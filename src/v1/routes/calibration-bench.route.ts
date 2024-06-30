import express from "express";
import calibrationBenchController from "../controllers/calibration-bench.controller";

const router = express.Router();

router.post("/begin", calibrationBenchController.initialize);

export default router;
