import { randomUUID } from "crypto";
import session from "express-session";
import { Store } from "express-session";
import createMemoryStore from "memorystore";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  travels,
  accommodations,
  activities,
  flights,
  transports,
  cruises,
  insurances,
  notes,
  User,
  InsertUser,
  Travel,
  InsertTravel,
  Accommodation,
  InsertAccommodation,
  Activity,
  InsertActivity,
  Flight,
  InsertFlight,
  Transport,
  InsertTransport,
  Cruise,
  InsertCruise,
  Insurance,
  InsertInsurance,
  Note,
  InsertNote
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Travel methods
  createTravel(travel: InsertTravel): Promise<Travel>;
  getTravelsByUser(userId: string): Promise<Travel[]>;
  getTravels(): Promise<Travel[]>;
  getTravel(id: string): Promise<Travel | undefined>;
  getTravelByPublicToken(token: string): Promise<Travel | undefined>;
  updateTravel(id: string, travel: Partial<Travel>): Promise<Travel>;
  deleteTravel(id: string): Promise<void>;

  // Accommodation methods
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  getAccommodationsByTravel(travelId: string): Promise<Accommodation[]>;
  updateAccommodation(id: string, accommodation: Partial<Accommodation>): Promise<Accommodation>;
  deleteAccommodation(id: string): Promise<void>;

  // Activity methods
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByTravel(travelId: string): Promise<Activity[]>;
  updateActivity(id: string, activity: Partial<Activity>): Promise<Activity>;
  deleteActivity(id: string): Promise<void>;

  // Flight methods
  createFlight(flight: InsertFlight): Promise<Flight>;
  getFlightsByTravel(travelId: string): Promise<Flight[]>;
  updateFlight(id: string, flight: Partial<Flight>): Promise<Flight>;
  deleteFlight(id: string): Promise<void>;

  // Transport methods
  createTransport(transport: InsertTransport): Promise<Transport>;
  getTransportsByTravel(travelId: string): Promise<Transport[]>;
  updateTransport(id: string, transport: Partial<Transport>): Promise<Transport>;
  deleteTransport(id: string): Promise<void>;

  // Cruise methods
  createCruise(cruise: InsertCruise): Promise<Cruise>;
  getCruisesByTravel(travelId: string): Promise<Cruise[]>;
  updateCruise(id: string, cruise: Partial<Cruise>): Promise<Cruise>;
  deleteCruise(id: string): Promise<void>;

  // Insurance methods
  createInsurance(insurance: InsertInsurance): Promise<Insurance>;
  getInsurancesByTravel(travelId: string): Promise<Insurance[]>;
  updateInsurance(id: string, insurance: Partial<Insurance>): Promise<Insurance>;
  deleteInsurance(id: string): Promise<void>;

  // Note methods
  createNote(note: InsertNote): Promise<Note>;
  getNotesByTravel(travelId: string): Promise<Note[]>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note>;
  deleteNote(id: string): Promise<void>;

  // Client stats
  getClientStats(): Promise<{
    clients: Array<{
      id: string;
      email: string;
      name: string;
      joinedAt: Date;
      lastActive: Date;
      stats: {
        total: number;
        published: number;
        draft: number;
      };
    }>;
    stats: {
      totalClients: number;
      totalTravels: number;
      publishedTravels: number;
      draftTravels: number;
    };
  }>;

  sessionStore: Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
}

  // Travel methods
  async createTravel(insertTravel: InsertTravel): Promise<Travel> {
    // Aseguramos que las fechas sean objetos Date
    const startDate = insertTravel.startDate instanceof Date 
      ? insertTravel.startDate 
      : new Date(insertTravel.startDate);
      
    const endDate = insertTravel.endDate instanceof Date 
      ? insertTravel.endDate 
      : new Date(insertTravel.endDate);
    
    // Normalizamos las fechas
    const normalized = {
      ...insertTravel,
      startDate: DatabaseStorage.normalizeNoteDate(startDate),
      endDate: DatabaseStorage.normalizeNoteDate(endDate),
    };

    const [travel] = await db
      .insert(travels)
      .values(normalized)
      .returning();
    return travel;
  }

  async getTravelsByUser(userId: string): Promise<Travel[]> {
    return await db.select()
      .from(travels)
      .where(eq(travels.createdBy, userId))
      .orderBy(desc(travels.updatedAt));
  }

  async getTravels(): Promise<Travel[]> {
    return await db.select().from(travels);
  }

  async getTravel(id: string): Promise<Travel | undefined> {
    const [travel] = await db.select().from(travels).where(eq(travels.id, id));
    return travel || undefined;
  }

  async getTravelByPublicToken(token: string): Promise<Travel | undefined> {
    const [travel] = await db.select().from(travels).where(eq(travels.publicToken, token));
    return travel || undefined;
  }

  async updateTravel(id: string, updates: Partial<Travel>): Promise<Travel> {

    if(updates.startDate){
      updates.startDate = DatabaseStorage.normalizeNoteDate(updates.startDate) as any;
    }
    if(updates.endDate){
      updates.endDate = DatabaseStorage.normalizeNoteDate(updates.endDate) as any;
    }
    
    const { startDate, endDate, ...rest } = updates;
    const [travel] = await db
      .update(travels)
      .set({
        ...rest,
        startDate: startDate ? new Date(startDate) : new Date(),  // ✅ parseamos
        endDate: endDate ? new Date(endDate) : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(travels.id, id))
      .returning();
    if (!travel) {
      throw new Error("Travel not found");
    }
    return travel;
  }

  async deleteTravel(id: string): Promise<void> {
    await db.delete(travels).where(eq(travels.id, id));
    // Related records will be deleted by cascade (if foreign keys are set up)
  }

  // Accommodation methods
  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const [accommodation] = await db
      .insert(accommodations)
      .values(insertAccommodation)
      .returning();
    return accommodation;
  }

  async getAccommodationsByTravel(travelId: string): Promise<Accommodation[]> {
    const result = await db.select()
      .from(accommodations)
      .where(eq(accommodations.travelId, travelId));
    console.log(`[DEBUG] Accommodations for travel ${travelId}:`, result.length);
    return result;
  }

  async updateAccommodation(id: string, updates: Partial<Accommodation>): Promise<Accommodation> {
    const [accommodation] = await db
      .update(accommodations)
      .set(updates)
      .where(eq(accommodations.id, id))
      .returning();
    if (!accommodation) {
      throw new Error("Accommodation not found");
    }
    return accommodation;
  }

  async deleteAccommodation(id: string): Promise<void> {
    await db.delete(accommodations).where(eq(accommodations.id, id));
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getActivitiesByTravel(travelId: string): Promise<Activity[]> {
    const result = await db.select()
      .from(activities)
      .where(eq(activities.travelId, travelId));
    console.log(`[DEBUG] Activities for travel ${travelId}:`, result.length);
    return result;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
    const [activity] = await db
      .update(activities)
      .set(updates)
      .where(eq(activities.id, id))
      .returning();
    if (!activity) {
      throw new Error("Activity not found");
    }
    return activity;
  }

  async deleteActivity(id: string): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  // Flight methods
  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const [flight] = await db
      .insert(flights)
      .values(insertFlight)
      .returning();
    return flight;
  }

  async getFlightsByTravel(travelId: string): Promise<Flight[]> {
    return await db.select()
      .from(flights)
      .where(eq(flights.travelId, travelId));
  }

  async updateFlight(id: string, updates: Partial<Flight>): Promise<Flight> {
    const [flight] = await db
      .update(flights)
      .set(updates)
      .where(eq(flights.id, id))
      .returning();
    if (!flight) {
      throw new Error("Flight not found");
    }
    return flight;
  }

  async deleteFlight(id: string): Promise<void> {
    await db.delete(flights).where(eq(flights.id, id));
  }

  // Transport methods
  async createTransport(insertTransport: InsertTransport): Promise<Transport> {
    const [transport] = await db
      .insert(transports)
      .values(insertTransport)
      .returning();
    return transport;
  }

  async getTransportsByTravel(travelId: string): Promise<Transport[]> {
    return await db.select()
      .from(transports)
      .where(eq(transports.travelId, travelId));
  }

  async updateTransport(id: string, updates: Partial<Transport>): Promise<Transport> {
    const [transport] = await db
      .update(transports)
      .set(updates)
      .where(eq(transports.id, id))
      .returning();
    if (!transport) {
      throw new Error("Transport not found");
    }
    return transport;
  }

  async deleteTransport(id: string): Promise<void> {
    await db.delete(transports).where(eq(transports.id, id));
  }

  // Cruise methods
  async createCruise(insertCruise: InsertCruise): Promise<Cruise> {
    const id = randomUUID();
    const [cruise] = await db
      .insert(cruises)
      .values({ ...insertCruise, id })
      .returning();
    return cruise;
  }

  async getCruisesByTravel(travelId: string): Promise<Cruise[]> {
    return await db.select()
      .from(cruises)
      .where(eq(cruises.travelId, travelId));
  }

  async updateCruise(id: string, updates: Partial<Cruise>): Promise<Cruise> {
    const [cruise] = await db
      .update(cruises)
      .set(updates)
      .where(eq(cruises.id, id))
      .returning();
    if (!cruise) {
      throw new Error("Cruise not found");
    }
    return cruise;
  }

  async deleteCruise(id: string): Promise<void> {
    await db.delete(cruises).where(eq(cruises.id, id));
  }

  // Insurance methods
  async createInsurance(insertInsurance: InsertInsurance): Promise<Insurance> {
    const id = randomUUID();
    const [insurance] = await db
      .insert(insurances)
      .values({ ...insertInsurance, id })
      .returning();
    return insurance;
  }

  async getInsurancesByTravel(travelId: string): Promise<Insurance[]> {
    return await db.select()
      .from(insurances)
      .where(eq(insurances.travelId, travelId));
  }

  async updateInsurance(id: string, updates: Partial<Insurance>): Promise<Insurance> {
    const [insurance] = await db
      .update(insurances)
      .set(updates)
      .where(eq(insurances.id, id))
      .returning();
    if (!insurance) {
      throw new Error("Insurance not found");
    }
    return insurance;
  }

  async deleteInsurance(id: string): Promise<void> {
    await db.delete(insurances).where(eq(insurances.id, id));
  }

  

  // Note methods
  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
  
    const normalized = {
      ...insertNote,
      noteDate: DatabaseStorage.normalizeNoteDate(insertNote.noteDate),
    };
  
    const [note] = await db
      .insert(notes)
      .values({ ...normalized, id })
      .returning();
  
    return note;
  }
  

  async getNotesByTravel(travelId: string): Promise<Note[]> {
    return await db.select()
      .from(notes)
      .where(eq(notes.travelId, travelId));
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    if (updates.noteDate) {
      updates.noteDate = DatabaseStorage.normalizeNoteDate(updates.noteDate) as any;
    }
  
    const [note] = await db
      .update(notes)
      .set(updates)
      .where(eq(notes.id, id))
      .returning();
  
    if (!note) {
      throw new Error("Note not found");
    }
  
    return note;
  }
  

  static normalizeNoteDate(input: string | Date): Date {
    const d = new Date(input);
    return new Date(Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      12, 0, 0 // 👈 siempre fija a 12:00 UTC
    ));
  }
  

  async deleteNote(id: string): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  async getClientStats() {
    // Obtener todos los clientes
    const clients = await db
      .select()
      .from(users)
      .where(eq(users.role, 'client'))
      .leftJoin(travels, eq(users.id, travels.clientId));

    // Procesar los datos
    const clientsMap = new Map();
    
    // Agrupar viajes por cliente
    clients.forEach(({ users: user, travels: travel }) => {
      if (!clientsMap.has(user.id)) {
        clientsMap.set(user.id, {
          id: user.id,
          email: user.username,
          name: user.name,
          joinedAt: user.createdAt,
          travels: [],
        });
      }
      
      if (travel) {
        clientsMap.get(user.id).travels.push(travel);
      }
    });

    // Calcular estadísticas para cada cliente
    const processedClients = Array.from(clientsMap.values()).map(client => {
      const stats = {
        total: client.travels.length,
        published: client.travels.filter((t: any) => t.status === 'published').length,
        draft: client.travels.filter((t: any) => t.status === 'draft').length,
      };

      const lastActive = client.travels.length > 0
        ? new Date(Math.max(...client.travels.map((t: any) => new Date(t.updatedAt).getTime())))
        : client.joinedAt;

      return {
        ...client,
        lastActive,
        stats
      };
    });

    // Ordenar por último activo (más reciente primero)
    processedClients.sort((a, b) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );

    // Calcular totales
    const totalStats = {
      totalClients: processedClients.length,
      totalTravels: processedClients.reduce((sum, client) => sum + client.stats.total, 0),
      publishedTravels: processedClients.reduce((sum, client) => sum + client.stats.published, 0),
      draftTravels: processedClients.reduce((sum, client) => sum + client.stats.draft, 0),
    };

    return {
      clients: processedClients,
      stats: totalStats
    };
  }


  async getTravelStats() {
    const travelsInfo = await db.select().from(travels);

    const stats = {
      // Viajes Realizados
      totalTravels: travelsInfo.length,
      // Viajes Publicados
      publishedTravels: travelsInfo.filter((t: any) => t.status === 'published').length,
      // Viajes Borradores
      draftTravels: travelsInfo.filter((t: any) => t.status === 'draft').length,
      // Viajes Cancelados
      cancelledTravels: travelsInfo.filter((t: any) => t.status === 'cancelled').length,
      // Viajes Enviados
      sentTravels: travelsInfo.filter((t: any) => t.status === 'sent').length,
      // Viajes concluidos
      completedTravels: travelsInfo.filter(t => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ignorar la hora
        const end = new Date(t.endDate);
        end.setHours(0, 0, 0, 0);
        return end < today;
      }).length
    };
    return stats;
  }


  
}

export const storage = new DatabaseStorage();