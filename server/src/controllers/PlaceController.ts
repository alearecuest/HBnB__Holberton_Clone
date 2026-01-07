import multer from "multer";
import path from "path";
import fs from "fs";
import { Router, Request, Response } from "express";
import { PlaceService } from "../services/PlaceService";
import { validateBody } from "../middlewares/validateBody";
import { placeCreateSchema, placeUpdateSchema } from "../schemas/placeSchema";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth";

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
      const places = await PlaceService.getAll();
      res.status(200).json(places);
  } catch (err) {
      res.status(500).json({ error: "Could not fetch places" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
try {
    const { id } = req.params;
    const place = await PlaceService.getById(id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.json(place);
} catch (err) {
    res.status(500).json({ error: "Error fetching place detail" });
}
});

router.post("/", authenticateJWT, validateBody(placeCreateSchema), async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            req.body.ownerId = userId;
            const place = await PlaceService.create(req.body);
            res.status(201).json(place);
        } catch (err) {
            res.status(400).json({ error: "Could not create place" });
        }
    }
);

router.post("/:placeId/photos", authenticateJWT, upload.array("photos", 10), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { placeId } = req.params;
      if (!req.files) return res.status(400).json({ error: "No files uploaded" });
      const photos = (req.files as Express.Multer.File[]).map(file => ({
        url: `/uploads/${file.filename}`
      }));
      const saved = await PlaceService.addPhotos(placeId, photos);
      res.json(saved);
    } catch (err) {
      res.status(500).json({ error: "Could not upload photo(s)" });
    }
  }
);

router.delete("/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const place = await PlaceService.getById(id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    if (!place.owner || place.owner.id !== req.user?.userId) return res.status(403).json({ error: "Forbidden" });
    await PlaceService.deleteById(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: "Could not delete place" });
  }
});

router.delete("/:placeId/photos/:photoIndex", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { placeId, photoIndex } = req.params;
      const updated = await PlaceService.deletePhoto(placeId, parseInt(photoIndex, 10), req.user!.userId);
      if (!updated) return res.status(403).json({ error: "Unauthorized or not found" });
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: "Could not delete photo" });
    }
  }
);

export default router;