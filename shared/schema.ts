import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("agent"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const travels = pgTable("travels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  clientName: text("client_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  travelers: integer("travelers").notNull(),
  status: text("status").notNull().default("draft"), // draft, published
  coverImage: text("cover_image"),
  publicToken: text("public_token"), // Token para acceso público
  publicTokenExpiry: timestamp("public_token_expiry"), // Expiración del token
  clientId: varchar("client_id").references(() => users.id, { onDelete: 'set null' }), // Id cliente 
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelId: varchar("travel_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hotel, hostal, resort
  location: text("location").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  roomType: text("room_type").notNull(),
  price: text("price"),
  confirmationNumber: text("confirmation_number"),
  policies: text("policies"),
  notes: text("notes"),
  thumbnail: text("thumbnail"),
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelId: varchar("travel_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // tour, restaurant, spa, theater, excursion, class, etc.
  provider: text("provider"),
  date: timestamp("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  confirmationNumber: text("confirmation_number"),
  conditions: text("conditions"),
  notes: text("notes"),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"), 
  placeStart: text("place_start"),
  placeEnd: text("place_end"),
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
});

export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelId: varchar("travel_id").notNull(),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  departureCity: text("departure_city").notNull(),
  arrivalCity: text("arrival_city").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  departureTerminal: text("departure_terminal"),
  arrivalTerminal: text("arrival_terminal"),
  class: text("class").notNull(),
  reservationNumber: text("reservation_number").notNull(),
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
});

export const transports = pgTable("transports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  travelId: varchar("travel_id").notNull(),
  type: text("type").notNull(), // autobus, alquiler_auto, uber, taxi, transporte_publico, tren, embarcacion
  name: text("name").notNull(),
  provider: text("provider"),
  contactName: text("contact_name"),
  contactNumber: text("contact_number"),
  pickupDate: timestamp("pickup_date").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  endDate: timestamp("end_date"),
  dropoffLocation: text("dropoff_location"),
  confirmationNumber: text("confirmation_number"),
  notes: text("notes"),
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
});

export const cruises = pgTable("cruises", {
  id: text("id").primaryKey(),
  travelId: text("travel_id").references(() => travels.id, { onDelete: "cascade" }).notNull(),
  cruiseLine: text("cruise_line").notNull(), // Barco o línea de cruceros
  confirmationNumber: text("confirmation_number"),
  departureDate: timestamp("departure_date").notNull(), // fecha y horario de vela
  departurePort: text("departure_port").notNull(), // puerto
  arrivalDate: timestamp("arrival_date").notNull(), // fecha y horario de desembarque
  arrivalPort: text("arrival_port").notNull(), // puerto de desembarque
  notes: text("notes"),
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
});

export const insurances = pgTable("insurances", {
  id: text("id").primaryKey(),
  travelId: text("travel_id").references(() => travels.id, { onDelete: "cascade" }).notNull(),
  provider: text("provider").notNull(), // Proveedor
  policyNumber: text("policy_number").notNull(), // Número de política
  policyType: text("policy_type").notNull(), // Tipo de política
  emergencyNumber: text("emergency_number"), // Número de emergencia
  effectiveDate: timestamp("effective_date").notNull(), // Fecha y hora
  importantInfo: text("important_info"), // Información importante
  policyDescription: text("policy_description"), // Descripción de la política
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
  notes: text("notes"), // Notas adicionales
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  travelId: text("travel_id").references(() => travels.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(), // Título
  noteDate: timestamp("note_date").notNull(), // Fecha
  content: text("content").notNull(), // Texto con notas
  visibleToTravelers: boolean("visible_to_travelers").notNull().default(true), // Visible para viajeros
  attachments: jsonb("attachments").$type<{ path: string; originalName: string }[]>().default([]), // Archivos adjuntos con nombre original
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});


export const insertTravelSchema = createInsertSchema(travels)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    clientId: z.string(),     // ⚠️ la llave foránea del usuario
    createdBy: z.string(),    // si también quieres registrar quién creó el viaje
  });

/*export const insertTravelSchema = createInsertSchema(travels).omit({
  id: true,
  clientId: true, // Lo manejaremos manualmente
  createdAt: true,
  updatedAt: true,
  status: true,
  coverImage: true,
}).extend({
  clientEmail: z.string().email("El correo electrónico no es válido"),
  startDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  endDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

*/


export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
}).extend({
  checkIn: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  checkOut: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
}).extend({
  date: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
}).extend({
  departureDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  arrivalDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

export const insertTransportSchema = createInsertSchema(transports).omit({
  id: true,
}).extend({
  pickupDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  endDate: z.union([z.date(), z.string().nullable()]).transform((val) => {
    if (!val) return null;
    return typeof val === 'string' ? new Date(val) : val;
  }).optional(),
});

export const insertCruiseSchema = createInsertSchema(cruises).omit({
  id: true,
}).extend({
  departureDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
  arrivalDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

export const insertInsuranceSchema = createInsertSchema(insurances).omit({
  id: true,
}).extend({
  effectiveDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
}).extend({
  noteDate: z.union([z.date(), z.string()]).transform((val) => {
    return typeof val === 'string' ? new Date(val) : val;
  }),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTravel = z.infer<typeof insertTravelSchema>;
export type Travel = typeof travels.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;
export type InsertTransport = z.infer<typeof insertTransportSchema>;
export type Transport = typeof transports.$inferSelect;
export type InsertCruise = z.infer<typeof insertCruiseSchema>;
export type Cruise = typeof cruises.$inferSelect;
export type InsertInsurance = z.infer<typeof insertInsuranceSchema>;
export type Insurance = typeof insurances.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
