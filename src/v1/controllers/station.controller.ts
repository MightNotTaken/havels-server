import { Request, Response } from "express";
import { AppDataSource } from "../../db";
import { Station } from "../entity/Station";
import { ShiftCountInterface } from "../interfaces/shift-count.interface";
import { getDateStamp } from "../utils/house-keeping.utils";
import mqttController from "./mqtt.controller";

const StationRepository = AppDataSource.getRepository(Station);


class StationController {
    public async getStations(req: Request, res: Response) {
        try {
            const stations = await StationRepository.find();
            res.status(200).json(stations);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async resetCount(req: Request, res: Response) {
        try {
            let {station } = req.body;
            const currentStation = await StationRepository.findOne({
                where: {
                    name: station
                }
            });
            if (!currentStation) {
                return res.status(400).send({
                    message: 'No station found with name ' + station
                });
            }
            mqttController.client.publish(`${currentStation.mac}/reset-all`, '');
            await StationRepository.save(currentStation);
            res.status(200).send({
                message: 'Station count reset',
                data: currentStation
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

const stationController = new StationController();
export default stationController;