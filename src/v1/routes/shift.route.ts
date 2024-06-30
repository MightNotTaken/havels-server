import express from "express";
import ShiftController from "../controllers/shift.controller";

const router = express.Router();

router.get("", ShiftController.getShifts);
router.post("", ShiftController.addShift);
router.post("/publish", ShiftController.publish);
router.delete("", ShiftController.remove);

export default router;
