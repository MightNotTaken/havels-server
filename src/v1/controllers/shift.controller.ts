import { Request, Response, response } from "express";
import { AppDataSource } from "../../db";
import { Shift } from "../entity/Shift";
import mqttController from "./mqtt.controller";
import { ShiftCount } from "../entity/ShiftCount";
import { Station } from "../entity/Station";
import { getDateStamp } from "../utils/house-keeping.utils";
import { ShiftCountInterface } from "../interfaces/shift-count.interface";
const ShiftRepository = AppDataSource.getRepository(Shift);
const ShiftCountRepository = AppDataSource.getRepository(ShiftCount);
const StationRepository = AppDataSource.getRepository(Station);

class ShiftController {
    public async getShifts(req: Request, res: Response) {
        try {
            const shifts = await ShiftRepository.find();
            res.status(200).json(shifts);
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public static validTiming(start, end) {
        const validator = (time) => {
            const [hour, min, sec] = time.split(':').map(x => +x);
            if (hour < 0 || hour > 23 || min < 0 || min >= 60 || sec < 0 || sec >= 60) {
                return false;
            }
            return true;
        }

        const toNumber = (time) => {
            const [hour, min, sec] = time.split(':').map(x => +x);
            return hour * 3600 + min * 60 + sec;
        }

        return validator(start) && validator(end) && toNumber(end) > toNumber(start);
    }
    
    public static overlap(shift1, shift2) {
        
        const toNumber = (time) => {
            const [hour, min, sec] = time.split(':').map(x => +x);
            return hour * 3600 + min * 60 + sec;
        }
        const first = {
            start: toNumber(shift1.start),
            end: toNumber(shift1.end)
        };
        const second = {
            start: toNumber(shift2.start),
            end: toNumber(shift2.end)
        };
    
        if ((first.start >= second.start && first.start <= second.end) ||
            (first.end >= second.start && first.end <= second.end) ||
            (second.start >= first.start && second.start <= first.end) ||
            (second.end >= first.start && second.end <= first.end)) {
            return true;
        } else {
            return false;
        }
    }

    public async addShift(req: Request, res: Response) {
        try {
            const { start, end, name } = req.body;
            if (!start || !end || !name) {
                return res.status(400).send({
                    message: 'missing parameters',
                    expected: [ 'start', 'end', 'name' ]
                });
            }
            if (!ShiftController.validTiming(start, end)) {
                return res.status(400).json({
                    message: 'timing not valid'
                });
            }
            let shift = await ShiftRepository.findOne({
                where: {
                    name
                }
            });
            if (shift) {
                shift.start = start;
                shift.end = end;
            } else {
                shift = await ShiftRepository.create({
                    start, end, name
                });
            }
            const savedShifts = await ShiftRepository.find();
            for (let sh of savedShifts) {
                if (ShiftController.overlap(sh, shift)) {
                    return res.status(400).send({
                        message: 'Shifts overlap',
                        shift: savedShifts
                    });
                }
            }
            savedShifts.push(shift);
            await ShiftRepository.save(shift);
            res.status(200).json(savedShifts);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async publish(req: Request, res: Response) {
        try {
            const shifts = await ShiftRepository.find({});
            mqttController.updateShifts('all', JSON.stringify(shifts));
            res.status(200).send({
                message: 'Shifts successfully published',
                data: shifts
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    
    public async remove(req: Request, res: Response) {
        try {
            const {name} = req.body;
            if (!name) {
                return res.status(400).send({
                    message: 'missing parameters',
                    expected: [ 'name' ]
                });
            }
            const shift = await ShiftRepository.findOne({
                where: {name}
            });
            if (!shift) {
                return res.status(400).send({
                    message: 'No shift found with name ' + name
                });
            }
            await ShiftRepository.remove(shift);
            res.status(200).send({
                message: 'Shift ' + name + ' successfully removed'
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }    
};

const shiftController = new ShiftController();
export default shiftController;