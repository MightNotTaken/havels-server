import express from "express";
import routes from "./routes";
import mqttController from "./controllers/mqtt.controller";

mqttController.initialize();
const router = express.Router();
router.use("/v1", routes);


export default router;
 