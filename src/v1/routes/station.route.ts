import express from "express";
import StationController from "../controllers/station.controller";
import mqttController from "../controllers/mqtt.controller";

const router = express.Router();

router.post("/reset-count", StationController.resetCount);
router.post("/reset-all", StationController.resetAll);
router.post("/hourly-count", StationController.getHourlyCount);
router.get("/raw-count", mqttController.getStationData);
router.get("/raw-data", mqttController.getStationRawData);

export default router;
