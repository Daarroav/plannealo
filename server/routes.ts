import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTravelSchema, insertAccommodationSchema, insertActivitySchema, insertFlightSchema, insertTransportSchema, insertCruiseSchema, insertInsuranceSchema, insertNoteSchema } from "@shared/schema";
import { ObjectStorageService, objectStorageClient as storageClient } from "./objectStorage";
import { EmailService } from "./emailService";
import { AeroDataBoxService } from "./aeroDataBoxService";
import multer from 'multer';  // Instalacion  para subir archivos
import express from 'express'; // Instalacion para archivos estaticos
import path from 'path';
import fs from "fs";  // Para crear carpetas
import { Buffer } from 'buffer';
import { eq } from "drizzle-orm";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes

  // Configuración de multer para subir archivos al Object Storage
  const multerStorage = multer.memoryStorage(); // Usar memoria en lugar de disco


  const upload = multer({
    storage: multerStorage, // Configuración de multer para subir archivos
    limits: {
      fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
  }); // Configuración de multer para subir archivos
  app.use('/uploads', express.static('uploads')); // Configuración de archivos estáticos

  // Backup endpoint
  app.get('/api/backup', async (req, res) => {
    try {
      // Check if user is admin
      const user = (req as any).user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
      }

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

  // Setup authentication routes first
  setupAuth(app);

  // Travel routes
  // Obtener estadísticas de clientes
  app.get("/api/clients/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    try {
      const stats = await storage.getClientStats();

      res.json(stats);
    } catch (error) {
      console.error("Error fetching client stats:", error);
      res.status(500).json({ message: "Error al obtener estadísticas de clientes" });
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


      app.post("/api/travels", upload.single('coverImage'), async (req, res) => {
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }

        console.log("Request body:", req.body);
        console.log("Cover image file:", req.file);
        try {
          const { clientEmail, ...travelData } = req.body;

          // Verificar si el cliente ya existe
          let client = await storage.getUserByUsername(clientEmail);
          console.log("Client:", client);

          // Si no existe, crear un nuevo usuario cliente
          if (!client) {
            // Generar una contraseña temporal segura
            const tempPassword = Math.random().toString(36).slice(-8);


            client = await storage.createUser({
              username: clientEmail,
              password: tempPassword, // La contraseña se hasheará en el storage
              name: req.body.clientName,
              role: 'client',
            });

            // Aquí podrías enviar un correo al cliente con sus credenciales
            // await emailService.sendWelcomeEmail(clientEmail, tempPassword);
          }

          const validated = insertTravelSchema.parse({
            ...travelData,
            clientEmail: clientEmail,
            clientId: client.id,
            createdBy: req.user!.id,
            startDate: new Date(travelData.startDate),
            endDate: new Date(travelData.endDate),
          });

          const travel = await storage.createTravel(validated);
          
          // Handle cover image upload if provided
          if (req.file) {
            try {
              // Upload file to object storage
              const objectPath = await uploadFileToObjectStorage(req.file, 'covers');
              
              // Set ACL policy for public access
              const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
              await objectFile.setMetadata({
                metadata: {
                  visibility: "public",
                  owner: "system",
                }
              });

              // Update travel with cover image path
              await storage.updateTravel(travel.id, { ...travel, coverImage: objectPath });
              travel.coverImage = objectPath;
            } catch (error) {
              console.error("Error uploading cover image:", error);
              // Don't fail the whole operation if image upload fails
            }
          }
          
          res.status(201).json(travel);
        } catch (error) {
          console.error("Error creating travel:", error);
          res.status(400).json({
            message: "Error creating travel",
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });

      app.put("/api/travels/:id", async (req, res) => {
        // check if the user is authenticated
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }



        try {
          const travel = await storage.getTravel(req.params.id); // Get travel by id
          if (!travel) { // If travel not found
            return res.status(404).json({ message: "Travel not found" });
          }

          // Condiciones para el acceso al viaje
          const isOwner = travel.createdBy === req.user!.id;
          const isAdmin = req.user!.role === "admin";

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
          res.json(updated);
        } catch (error) {
          console.error("Error updating travel:", error);
          res.status(500).json({ message: "Error updating travel" });
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
          const isAdmin = req.user!.role === "admin";

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
          const isAdmin = req.user!.role === "admin";

          if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Access denied" });
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

          const validated = insertActivitySchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            date: new Date(req.body.date),
            attachments: attachments,
          });

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

          const validated = insertFlightSchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            departureDate: new Date(req.body.departureDate),
            arrivalDate: new Date(req.body.arrivalDate),
            attachments: attachments,
          });

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

          const validated = insertTransportSchema.parse({
            ...req.body,
            travelId: req.params.travelId,
            pickupDate: new Date(req.body.pickupDate),
            ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
            attachments: attachments,
          });

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

          const validated = insertInsuranceSchema.parse(insuranceData);

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
            visibleToTravelers: visibleToTravelers === 'true',
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
          country: countries.name,
          state: states.name,
          city: cities.name,
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

      app.put("/api/travels/:id/cover-image", async (req, res) => {
        try {
          const travelId = req.params.id;
          const { coverImageURL } = req.body;

          const objectStorageService = new ObjectStorageService();
          const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
            coverImageURL,
            {
              owner: "system", // For now, using system as owner
              visibility: "public",
            },
          );

          // Update travel with cover image URL
          const travel = await storage.getTravel(travelId);
          if (!travel) {
            return res.status(404).json({ error: "Travel not found" });
          }

          // Update the travel object with the cover image path
          await storage.updateTravel(travelId, { ...travel, coverImage: objectPath });

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
          const { recipientEmail, clientName } = req.body;

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
            { ...travel, clientName: clientName || travel.clientName },
            recipientEmail,
            publicToken
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