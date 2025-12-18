import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export interface JwtPayload {
    userId: string;
    isAdmin: boolean;
}

export function generateToken(payload: JwtPayload, expiresIn: string = "1d"): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}