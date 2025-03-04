import dotenv from 'dotenv';
dotenv.config();

import express, {Request, Response} from "express";
import cors from "cors";
import http from "http";

import v1 from "./v1";
import { initializeDB } from './db';
import MQTTService from './v1/utils/mqtt.util';
import calibrationBenchController from './v1/controllers/calibration-bench.controller';
import wsUtil from './v1/utils/ws.util';
import psCtrl from './v1/controllers/pulse-station.hardware.controller';

const PORT = +process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", v1);

app.get("/route", (req: any, res: any) => {
  res.status(200).send({
    message: 'its working'
  })
});

const server = http.createServer(app);

wsUtil.init(server);
psCtrl.initialize();
server.listen(PORT, () => {
  // MQTTService.connect().then(() => {
  //   console.log('connected to Mqtt broker');
  // }, (error) => {
  //   console.error('Error in connecting to mqtt', error);
  // })
  initializeDB().then(
    async () => {
      try {
        console.log("database successfully initialized");
        calibrationBenchController.initialize();
      } catch (error) {
        console.error(error.message || error);
      }
    },
    (error) => {
      console.log(error)
    } 
  ); 
  console.log(`Server listening on port ${PORT}`);
});