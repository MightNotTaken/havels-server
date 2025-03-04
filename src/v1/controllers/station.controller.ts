import { Request, Response } from "express";
import { AppDataSource } from "../../db";
import { Station } from "../entity/Station";
import mqttController from "./mqtt.controller";
import { stat } from "fs";
import { HourlyCount } from "../entity/HourlyStationCount";

const StationRepository = AppDataSource.getRepository(Station);
const HourlyCountRepository = AppDataSource.getRepository(HourlyCount);

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
            currentStation.referenceCount = currentStation.currentCount;
            // mqttController.client.publish(`/reset-all`, station);
            console.log({station})
            await StationRepository.save(currentStation);
            res.status(200).send({
                message: 'Station count reset',
                data: currentStation
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async resetAll(req: Request, res: Response) {
        try {
            const stations = await StationRepository.find({
                where: {
                }
            });
            for (let station of stations) {
                station.referenceCount = station.currentCount;
            }
            await StationRepository.save(stations);
            res.status(200).send({
                message: 'Station count reset',
                data: stations
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getHourlyCount(req: Request, res: Response) {
        try {
            const {day, month, year, hour} = req.body;
            const date = new Date();
            date.setDate(day);
            date.setMonth(month - 1);
            date.setFullYear(year);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            let response = await HourlyCountRepository.find({
                where: {
                    date,
                    hour: +hour
                },
                relations: ['station']
            });
            response = response.map((r: any) => {
                r.station = r.station.name;
                return r;
            })
            response = response.sort((r1, r2) => {
                if (r1.station < r2.station) return -1;
                return 1;
            })
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

const stationController = new StationController();
export default stationController;