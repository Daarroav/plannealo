import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("agent"),
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
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertTravelSchema = createInsertSchema(travels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export const insertTransportSchema = createInsertSchema(transports).omit({
  id: true,
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
