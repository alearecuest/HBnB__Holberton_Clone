import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }
    try {
        const token = header.replace("Bearer ", "");
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Forbidden: Admin privileges required" });
    }
    next();
}