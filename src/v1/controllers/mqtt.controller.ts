import { Console } from "console";
import { AppDataSource } from "../../db";
import { Shift } from "../entity/Shift";
import MQTTService from "../utils/mqtt.util";

import { MqttClient } from "mqtt/*";
import { Station } from "../entity/Station";
import { getDateStamp } from "../utils/house-keeping.utils";
import { ShiftCount } from "../entity/ShiftCount";
import calibrationBenchController from "./calibration-bench.controller";
import { SPM } from "../entity/SPM/SPM";
import { SPMEntry } from "../entity/SPM/Entry";


const ShiftRepository = AppDataSource.getTreeRepository(Shift);
const StationRepository = AppDataSource.getTreeRepository(Station);
const ShiftCountRepository = AppDataSource.getTreeRepository(ShiftCount);
const SPMRepository = AppDataSource.getRepository(SPM);
const SPMEntryRepository = AppDataSource.getRepository(SPMEntry);

class MQTTController {
    client: MqttClient = null;
    constructor() {
        MQTTService.onConnect((client: MqttClient) => {
            console.log('MQTT connection established');
            this.client = client;
            this.registerDeviceEvents();
        });
    }

    registerDeviceEvents() {
        MQTTService.listen('connect', async (data) => {
            try {
                const {mac, station} = JSON.parse(data);
                let stationData = await StationRepository.findOne({
                    where: {
                        name: station
                    },
                    relations: ['shifts']
                });
                if (!stationData) {
                    stationData = await StationRepository.create({
                        name: station,
                        mac
                    });
                    await StationRepository.save(stationData);
                }
                const shifts = await ShiftRepository.find();

                setTimeout(() => {
                    this.updateShifts(mac, JSON.stringify(shifts));
                }, 1000);
                this.client?.publish(`${mac}/utc`, this.getTime() + '_' + this.getDate());
            } catch (error) {
                console.error(error);
            }
        });
        MQTTService.listen("station-count", async (data) => {
            try {
                data = JSON.parse(data);
                const name = data.station;
                let station = await StationRepository.findOne({
                    where: {
                        name
                    },
                    relations: ['shifts']
                });
                if (!station) {
                    station = await StationRepository.create({
                        name,
                        mac: data.mac
                    });
                }
                if (!station.shifts) {
                    station.shifts = [];
                }
                let shift: ShiftCount = station.shifts?.filter(shift => getDateStamp(shift.date) == data.date && shift.name == data.current)[0];
                if (!shift) {
                    let date = new Date();
                    shift = await ShiftCountRepository.create({
                        name: data.current,
                        date,
                        count: +data[data.current]
                    });
                    station.shifts.push(shift);
                } else {
                    shift.count = +data[data.current];
                }
                await StationRepository.save(station);
                
                await ShiftCountRepository.save(shift);
                const response: any = {};
                response.current = data.current;
                response[data.current] = +data[data.current];
                response["station"] = data.station;
                this.client.publish(`${data.mac}/reset-count`, JSON.stringify(response));
            } catch (error) {
                console.error(error);
            }
        });
        MQTTService.listen("calibration-bench", async (data) => {
            try {
                calibrationBenchController.parseBuffer(data);
            } catch (error) {
                console.error(error)
            }
        });
        MQTTService.listen("spm", async (_data) => {
            try {
                const {
                    name, data, shift
                } = JSON.parse(_data);
                let spm = await SPMRepository.findOne({
                    where: {
                        name
                    }
                });
                if (!spm) {
                    console.log("creating spm")
                    spm = await SPMRepository.create({
                        name
                    });
                    await SPMRepository.save(spm);
                }
                const date = new Date();
                const entry = await SPMEntryRepository.create({
                    data,
                    date,
                    shift,
                    spm
                });
                await SPMEntryRepository.save(entry);
            } catch (error) {
                console.error(error);
            }
        });
    }

    getTime() {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return hours + ':' + minutes + ':' + seconds;
    }

    getDate() {
        const date = new Date();
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    updateShifts(mac: string, data: string) {
        this.client.publish(`${mac}/shift`, data);
    }
 
    async globalOTAUpdate(type: string, version: string) {
        this.client?.publish(`${type}/ota`, JSON.stringify({
            version,
            url: `${process.env.OTA_BASE_URL}?version=${version}&type=${type}`
        }));
    }
 
    async updateSingleFirmware(type: string, version: string, mac: string) {
        this.client?.publish(`${mac}/ota`, JSON.stringify({
            version,
            url: `${process.env.OTA_BASE_URL}?version=${version}&type=${type}`
        }));
    }

    initialize() {

    }
};

const mqttController = new MQTTController();
export default mqttController;