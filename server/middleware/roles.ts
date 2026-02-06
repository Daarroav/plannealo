import type { Request, Response, NextFunction } from "express";

type Role = "master" | "admin" | "traveler";

type AuthedRequest = Request & {
  isAuthenticated?: () => boolean;
  user?: {
    role?: Role;
  };
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "No autenticado" });
}

export function requireRole(roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    return next();
  };
}
