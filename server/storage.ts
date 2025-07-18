import { users, packages, bookings, type User, type InsertUser, type Package, type InsertPackage, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Package operations
  getPackage(id: number): Promise<Package | undefined>;
  getPackages(filters?: any): Promise<Package[]>;
  createPackage(packageData: InsertPackage): Promise<Package>;
  updatePackage(id: number, packageData: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: insertUser.password || null,
        phone: insertUser.phone || null,
        photoUrl: insertUser.photoUrl || null,
        isAdmin: insertUser.isAdmin || false,
        firebaseUid: insertUser.firebaseUid || null,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg || undefined;
  }

  async getPackages(filters?: any): Promise<Package[]> {
    let query = db.select().from(packages).where(eq(packages.isActive, true));
    
    const results = await query;
    
    // Apply filters in memory for now (can be optimized with SQL filters later)
    let filtered = results;
    
    if (filters?.country) {
      filtered = filtered.filter(pkg => pkg.country.toLowerCase() === filters.country.toLowerCase());
    }
    
    if (filters?.isInternational !== undefined) {
      filtered = filtered.filter(pkg => pkg.isInternational === filters.isInternational);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createPackage(packageData: InsertPackage): Promise<Package> {
    const [pkg] = await db
      .insert(packages)
      .values({
        ...packageData,
        originalPrice: packageData.originalPrice || null,
        itinerary: packageData.itinerary || null,
        inclusions: packageData.inclusions || null,
        exclusions: packageData.exclusions || null,
        rating: packageData.rating || "4.5",
        isActive: packageData.isActive ?? true,
        isInternational: packageData.isInternational ?? true,
      })
      .returning();
    return pkg;
  }

  async updatePackage(id: number, updateData: Partial<InsertPackage>): Promise<Package | undefined> {
    const [pkg] = await db
      .update(packages)
      .set(updateData)
      .where(eq(packages.id, id))
      .returning();
    return pkg || undefined;
  }

  async deletePackage(id: number): Promise<boolean> {
    const result = await db.delete(packages).where(eq(packages.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...bookingData,
        status: bookingData.status || "pending",
        travelers: bookingData.travelers || 1,
        travelDate: bookingData.travelDate || null,
      })
      .returning();
    return booking;
  }

  async updateBooking(id: number, updateData: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentPackageId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentPackageId = 1;
    this.currentBookingId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample admin user
    const adminUser: User = {
      id: this.currentUserId++,
      email: "admin@apniholidays.com",
      password: "admin123",
      name: "Admin User",
      phone: "+91 98765 43210",
      photoUrl: null,
      isAdmin: true,
      firebaseUid: "admin-firebase-uid",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Add sample international packages
    const samplePackages = [
      {
        title: "Thailand Paradise",
        destination: "Bangkok & Phuket",
        country: "Thailand",
        duration: 6,
        price: "45000",
        originalPrice: "55000",
        description: "Discover the best of Thailand with our carefully curated package. Explore bustling Bangkok markets, visit ancient temples, and relax on pristine Phuket beaches.",
        itinerary: [
          "Day 1: Arrival in Bangkok - Airport pickup and hotel check-in",
          "Day 2: Bangkok city tour - Grand Palace, Wat Pho, Floating Market",
          "Day 3: Flight to Phuket - Beach relaxation and sunset dinner",
          "Day 4: Phi Phi Island tour - Snorkeling and island hopping",
          "Day 5: Phuket local sightseeing - Big Buddha, Chalong Temple",
          "Day 6: Departure - Shopping and flight back to India"
        ],
        inclusions: [
          "Round-trip flights from Delhi/Mumbai",
          "4-star hotel accommodation",
          "Daily breakfast and 2 dinners",
          "All transfers and sightseeing",
          "English-speaking guide",
          "Travel insurance"
        ],
        exclusions: [
          "Lunch and other meals not mentioned",
          "Personal expenses and shopping",
          "Visa fees (visa on arrival)",
          "Tips and gratuities",
          "Any activities not mentioned in itinerary"
        ],
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.8",
        isActive: true,
        isInternational: true
      },
      {
        title: "Dubai Luxury Experience",
        destination: "City of Gold",
        country: "UAE",
        duration: 5,
        price: "65000",
        originalPrice: "78000",
        description: "Experience luxury and adventure in Dubai. From world-class shopping to desert safaris, this package offers the perfect blend of modern attractions and traditional culture.",
        itinerary: [
          "Day 1: Arrival in Dubai - Airport pickup and Burj Khalifa visit",
          "Day 2: Dubai city tour - Dubai Mall, Gold Souk, Spice Souk",
          "Day 3: Desert safari with BBQ dinner and cultural show",
          "Day 4: Dubai Marina cruise and Atlantis Aquaventure",
          "Day 5: Last-minute shopping and departure"
        ],
        inclusions: [
          "Round-trip flights from major Indian cities",
          "5-star hotel accommodation",
          "Daily breakfast",
          "Desert safari with dinner",
          "Dubai Marina cruise",
          "All transfers and tours"
        ],
        exclusions: [
          "Lunch and dinner (except mentioned)",
          "Personal expenses",
          "Visa fees",
          "Optional activities",
          "Travel insurance"
        ],
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.9",
        isActive: true,
        isInternational: true
      },
      {
        title: "Bali Island Paradise",
        destination: "Island of Gods",
        country: "Indonesia",
        duration: 7,
        price: "52000",
        originalPrice: "60000",
        description: "Immerse yourself in Bali's rich culture, stunning landscapes, and pristine beaches. Perfect for families and couples seeking relaxation and adventure.",
        itinerary: [
          "Day 1: Arrival in Denpasar - Transfer to Ubud",
          "Day 2: Ubud tour - Monkey Forest, Rice Terraces, Art Villages",
          "Day 3: Volcano trek and hot springs",
          "Day 4: Transfer to Seminyak - Beach relaxation",
          "Day 5: Water sports and temple visits",
          "Day 6: Uluwatu temple and Kecak dance",
          "Day 7: Departure"
        ],
        inclusions: [
          "Round-trip flights",
          "4-star resort accommodation",
          "Daily breakfast and 3 dinners",
          "Private car with driver",
          "English-speaking guide",
          "All entrance fees"
        ],
        exclusions: [
          "Lunch and other meals",
          "Personal expenses",
          "Visa on arrival fees",
          "Optional activities",
          "Travel insurance"
        ],
        imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.7",
        isActive: true,
        isInternational: true
      },
      {
        title: "Singapore Highlights",
        destination: "Lion City",
        country: "Singapore",
        duration: 4,
        price: "58000",
        originalPrice: "68000",
        description: "Explore Singapore's perfect blend of cultures, modern attractions, and culinary delights. Ideal for families and first-time visitors.",
        itinerary: [
          "Day 1: Arrival - Gardens by the Bay and Marina Bay Sands",
          "Day 2: Universal Studios Singapore full day",
          "Day 3: City tour - Chinatown, Little India, Sentosa Island",
          "Day 4: Shopping and departure"
        ],
        inclusions: [
          "Round-trip flights",
          "4-star hotel accommodation",
          "Daily breakfast",
          "Universal Studios tickets",
          "City tour with guide",
          "Airport transfers"
        ],
        exclusions: [
          "Meals except breakfast",
          "Personal expenses",
          "Additional attractions",
          "Travel insurance",
          "Tips and gratuities"
        ],
        imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.8",
        isActive: true,
        isInternational: true
      },
      {
        title: "Maldives Honeymoon Special",
        destination: "Tropical Paradise",
        country: "Maldives",
        duration: 5,
        price: "85000",
        originalPrice: "95000",
        description: "Perfect romantic getaway in the Maldives. Enjoy overwater villas, pristine beaches, and world-class hospitality in this tropical paradise.",
        itinerary: [
          "Day 1: Arrival in Male - Seaplane transfer to resort",
          "Day 2-4: Resort activities - Snorkeling, spa, water sports",
          "Day 5: Departure - Transfer back to Male airport"
        ],
        inclusions: [
          "Round-trip flights to Male",
          "Seaplane transfers",
          "4-star resort accommodation",
          "All meals (breakfast, lunch, dinner)",
          "Water sports activities",
          "Spa treatment for couples"
        ],
        exclusions: [
          "Alcoholic beverages",
          "Premium spa treatments",
          "Deep sea fishing",
          "Personal expenses",
          "Travel insurance"
        ],
        imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.9",
        isActive: true,
        isInternational: true
      },
      {
        title: "Turkey Cultural Journey",
        destination: "Istanbul & Cappadocia",
        country: "Turkey",
        duration: 8,
        price: "72000",
        originalPrice: "85000",
        description: "Discover Turkey's rich history and stunning landscapes. From Istanbul's historic sites to Cappadocia's fairy chimneys, this journey offers unforgettable experiences.",
        itinerary: [
          "Day 1: Arrival in Istanbul",
          "Day 2: Istanbul city tour - Blue Mosque, Hagia Sophia, Grand Bazaar",
          "Day 3: Bosphorus cruise and Topkapi Palace",
          "Day 4: Flight to Cappadocia",
          "Day 5: Hot air balloon ride and valley tours",
          "Day 6: Underground cities and pottery workshop",
          "Day 7: Return to Istanbul",
          "Day 8: Departure"
        ],
        inclusions: [
          "Round-trip international flights",
          "Domestic flights within Turkey",
          "4-star hotel accommodation",
          "Daily breakfast and 4 dinners",
          "Hot air balloon ride",
          "All transfers and tours"
        ],
        exclusions: [
          "Lunch and other meals",
          "Personal expenses",
          "Visa fees",
          "Optional activities",
          "Travel insurance"
        ],
        imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: "4.6",
        isActive: true,
        isInternational: true
      }
    ];

    // Add sample packages to storage
    samplePackages.forEach(pkg => {
      const packageData = {
        ...pkg,
        id: this.currentPackageId++,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.packages.set(packageData.id, packageData);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      password: insertUser.password || null,
      phone: insertUser.phone || null,
      photoUrl: insertUser.photoUrl || null,
      isAdmin: insertUser.isAdmin || false,
      firebaseUid: insertUser.firebaseUid || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Package operations
  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackages(filters?: any): Promise<Package[]> {
    let packages = Array.from(this.packages.values());
    
    if (filters?.country) {
      packages = packages.filter(pkg => pkg.country.toLowerCase() === filters.country.toLowerCase());
    }
    
    if (filters?.isInternational !== undefined) {
      packages = packages.filter(pkg => pkg.isInternational === filters.isInternational);
    }
    
    if (filters?.isActive !== undefined) {
      packages = packages.filter(pkg => pkg.isActive === filters.isActive);
    }
    
    return packages.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createPackage(packageData: InsertPackage): Promise<Package> {
    const id = this.currentPackageId++;
    const now = new Date();
    const pkg: Package = {
      ...packageData,
      id,
      originalPrice: packageData.originalPrice || null,
      itinerary: packageData.itinerary || null,
      inclusions: packageData.inclusions || null,
      exclusions: packageData.exclusions || null,
      rating: packageData.rating || "4.5",
      isActive: packageData.isActive ?? true,
      isInternational: packageData.isInternational ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: number, updateData: Partial<InsertPackage>): Promise<Package | undefined> {
    const pkg = this.packages.get(id);
    if (!pkg) return undefined;
    
    const updatedPackage = {
      ...pkg,
      ...updateData,
      updatedAt: new Date(),
    };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: number): Promise<boolean> {
    return this.packages.delete(id);
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = {
      ...bookingData,
      id,
      status: bookingData.status || "pending",
      travelers: bookingData.travelers || 1,
      travelDate: bookingData.travelDate || null,
      bookingDate: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: number, updateData: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updateData };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new DatabaseStorage();
