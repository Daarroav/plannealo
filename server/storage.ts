import { randomUUID } from "crypto";
import session from "express-session";
import { Store } from "express-session";
import createMemoryStore from "memorystore";
import { eq, desc, sql, and, count, inArray } from "drizzle-orm";
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

export class DatabaseStorage implements IStorage {
    async createTravel(insertTravel: InsertTravel): Promise<Travel> {
      const id = randomUUID();
      const [travel] = await db
        .insert(travels)
        .values({ ...insertTravel, id })
        .returning();
      return travel;
    }
  public sessionStore: Store;

  constructor() {
    // ...inicialización...
  }


  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

	async getAllUsers(): Promise<User[]> {
		return db.select().from(users);
	}

  async getTravelsByUser(userId: string): Promise<Travel[]> {
    return await db.select().from(travels).where(
      and(
        eq(travels.createdBy, userId),
        sql`${travels.status} != 'delete'`
      )
    );
  }

  async getTravels(): Promise<Travel[]> {
    return await db.select().from(travels).where(sql`${travels.status} != 'delete'`);
  }

  async getTravel(id: string): Promise<Travel | undefined> {
    const [travel] = await db.select().from(travels).where(
      and(
        eq(travels.id, id),
        sql`${travels.status} != 'delete'`
      )
    );
    return travel || undefined;
  }

  async getTravelByPublicToken(token: string): Promise<Travel | undefined> {
    const [travel] = await db.select().from(travels).where(
      and(
        eq(travels.publicToken, token),
        sql`${travels.status} != 'delete'`
      )
    );
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

    // Prepare update object - only include dates if they were provided
    const updateData: any = {
      ...rest,
      updatedAt: new Date(),
    };

    // Only update dates if they were explicitly provided
    if (startDate !== undefined) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate !== undefined) {
      updateData.endDate = new Date(endDate);
    }

