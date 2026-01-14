import { Router, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await UserService.validateUser(email, password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({ userId: user.id, isAdmin: user.isAdmin });
    const { password: _, ...sanitizedUser } = user;
    res.json({ token, user: sanitizedUser });
});

router.post("/register", async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "Email, password, firstName and lastName required" });
    }

    const existing = await UserService.findByEmail(email);
    if (existing) {
        return res.status(409).json({ error: "User already exists" });
    }

    try {
        const user = await UserService.create({ email, password, firstName, lastName });
        const token = generateToken({ userId: user.id, isAdmin: user.isAdmin });
        const { password: _, ...sanitizedUser } = user;
        return res.status(201).json({ token, user: sanitizedUser });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;