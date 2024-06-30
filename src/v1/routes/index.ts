import express from "express";

import otaRoutes from "./ota.route";
import shiftRoutes from "./shift.route";
import stationRoutes from "./station.route";
import calibrationBenchRoutes from "./calibration-bench.route";

const routes = express.Router();

routes.use("/ota", otaRoutes);
routes.use("/shift", shiftRoutes);
routes.use("/station", stationRoutes);
routes.use("/calibration-bench", calibrationBenchRoutes);

export default routes;
