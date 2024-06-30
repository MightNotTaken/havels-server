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
            let {station, shift, count} = req.body;
            if (!station || !shift) {
                return res.status(400).send({
                    message: 'missing parameters',
                    expected: [ 'station', 'shift', 'count (optional, default value 0)' ]
                });
            }
            if (!count) {
                count = 0;
            }
            let date = new Date();
            const currentStation = await StationRepository.findOne({
                where: {
                    name: station
                },
                relations: ['shifts']
            });
            if (!currentStation) {
                return res.status(400).send({
                    message: 'No station found with name ' + station
                });
            }
            
            const shiftCount: ShiftCountInterface = currentStation.shifts?.filter(sft => getDateStamp(sft.date) == getDateStamp(date) && sft.name == shift)[0];

            if (!shiftCount) {
                return res.status(400).send({
                    message: 'No shift-count found with name ' + shift
                });
            }
            shiftCount.count = count;
            const response: any = {};
            response[shift] = shiftCount.count;
            response.station = station;
            response.current = shift;
            mqttController.client.publish(`${currentStation.mac}/reset-count`, JSON.stringify(response));
            await StationRepository.save(currentStation);
            res.status(200).send({
                message: 'Shift ' + shift + ' for station ' + station + ' count set to ' + count,
                data: currentStation
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

const stationController = new StationController();
export default stationController;