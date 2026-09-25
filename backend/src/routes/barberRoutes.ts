import { Router } from "express";
import { getBarbers } from "../controllers/barberController";

const router = Router();

router.get("/", getBarbers);

export default router;