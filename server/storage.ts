import { randomUUID } from "crypto";
import session from "express-session";
import { Store } from "express-session";
import createMemoryStore from "memorystore";
import { 
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
  InsertTransport
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Travel methods
  createTravel(travel: InsertTravel): Promise<Travel>;
  getTravelsByUser(userId: string): Promise<Travel[]>;
  getTravel(id: string): Promise<Travel | undefined>;
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
  
  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private travels: Map<string, Travel>;
  private accommodations: Map<string, Accommodation>;
  private activities: Map<string, Activity>;
  private flights: Map<string, Flight>;
  private transports: Map<string, Transport>;
  public sessionStore: Store;

  constructor() {
    this.users = new Map();
    this.travels = new Map();
    this.accommodations = new Map();
    this.activities = new Map();
    this.flights = new Map();
    this.transports = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: insertUser.role || "agent" };
    this.users.set(id, user);
    return user;
  }

  // Travel methods
  async createTravel(insertTravel: InsertTravel): Promise<Travel> {
    const id = randomUUID();
    const now = new Date();
    const travel: Travel = {
      ...insertTravel,
      id,
      status: insertTravel.status || "draft",
      coverImage: insertTravel.coverImage || null,
      createdAt: now,
      updatedAt: now,
    };
    this.travels.set(id, travel);
    return travel;
  }

  async getTravelsByUser(userId: string): Promise<Travel[]> {
    return Array.from(this.travels.values())
      .filter((travel) => travel.createdBy === userId)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getTravel(id: string): Promise<Travel | undefined> {
    return this.travels.get(id);
  }

  async updateTravel(id: string, updates: Partial<Travel>): Promise<Travel> {
    const travel = this.travels.get(id);
    if (!travel) {
      throw new Error("Travel not found");
    }
    const updatedTravel = { ...travel, ...updates, updatedAt: new Date() };
    this.travels.set(id, updatedTravel);
    return updatedTravel;
  }

  async deleteTravel(id: string): Promise<void> {
    this.travels.delete(id);
    // Also delete related records
    Array.from(this.accommodations.entries()).forEach(([key, accommodation]) => {
      if (accommodation.travelId === id) {
        this.accommodations.delete(key);
      }
    });
    Array.from(this.activities.entries()).forEach(([key, activity]) => {
      if (activity.travelId === id) {
        this.activities.delete(key);
      }
    });
    Array.from(this.flights.entries()).forEach(([key, flight]) => {
      if (flight.travelId === id) {
        this.flights.delete(key);
      }
    });
    Array.from(this.transports.entries()).forEach(([key, transport]) => {
      if (transport.travelId === id) {
        this.transports.delete(key);
      }
    });
  }

  // Accommodation methods
  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = randomUUID();
    const accommodation: Accommodation = {
      ...insertAccommodation,
      id,
      price: insertAccommodation.price || null,
      confirmationNumber: insertAccommodation.confirmationNumber || null,
      policies: insertAccommodation.policies || null,
      notes: insertAccommodation.notes || null,
    };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  async getAccommodationsByTravel(travelId: string): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(
      (accommodation) => accommodation.travelId === travelId
    );
  }

  async updateAccommodation(id: string, updates: Partial<Accommodation>): Promise<Accommodation> {
    const accommodation = this.accommodations.get(id);
    if (!accommodation) {
      throw new Error("Accommodation not found");
    }
    const updated = { ...accommodation, ...updates };
    this.accommodations.set(id, updated);
    return updated;
  }

  async deleteAccommodation(id: string): Promise<void> {
    this.accommodations.delete(id);
  }

  // Activity methods
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      confirmationNumber: insertActivity.confirmationNumber || null,
      notes: insertActivity.notes || null,
      provider: insertActivity.provider || null,
      startTime: insertActivity.startTime || null,
      endTime: insertActivity.endTime || null,
      conditions: insertActivity.conditions || null,
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivitiesByTravel(travelId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.travelId === travelId
    );
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
    const activity = this.activities.get(id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    const updated = { ...activity, ...updates };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: string): Promise<void> {
    this.activities.delete(id);
  }

  // Flight methods
  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = randomUUID();
    const flight: Flight = {
      ...insertFlight,
      id,
      departureTerminal: insertFlight.departureTerminal || null,
      arrivalTerminal: insertFlight.arrivalTerminal || null,
    };
    this.flights.set(id, flight);
    return flight;
  }

  async getFlightsByTravel(travelId: string): Promise<Flight[]> {
    return Array.from(this.flights.values()).filter(
      (flight) => flight.travelId === travelId
    );
  }

  async updateFlight(id: string, updates: Partial<Flight>): Promise<Flight> {
    const flight = this.flights.get(id);
    if (!flight) {
      throw new Error("Flight not found");
    }
    const updated = { ...flight, ...updates };
    this.flights.set(id, updated);
    return updated;
  }

  async deleteFlight(id: string): Promise<void> {
    this.flights.delete(id);
  }

  // Transport methods
  async createTransport(insertTransport: InsertTransport): Promise<Transport> {
    const id = randomUUID();
    const transport: Transport = {
      ...insertTransport,
      id,
      endDate: insertTransport.endDate || null,
      confirmationNumber: insertTransport.confirmationNumber || null,
      notes: insertTransport.notes || null,
      provider: insertTransport.provider || null,
      contactName: insertTransport.contactName || null,
      contactNumber: insertTransport.contactNumber || null,
      dropoffLocation: insertTransport.dropoffLocation || null,
    };
    this.transports.set(id, transport);
    return transport;
  }

  async getTransportsByTravel(travelId: string): Promise<Transport[]> {
    return Array.from(this.transports.values()).filter(
      (transport) => transport.travelId === travelId
    );
  }

  async updateTransport(id: string, updates: Partial<Transport>): Promise<Transport> {
    const transport = this.transports.get(id);
    if (!transport) {
      throw new Error("Transport not found");
    }
    const updated = { ...transport, ...updates };
    this.transports.set(id, updated);
    return updated;
  }

  async deleteTransport(id: string): Promise<void> {
    this.transports.delete(id);
  }
}

export const storage = new MemStorage();
