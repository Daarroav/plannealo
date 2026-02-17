import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored || !stored.includes('.')) {
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Verificar SESSION_SECRET
  let sessionSecret = process.env.SESSION_SECRET;
  
  if (!sessionSecret) {
    // En producción, SESSION_SECRET es obligatorio
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ CRITICAL: SESSION_SECRET environment variable is not set in production');
      console.error('❌ Please configure SESSION_SECRET in Replit Secrets');
      throw new Error('SESSION_SECRET is required in production');
    }
    
    // En desarrollo/preview, usar valor por defecto con advertencia
    console.warn('⚠️  SESSION_SECRET not found - using default for development/preview');
    console.warn('⚠️  Configure SESSION_SECRET in Replit Secrets for security');
    sessionSecret = 'dev-' + randomBytes(32).toString('hex');
  }
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Forzar rol traveler en registro público
    const user = await storage.createUser({
      ...req.body,
      role: 'traveler',
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El correo electrónico es requerido" });
    }

    try {
      const user = await storage.getUserByUsername(email);

      if (!user) {
        // No revelar si el email existe o no (por seguridad)
        // Pero en desarrollo, puede ser útil saber
        if (process.env.NODE_ENV === 'development') {
          return res.status(404).json({ message: "No existe cuenta con este correo electrónico" });
        }
        // En producción, responder exitosamente aunque no exista
        return res.status(200).json({ message: "Si el correo existe, recibirás instrucciones de recuperación" });
      }

      // TODO: Implementar envío de email con enlace de recuperación
      // Por ahora, solo confirmamos que el usuario existe
      console.log(`Password reset requested for user: ${email}`);

      return res.status(200).json({ 
        message: "Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada." 
      });
    } catch (error) {
      console.error("Error in forgot-password:", error);
      return res.status(500).json({ message: "Error al procesar la solicitud" });
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
