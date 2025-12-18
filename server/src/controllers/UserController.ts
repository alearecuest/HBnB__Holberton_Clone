import { Router, Request, Response } from "express";
import { UserService } from "../services/UserService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const user = await UserService.create(req.body);
        const { password, ...rest } = user;
        res.status(201).json(rest);
    } catch (err) {
        res.status(400).json({ error: "Could not create user" });
    }
});


export default router;