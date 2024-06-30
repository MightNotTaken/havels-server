import { Request, Response, response } from "express";
import { OTA } from "../entity/OTA";
import { Like } from "typeorm";
import { AppDataSource } from "../../db";

const OTARepository = AppDataSource.getRepository(OTA);

class OTAController {
    public async getDetails(req: Request, res: Response) {
        try {
            const {type, version, description} = req.body;
            if (!version && !type && !description){
                return res?.status(400).json({
                    message: 'missing parameters, provided atleast one',
                    expected: ['version', 'type', 'description (partial match allowed)']
                });
            }
            const where: any = {};
            if (version) {
                where.version = version;
            }
            if (type) {
                where.type = type;
            }
            if (description) {
                where.description = Like(`%${description}%`);
            }

            const matches = await OTARepository.find({where});
            res?.status(200).send(matches);
            if (!response) {
                return matches;
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public async addNewVersion(req: Request, res: Response) {
        try {
            const {version, type, description, path} = req.body;
            if (!version || !type || !description){
                return res.status(400).json({
                    message: 'missing parameters',
                    expected: ['version', 'type', 'description']
                });
            }
            const firmware = await OTARepository.findOne({
                where: {
                    version,
                    type
                }
            });
            if (firmware) {
                return res.status(409).json({
                    message: 'Duplicate firmware conflict'
                });
            }
            const newFirmware = OTARepository.create({
                version,  
                type,  
                description,
                path
            });
            await OTARepository.save(newFirmware);
            return res.status(200).send({
                message: 'Firmware successfully uploaded',
                data: newFirmware
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }    
    public async download(req: Request, res: Response) {
        try {
            const {version, type} = req.query as any;
            if (!version || !type) {
                return res.status(400).json({
                    message:  "Missing parameter",
                    expected: ["version", "type"]
                });
            }
            const firmware = await OTARepository.findOne({
                where: {
                    version,
                    type
                }
            });
            if (firmware) {
                return res.status(200).download(firmware.path);
            }
            return res.status(404).json({message: "Firmware Not found"});
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async remove(req: Request, res: Response) {
        try {
            const {version, type} = req.body;
            if (!version || !type){
                return res.status(400).json({
                    message: 'missing parameters',
                    expected: ['version', 'type']
                });
            }
            const firmware = await OTARepository.findOne({
                where: {
                    version,
                    type
                }
            });
            if (firmware) {
                await OTARepository.remove(firmware);
                return res.status(200).json({
                    message: 'Ota version removed'
                });
            }
            return res.status(404).json({message: "Firmware Not found"});
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getLatestVersion(type: string) {
        try {
            const firmwares = await OTARepository.find({
                where: {
                    type
                },
                order: {
                    version: 'DESC'
                }
            });
            if (firmwares && firmwares[0]) {
                return firmwares[0].version;
            }
            return "1.0.0";
        } catch (error) {
            return "1.0.0";
        }

    }
};

const OtaController = new OTAController();
export default OtaController;