import express from "express";
import StationController from "../controllers/station.controller";

const router = express.Router();

router.post("/reset-count", StationController.resetCount);

export default router;
