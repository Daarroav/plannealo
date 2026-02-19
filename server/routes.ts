import type { Express } from "express";
import { requireAuth, requireRole } from "./middleware/roles";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTravelSchema, insertAccommodationSchema, insertActivitySchema, insertFlightSchema, insertTransportSchema, insertCruiseSchema, insertInsuranceSchema, insertNoteSchema, travels } from "@shared/schema";
import { ObjectStorageService, objectStorageClient as storageClient } from "./objectStorage";
import { EmailService } from "./emailService";
import { AeroDataBoxService } from "./aeroDataBoxService";
import multer from 'multer';  // Instalacion  para subir archivos
import express from 'express'; // Instalacion para archivos estaticos
import path from 'path';
import fs from "fs";  // Para crear carpetas
import { Buffer } from 'buffer';
import { randomUUID } from "crypto";
import { eq, or, sql } from "drizzle-orm";
import { airports, insertAirportSchema } from "../shared/schema";
import { db } from "./db";


// Initialize ObjectStorageService
const objectStorageService = new ObjectStorageService();

// Helper function to parse object storage paths
function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return { bucketName, objectName };
}

// Helper function to upload file to Object Storage
async function uploadFileToObjectStorage(file: Express.Multer.File, folder: string): Promise<string> {
  const shouldUseLocalStorage = !process.env.PRIVATE_OBJECT_DIR;

  if (shouldUseLocalStorage) {
    const uploadsRoot = path.join(process.cwd(), "uploads", folder);
    await fs.promises.mkdir(uploadsRoot, { recursive: true });

    const ext = path.extname(file.originalname || "").toLowerCase();
    const baseName = path
      .basename(file.originalname || "file", ext)
      .replace(/[^a-zA-Z0-9-_]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const safeBaseName = baseName || "file";
    const fileName = `${Date.now()}-${randomUUID()}-${safeBaseName}${ext}`;
    const filePath = path.join(uploadsRoot, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return `/objects/uploads/${folder}/${fileName}`;
  }

  // Ensure correct content type is set, especially for PDFs
  let contentType = file.mimetype;

  // Additional validation for PDFs based on file extension
  if (file.originalname.toLowerCase().endsWith('.pdf') && file.mimetype !== 'application/pdf') {
    contentType = 'application/pdf';
    console.log(`Corrected content type for ${file.originalname}: ${file.mimetype} -> ${contentType}`);
  }

  const tempObjectStorageService = new ObjectStorageService();
  const uploadURL = await tempObjectStorageService.getObjectEntityUploadURL();
  const uploadResult = await fetch(uploadURL, {
    method: 'PUT',
    body: file.buffer,
    headers: {
      'Content-Type': contentType,
    },
  });
  if (!uploadResult.ok) {
    throw new Error(`Failed to upload file to object storage: ${uploadResult.statusText}`);
  }

  const normalizedPath = tempObjectStorageService.normalizeObjectEntityPath(uploadURL);

  // Set metadata with original filename and corrected content type
  try {
    const objectFile = await tempObjectStorageService.getObjectEntityFile(normalizedPath);
    await objectFile.setMetadata({
      contentType: contentType,
      metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
        fileType: contentType,
        folder: folder,
      }
    });
  } catch (error) {
    console.error('Failed to set metadata for uploaded file:', error);
    // Continue anyway, the file is still uploaded
  }

  return normalizedPath;
}

const DEFAULT_AIRPORT_TIMEZONE = "America/Mexico_City";

function normalizeCatalogText(value?: string | null): string {
  if (!value) return "";
  return value.trim().replace(/\s+/g, " ");
}

function normalizeCatalogComparison(value?: string | null): string {
  const normalized = normalizeCatalogText(value);
  if (!normalized) return "";
  return normalized
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseAirportCityValue(value?: string | null): { code?: string; city?: string } {
  const normalized = normalizeCatalogText(value);
  if (!normalized) return {};

  const match = normalized.match(/^([A-Za-z]{3,4})\s*-\s*(.+)$/);
  if (!match) {
    return { city: normalized };
  }

  return {
    code: match[1].toUpperCase(),
    city: normalizeCatalogText(match[2]),
  };
}

async function ensureServiceProviderInCatalog(providerName: string | undefined, userId: string) {
  const normalizedProviderName = normalizeCatalogText(providerName);
  if (!normalizedProviderName) return;

  const { serviceProviders, insertServiceProviderSchema } = await import("../shared/schema");

  const normalizedProviderComparison = normalizeCatalogComparison(normalizedProviderName);
  const providers = await db
    .select({ id: serviceProviders.id, name: serviceProviders.name })
    .from(serviceProviders);

  const existingProvider = providers.find((provider) => {
    return normalizeCatalogComparison(provider.name) === normalizedProviderComparison;
  });

  if (existingProvider) return;

  const validatedProvider = insertServiceProviderSchema.parse({
    name: normalizedProviderName,
    active: true,
    createdBy: userId,
  });

  await db.insert(serviceProviders).values(validatedProvider);
}

async function ensureAirportInCatalog(
  airportName: string | undefined,
  cityValue: string | undefined,
  timezone: string | undefined,
  userId: string,
) {
  const parsedCity = parseAirportCityValue(cityValue);
  const normalizedAirportName = normalizeCatalogText(airportName) || parsedCity.city || normalizeCatalogText(cityValue);
  if (!normalizedAirportName) return;
  const resolvedCity = parsedCity.city || normalizedAirportName;

  const normalizedAirportComparison = normalizeCatalogComparison(normalizedAirportName);
  const airportsList = await db
    .select({ id: airports.id, airportName: airports.airportName })
    .from(airports);

  const existingAirport = airportsList.find((airport) => {
    return normalizeCatalogComparison(airport.airportName) === normalizedAirportComparison;
  });

  if (existingAirport) return;

  const validatedAirport = insertAirportSchema.parse({
    country: "No especificado",
    city: resolvedCity,
    airportName: normalizedAirportName,
    iataCode: parsedCity.code && parsedCity.code.length === 3 ? parsedCity.code : null,
    icaoCode: parsedCity.code && parsedCity.code.length === 4 ? parsedCity.code : null,
    timezones: [{ timezone: normalizeCatalogText(timezone) || DEFAULT_AIRPORT_TIMEZONE }],
    createdBy: userId,
  });

  await db.insert(airports).values(validatedAirport);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticación y sesión ANTES de las rutas protegidas
  setupAuth(app);

  // Crear usuario (solo master)
  app.post('/api/users', requireAuth, requireRole(['master']), async (req, res) => {
    try {
      const { username, password, name, role } = req.body;
      if (!username || !password || !name || !role) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
      const hashedPassword = await (await import('./auth')).hashPassword(password);
      const user = await storage.createUser({ username, password: hashedPassword, name, role });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  });

  // Editar usuario (solo master)
  app.put('/api/users/:id', requireAuth, requireRole(['master']), async (req, res) => {
    try {
      const { name, role } = req.body;
      const user = await storage.updateUser(req.params.id, { name, role });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al editar usuario' });
    }
  });

  // Editar perfil del usuario autenticado
  app.put('/api/profile', requireAuth, async (req, res) => {
    try {
      const { name, username } = req.body;

      if (!name && !username) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
      }

      if (username) {
        const existing = await storage.getUserByUsername(username);
        if (existing && existing.id !== req.user!.id) {
          return res.status(400).json({ error: 'El correo ya está en uso' });
        }
      }

      const currentUser = await storage.getUser(req.user!.id);
      const updates: { name?: string; username?: string } = {};
      if (name) updates.name = name;
      if (username) updates.username = username;

      const user = await storage.updateUser(req.user!.id, updates);

      // Update traveler info in related travels to reflect profile changes
      await db
        .update(travels)
        .set({
          clientName: user.name,
          clientEmail: user.username,
        })
        .where(
          or(
            eq(travels.clientId, user.id),
            eq(travels.clientEmail, currentUser?.username || ""),
            eq(travels.clientEmail, user.username)
          )
        );

      res.json(user);
    } catch (error) {
      console.error('Error al editar perfil:', error);
      res.status(500).json({ error: 'Error al editar perfil' });
    }
  });

  // Eliminar usuario (solo master)
  app.delete('/api/users/:id', requireAuth, requireRole(['master']), async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  });

    // Endpoint para listar todos los usuarios (solo master)
    app.get('/api/users', requireAuth, requireRole(['master']), async (req, res) => {
      try {
        const users = await storage.getAllUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
      }
    });
  // Setup authentication routes

  // Configuración de multer para subir archivos al Object Storage
  const multerStorage = multer.memoryStorage(); // Usar memoria en lugar de disco


  const upload = multer({
    storage: multerStorage, // Configuración de multer para subir archivos
    limits: {
      fileSize: 10 * 1024 * 1024 // Límite de 10MB
    }
  }); // Configuración de multer para subir archivos
  app.use('/uploads', express.static('uploads')); // Configuración de archivos estáticos

  // Backup endpoint
  app.get('/api/backup', requireAuth, requireRole(['master', 'admin']), async (req, res) => {
    try {
      // Backup logic would go here
      res.json({ message: 'Backup endpoint - implementation pending' });
    } catch (error) {
      console.error('Error in backup endpoint:', error);
      res.status(500).json({ error: 'Error in backup endpoint' });
    }
  });

  // Get list of cover images
  app.get('/api/covers-list', async (req, res) => {
    try {
      const { promises: fsPromises } = await import('fs');
      const { join } = await import('path');
      const coversDir = join(process.cwd(), 'uploads', 'covers');

      // Check if directory exists
      try {
        const files = await fsPromises.readdir(coversDir);
        // Filter only image files
        const imageFiles = files.filter((file: string) =>
          /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
        );
        res.json(imageFiles);
      } catch (err) {
        // Directory doesn't exist or is empty
        res.json([]);
      }
    } catch (error) {
      console.error('Error listing cover images:', error);
      res.status(500).json({ error: 'Failed to list cover images' });
    }
  });

  // (setupAuth ya se ejecutó antes de las rutas protegidas)

  // Travel routes
  // Obtener estadísticas de viajeros
  app.get("/api/clients/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    try {
      const stats = await storage.getClientStats();

      res.json(stats);
    } catch (error) {
      console.error("Error fetching client stats:", error);
      res.status(500).json({ message: "Error al obtener estadísticas de viajeros" });
    }
  });

      app.get("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  });

  app.get("/api/reports", async (req, res) => {

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    try {
      const reports = await storage.getTravelStats();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Error al obtener informes" });
    }
  });

  // Rutas de catálogo para autocompletar
  app.get("/api/catalog/accommodations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const catalog = await storage.getAccommodationsCatalog(req.user!.id);
      res.json(catalog);
    } catch (error) {
      console.error("Error fetching accommodations catalog:", error);
      res.status(500).json({ message: "Error al obtener catálogo de alojamientos" });
    }
  });

  app.get("/api/catalog/activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const catalog = await storage.getActivitiesCatalog(req.user!.id);
      res.json(catalog);
    } catch (error) {
      console.error("Error fetching activities catalog:", error);
      res.status(500).json({ message: "Error al obtener catálogo de actividades" });
    }
  });

  app.get("/api/catalog/flights", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const catalog = await storage.getFlightsCatalog(req.user!.id);
      res.json(catalog);
    } catch (error) {
      console.error("Error fetching flights catalog:", error);
      res.status(500).json({ message: "Error al obtener catálogo de vuelos" });
    }
  });

  app.get("/api/catalog/transports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const catalog = await storage.getTransportsCatalog(req.user!.id);
      res.json(catalog);
    } catch (error) {
      console.error("Error fetching transports catalog:", error);
      res.status(500).json({ message: "Error al obtener catálogo de transportes" });
    }
  });

  app.get("/api/travels", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          if (req.user && req.user.role === "admin") {
            // Si es admin, obtiene TODOS los viajes
            const travels = await storage.getTravels();
            res.json(travels);
          } else if (req.user) {
            // Si es un usuario normal (agente), solo obtiene sus propios viajes
            const travels = await storage.getTravelsByUser(req.user.id);
            res.json(travels);
          } else {
            // Este caso no debería ocurrir porque ya verificamos isAuthenticated() al inicio pero por si acaso
            res.sendStatus(401);
          }
        } catch (error) {
          console.error("Error fetching travels:", error);
          res.status(500).json({ message: "Error fetching travels" });
        }
      });

      // Get statistics for home page
      app.get("/api/stats", async (req, res) => {
        if (!req.isAuthenticated()) {
          console.log("❌ /api/stats: Usuario no autenticado");
          return res.sendStatus(401);
        }

        console.log("✅ /api/stats: Consultando estadísticas para usuario:", req.user?.id, "Role:", req.user?.role);

        try {
          let userTravels;
          
          // Get travels based on user role
          if (req.user && req.user.role === "admin") {
            userTravels = await storage.getTravels();
          } else if (req.user) {
            userTravels = await storage.getTravelsByUser(req.user.id);
          } else {
            return res.sendStatus(401);
          }

          console.log("📊 Total viajes encontrados:", userTravels.length);
          console.log("📊 Viajes por status:", userTravels.map((t: any) => ({ id: t.id, status: t.status })));

          // Calculate stats
          const activeTrips = userTravels.filter((t: any) => t.status === 'published').length;
          const drafts = userTravels.filter((t: any) => t.status === 'draft').length;
          
          // Get unique clients count from these travels
          const uniqueClientIds = new Set(userTravels.map((t: any) => t.clientId).filter(Boolean));
          const clients = uniqueClientIds.size;

          const stats = {
            activeTrips,
            drafts,
            clients
          };

          console.log("✅ Estadísticas calculadas:", stats);

          res.json(stats);
        } catch (error) {
          console.error("❌ Error fetching stats:", error);
          res.status(500).json({ message: "Error fetching statistics" });
        }
      });

      app.post("/api/travels", upload.single('coverImage'), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        console.log("=== INICIO CREAR VIAJE ===");
        console.log("Request body:", req.body);
        console.log("Cover image file:", req.file);
        
        try {
          const { clientEmail, ...travelData } = req.body;

          // Convertir travelers a número
          if (travelData.travelers && typeof travelData.travelers === 'string') {
            travelData.travelers = parseInt(travelData.travelers, 10);
            console.log("Travelers convertido a número:", travelData.travelers);
          }

          // Verificar si el viajero ya existe
          let client = await storage.getUserByUsername(clientEmail);
          console.log("Viajero encontrado/creado:", client?.id);

          // Si no existe, crear un nuevo usuario viajero
          if (!client) {
            const tempPassword = Math.random().toString(36).slice(-8);
            client = await storage.createUser({
              username: clientEmail,
              password: tempPassword,
              name: req.body.clientName,
              role: 'client',
            });
            console.log("Nuevo viajero creado con ID:", client.id);
          }

          const validated = insertTravelSchema.parse({
            ...travelData,
            clientEmail: clientEmail,
            clientId: client.id,
            createdBy: req.user!.id,
            startDate: new Date(travelData.startDate),
            endDate: new Date(travelData.endDate),
          });

          console.log("Datos validados, creando viaje...");
          const travel = await storage.createTravel(validated);
          console.log("Viaje creado con ID:", travel.id);
          
          // Handle cover image upload if provided
          if (req.file) {
            console.log("=== PROCESANDO IMAGEN DE PORTADA ===");
            console.log("Nombre del archivo:", req.file.originalname);
            console.log("Tamaño:", req.file.size, "bytes");
            console.log("Tipo MIME:", req.file.mimetype);
            
            try {
              // Upload file to object storage
              console.log("Subiendo archivo a Object Storage...");
              const objectPath = await uploadFileToObjectStorage(req.file, 'travel-covers');
              console.log("Archivo subido exitosamente. Object Path:", objectPath);
              
              if (objectPath.startsWith("/objects/uploads/")) {
                // Local storage: skip object storage metadata
                console.log("Actualizando viaje con coverImage (local):", objectPath);
                await storage.updateTravel(travel.id, { coverImage: objectPath });
                travel.coverImage = objectPath;
                console.log("Viaje actualizado exitosamente con coverImage");
              } else {
                // Set ACL policy for public access
                console.log("Configurando permisos públicos...");
                const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
                await objectFile.setMetadata({
                  metadata: {
                    visibility: "public",
                    owner: "system",
                  }
                });
                console.log("Permisos configurados correctamente");

                // Update travel with cover image path
                console.log("Actualizando viaje con coverImage:", objectPath);
                await storage.updateTravel(travel.id, { coverImage: objectPath });
                travel.coverImage = objectPath;
                console.log("Viaje actualizado exitosamente con coverImage");
              }
            } catch (error) {
              console.error("❌ ERROR al procesar imagen de portada:", error);
              console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack available');
              // Don't fail the whole operation if image upload fails
            }
          } else {
            console.log("⚠️ No se recibió archivo de imagen de portada");
          }
          
          console.log("=== VIAJE CREADO EXITOSAMENTE ===");
          console.log("ID:", travel.id);
          console.log("Cover Image:", travel.coverImage || "Sin imagen");
          
          res.status(201).json(travel);
        } catch (error) {
          console.error("❌ ERROR CREANDO VIAJE:", error);
          console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
          res.status(400).json({
            message: "Error creating travel",
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      app.put("/api/travels/:id", upload.single('coverImage'), async (req, res) => {
        // check if the user is authenticated
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        console.log("=== INICIO EDITAR VIAJE ===");
        console.log("Request body:", req.body);
        console.log("Cover image file:", req.file);

        try {
          const travel = await storage.getTravel(req.params.id); // Get travel by id
          if (!travel) { // If travel not found
            return res.status(404).json({ message: "Travel not found" });
          }

          // Condiciones para el acceso al viaje
          const isOwner = travel.createdBy === req.user!.id;
          const isAdmin = req.user!.role === "admin" || req.user!.role === "master";

          if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Access denied" });
          }

          const updated = await storage.updateTravel(req.params.id, req.body);

          // Update name and mail client
          if (req.body.clientName || req.body.clientEmail) {
            await storage.updateUser(travel.clientId!, {
              name: req.body.clientName,
              username: req.body.clientEmail,
            });
          }

          // Handle cover image upload if provided
          if (req.file) {
            console.log("=== PROCESANDO IMAGEN DE PORTADA (EDICIÓN) ===");
            console.log("Nombre del archivo:", req.file.originalname);
            console.log("Tamaño:", req.file.size, "bytes");
            console.log("Tipo MIME:", req.file.mimetype);
            
            try {
              // Upload file to object storage
              console.log("Subiendo archivo a Object Storage...");
              const objectPath = await uploadFileToObjectStorage(req.file, 'travel-covers');
              console.log("Archivo subido exitosamente. Object Path:", objectPath);
              
              if (objectPath.startsWith("/objects/uploads/")) {
                // Local storage: skip object storage metadata
                console.log("Actualizando viaje con coverImage (local):", objectPath);
                await storage.updateTravel(req.params.id, { coverImage: objectPath });
                updated.coverImage = objectPath;
                console.log("Viaje actualizado exitosamente con coverImage");
              } else {
                // Set ACL policy for public access
                console.log("Configurando permisos públicos...");
                const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
                await objectFile.setMetadata({
                  metadata: {
                    visibility: "public",
                    owner: "system",
                  }
                });
                console.log("Permisos configurados correctamente");

                // Update travel with cover image path
                console.log("Actualizando viaje con coverImage:", objectPath);
                await storage.updateTravel(req.params.id, { coverImage: objectPath });
                updated.coverImage = objectPath;
                console.log("Viaje actualizado exitosamente con coverImage");
              }
            } catch (error) {
              console.error("❌ ERROR al procesar imagen de portada:", error);
              console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack available');
              // Don't fail the whole operation if image upload fails
            }
          }

          console.log("=== VIAJE EDITADO EXITOSAMENTE ===");
          console.log("ID:", updated.id);
          console.log("Cover Image:", updated.coverImage || "Sin cambios en imagen");

          res.json(updated);
        } catch (error) {
          console.error("❌ ERROR EDITANDO VIAJE:", error);
          console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
          res.status(500).json({ 
            message: "Error updating travel",
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      // Test endpoint para verificar que la ruta funciona
      app.get("/api/travels/upload-test", async (req, res) => {
        console.log("TEST ENDPOINT REACHED");
        res.json({ message: "Test endpoint works", authenticated: req.isAuthenticated ? req.isAuthenticated() : false });
      });

      // Endpoint directo para subir imagen de portada (almacenamiento local)
      app.post("/api/travels/upload-cover-direct", upload.single('file'), async (req, res) => {
        console.log("=== ENDPOINT UPLOAD-COVER-DIRECT LLAMADO ===");
        console.log("Authenticated:", req.isAuthenticated ? req.isAuthenticated() : 'No auth function');
        console.log("File received:", req.file ? 'Yes' : 'No');
        console.log("Body:", req.body);
        
        if (!req.isAuthenticated()) {
          console.log("Usuario no autenticado");
          return res.status(401).json({ error: "Not authenticated" });
        }

        try {
          if (!req.file) {
            console.log("No se recibió archivo");
            return res.status(400).json({ error: "No file uploaded" });
          }

          console.log("=== SUBIDA DIRECTA DE IMAGEN ===");
          console.log("Archivo:", req.file.originalname);
          console.log("Tamaño:", req.file.size);
          console.log("Tipo:", req.file.mimetype);
          
          const objectPath = await uploadFileToObjectStorage(req.file, 'travel-covers');
          console.log("Imagen subida a:", objectPath);
          
          res.json({ uploadURL: objectPath });
        } catch (error) {
          console.error("Error uploading cover image:", error);
          console.error("Stack:", error instanceof Error ? error.stack : 'No stack');
          res.status(500).json({ 
            error: "Error uploading cover image",
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      app.get("/api/travels/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const travel = await storage.getTravel(req.params.id);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          // Condiciones para el acceso al viaje
          const isOwner = travel.createdBy === req.user!.id;
          const isAdmin = req.user!.role === "admin" || req.user!.role === "master";

          if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Access denied" });
          }

          res.json(travel);
        } catch (error) {
          console.error("Error fetching travel:", error);
          res.status(500).json({ message: "Error fetching travel" });
        }
      });

      // Get complete travel data with all related entities
      app.get("/api/travels/:id/full", async (req, res) => {
        try {
          const travel = await storage.getTravel(req.params.id);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          // Verificar si hay un token público en los query params
          const publicToken = req.query.token as string | undefined;
          
          // Caso 1: Acceso con token público válido (sin necesidad de login)
          if (publicToken) {
            // Verificar que el token coincida y no haya expirado
            if (!travel.publicToken || travel.publicToken !== publicToken) {
              return res.status(403).json({ message: "Invalid or expired token" });
            }

            if (travel.publicTokenExpiry && new Date(travel.publicTokenExpiry) < new Date()) {
              return res.status(403).json({ message: "Token has expired" });
            }

            // Token válido - permitir acceso sin autenticación
            console.log(`Public token access granted for travel ${req.params.id}`);
          } else {
            // Caso 2: Acceso con autenticación (usuario logueado)
            if (!req.isAuthenticated()) {
              return res.sendStatus(401);
            }

            // Verificar permisos del usuario autenticado
            const isOwner = travel.createdBy === req.user!.id;
            const isAdmin = req.user!.role === "admin" || req.user!.role === "master";

            if (!isOwner && !isAdmin) {
              return res.status(403).json({ message: "Access denied" });
            }
          }

          // Fetch all related data in parallel
          const [accommodations, activities, flights, transports, cruises, insurances, notes] = await Promise.all([
            storage.getAccommodationsByTravel(req.params.id),
            storage.getActivitiesByTravel(req.params.id),
            storage.getFlightsByTravel(req.params.id),
            storage.getTransportsByTravel(req.params.id),
            storage.getCruisesByTravel(req.params.id),
            storage.getInsurancesByTravel(req.params.id),
            storage.getNotesByTravel(req.params.id),
          ]);

          res.json({
            travel,
            accommodations,
            activities,
            flights,
            transports,
            cruises,
            insurances,
            notes,
          });
        } catch (error) {
          console.error("Error fetching travel data:", error);
          res.status(500).json({ message: "Error fetching travel data" });
        }
      });

// Delete travel - PROTEGIDO: No elimina si tiene datos relacionados
  app.delete('/api/travels/:id', async (req, res) => {
    const { id } = req.params;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).send('Not authenticated');
    }

    try {
      // Verificar si hay datos relacionados antes de eliminar
      const accommodations = await storage.getAccommodations(id);
      const activities = await storage.getActivities(id);
      const flights = await storage.getFlights(id);
      const transports = await storage.getTransports(id);

      const hasRelatedData =
        accommodations.length > 0 ||
        activities.length > 0 ||
        flights.length > 0 ||
        transports.length > 0;

      if (hasRelatedData) {
        return res.status(400).json({
          error: 'Cannot delete travel with related data',
          message: 'Este viaje tiene alojamientos, actividades, vuelos o transportes asociados. Elimínalos primero.'
        });
      }

      await storage.deleteTravel(Number.parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting travel:', error);
      res.status(500).send('Error deleting travel');
    }
  });

      // Accommodation routes
      app.get("/api/travels/:travelId/accommodations", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const accommodations = await storage.getAccommodationsByTravel(req.params.travelId);
          res.json(accommodations);
        } catch (error) {
          console.error("Error fetching accommodations:", error);
          res.status(500).json({ message: "Error fetching accommodations" });
        }
      });

      app.post("/api/travels/:travelId/accommodations", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let thumbnail: string | null = null;
          let attachments: string[] = [];

          // Handle thumbnail upload
          if (files?.thumbnail?.[0]) {
            thumbnail = await uploadFileToObjectStorage(files.thumbnail[0], 'accommodations');
          }

          // Handle attachments upload
          if (files?.attachments) {
            for (const file of files.attachments) {
              const objectPath = await uploadFileToObjectStorage(file, 'accommodations');
              attachments.push(objectPath);
            }
          }

          // Validate that required fields are present
          if (!req.body.name || !req.body.type || !req.body.location || !req.body.checkIn || !req.body.checkOut || !req.body.roomType) {
            return res.status(400).json({
              message: "Missing required fields",
              received: Object.keys(req.body),
              missing: {
                name: !req.body.name,
                type: !req.body.type,
                location: !req.body.location,
                checkIn: !req.body.checkIn,
                checkOut: !req.body.checkOut,
                roomType: !req.body.roomType
              }
            });
          }

          // Debug: Log cost values being saved
          console.log('[Accommodation Cost Debug]', {
            price: req.body.price,
            costAmount: req.body.costAmount,
            costCurrency: req.body.costCurrency
          });

          const validated = insertAccommodationSchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            checkIn: new Date(req.body.checkIn),
            checkOut: new Date(req.body.checkOut),
            thumbnail: thumbnail,
            attachments: attachments,
          });

          const accommodation = await storage.createAccommodation(validated);
          res.status(201).json(accommodation);
        } catch (error) {
          console.error("Error creating accommodation:", error);
          res.status(400).json({ message: "Error creating accommodation" });
        }
      });

      app.put("/api/accommodations/:id", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle thumbnail upload and removal
          if (files?.thumbnail?.[0]) {
            // New thumbnail uploaded
            updateData.thumbnail = await uploadFileToObjectStorage(files.thumbnail[0], 'accommodations');
          } else if (req.body.removeThumbnail === 'true') {
            // Explicitly remove thumbnail
            updateData.thumbnail = null;
            console.log("Thumbnail explicitly removed for accommodation:", req.params.id);
          }
          // If neither condition is met, don't modify thumbnail field

          // Remove the removeThumbnail flag from updateData as it's not a database field
          delete updateData.removeThumbnail;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
              console.log("Preserving existing attachments:", existingAttachments);
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const objectPath = await uploadFileToObjectStorage(file, 'accommodations');
              newAttachments.push(objectPath);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
            console.log("Added new attachments:", newAttachments);
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
            console.log("Final attachments array:", finalAttachments);
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          // Convert dates if provided
          if (updateData.checkIn) {
            updateData.checkIn = new Date(updateData.checkIn);
          }
          if (updateData.checkOut) {
            updateData.checkOut = new Date(updateData.checkOut);
          }

          // Remove undefined values to avoid "No values to set" error
          Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
              delete updateData[key];
            }
          });

          // Allow null values for thumbnail removal, but remove other null values
          Object.keys(updateData).forEach(key => {
            if (updateData[key] === null && key !== 'thumbnail') {
              delete updateData[key];
            }
          });

          if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
          }

          console.log("Update data for accommodation:", req.params.id, updateData);
          const accommodation = await storage.updateAccommodation(req.params.id, updateData);
          res.json(accommodation);
        } catch (error) {
          console.error("Error updating accommodation:", error);
          res.status(400).json({ message: "Error updating accommodation" });
        }
      });

      // Activity routes
      app.get("/api/travels/:travelId/activities", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const activities = await storage.getActivitiesByTravel(req.params.travelId);
          res.json(activities);
        } catch (error) {
          console.error("Error fetching activities:", error);
          res.status(500).json({ message: "Error fetching activities" });
        }
      });

      app.post("/api/travels/:travelId/activities", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let attachments: string[] = [];

          // Handle attachments upload
          if (files?.attachments) {
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'activities');
              attachments.push(attachment);
            }
          }

          // Debug: Log cost values being saved
          console.log('[Activity Cost Debug]', {
            costAmount: req.body.costAmount,
            costCurrency: req.body.costCurrency,
            costBreakdown: req.body.costBreakdown
          });

          const validated = insertActivitySchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            date: new Date(req.body.date),
            attachments: attachments,
          });

          await ensureServiceProviderInCatalog(validated.provider || undefined, req.user!.id);

          const activity = await storage.createActivity(validated);
          res.status(201).json(activity);
        } catch (error) {
          console.error("Error creating activity:", error);
          res.status(400).json({ message: "Error creating activity" });
        }
      });

      app.put("/api/activities/:id", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'activities');
              newAttachments.push(attachment);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          const activity = await storage.updateActivity(req.params.id, {
            ...updateData,
            date: updateData.date ? new Date(updateData.date) : undefined,
          });

          await ensureServiceProviderInCatalog(updateData.provider, req.user!.id);

          res.json(activity);
        } catch (error) {
          console.error("Error updating activity:", error);
          res.status(400).json({ message: "Error updating activity" });
        }
      });

      app.post("/api/travels/:travelId/flights", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let attachments: string[] = [];

          // Upload attachments to Object Storage
          if (files?.attachments) {
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'flights');
              attachments.push(attachment);
            }
          }

          // Debug: Log cost values being saved
          console.log('[Flight Cost Debug]', {
            costAmount: req.body.costAmount,
            costCurrency: req.body.costCurrency,
            costBreakdown: req.body.costBreakdown
          });

          const validated = insertFlightSchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            departureDate: new Date(req.body.departureDate),
            arrivalDate: new Date(req.body.arrivalDate),
            attachments: attachments,
          });

          await Promise.all([
            ensureAirportInCatalog(
              validated.departureAirport || undefined,
              validated.departureCity,
              validated.departureTimezone || undefined,
              req.user!.id,
            ),
            ensureAirportInCatalog(
              validated.arrivalAirport || undefined,
              validated.arrivalCity,
              validated.arrivalTimezone || undefined,
              req.user!.id,
            ),
          ]);

          const flight = await storage.createFlight(validated);
          res.status(201).json(flight);
        } catch (error) {
          console.error("Error creating flight:", error);
          res.status(400).json({ message: "Error creating flight" });
        }
      });

      app.put("/api/flights/:id", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'flights');
              newAttachments.push(attachment);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          const flight = await storage.updateFlight(req.params.id, {
            ...updateData,
            departureDate: updateData.departureDate ? new Date(updateData.departureDate) : undefined,
            arrivalDate: updateData.arrivalDate ? new Date(updateData.arrivalDate) : undefined,
          });

          await Promise.all([
            ensureAirportInCatalog(
              updateData.departureAirport,
              updateData.departureCity,
              updateData.departureTimezone,
              req.user!.id,
            ),
            ensureAirportInCatalog(
              updateData.arrivalAirport,
              updateData.arrivalCity,
              updateData.arrivalTimezone,
              req.user!.id,
            ),
          ]);

          res.json(flight);
        } catch (error) {
          console.error("Error updating flight:", error);
          res.status(400).json({ message: "Error updating flight" });
        }
      });

      app.post("/api/travels/:travelId/transports", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let attachments: string[] = [];

          // Upload attachments to Object Storage
          if (files?.attachments) {
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'transports');
              attachments.push(attachment);
            }
          }

          // Debug: Log cost values being saved
          console.log('[Transport Cost Debug]', {
            costAmount: req.body.costAmount,
            costCurrency: req.body.costCurrency,
            costBreakdown: req.body.costBreakdown
          });

          const validated = insertTransportSchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            pickupDate: new Date(req.body.pickupDate),
            ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
            attachments: attachments,
          });

          await ensureServiceProviderInCatalog(validated.provider || undefined, req.user!.id);

          const transport = await storage.createTransport(validated);
          res.status(201).json(transport);
        } catch (error) {
          console.error("Error creating transport:", error);
          res.status(400).json({ message: "Error creating transport" });
        }
      });

      app.put("/api/transports/:id", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'transports');
              newAttachments.push(attachment);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          const transport = await storage.updateTransport(req.params.id, {
            ...updateData,
            pickupDate: updateData.pickupDate ? new Date(updateData.pickupDate) : undefined,
            endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
          });

          await ensureServiceProviderInCatalog(updateData.provider, req.user!.id);

          res.json(transport);
        } catch (error) {
          console.error("Error updating transport:", error);
          res.status(400).json({ message: "Error updating transport" });
        }
      });

      app.post("/api/travels/:travelId/cruises", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let attachments: string[] = [];

          // Upload attachments to Object Storage
          if (files?.attachments) {
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'cruises');
              attachments.push(attachment);
            }
          }

          // Debug: Log cost values being saved
          console.log('[Cruise Cost Debug]', {
            costAmount: req.body.costAmount,
            costCurrency: req.body.costCurrency,
            costBreakdown: req.body.costBreakdown
          });

          const validated = insertCruiseSchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            departureDate: new Date(req.body.departureDate),
            arrivalDate: new Date(req.body.arrivalDate),
            attachments: attachments,
          });

          const cruise = await storage.createCruise(validated);
          res.status(201).json(cruise);
        } catch (error) {
          console.error("Error creating cruise:", error);
          res.status(400).json({ message: "Error creating cruise" });
        }
      });

      app.put("/api/cruises/:id", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'cruises');
              newAttachments.push(attachment);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          const cruise = await storage.updateCruise(req.params.id, {
            ...updateData,
            departureDate: updateData.departureDate ? new Date(updateData.departureDate) : undefined,
            arrivalDate: updateData.arrivalDate ? new Date(updateData.arrivalDate) : undefined,
          });
          res.json(cruise);
        } catch (error) {
          console.error("Error updating cruise:", error);
          res.status(400).json({ message: "Error updating cruise" });
        }
      });

      app.post("/api/travels/:travelId/insurances", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          console.log("Raw insurance req.body:", req.body);
          console.log("Insurance Files:", req.files);

          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let attachments: string[] = [];

          // Upload attachments to Object Storage
          if (files?.attachments) {
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'insurances');
              attachments.push(attachment);
            }
          }

          // Ensure all required fields are present
          const { provider, policyNumber, policyType, effectiveDate } = req.body;

          // Check for empty strings and missing values
          if (!provider || !policyNumber || policyNumber.trim() === '' || !policyType || !effectiveDate) {
            return res.status(400).json({
              message: "Missing required fields",
              received: { provider, policyNumber, policyType, effectiveDate },
              details: "Todos los campos obligatorios deben completarse: provider, policyNumber, policyType, effectiveDate"
            });
          }

          const insuranceData = {
            travelId: req.params.travelId,
            provider: provider,
            policyNumber: policyNumber,
            policyType: policyType,
            emergencyNumber: req.body.emergencyNumber || null,
            effectiveDate: effectiveDate, // Let the schema handle the date transformation
            importantInfo: req.body.importantInfo || null,
            policyDescription: req.body.policyDescription || null,
            notes: req.body.notes || null,
            attachments: attachments,
          };

          console.log("Insurance data before validation:", insuranceData);
          
          // Debug: Log cost values being saved
          console.log('[Insurance Cost Debug]', {
            costAmount: req.body.costAmount,
            costCurrency: req.body.costCurrency,
            costBreakdown: req.body.costBreakdown
          });

          const validated = insertInsuranceSchema.parse(insuranceData);

          await ensureServiceProviderInCatalog(validated.provider, req.user!.id);

          const insurance = await storage.createInsurance(validated);
          res.status(201).json(insurance);
        } catch (error: any) {
          console.error("Error creating insurance:", error);
          if (error.name === 'ZodError') {
            return res.status(400).json({
              message: "Validation error",
              details: error.errors
            });
          }
          res.status(400).json({ message: "Error creating insurance" });
        }
      });

      app.put("/api/insurances/:id", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'insurances');
              newAttachments.push(attachment);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          const insurance = await storage.updateInsurance(req.params.id, {
            ...updateData,
            effectiveDate: updateData.effectiveDate ? new Date(updateData.effectiveDate) : undefined,
          });

          await ensureServiceProviderInCatalog(updateData.provider, req.user!.id);

          res.json(insurance);
        } catch (error) {
          console.error("Error updating insurance:", error);
          res.status(400).json({ message: "Error updating insurance" });
        }
      });

      // Note routes
      app.get("/api/travels/:travelId/notes", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const notes = await storage.getNotesByTravel(req.params.travelId);
          res.json(notes);
        } catch (error) {
          console.error("Error fetching notes:", error);
          res.status(500).json({ message: "Error fetching notes" });
        }
      });

      // Create note for travel
      app.post("/api/travels/:id/notes", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          console.log("Raw req.body:", req.body);
          console.log("Files:", req.files);

          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
          let attachments: string[] = [];

          // Handle attachments upload
          if (files?.attachments) {
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'notes');
              attachments.push(attachment);
            }
          }

          // Ensure all required fields are present
          const { title, noteDate, content, visibleToTravelers } = req.body;
          const user = (req as any).user;

          if (!title || !noteDate || !content) {
            return res.status(400).json({
              message: "Missing required fields",
              received: { title, noteDate, content }
            });
          }

          // Parse the ISO string to Date object, preserving the UTC timestamp
          const parsedDate = new Date(noteDate);
          console.log("Received noteDate:", noteDate);
          console.log("Parsed to Date object:", parsedDate.toISOString());

          const noteData = {
            travelId: req.params.id,
            title: title,
            noteDate: parsedDate, // Use the parsed Date object
            content: content,
            visibleToTravelers: user?.role === 'traveler' ? true : visibleToTravelers === 'true',
            costAmount: null,
            costCurrency: null,
            costBreakdown: null,
            attachments: attachments,
          };

          console.log("Note data before validation:", noteData);

          const validated = insertNoteSchema.parse(noteData);
          
          console.log("Validated note data (after schema):", {
            ...validated,
            noteDate: validated.noteDate.toISOString()
          });

          const note = await storage.createNote(validated);
          console.log("Note created with timestamp:", note.noteDate);
          
          res.status(201).json(note);
        } catch (error: any) {
          console.error("Error creating note:", error);
          if (error.name === 'ZodError') {
            return res.status(400).json({
              message: "Validation error",
              details: error.errors
            });
          }
          res.status(400).json({ message: "Error creating note" });
        }
      });

      // Update note for travel
      app.put("/api/travels/:travelId/notes/:noteId", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const updateData = { ...req.body };
          const user = (req as any).user;
          const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

          // Handle attachments update with proper deletion support
          let finalAttachments = [];

          // Start with existing attachments if provided
          if (req.body.existingAttachments) {
            try {
              const existingAttachments = JSON.parse(req.body.existingAttachments);
              finalAttachments = [...existingAttachments];
            } catch (error) {
              console.error("Error parsing existing attachments:", error);
            }
          }

          // Add new uploaded files
          if (files?.attachments) {
            const newAttachments = [];
            for (const file of files.attachments) {
              const attachment = await uploadFileToObjectStorage(file, 'notes');
              newAttachments.push(attachment);
            }
            finalAttachments = [...finalAttachments, ...newAttachments];
          }

          // Update attachments array if there were changes
          if (req.body.removedExistingAttachments || files?.attachments) {
            updateData.attachments = finalAttachments;
          }

          // Clean up form data fields that shouldn't be in the database
          delete updateData.existingAttachments;
          delete updateData.removedExistingAttachments;

          if (user?.role === 'traveler') {
            updateData.visibleToTravelers = true;
          } else if (typeof updateData.visibleToTravelers === 'string') {
            updateData.visibleToTravelers = updateData.visibleToTravelers === 'true';
          }

          updateData.costAmount = null;
          updateData.costCurrency = null;
          updateData.costBreakdown = null;

          // Convert date if provided - preserve the exact UTC timestamp
          if (updateData.noteDate) {
            const parsedDate = new Date(updateData.noteDate);
            console.log("Updating note with date - received:", updateData.noteDate, "parsed:", parsedDate.toISOString());
            updateData.noteDate = parsedDate;
          }

          // Remove undefined values to avoid "No values to set" error
          Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined || updateData[key] === null) {
              delete updateData[key];
            }
          });

          if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
          }

          console.log("Updating note with data:", {
            ...updateData,
            noteDate: updateData.noteDate?.toISOString?.() || updateData.noteDate
          });

          const note = await storage.updateNote(req.params.noteId, updateData);
          console.log("Updated note timestamp:", note.noteDate);
          
          res.json(note);
        } catch (error) {
          console.error("Error updating note:", error);
          res.status(400).json({ message: "Error updating note" });
        }
      });

      // ==================== DELETE ENDPOINTS ====================
      
      // Delete accommodation
      app.delete("/api/accommodations/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { accommodations } = await import("../shared/schema");
          const [accommodation] = await db.select().from(accommodations).where(eq(accommodations.id, req.params.id));
          
          if (!accommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
          }

          const travel = await storage.getTravel(accommodation.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteAccommodation(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting accommodation:", error);
          res.status(500).json({ message: "Error deleting accommodation" });
        }
      });

      // Delete activity
      app.delete("/api/activities/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { activities } = await import("../shared/schema");
          const [activity] = await db.select().from(activities).where(eq(activities.id, req.params.id));
          
          if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
          }

          const travel = await storage.getTravel(activity.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteActivity(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting activity:", error);
          res.status(500).json({ message: "Error deleting activity" });
        }
      });

      // Delete flight
      app.delete("/api/flights/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { flights } = await import("../shared/schema");
          const [flight] = await db.select().from(flights).where(eq(flights.id, req.params.id));
          
          if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
          }

          const travel = await storage.getTravel(flight.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteFlight(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting flight:", error);
          res.status(500).json({ message: "Error deleting flight" });
        }
      });

      // Delete transport
      app.delete("/api/transports/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { transports } = await import("../shared/schema");
          const [transport] = await db.select().from(transports).where(eq(transports.id, req.params.id));
          
          if (!transport) {
            return res.status(404).json({ message: "Transport not found" });
          }

          const travel = await storage.getTravel(transport.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteTransport(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting transport:", error);
          res.status(500).json({ message: "Error deleting transport" });
        }
      });

      // Delete cruise
      app.delete("/api/cruises/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { cruises } = await import("../shared/schema");
          const [cruise] = await db.select().from(cruises).where(eq(cruises.id, req.params.id));
          
          if (!cruise) {
            return res.status(404).json({ message: "Cruise not found" });
          }

          const travel = await storage.getTravel(cruise.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteCruise(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting cruise:", error);
          res.status(500).json({ message: "Error deleting cruise" });
        }
      });

      // Delete insurance
      app.delete("/api/insurances/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { insurances } = await import("../shared/schema");
          const [insurance] = await db.select().from(insurances).where(eq(insurances.id, req.params.id));
          
          if (!insurance) {
            return res.status(404).json({ message: "Insurance not found" });
          }

          const travel = await storage.getTravel(insurance.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteInsurance(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting insurance:", error);
          res.status(500).json({ message: "Error deleting insurance" });
        }
      });

      // Delete note
      app.delete("/api/notes/:id", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        try {
          const { notes } = await import("../shared/schema");
          const [note] = await db.select().from(notes).where(eq(notes.id, req.params.id));
          
          if (!note) {
            return res.status(404).json({ message: "Note not found" });
          }

          const travel = await storage.getTravel(note.travelId);
          if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
          }

          const user = (req as any).user;
          if (travel.createdBy !== user.id && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
          }

          await storage.deleteNote(req.params.id);
          res.json({ success: true });
        } catch (error) {
          console.error("Error deleting note:", error);
          res.status(500).json({ message: "Error deleting note" });
        }
      });

      // ==================== LOCATION CATALOGS ENDPOINTS ====================

  // Obtener países
  app.get("/api/locations/country", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { countries } = await import("../shared/schema");
      const allCountries = await db.select().from(countries).orderBy(countries.name);
      return res.json(allCountries);
    } catch (error: any) {
      console.error("Error fetching countries:", error);
      return res.status(500).send("Error fetching countries");
    }
  });

  // Crear país
  app.post("/api/locations/country", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { countries } = await import("../shared/schema");
      const { name } = req.body;

      const [newCountry] = await db
        .insert(countries)
        .values({ name })
        .returning();

      return res.json(newCountry);
    } catch (error: any) {
      console.error("Error creating country:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Obtener estados
  app.get("/api/locations/state", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { states } = await import("../shared/schema");
      const { parentId } = req.query;

      let query = db.select().from(states);
      if (parentId) {
        query = query.where(eq(states.countryId, parentId as string));
      }

      const allStates = await query.orderBy(states.name);
      return res.json(allStates);
    } catch (error: any) {
      console.error("Error fetching states:", error);
      return res.status(500).send("Error fetching states");
    }
  });

  // Crear estado
  app.post("/api/locations/state", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { states } = await import("../shared/schema");
      const { name, countryId } = req.body;

      const [newState] = await db
        .insert(states)
        .values({ name, countryId })
        .returning();

      return res.json(newState);
    } catch (error: any) {
      console.error("Error creating state:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Obtener ciudades
  app.get("/api/locations/city", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { cities } = await import("../shared/schema");
      const { parentId } = req.query;

      let query = db.select().from(cities);
      if (parentId) {
        query = query.where(eq(cities.stateId, parentId as string));
      }

      const allCities = await query.orderBy(cities.name);
      return res.json(allCities);
    } catch (error: any) {
      console.error("Error fetching cities:", error);
      return res.status(500).send("Error fetching cities");
    }
  });

  // Crear ciudad
  app.post("/api/locations/city", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { cities } = await import("../shared/schema");
      const { name, stateId, countryId } = req.body;

      const [newCity] = await db
        .insert(cities)
        .values({ name, stateId, countryId })
        .returning();

      return res.json(newCity);
    } catch (error: any) {
      console.error("Error creating city:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // ==================== SERVICE PROVIDERS ENDPOINTS ====================

  // Obtener todos los proveedores
  app.get("/api/service-providers", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { serviceProviders } = await import("../shared/schema");
      
      const allProviders = await db
        .select()
        .from(serviceProviders)
        .orderBy(serviceProviders.name);
        
      return res.json(allProviders);
    } catch (error: any) {
      console.error("Error fetching service providers:", error);
      return res.status(500).send("Error fetching service providers");
    }
  });

  // Crear proveedor
  app.post("/api/service-providers", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { serviceProviders, insertServiceProviderSchema } = await import("../shared/schema");
      
      const validatedData = insertServiceProviderSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const [newProvider] = await db
        .insert(serviceProviders)
        .values(validatedData)
        .returning();

      return res.json(newProvider);
    } catch (error: any) {
      console.error("Error creating service provider:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Actualizar proveedor
  app.patch("/api/service-providers/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { serviceProviders, insertServiceProviderSchema } = await import("../shared/schema");
      const { id } = req.params;
      const validatedData = insertServiceProviderSchema.partial().parse(req.body);

      const [updatedProvider] = await db
        .update(serviceProviders)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(serviceProviders.id, id))
        .returning();

      if (!updatedProvider) {
        return res.status(404).send("Service provider not found");
      }

      return res.json(updatedProvider);
    } catch (error: any) {
      console.error("Error updating service provider:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Eliminar proveedor (solo si no está asociado)
  app.delete("/api/service-providers/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { serviceProviders } = await import("../shared/schema");
      const { id } = req.params;

      // TODO: Verificar si el proveedor está asociado a algún servicio
      // Por ahora permitimos la eliminación
      
      const [deletedProvider] = await db
        .delete(serviceProviders)
        .where(eq(serviceProviders.id, id))
        .returning();

      if (!deletedProvider) {
        return res.status(404).send("Service provider not found");
      }

      return res.json({ message: "Service provider deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting service provider:", error);
      return res.status(500).send("Error deleting service provider");
    }
  });

  // ==================== AIRPORTS ENDPOINTS ====================

  // Obtener todos los aeropuertos
  app.get("/api/airports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { countries, states, cities } = await import("../shared/schema");
      
      const allAirports = await db
        .select({
          id: airports.id,
          airportName: airports.airportName,
          iataCode: airports.iataCode,
          icaoCode: airports.icaoCode,
          latitude: airports.latitude,
          longitude: airports.longitude,
          timezones: airports.timezones,
          countryId: airports.countryId,
          stateId: airports.stateId,
          cityId: airports.cityId,
          country: sql<string | null>`COALESCE(${countries.name}, ${airports.country})`,
          state: sql<string | null>`COALESCE(${states.name}, ${airports.state})`,
          city: sql<string | null>`COALESCE(${cities.name}, ${airports.city})`,
          createdBy: airports.createdBy,
          createdAt: airports.createdAt,
          updatedAt: airports.updatedAt,
        })
        .from(airports)
        .leftJoin(countries, eq(airports.countryId, countries.id))
        .leftJoin(states, eq(airports.stateId, states.id))
        .leftJoin(cities, eq(airports.cityId, cities.id))
        .orderBy(countries.name, cities.name);
        
      return res.json(allAirports);
    } catch (error: any) {
      console.error("Error fetching airports:", error);
      return res.status(500).send("Error fetching airports");
    }
  });

  // Crear aeropuerto
  app.post("/api/airports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const validatedData = insertAirportSchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });

      const [newAirport] = await db
        .insert(airports)
        .values(validatedData)
        .returning();

      return res.json(newAirport);
    } catch (error: any) {
      console.error("Error creating airport:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Actualizar aeropuerto
  app.patch("/api/airports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { id } = req.params;
      const validatedData = insertAirportSchema.partial().parse(req.body);

      const [updatedAirport] = await db
        .update(airports)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(airports.id, id))
        .returning();

      if (!updatedAirport) {
        return res.status(404).send("Airport not found");
      }

      return res.json(updatedAirport);
    } catch (error: any) {
      console.error("Error updating airport:", error);
      return res.status(400).json({ error: error.message });
    }
  });

  // Eliminar aeropuerto
  app.delete("/api/airports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const { id } = req.params;

      const [deletedAirport] = await db
        .delete(airports)
        .where(eq(airports.id, id))
        .returning();

      if (!deletedAirport) {
        return res.status(404).send("Airport not found");
      }

      return res.json({ message: "Airport deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting airport:", error);
      return res.status(500).send("Error deleting airport");
    }
  });

      // OBJETO DE STORAGE
      app.get("/api/objects/:key(*)", async (req, res) => {
        try {
          const objectPath = req.path.replace("/api", "");
          console.log("Serving object path:", objectPath);

          if (objectPath.startsWith("/objects/uploads/")) {
            const relativePath = objectPath.replace("/objects/uploads/", "");
            const uploadsRoot = path.join(process.cwd(), "uploads");
            const resolvedPath = path.normalize(path.join(uploadsRoot, relativePath));

            if (!resolvedPath.startsWith(uploadsRoot)) {
              return res.status(400).json({ error: "Invalid object path" });
            }

            return res.sendFile(resolvedPath);
          }

          const objectStorageService = new ObjectStorageService();

          // Check if environment variables are set
          try {
            objectStorageService.getPrivateObjectDir();
            objectStorageService.getPublicObjectSearchPaths();
          } catch (envError: any) {
            console.error("Environment configuration error:", envError.message);
            return res.status(500).json({
              error: "Server configuration error",
              details: envError.message
            });
          }

          const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

          // Check if user can access this object
          const canAccess = await objectStorageService.canAccessObjectEntity({
            userId: req.user?.id,
            objectFile,
          });

          if (!canAccess) {
            return res.status(403).json({ error: "Access denied" });
          }

          await objectStorageService.downloadObject(objectFile, res);
        } catch (error: any) {
          if (error.name === "ObjectNotFoundError") {
            return res.status(404).json({ error: "Object not found" });
          }
          console.error("Error serving object:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            objectPath: req.path.replace("/api", "")
          });
          res.status(500).json({
            error: "Error serving object",
            details: error.message
          });
        }
      });

      // Get file metadata (including original filename)
      app.get("/api/objects/*/metadata", async (req, res) => {
        try {
          const objectPath = req.path.replace("/api", "").replace("/metadata", "");

          if (objectPath.startsWith("/objects/uploads/")) {
            const relativePath = objectPath.replace("/objects/uploads/", "");
            const uploadsRoot = path.join(process.cwd(), "uploads");
            const resolvedPath = path.normalize(path.join(uploadsRoot, relativePath));

            if (!resolvedPath.startsWith(uploadsRoot)) {
              return res.status(400).json({ error: "Invalid object path" });
            }

            const stats = await fs.promises.stat(resolvedPath);
            const originalName = path.basename(resolvedPath);

            return res.json({
              originalName,
              uploadedAt: stats.mtime.toISOString(),
              contentType: "application/octet-stream",
              size: stats.size.toString(),
            });
          }

          const objectStorageService = new ObjectStorageService();
          const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

          // Check if user can access this object
          const canAccess = await objectStorageService.canAccessObjectEntity({
            userId: req.user?.id,
            objectFile,
          });

          if (!canAccess) {
            return res.status(403).json({ error: "Access denied" });
          }

          // Get file metadata
          const [metadata] = await objectFile.getMetadata();
          const originalName = metadata?.metadata?.originalName || "Archivo sin nombre";
          const uploadedAt = metadata?.metadata?.uploadedAt;

          res.json({
            originalName,
            uploadedAt,
            contentType: metadata.contentType,
            size: metadata.size
          });
        } catch (error: any) {
          if (error.name === "ObjectNotFoundError") {
            return res.status(404).json({ error: "File not found" });
          }
          console.error("Error getting object metadata:", error);
          res.status(500).json({
            error: "Error getting metadata",
            details: error.message
          });
        }
      });

      // Create backup of all Object Storage files
      app.get("/api/backup/storage", async (req, res) => {
        if (!req.isAuthenticated() || req.user?.role !== 'admin') {
          return res.status(403).json({ error: "Access denied. Admin only." });
        }

        const archiver = await import('archiver');

        try {
          const privateDir = objectStorageService.getPrivateObjectDir();
          const { bucketName, objectName } = parseObjectPath(privateDir);

          const bucket = storageClient.bucket(bucketName);

          // Get date filters from query parameters
          const startDateParam = req.query.startDate as string | undefined;
          const endDateParam = req.query.endDate as string | undefined;

          let startDate: Date | undefined;
          let endDate: Date | undefined;

          if (startDateParam) {
            try {
              startDate = new Date(startDateParam);
              if (isNaN(startDate.getTime())) {
                return res.status(400).json({ error: "Invalid start date format" });
              }
              startDate.setHours(0, 0, 0, 0);
            } catch (err) {
              return res.status(400).json({ error: "Invalid start date" });
            }
          }
          if (endDateParam) {
            try {
              endDate = new Date(endDateParam);
              if (isNaN(endDate.getTime())) {
                return res.status(400).json({ error: "Invalid end date format" });
              }
              endDate.setHours(23, 59, 59, 999);
            } catch (err) {
              return res.status(400).json({ error: "Invalid end date" });
            }
          }

          // Get all files in the uploads directory
          let allFiles;
          try {
            [allFiles] = await bucket.getFiles({ prefix: `${objectName}/uploads/` });
          } catch (storageError: any) {
            console.error('Error accessing storage bucket:', storageError);
            return res.status(500).json({
              error: "Error accessing storage",
              details: storageError.message
            });
          }

          // Filter files by upload date if date range is specified
          let files = allFiles;
          if (startDate || endDate) {
            files = [];
            for (const file of allFiles) {
              try {
                const [metadata] = await file.getMetadata();
                const uploadedAt = metadata?.metadata?.uploadedAt
                  ? new Date(metadata.metadata.uploadedAt)
                  : metadata?.timeCreated
                    ? new Date(metadata.timeCreated)
                    : null;

                if (uploadedAt) {
                  const inRange = (!startDate || uploadedAt >= startDate) &&
                                 (!endDate || uploadedAt <= endDate);
                  if (inRange) {
                    files.push(file);
                  }
                }
              } catch (err) {
                console.error(`Error checking metadata for ${file.name}:`, err);
                // Include file if we can't determine date
                files.push(file);
              }
            }
          }

          if (files.length === 0) {
            return res.status(404).json({
              error: "No se encontraron archivos",
              details: startDate || endDate
                ? "No hay archivos en el rango de fechas seleccionado"
                : "No hay archivos en el almacenamiento"
            });
          }

          console.log(`Starting backup with ${files.length} files`)

          // Set headers for ZIP download with better timeout handling
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          let filename = `storage_backup_${timestamp}`;
          if (startDate || endDate) {
            const dateRange = `${startDate ? startDate.toISOString().split('T')[0] : 'inicio'}_a_${endDate ? endDate.toISOString().split('T')[0] : 'fin'}`;
            filename = `storage_backup_${dateRange}_${timestamp}`;
          }
          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Disposition', `attachment; filename="${filename}.zip"`);
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Transfer-Encoding', 'chunked');

          // Create ZIP archive with lower compression for faster processing
          const archive = archiver.default('zip', {
            zlib: { level: 6 } // Balanced compression (faster than 9)
          });

          let hasError = false;
          let archiveFinalized = false;

          archive.on('error', (err) => {
            console.error('Archive error:', err);
            hasError = true;
            if (!res.headersSent) {
              res.status(500).json({
                error: 'Error creating backup',
                details: err.message
              });
            } else {
              // If headers already sent, we can't send JSON error
              // Just end the response
              try {
                res.end();
              } catch (endError) {
                console.error('Error ending response:', endError);
              }
            }
          });

          archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
              console.warn('Archive warning (ENOENT):', err);
            } else {
              console.error('Archive warning (non-ENOENT):', err);
              // For critical warnings, mark as error
              if (err.code !== 'ENOENT') {
                hasError = true;
              }
            }
          });

          archive.on('end', () => {
            archiveFinalized = true;
            console.log('Archive finalized successfully');
          });

          // Pipe archive to response with error handling
          try {
            archive.pipe(res);
          } catch (pipeError: any) {
            console.error('Error piping archive to response:', pipeError);
            if (!res.headersSent) {
              return res.status(500).json({
                error: 'Error streaming backup',
                details: pipeError.message
              });
            }
            return;
          }

          // Keep connection alive
          const keepAliveInterval = setInterval(() => {
            if (!hasError && !res.writableEnded) {
              // Send a comment to keep connection alive
              res.write('');
            }
          }, 5000);

          // Add each file to the archive with error handling
          let processedCount = 0;
          for (const file of files) {
            if (hasError) break;

            try {
              const [metadata] = await file.getMetadata();
              const originalName = metadata?.metadata?.originalName || file.name.split('/').pop() || 'unnamed';
              const folder = metadata?.metadata?.folder || 'general';

              // Create a readable stream from the file
              const stream = file.createReadStream();

              // Handle stream errors
              stream.on('error', (streamErr) => {
                console.error(`Stream error for ${file.name}:`, streamErr);
                // Continue with other files instead of failing
              });

              // Add to archive with organized folder structure
              archive.append(stream, {
                name: `${folder}/${originalName}`,
                date: metadata?.metadata?.uploadedAt ? new Date(metadata.metadata.uploadedAt) : new Date()
              });

              processedCount++;

              // Log progress every 50 files
              if (processedCount % 50 === 0) {
                console.log(`Processed ${processedCount}/${files.length} files`);
              }
            } catch (fileError) {
              console.error(`Error processing file ${file.name}:`, fileError);
              // Continue with other files
            }
          }

          // Clear keep-alive interval
          clearInterval(keepAliveInterval);

          // Finalize the archive
          if (!hasError) {
            try {
              await archive.finalize();

              // Wait a bit to ensure finalization completes
              await new Promise(resolve => setTimeout(resolve, 100));

              if (!archiveFinalized) {
                console.warn('Archive finalize() called but end event not received');
              }

              console.log(`Backup created successfully with ${processedCount}/${files.length} files`);
            } catch (finalizeError: any) {
              console.error('Error finalizing archive:', finalizeError);
              if (!res.headersSent) {
                return res.status(500).json({
                  error: 'Error completing backup',
                  details: finalizeError.message
                });
              }
            }
          } else {
            console.error('Archive had errors, not finalizing');
            if (!res.headersSent) {
              return res.status(500).json({
                error: 'Backup creation failed due to errors'
              });
            }
          }
        } catch (error: any) {
          console.error("Error creating storage backup:", error);
          console.error("Error stack:", error.stack);

          // Make sure we always send a response
          if (!res.headersSent) {
            res.status(500).json({
              error: "Error creating backup",
              details: error.message || 'Unknown error occurred'
            });
          }
        }
      });

      // Endpoint para obtener URL de carga de objetos
      app.post("/api/objects/upload", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        try {
          console.log("=== OBTENIENDO URL DE CARGA ===");
          
          // Check if using local storage
          const shouldUseLocalStorage = !process.env.PRIVATE_OBJECT_DIR;
          
          if (shouldUseLocalStorage) {
            // For local storage, return a special flag to indicate direct upload
            console.log("Usando almacenamiento local, retornando indicador de subida directa");
            return res.json({ 
              useDirectUpload: true,
              uploadURL: "/api/travels/upload-cover-direct" 
            });
          }
          
          const objectStorageService = new ObjectStorageService();
          const uploadURL = await objectStorageService.getObjectEntityUploadURL();
          console.log("URL de carga generada exitosamente");
          res.json({ uploadURL });
        } catch (error) {
          console.error("Error getting upload URL:", error);
          console.error("Error stack:", error instanceof Error ? error.stack : 'No stack available');
          res.status(500).json({ 
            error: "Error getting upload URL",
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      app.put("/api/travels/:id/cover-image", async (req, res) => {
        try {
          const travelId = req.params.id;
          const { coverImageURL } = req.body;

          console.log("=== ACTUALIZANDO IMAGEN DE PORTADA ===");
          console.log("Travel ID:", travelId);
          console.log("Cover Image URL:", coverImageURL);

          let objectPath = coverImageURL;

          // Only try to set ACL policy if using Object Storage (not local storage)
          const shouldUseLocalStorage = !process.env.PRIVATE_OBJECT_DIR;
          
          if (!shouldUseLocalStorage) {
            const objectStorageService = new ObjectStorageService();
            objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
              coverImageURL,
              {
                owner: "system",
                visibility: "public",
              },
            );
          }

          // Update travel with cover image URL
          const travel = await storage.getTravel(travelId);
          if (!travel) {
            return res.status(404).json({ error: "Travel not found" });
          }

          // Update the travel object with the cover image path
          console.log("Actualizando viaje con coverImage:", objectPath);
          await storage.updateTravel(travelId, { ...travel, coverImage: objectPath });
          
          console.log("Imagen de portada actualizada exitosamente");
          res.json({ objectPath });
        } catch (error) {
          console.error("Error updating cover image:", error);
          res.status(500).json({ error: "Error updating cover image" });
        }
      });

      // Endpoint para compartir itinerario por correo
      app.post("/api/travels/:id/share", async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        try {
          const travelId = req.params.id;
          const { recipientEmail, recipientName } = req.body;

          if (!recipientEmail) {
            return res.status(400).json({ error: "Recipient email is required" });
          }

          // Obtener el viaje
          const travel = await storage.getTravel(travelId);
          if (!travel) {
            return res.status(404).json({ error: "Travel not found" });
          }

          // Crear servicio de email
          const emailService = new EmailService();

          // Generar token público si no existe o si ha expirado
          let publicToken = travel.publicToken;
          let publicTokenExpiry = travel.publicTokenExpiry;

          const now = new Date();
          const oneMonthFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days

          if (!publicToken || !publicTokenExpiry || publicTokenExpiry < now) {
            publicToken = emailService.generatePublicToken();
            publicTokenExpiry = oneMonthFromNow;

            // Actualizar el viaje con el nuevo token
            await storage.updateTravel(travelId, {
              publicToken,
              publicTokenExpiry
            });
          }

          // Enviar el correo
          await emailService.sendTravelShareEmail(
            travel,
            recipientEmail,
            publicToken,
            recipientName
          );

          res.json({
            success: true,
            message: "Itinerario enviado exitosamente",
            tokenExpiry: publicTokenExpiry
          });
        } catch (error: any) {
          console.error("Error sharing travel:", error);
          res.status(500).json({
            error: "Error al enviar el itinerario",
            details: error.message
          });
        }
      });

      // AWS SNS Webhook endpoint for email bounce notifications
      app.post("/api/webhooks/sns/email-bounce", express.json({ type: 'text/plain' }), async (req, res) => {
        try {
          const messageType = req.headers['x-amz-sns-message-type'];

          // Parse the SNS message
          let message;
          if (typeof req.body === 'string') {
            message = JSON.parse(req.body);
          } else {
            message = req.body;
          }

          console.log('SNS Message Type:', messageType);
          console.log('SNS Message:', JSON.stringify(message, null, 2));

          // Handle subscription confirmation
          if (messageType === 'SubscriptionConfirmation') {
            console.log('Confirming SNS subscription...');
            const subscribeURL = message.SubscribeURL;

            // Confirm the subscription by making a GET request to SubscribeURL
            const response = await fetch(subscribeURL);

            if (response.ok) {
              console.log('SNS subscription confirmed successfully');
              return res.status(200).json({
                message: 'Subscription confirmed',
                subscriptionArn: message.SubscriptionArn
              });
            } else {
              console.error('Failed to confirm subscription:', await response.text());
              return res.status(500).json({ error: 'Failed to confirm subscription' });
            }
          }

          // Handle notification messages (bounces, complaints, etc.)
          if (messageType === 'Notification') {
            const snsMessage = typeof message.Message === 'string'
              ? JSON.parse(message.Message)
              : message.Message;

            console.log('SNS Notification Message:', JSON.stringify(snsMessage, null, 2));

            // Handle bounce notifications
            if (snsMessage.notificationType === 'Bounce') {
              const bounce = snsMessage.bounce;
              const bouncedRecipients = bounce.bouncedRecipients || [];

              console.log('Email Bounce Detected:');
              console.log('- Bounce Type:', bounce.bounceType);
              console.log('- Bounce Subtype:', bounce.bounceSubType);
              console.log('- Bounced Recipients:', bouncedRecipients.map((r: any) => r.emailAddress).join(', '));

              // Log each bounced email
              for (const recipient of bouncedRecipients) {
                console.log(`Bounced email: ${recipient.emailAddress}`);
                console.log(`Status: ${recipient.status || 'N/A'}`);
                console.log(`Diagnostic Code: ${recipient.diagnosticCode || 'N/A'}`);

                // TODO: Implement business logic here:
                // - Mark email as invalid in database
                // - Notify admin
                // - Update user status
              }
            }

            // Handle complaint notifications
            if (snsMessage.notificationType === 'Complaint') {
              const complaint = snsMessage.complaint;
              const complainedRecipients = complaint.complainedRecipients || [];

              console.log('Email Complaint Detected:');
              console.log('- Complaint Feedback Type:', complaint.complaintFeedbackType);
              console.log('- Complained Recipients:', complainedRecipients.map((r: any) => r.emailAddress).join(', '));

              // TODO: Implement business logic here:
              // - Remove from mailing list
              // - Log complaint
            }

            // Handle delivery notifications (optional)
            if (snsMessage.notificationType === 'Delivery') {
              const delivery = snsMessage.delivery;
              console.log('Email Delivered Successfully:');
              console.log('- Recipients:', delivery.recipients.join(', '));
            }

            return res.status(200).json({ message: 'Notification processed' });
          }

          // Handle unsubscribe confirmation
          if (messageType === 'UnsubscribeConfirmation') {
            console.log('SNS Unsubscribe Confirmation received');
            return res.status(200).json({ message: 'Unsubscribe noted' });
          }

          // Unknown message type
          console.warn('Unknown SNS message type:', messageType);
          return res.status(400).json({ error: 'Unknown message type' });

        } catch (error: any) {
          console.error('Error processing SNS webhook:', error);
          console.error('Error details:', error.message);
          console.error('Request body:', req.body);

          // Return 200 to prevent SNS from retrying
          return res.status(200).json({
            error: 'Error processing webhook',
            details: error.message
          });
        }
      });



      const httpServer = createServer(app);
  return httpServer;
}