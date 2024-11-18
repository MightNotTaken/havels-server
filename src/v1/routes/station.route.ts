import express from "express";
import StationController from "../controllers/station.controller";

const router = express.Router();

router.post("/reset-count", StationController.resetCount);
router.post("/reset-all", StationController.resetAll);

export default router;
