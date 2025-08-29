import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTravelSchema, insertAccommodationSchema, insertActivitySchema, insertFlightSchema, insertTransportSchema, insertCruiseSchema, insertInsuranceSchema, insertNoteSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import { EmailService } from "./emailService";
import { AeroDataBoxService } from "./aeroDataBoxService";
import multer from 'multer';  // Instalacion  para subir archivos
import express from 'express'; // Instalacion para archivos estaticos
import path from 'path';


export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes

  // Configuración de multer para subir archivos
  const multerStorage = multer.diskStorage({
    destination: 'uploads/', // Directorio donde se guardarán los archivos subidos
    filename: function (req, file, cb) { // Nombre del archivo subido
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Genera un nombre único
      const ext = path.extname(file.originalname); // Obtiene la extensión del archivo
      cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Genera el nombre del archivo
    }
  });


  const upload = multer({ 
    storage: multerStorage, // Configuración de multer para subir archivos
    limits: {
      fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
  }); // Configuración de multer para subir archivos
  app.use('/uploads', express.static('uploads')); // Configuración de archivos estáticos


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
  

  app.post("/api/travels", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    console.log("Request body:", req.body);
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
      res.status(201).json(travel);
    } catch (error) {
      console.error("Error creating travel:", error);
      res.status(400).json({ 
        message: "Error creating travel",
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  app.get("/api/travels/:id", async (req, res) => {
    console.info("Fetching travel:", req.params.id);
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

  app.put("/api/travels/:id", async (req, res) => {
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

      const updated = await storage.updateTravel(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating travel:", error);
      res.status(500).json({ message: "Error updating travel" });
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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const thumbnail = files.thumbnail?.[0] ? `/uploads/${files.thumbnail[0].filename}` : null;
      const attachments = files.attachments ? files.attachments.map(file => `/uploads/${file.filename}`) : [];

      console.log("Request body:", req.body);
      console.log("Thumbnail:", thumbnail);
      console.log("Attachments:", attachments);
      console.log("Travel ID:", req.params.travelId);
      
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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Handle thumbnail upload
      if (files.thumbnail?.[0]) {
        updateData.thumbnail = `/uploads/${files.thumbnail[0].filename}`;
      }
      
      // Handle attachments upload
      if (files.attachments) {
        updateData.attachments = files.attachments.map(file => `/uploads/${file.filename}`);
      }
      
      // Convert dates if provided
      if (updateData.checkIn) {
        updateData.checkIn = new Date(updateData.checkIn);
      }
      if (updateData.checkOut) {
        updateData.checkOut = new Date(updateData.checkOut);
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

  app.post("/api/travels/:travelId/activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertActivitySchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        date: new Date(req.body.date),
      });

      const activity = await storage.createActivity(validated);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: "Error creating activity" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const activity = await storage.updateActivity(req.params.id, {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      });
      res.json(activity);
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(400).json({ message: "Error updating activity" });
    }
  });

  app.put("/api/flights/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const flight = await storage.updateFlight(req.params.id, {
        ...req.body,
        departureDate: req.body.departureDate ? new Date(req.body.departureDate) : undefined,
        arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : undefined,
      });
      res.json(flight);
    } catch (error) {
      console.error("Error updating flight:", error);
      res.status(400).json({ message: "Error updating flight" });
    }
  });

  app.put("/api/transports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const transport = await storage.updateTransport(req.params.id, {
        ...req.body,
        pickupDate: req.body.pickupDate ? new Date(req.body.pickupDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      });
      res.json(transport);
    } catch (error) {
      console.error("Error updating transport:", error);
      res.status(400).json({ message: "Error updating transport" });
    }
  });

  app.put("/api/cruises/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const cruise = await storage.updateCruise(req.params.id, {
        ...req.body,
        departureDate: req.body.departureDate ? new Date(req.body.departureDate) : undefined,
        arrivalDate: req.body.arrivalDate ? new Date(req.body.arrivalDate) : undefined,
      });
      res.json(cruise);
    } catch (error) {
      console.error("Error updating cruise:", error);
      res.status(400).json({ message: "Error updating cruise" });
    }
  });

  app.put("/api/insurances/:id", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const updateData = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      // Handle attachments upload
      if (files?.attachments) {
        updateData.attachments = files.attachments.map(file => `/uploads/${file.filename}`);
      }
      
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

  // Flight routes
  app.get("/api/travels/:travelId/flights", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const flights = await storage.getFlightsByTravel(req.params.travelId);
      res.json(flights);
    } catch (error) {
      console.error("Error fetching flights:", error);
      res.status(500).json({ message: "Error fetching flights" });
    }
  });

  app.post("/api/travels/:travelId/flights", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertFlightSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        departureDate: new Date(req.body.departureDate),
        arrivalDate: new Date(req.body.arrivalDate),
      });

      const flight = await storage.createFlight(validated);
      res.status(201).json(flight);
    } catch (error) {
      console.error("Error creating flight:", error);
      res.status(400).json({ message: "Error creating flight" });
    }
  });

  // Transport routes
  app.get("/api/travels/:travelId/transports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const transports = await storage.getTransportsByTravel(req.params.travelId);
      res.json(transports);
    } catch (error) {
      console.error("Error fetching transports:", error);
      res.status(500).json({ message: "Error fetching transports" });
    }
  });

  app.post("/api/travels/:travelId/transports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertTransportSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        pickupDate: new Date(req.body.pickupDate),
        ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
      });

      const transport = await storage.createTransport(validated);
      res.status(201).json(transport);
    } catch (error) {
      console.error("Error creating transport:", error);
      res.status(400).json({ message: "Error creating transport" });
    }
  });

  // Cruise routes
  app.get("/api/travels/:travelId/cruises", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const cruises = await storage.getCruisesByTravel(req.params.travelId);
      res.json(cruises);
    } catch (error) {
      console.error("Error fetching cruises:", error);
      res.status(500).json({ message: "Error fetching cruises" });
    }
  });

  app.post("/api/travels/:travelId/cruises", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertCruiseSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        departureDate: new Date(req.body.departureDate),
        arrivalDate: new Date(req.body.arrivalDate),
      });

      const cruise = await storage.createCruise(validated);
      res.status(201).json(cruise);
    } catch (error) {
      console.error("Error creating cruise:", error);
      res.status(400).json({ message: "Error creating cruise" });
    }
  });

  // Insurance routes
  app.get("/api/travels/:travelId/insurances", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const insurances = await storage.getInsurancesByTravel(req.params.travelId);
      res.json(insurances);
    } catch (error) {
      console.error("Error fetching insurances:", error);
      res.status(500).json({ message: "Error fetching insurances" });
    }
  });

  app.post("/api/travels/:travelId/insurances", upload.fields([{ name: 'attachments', maxCount: 10 }]), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const attachments = files?.attachments ? files.attachments.map(file => `/uploads/${file.filename}`) : [];
      
      const validated = insertInsuranceSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        effectiveDate: new Date(req.body.effectiveDate),
        attachments: attachments,
      });

      const insurance = await storage.createInsurance(validated);
      res.status(201).json(insurance);
    } catch (error) {
      console.error("Error creating insurance:", error);
      res.status(400).json({ message: "Error creating insurance" });
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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const attachments = files?.attachments ? files.attachments.map(file => `/uploads/${file.filename}`) : [];
      
      const validated = insertNoteSchema.parse({
        ...req.body,
        travelId: req.params.id,
        noteDate: new Date(req.body.noteDate),
        attachments: attachments,
      });

      const note = await storage.createNote(validated);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
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
      
      // Handle attachments upload
      if (files?.attachments) {
        updateData.attachments = files.attachments.map(file => `/uploads/${file.filename}`);
      }
      
      // Convert date if provided
      if (updateData.noteDate) {
        updateData.noteDate = new Date(updateData.noteDate);
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

      const note = await storage.updateNote(req.params.noteId, updateData);
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(400).json({ message: "Error updating note" });
    }
  });

  // AeroDataBox API endpoints
  app.get("/api/airports/search", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }

      const airports = await AeroDataBoxService.searchAirports(q);
      res.json(airports);
    } catch (error) {
      console.error("Error searching airports:", error);
      res.status(500).json({ message: "Error searching airports" });
    }
  });

  app.get("/api/flights/search", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { origin, destination, date } = req.query;
      
      if (!origin || !destination || !date) {
        return res.status(400).json({ 
          message: "Parameters 'origin', 'destination', and 'date' are required" 
        });
      }

      const flights = await AeroDataBoxService.searchFlightsBetweenAirports(
        origin as string, 
        destination as string, 
        date as string
      );
      
      res.json(flights);
    } catch (error) {
      console.error("Error searching flights:", error);
      res.status(500).json({ message: "Error searching flights" });
    }
  });

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const travels = await storage.getTravelsByUser(req.user!.id);
      const activeTrips = travels.filter(t => t.status === "published").length;
      const drafts = travels.filter(t => t.status === "draft").length;

      // For clients, we'll count unique client names
      const uniqueClients = new Set(travels.map(t => t.clientName)).size;

      res.json({
        activeTrips,
        drafts,
        clients: uniqueClients,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Get full travel data (for preview and PDF generation)
  app.get("/api/travels/:id/full", async (req, res) => {
    try {
      const publicToken = req.query.token as string;
      let travel;

      if (publicToken) {
        // Acceso público con token
        travel = await storage.getTravelByPublicToken(publicToken);
        if (!travel) {
          return res.status(404).json({ error: "Travel not found or token invalid" });
        }
        
        // Verificar que el token no haya expirado
        if (travel.publicTokenExpiry && travel.publicTokenExpiry < new Date()) {
          return res.status(403).json({ error: "Access link has expired" });
        }
        
        // Verificar que el ID coincida con el token
        if (travel.id !== req.params.id) {
          return res.status(404).json({ error: "Travel not found" });
        }
      } else {
        // Acceso autenticado normal
        if (!req.isAuthenticated()) {
          return res.sendStatus(401);
        }
        travel = await storage.getTravel(req.params.id);
        if (!travel) {
          return res.status(404).json({ error: "Travel not found" });
        }
      }

      const [accommodations, activities, flights, transports, cruises, insurances, notes] = await Promise.all([
        storage.getAccommodationsByTravel(req.params.id),
        storage.getActivitiesByTravel(req.params.id),
        storage.getFlightsByTravel(req.params.id),
        storage.getTransportsByTravel(req.params.id),
        storage.getCruisesByTravel(req.params.id),
        storage.getInsurancesByTravel(req.params.id),
        storage.getNotesByTravel(req.params.id)
      ]);

      res.json({
        travel,
        accommodations,
        activities,
        flights,
        transports,
        cruises,
        insurances,
        notes
      });
    } catch (error) {
      console.error("Error fetching full travel data:", error);
      res.status(500).json({ error: "Error fetching travel data" });
    }
  });

  // Share travel via email (placeholder - not connected to SendGrid)
  app.post("/api/travels/:id/share/email", async (req, res) => {
    try {
      const { clientEmail, clientName, message } = req.body;

      if (!clientEmail || !clientName) {
        return res.status(400).json({ error: "Client email and name are required" });
      }

      const travel = await storage.getTravel(req.params.id);
      if (!travel) {
        return res.status(404).json({ error: "Travel not found" });
      }

      // TODO: Integrate with SendGrid when API key is available
      // For now, just simulate success
      console.log(`Email would be sent to: ${clientEmail}`);
      console.log(`Client name: ${clientName}`);
      console.log(`Travel: ${travel.name}`);
      console.log(`Message: ${message || 'No message'}`);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.json({ 
        success: true, 
        message: "Itinerario enviado exitosamente" 
      });
    } catch (error) {
      console.error("Error sharing travel:", error);
      res.status(500).json({ error: "Error sharing travel" });
    }
  });

  // Generate PDF for travel using Puppeteer
  app.get("/api/travels/:id/generate-pdf", async (req, res) => {
    const puppeteer = await import('puppeteer');
    let browser;
    
    try {
      const travel = await storage.getTravel(req.params.id);
      if (!travel) {
        return res.status(404).json({ error: "Travel not found" });
      }

      // Get all travel data
      const [accommodations, activities, flights, transports, cruises, insurances, notes] = await Promise.all([
        storage.getAccommodationsByTravel(req.params.id),
        storage.getActivitiesByTravel(req.params.id),
        storage.getFlightsByTravel(req.params.id),
        storage.getTransportsByTravel(req.params.id),
        storage.getCruisesByTravel(req.params.id),
        storage.getInsurancesByTravel(req.params.id),
        storage.getNotesByTravel(req.params.id)
      ]);

      // Filter notes to only show those visible to travelers
      const visibleNotes = notes.filter(note => note.visibleToTravelers);

      // Create a simple HTML content for PDF generation
      const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      const formatDateTime = (dateTime: Date) => {
        return new Date(dateTime).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Itinerario - ${travel.name}</title>
          <style>
            @page { margin: 40px; }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              line-height: 1.4;
              font-size: 11px;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              padding-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #dc2626;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .header-center {
              flex: 1;
              text-align: center;
            }
            .client-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .dates {
              font-size: 14px;
              margin: 15px 0;
              color: #666;
            }
            .cover-image { 
              width: 100%; 
              max-width: 500px; 
              height: 250px; 
              object-fit: cover; 
              margin: 20px auto; 
              display: block;
              border: 1px solid #ddd;
            }
            .agency-info {
              margin-top: 30px;
              text-align: right;
              font-size: 12px;
              color: #666;
            }
            .day-section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .day-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .day-box {
              background: #f8f9fa;
              border: 1px solid #ddd;
              padding: 8px 12px;
              margin-right: 15px;
              text-align: center;
              min-width: 50px;
              font-weight: bold;
            }
            .day-month {
              font-size: 10px;
              text-transform: uppercase;
              display: block;
            }
            .day-number {
              font-size: 16px;
              display: block;
            }
            .activity-item {
              margin-bottom: 20px;
              padding: 15px;
              border-left: 3px solid #dc2626;
              background: #fafafa;
            }
            .activity-title {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .activity-details {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 15px;
              margin-bottom: 10px;
            }
            .detail-item {
              font-size: 10px;
            }
            .detail-label {
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .detail-value {
              color: #666;
            }
            .notes {
              margin-top: 10px;
              font-style: italic;
              color: #666;
              font-size: 10px;
            }
            .footer {
              position: fixed;
              bottom: 20px;
              left: 40px;
              right: 40px;
              text-align: center;
              font-size: 9px;
              color: #999;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            .time-label {
              font-weight: bold;
              color: #dc2626;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PLANNEALO</div>
            <div class="header-center">
              <div class="client-title">${travel.clientName}</div>
              <div class="dates">Start: ${formatDate(travel.startDate)} &nbsp;&nbsp;&nbsp;&nbsp; End: ${formatDate(travel.endDate)}</div>
              ${travel.coverImage ? `<img src="${travel.coverImage}" alt="Imagen de portada" class="cover-image" />` : ''}
            </div>
            <div class="agency-info">
              <div style="font-weight: bold;">PLANNEALO</div>
              <div>e: plannealo@gmail.com</div>
            </div>
          </div>
      `;

      // Group all activities by date
      const allActivities = [
        ...accommodations.map(acc => ({
          type: 'accommodation',
          date: acc.checkIn,
          title: acc.name,
          subtitle: 'Check-In',
          details: {
            'ACCOMMODATIONS': acc.name,
            'BOOKING #': acc.confirmationNumber || '',
            'CHECK-IN': formatDateTime(acc.checkIn),
            'CHECK-OUT': formatDateTime(acc.checkOut)
          },
          notes: acc.notes,
          location: acc.location
        })),
        ...activities.map(activity => ({
          type: 'activity',
          date: activity.date,
          title: activity.name,
          subtitle: activity.type,
          details: {
            'ABOUT': activity.name,
            'BOOKING #': activity.confirmationNumber || '',
            'START': formatDateTime(activity.date) + (activity.startTime ? ` ${activity.startTime}` : ''),
            'FINISH': activity.endTime || ''
          },
          notes: activity.notes
        })),
        ...flights.map(flight => ({
          type: 'flight',
          date: flight.departureDate,
          title: `Flight to: ${flight.arrivalCity}`,
          subtitle: 'Flight',
          details: {
            'AIRLINE & FLIGHT #': `${flight.airline} ${flight.flightNumber}`,
            'DEPARTURE': formatDateTime(flight.departureDate),
            'ARRIVAL': formatDateTime(flight.arrivalDate)
          },
          notes: '',
          location: `${flight.departureCity} - ${flight.arrivalCity}`
        })),
        ...transports.map(transport => ({
          type: 'transport',
          date: transport.pickupDate,
          title: transport.type,
          subtitle: 'Transport',
          details: {
            'CONTACT': transport.provider || '',
            'BOOKING #': transport.confirmationNumber || '',
            'START': formatDateTime(transport.pickupDate),
            'FINISH': transport.endDate ? formatDateTime(transport.endDate) : ''
          },
          notes: transport.notes,
          location: `${transport.pickupLocation} - ${transport.dropoffLocation || ''}`
        }))
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Group by date
      const activitiesByDate = allActivities.reduce((acc, activity) => {
        const dateKey = formatDate(activity.date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(activity);
        return acc;
      }, {} as Record<string, any[]>);

      Object.entries(activitiesByDate).forEach(([date, dayActivities]) => {
        const dayDate = new Date(dayActivities[0].date);
        const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const monthName = dayDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const dayNumber = dayDate.getDate();

        htmlContent += `
          <div class="day-section">
            <div class="day-header">
              <div class="day-box">
                <span class="day-month">${dayName}<br/>${monthName}</span>
                <span class="day-number">${dayNumber}</span>
              </div>
              <div style="flex: 1;">
                ${dayActivities.map(activity => `<strong>${activity.title}</strong>`).join(' • ')}
              </div>
            </div>
        `;

        dayActivities.forEach(activity => {
          htmlContent += `
            <div class="activity-item">
              <div class="activity-title">${activity.title}</div>
              <div class="activity-details">
                ${Object.entries(activity.details).map(([key, value]) => `
                  <div class="detail-item">
                    <div class="detail-label">${key}</div>
                    <div class="detail-value">${value}</div>
                  </div>
                `).join('')}
              </div>
              ${activity.notes ? `<div class="notes">${activity.notes}</div>` : ''}
            </div>
          `;
        });

        htmlContent += `</div>`;
      });

      // Add remaining notes section
      if (visibleNotes.length > 0) {
        htmlContent += `
          <div class="day-section">
            <div class="day-header">
              <div class="day-box">
                <span class="day-month">NOTAS</span>
              </div>
              <div style="flex: 1;"><strong>Información Adicional</strong></div>
            </div>
        `;
        visibleNotes.forEach(note => {
          htmlContent += `
            <div class="activity-item">
              <div class="activity-title">${note.title}</div>
              <div class="notes">${note.content}</div>
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      // Add footer
      htmlContent += `
          <div class="footer">
            PLANNEALO &nbsp;&nbsp;&nbsp; e: plannealo@gmail.com &nbsp;&nbsp;&nbsp; page 1 of 1
          </div>
        </body></html>`;

      // Try to generate PDF using Puppeteer, fallback to HTML if it fails
      try {
        browser = await puppeteer.launch({ 
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '40px',
            right: '40px',
            bottom: '40px',
            left: '40px'
          }
        });

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="itinerario-${travel.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
        
        res.send(pdfBuffer);
      } catch (puppeteerError: any) {
        console.warn('Puppeteer failed, falling back to printable HTML:', puppeteerError.message);
        
        // Fallback: return HTML optimized for printing/PDF conversion
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `inline; filename="itinerario-${travel.name.replace(/\s+/g, '-').toLowerCase()}.html"`);
        
        // Add print-specific CSS and auto-print script
        const printableHtml = htmlContent.replace(
          '</head>',
          `
          <style media="print">
            @page { size: A4; margin: 40px; }
            body { -webkit-print-color-adjust: exact; }
          </style>
          <script>
            window.addEventListener('load', function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            });
          </script>
          </head>`
        );
        
        res.send(printableHtml);
      }
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Error generating PDF" });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // Object Storage endpoints for travel cover images
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Error getting upload URL" });
    }
  });

  // Serve object storage files
  app.get("/api/objects/*", async (req, res) => {
    try {
      const objectPath = req.path.replace("/api", "");
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

      await objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      if (error.name === "ObjectNotFoundError") {
        return res.status(404).json({ error: "Object not found" });
      }
      console.error("Error serving object:", error);
      res.status(500).json({ error: "Error serving object" });
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
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
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

  const httpServer = createServer(app);
  return httpServer;
}