    const [travel] = await db
      .update(travels)
      .set(updateData)
      .where(
        and(
          eq(travels.id, id),
          sql`${travels.status} != 'delete'`
        )
      )
      .returning();
    if (!travel) {
      throw new Error("Travel not found");
    }
    return travel;
  }

  async deleteTravel(id: string): Promise<void> {
    await db
      .update(travels)
      .set({ status: 'delete', updatedAt: new Date() })
      .where(
        and(
          eq(travels.id, id),
          sql`${travels.status} != 'delete'`
        )
      );
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

    // Convertir a Date si es string, pero NO normalizar para preservar la hora exacta
    const noteDate = insertNote.noteDate instanceof Date 
      ? insertNote.noteDate 
      : new Date(insertNote.noteDate);

    const [note] = await db
      .insert(notes)
      .values({ ...insertNote, id, noteDate })
      .returning();

    return note;
  }


  async getNotesByTravel(travelId: string): Promise<Note[]> {
    return await db.select()
      .from(notes)
      .where(eq(notes.travelId, travelId));
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    // Convertir a Date si es string, pero NO normalizar para preservar la hora exacta
    if (updates.noteDate) {
      updates.noteDate = updates.noteDate instanceof Date 
        ? updates.noteDate 
        : new Date(updates.noteDate) as any;
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

  async getClientStats(): Promise<{
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
  }> {
    // Get all travels excluding deleted ones
    const allTravels = await db.select().from(travels).where(sql`${travels.status} != 'delete'`);

    // Agrupar viajes por viajero
    const clientsMap = new Map<string, {
      id: string;
      email: string;
      name: string;
      joinedAt: Date;
      travels: Travel[];
    }>();

    allTravels.forEach((travel) => {
      if (travel.clientId && !clientsMap.has(travel.clientId)) {
        clientsMap.set(travel.clientId, {
          id: travel.clientId,
          email: "", // Will fetch later if needed or assume available elsewhere
          name: "",  // Will fetch later if needed or assume available elsewhere
          joinedAt: new Date(), // Will fetch later if needed or assume available elsewhere
          travels: [],
        });
      }
      if (travel.clientId) {
        clientsMap.get(travel.clientId)!.travels.push(travel);
      }
    });

    // Fetch user details for clients in the map
    const clientIds = Array.from(clientsMap.keys());
    let usersData: User[] = [];
    if (clientIds.length > 0) {
      usersData = await db.select().from(users).where(
        inArray(users.id, clientIds)
      );
    }

    const usersMap = new Map<string, User>(usersData.map(u => [u.id, u]));

    // Calcular estadísticas para cada viajero
    const processedClients = Array.from(clientsMap.values()).map(client => {
      const user = usersMap.get(client.id);
      const stats = {
        total: client.travels.length,
        published: client.travels.filter((t: any) => t.status === 'published').length,
        draft: client.travels.filter((t: any) => t.status === 'draft').length,
      };

      const lastActive = client.travels.length > 0
        ? new Date(Math.max(...client.travels.map((t: any) => new Date(t.updatedAt).getTime())))
        : client.joinedAt; // Use joinedAt if no travels

      return {
        id: client.id,
        email: user?.username || "",
        name: user?.name || "",
        joinedAt: user?.createdAt || client.joinedAt, // Use user's creation date
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


  async getTravelStats(): Promise<{
    totalTravels: number;
    publishedTravels: number;
    draftTravels: number;
    cancelledTravels: number;
    sentTravels: number;
    completedTravels: number;
  }> {
    // Get all travels excluding deleted ones
    const travelsInfo = await db.select().from(travels).where(sql`${travels.status} != 'delete'`);

    const stats = {
      // Viajes Realizados (consider only non-deleted)
      totalTravels: travelsInfo.length,
      // Viajes Publicados
      publishedTravels: travelsInfo.filter((t: any) => t.status === 'published').length,
      // Viajes Borradores
      draftTravels: travelsInfo.filter((t: any) => t.status === 'draft').length,
      // Viajes Cancelados (assuming 'cancelled' is a valid status other than 'delete')
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

  // Catálogo de Alojamientos
  async getAccommodationsCatalog(userId: string) {
    // Obtener todos los viajes del usuario
    const userTravels = await db
      .select({ id: travels.id })
      .from(travels)
      .where(eq(travels.createdBy, userId));
    
    const travelIds = userTravels.map(t => t.id);
    
    if (travelIds.length === 0) {
      return [];
    }

    // Obtener todos los alojamientos únicos de esos viajes
    const allAccommodations = await db
      .select()
      .from(accommodations)
      .where(inArray(accommodations.travelId, travelIds));

    // Crear un mapa para eliminar duplicados basándose en nombre + ubicación
    const uniqueMap = new Map();
    
    allAccommodations.forEach(acc => {
      const key = `${acc.name}-${acc.location}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          name: acc.name,
          type: acc.type,
          location: acc.location,
          roomType: acc.roomType,
          price: acc.price,
          policies: acc.policies,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  // Catálogo de Actividades
  async getActivitiesCatalog(userId: string) {
    const userTravels = await db
      .select({ id: travels.id })
      .from(travels)
      .where(eq(travels.createdBy, userId));
    
    const travelIds = userTravels.map(t => t.id);
    
    if (travelIds.length === 0) {
      return [];
    }

    const allActivities = await db
      .select()
      .from(activities)
      .where(inArray(activities.travelId, travelIds));

    const uniqueMap = new Map();
    
    allActivities.forEach(act => {
      const key = `${act.name}-${act.provider || 'no-provider'}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          name: act.name,
          type: act.type,
          provider: act.provider,
          contactName: act.contactName,
          contactPhone: act.contactPhone,
          conditions: act.conditions,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  // Catálogo de Vuelos (aerolíneas y rutas)
  async getFlightsCatalog(userId: string) {
    const userTravels = await db
      .select({ id: travels.id })
      .from(travels)
      .where(eq(travels.createdBy, userId));
    
    const travelIds = userTravels.map(t => t.id);
    
    if (travelIds.length === 0) {
      return { airlines: [], routes: [], departureAirports: [], arrivalAirports: [] };
    }

    const allFlights = await db
      .select()
      .from(flights)
      .where(inArray(flights.travelId, travelIds));

    // Aerolíneas únicas
    const airlinesSet = new Set<string>();
    allFlights.forEach(f => airlinesSet.add(f.airline));

    // Aeropuertos de salida únicos
    const departureAirportsMap = new Map();
    allFlights.forEach(f => {
      if (f.departureAirport && f.departureCity) {
        const key = `${f.departureCity}|${f.departureAirport}`;
        if (!departureAirportsMap.has(key)) {
          departureAirportsMap.set(key, {
            city: f.departureCity,
            airportName: f.departureAirport,
            label: f.departureAirport,
          });
        }
      }
    });

    // Aeropuertos de llegada únicos
    const arrivalAirportsMap = new Map();
    allFlights.forEach(f => {
      if (f.arrivalAirport && f.arrivalCity) {
        const key = `${f.arrivalCity}|${f.arrivalAirport}`;
        if (!arrivalAirportsMap.has(key)) {
          arrivalAirportsMap.set(key, {
            city: f.arrivalCity,
            airportName: f.arrivalAirport,
            label: f.arrivalAirport,
          });
        }
      }
    });

    // Rutas únicas (combinación origen-destino)
    const routesMap = new Map();
    allFlights.forEach(f => {
      const key = `${f.departureCity}-${f.arrivalCity}`;
      if (!routesMap.has(key)) {
        routesMap.set(key, {
          departureCity: f.departureCity,
          arrivalCity: f.arrivalCity,
          departureAirport: f.departureAirport,
          arrivalAirport: f.arrivalAirport,
          departureTerminal: f.departureTerminal,
          arrivalTerminal: f.arrivalTerminal,
        });
      }
    });

    return {
      airlines: Array.from(airlinesSet),
      routes: Array.from(routesMap.values()),
      departureAirports: Array.from(departureAirportsMap.values()),
      arrivalAirports: Array.from(arrivalAirportsMap.values()),
    };
  }

  // Catálogo de Transportes
  async getTransportsCatalog(userId: string) {
    const userTravels = await db
      .select({ id: travels.id })
      .from(travels)
      .where(eq(travels.createdBy, userId));
    
    const travelIds = userTravels.map(t => t.id);
    
    if (travelIds.length === 0) {
      return [];
    }

    const allTransports = await db
      .select()
      .from(transports)
      .where(inArray(transports.travelId, travelIds));

    const uniqueMap = new Map();
    
    allTransports.forEach(trans => {
      const key = `${trans.name}-${trans.provider || 'no-provider'}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          type: trans.type,
          name: trans.name,
          provider: trans.provider,
          contactName: trans.contactName,
          contactNumber: trans.contactNumber,
        });
      }
    });

    return Array.from(uniqueMap.values());
  }
}

export const storage = new DatabaseStorage();