import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTravelSchema, insertAccommodationSchema, insertActivitySchema, insertFlightSchema, insertTransportSchema, insertCruiseSchema, insertInsuranceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Travel routes
  app.get("/api/travels", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    try {
      const travels = await storage.getTravelsByUser(req.user!.id);
      res.json(travels);
    } catch (error) {
      console.error("Error fetching travels:", error);
      res.status(500).json({ message: "Error fetching travels" });
    }
  });

  app.post("/api/travels", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertTravelSchema.parse({
        ...req.body,
        createdBy: req.user!.id,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      });
      
      const travel = await storage.createTravel(validated);
      res.status(201).json(travel);
    } catch (error) {
      console.error("Error creating travel:", error);
      res.status(400).json({ message: "Error creating travel" });
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
      if (travel.createdBy !== req.user!.id) {
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
      if (travel.createdBy !== req.user!.id) {
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

  app.post("/api/travels/:travelId/accommodations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertAccommodationSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        checkIn: new Date(req.body.checkIn),
        checkOut: new Date(req.body.checkOut),
      });
      
      const accommodation = await storage.createAccommodation(validated);
      res.status(201).json(accommodation);
    } catch (error) {
      console.error("Error creating accommodation:", error);
      res.status(400).json({ message: "Error creating accommodation" });
    }
  });

  app.put("/api/accommodations/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const accommodation = await storage.updateAccommodation(req.params.id, {
        ...req.body,
        checkIn: req.body.checkIn ? new Date(req.body.checkIn) : undefined,
        checkOut: req.body.checkOut ? new Date(req.body.checkOut) : undefined,
      });
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

  app.post("/api/travels/:travelId/insurances", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertInsuranceSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        effectiveDate: new Date(req.body.effectiveDate),
      });
      
      const insurance = await storage.createInsurance(validated);
      res.status(201).json(insurance);
    } catch (error) {
      console.error("Error creating insurance:", error);
      res.status(400).json({ message: "Error creating insurance" });
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

  const httpServer = createServer(app);
  return httpServer;
}
