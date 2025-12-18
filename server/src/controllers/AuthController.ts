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

export default router;