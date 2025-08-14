import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTravelSchema, insertAccommodationSchema, insertActivitySchema, insertFlightSchema, insertTransportSchema, insertCruiseSchema, insertInsuranceSchema, insertNoteSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";

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

  app.post("/api/travels/:travelId/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validated = insertNoteSchema.parse({
        ...req.body,
        travelId: req.params.travelId,
        noteDate: new Date(req.body.noteDate),
      });
      
      const note = await storage.createNote(validated);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Error creating note" });
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
      const travel = await storage.getTravel(req.params.id);
      if (!travel) {
        return res.status(404).json({ error: "Travel not found" });
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

  // Generate PDF for travel (returns HTML for now, can be converted to PDF on client)
  app.get("/api/travels/:id/generate-pdf", async (req, res) => {
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
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 20px; }
            .cover-image { width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 8px; margin: 20px auto; display: block; }
            .section { margin-bottom: 25px; page-break-inside: avoid; }
            .section h2 { color: #dc2626; border-bottom: 1px solid #dc2626; padding-bottom: 5px; margin-bottom: 15px; }
            .item { margin-bottom: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; }
            .item h3 { margin-top: 0; color: #374151; font-size: 18px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
            .detail { font-size: 14px; color: #6b7280; }
            .badge { background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            @media print {
              body { margin: 0; font-size: 12px; }
              .item { break-inside: avoid; }
              .cover-image { height: 250px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${travel.name}</h1>
            ${travel.coverImage ? `<img src="${travel.coverImage}" alt="Imagen de portada de ${travel.name}" class="cover-image" />` : ''}
            <p><strong>Cliente:</strong> ${travel.clientName}</p>
            <p><strong>Fechas:</strong> ${formatDate(travel.startDate)} - ${formatDate(travel.endDate)}</p>
          </div>
      `;

      if (accommodations.length > 0) {
        htmlContent += `<div class="section"><h2>🏨 Alojamientos</h2>`;
        accommodations.forEach(acc => {
          htmlContent += `
            <div class="item">
              <h3>${acc.name} <span class="badge">${acc.type}</span></h3>
              <div class="details">
                <div class="detail">📍 ${acc.location}</div>
                <div class="detail">📅 ${formatDate(acc.checkIn)} - ${formatDate(acc.checkOut)}</div>
                <div class="detail">🛏️ ${acc.roomType}</div>
                ${acc.confirmationNumber ? `<div class="detail">🎫 ${acc.confirmationNumber}</div>` : ''}
              </div>
              ${acc.notes ? `<p style="margin-top: 10px; font-style: italic; color: #6b7280;">${acc.notes}</p>` : ''}
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      if (activities.length > 0) {
        htmlContent += `<div class="section"><h2>🎯 Actividades</h2>`;
        activities.forEach(activity => {
          htmlContent += `
            <div class="item">
              <h3>${activity.name} <span class="badge">${activity.type}</span></h3>
              <div class="details">
                <div class="detail">📅 ${formatDate(activity.date)}</div>
                ${activity.startTime ? `<div class="detail">⏰ ${activity.startTime} - ${activity.endTime}</div>` : ''}
                ${activity.confirmationNumber ? `<div class="detail">🎫 ${activity.confirmationNumber}</div>` : ''}
              </div>
              ${activity.notes ? `<p style="margin-top: 10px; font-style: italic; color: #6b7280;">${activity.notes}</p>` : ''}
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      if (flights.length > 0) {
        htmlContent += `<div class="section"><h2>✈️ Vuelos</h2>`;
        flights.forEach(flight => {
          htmlContent += `
            <div class="item">
              <h3>${flight.airline} ${flight.flightNumber} <span class="badge">${flight.class}</span></h3>
              <div class="details">
                <div class="detail">🛫 ${flight.departureCity} → ${flight.arrivalCity}</div>
                <div class="detail">📅 Salida: ${formatDate(flight.departureDate)}</div>
                <div class="detail">🕐 Llegada: ${formatDate(flight.arrivalDate)}</div>
                ${flight.reservationNumber ? `<div class="detail">🎫 ${flight.reservationNumber}</div>` : ''}
              </div>
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      if (transports.length > 0) {
        htmlContent += `<div class="section"><h2>🚗 Transporte</h2>`;
        transports.forEach(transport => {
          htmlContent += `
            <div class="item">
              <h3>${transport.name} <span class="badge">${transport.type}</span></h3>
              <div class="details">
                <div class="detail">📍 ${transport.pickupLocation} → ${transport.dropoffLocation || 'Destino'}</div>
                <div class="detail">📅 ${formatDate(transport.pickupDate)}</div>
                ${transport.confirmationNumber ? `<div class="detail">🎫 ${transport.confirmationNumber}</div>` : ''}
              </div>
              ${transport.notes ? `<p style="margin-top: 10px; font-style: italic; color: #6b7280;">${transport.notes}</p>` : ''}
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      if (cruises.length > 0) {
        htmlContent += `<div class="section"><h2>🚢 Cruceros</h2>`;
        cruises.forEach(cruise => {
          htmlContent += `
            <div class="item">
              <h3>${cruise.cruiseLine}</h3>
              <div class="details">
                <div class="detail">📅 ${formatDate(cruise.departureDate)} - ${formatDate(cruise.arrivalDate)}</div>
                <div class="detail">🏃 ${cruise.departurePort} → ${cruise.arrivalPort}</div>
                ${cruise.confirmationNumber ? `<div class="detail">🎫 ${cruise.confirmationNumber}</div>` : ''}
              </div>
              ${cruise.notes ? `<p style="margin-top: 10px; font-style: italic; color: #6b7280;">${cruise.notes}</p>` : ''}
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      if (insurances.length > 0) {
        htmlContent += `<div class="section"><h2>🛡️ Seguros</h2>`;
        insurances.forEach(insurance => {
          htmlContent += `
            <div class="item">
              <h3>${insurance.provider} <span class="badge">${insurance.policyType}</span></h3>
              <div class="details">
                <div class="detail">📋 ${insurance.policyNumber}</div>
                <div class="detail">📅 ${formatDate(insurance.effectiveDate)}</div>
                ${insurance.emergencyNumber ? `<div class="detail">📞 ${insurance.emergencyNumber}</div>` : ''}
              </div>
              ${insurance.notes ? `<p style="margin-top: 10px; font-style: italic; color: #6b7280;">${insurance.notes}</p>` : ''}
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      if (visibleNotes.length > 0) {
        htmlContent += `<div class="section"><h2>📝 Notas Importantes</h2>`;
        visibleNotes.forEach(note => {
          htmlContent += `
            <div class="item">
              <h3>${note.title}</h3>
              <div class="detail" style="margin-bottom: 10px;">📅 ${formatDateTime(note.noteDate)}</div>
              <p style="white-space: pre-wrap; margin: 10px 0; color: #374151;">${note.content}</p>
              ${note.attachments && note.attachments.length > 0 ? `
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                  <strong>Documentos Adjuntos:</strong>
                  <ul style="margin: 5px 0 0 20px; color: #6b7280;">
                    ${note.attachments.map((fileName: string) => `<li>📄 ${fileName}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      htmlContent += `
          <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p><strong>Itinerario generado por PLANNEALO - Agencia de Viajes</strong></p>
            <p>Fecha de generación: ${formatDate(new Date())}</p>
          </div>
        </body>
        </html>
      `;

      // Set headers for HTML download (users can save as PDF)
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="itinerario-${travel.name.replace(/\s+/g, '-').toLowerCase()}.html"`);
      
      res.send(htmlContent);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Error generating PDF" });
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

  // Update travel with cover image
  app.put("/api/travels/:id/cover-image", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { coverImageURL } = req.body;
      if (!coverImageURL) {
        return res.status(400).json({ error: "coverImageURL is required" });
      }

      const travel = await storage.getTravel(req.params.id);
      if (!travel) {
        return res.status(404).json({ error: "Travel not found" });
      }
      if (travel.createdBy !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(coverImageURL);

      // Update travel with cover image path
      await storage.updateTravel(req.params.id, { coverImage: objectPath });

      res.json({ objectPath });
    } catch (error) {
      console.error("Error updating travel cover image:", error);
      res.status(500).json({ error: "Error updating cover image" });
    }
  });

  // Serve objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.sendStatus(404);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
