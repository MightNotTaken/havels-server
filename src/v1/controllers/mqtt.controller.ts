import { Console, profileEnd } from "console";
import { AppDataSource } from "../../db";
import MQTTService from "../utils/mqtt.util";
import { Request, Response } from "express";
import { MqttClient } from "mqtt/*";
import { Station } from "../entity/Station";
import { SPM } from "../entity/SPM/SPM";
import { SPMEntry } from "../entity/SPM/Entry";
import { HourlyCount } from "../entity/HourlyStationCount";
import { CalibrationBench } from "../entity/calibration-bench/Bench";
import calibrationBenchController, { CalibrationBenchController } from "./calibration-bench.controller";
import { Batch } from "../entity/calibration-bench/Batch";
import { CalibrationPodEntry } from "../entity/calibration-bench/Entry";


const StationRepository = AppDataSource.getTreeRepository(Station);
const HourlyCountRepository = AppDataSource.getTreeRepository(HourlyCount);
const SPMRepository = AppDataSource.getRepository(SPM);
const SPMEntryRepository = AppDataSource.getRepository(SPMEntry);
const CalBenchRepository = AppDataSource.getRepository(CalibrationBench);
const BatchRepository = AppDataSource.getRepository(Batch);
const PodEntryRepository = AppDataSource.getRepository(CalibrationPodEntry);

let stations: any = {};
let globalData = {
    date: new Date(),
    dateString: ''
}

function updateGlobalTimingParameters() {    
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    globalData.date = date;
    globalData.dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    console.log(globalData);
}

class MQTTController {
    client: MqttClient = null;
    constructor() {
        MQTTService.onConnect((client: MqttClient) => {
            console.log('MQTT connection established');
            this.client = client;
            this.registerDeviceEvents();
        });
    }

    public static getRawData() {
        let response = [];
        for (let station in stations) {
            const stationData = {...stations[station]};
            let dataObject: any = {
                station: stationData.displayName,
                name: stationData.name,
                id: stationData.id,
                data: []
            };
            
            if (stationData.data[globalData.dateString]) {
                for (let hour in stationData.data[globalData.dateString]) {
                    dataObject.data.push({
                        hour: +hour,
                        count: stationData.data[globalData.dateString][hour].current - stationData.data[globalData.dateString][hour].reference
                    });
                }
            }
            response.push(dataObject);
        }
        return response;
    }

    public static async saveData() {
        try {
            console.log('saving data');
            const rawData = MQTTController.getRawData();
            for (let stationData of rawData) {
                const {name, id, data} = stationData;
                for (let {hour, count} of data) {
                    let hourlyCount = await HourlyCountRepository.findOne({
                        where: {
                            station: +id as any,
                            hour: +hour,
                            date: globalData.date
                        }
                    });
                    if (!hourlyCount) {
                        console.log(`creating hourly count for ${stationData.displayName} on date ${globalData.dateString} and hour ${hour}`);
                        hourlyCount = await HourlyCountRepository.create({
                            hour: +hour,
                            date: globalData.date,
                            station: id,
                            count: +count
                        });
                    } else {
                        hourlyCount.count = count;
                    }
                    await HourlyCountRepository.save(hourlyCount);
                }
            }
        } catch (error) {
            console.error("error in updating database", error);
        }
    }

    public async getStationData(req: Request, res: Response) {
        try {
            let response = MQTTController.getRawData();
            res.status(200).json(response);
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'internal server error'
            });
        }
    }
    

    public async getStationRawData(req: Request, res: Response) {
        try {
            res.status(200).json(stations);
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'internal server error'
            });
        }
    }

    registerDeviceEvents() {
        MQTTService.listen('connect', async (data) => {
            try {
                const {mac, station} = JSON.parse(data);
                console.log('connection', {mac, station})

                this.client?.publish(`${mac}/utc`, this.getTime() + '_' + this.getDate());
            } catch (error) {
                console.error(error);
            }
        });
        MQTTService.listen("spm:connect", async (data) => {
            try {
                const {mac, station} = JSON.parse(data);
                let spm = await SPMRepository.findOne({where: {mac}});
                if (!spm) {
                    spm = await SPMRepository.create({mac, name: station});
                    await SPMRepository.save(spm);
                } else if (spm.name !== station) {
                    await SPMRepository.update(spm, {name: station});
                }
                setTimeout(() => {
                    this.client?.publish(`${mac}/id`, `${spm.id}`);
                }, 400);
                this.client?.publish(`${mac}/utc`, this.getTime() + '_' + this.getDate());
            } catch (error) {
                console.error(error);
            }
        });
        MQTTService.listen("spm:data", async (data) => {
            try {
                let [id, qr, rating, resistance, resistanceStatus, hold, holdStatus, trip, tripStatus, hvStatus, overallStatus] = JSON.parse(data);
                resistanceStatus = resistanceStatus ? 'Pass' : 'Fail';
                holdStatus = holdStatus ? 'Pass' : 'Fail';
                tripStatus = tripStatus ? 'Pass' : 'Fail';
                hvStatus = hvStatus ? 'Pass' : 'Fail';
                overallStatus = overallStatus ? 'Pass' : 'Fail';
                let spm = await SPMRepository.findOne({where: {id: +id}});
                if (spm) {
                    let entry = await SPMEntryRepository.create({
                        qr, rating, resistance, resistanceStatus, hold, holdStatus, trip, tripStatus, hvStatus, overallStatus, spm, date: new Date()
                    } as any);
                    await SPMEntryRepository.save(entry);
                    console.log(entry);
                }
            } catch (error) {
                console.error(error);
            }
        });
        MQTTService.listen("hourly-station-count", async (data) => {
            try {
                console.log(data);
                const [hour, stationName, count, mac] = JSON.parse(data);
                if (!stations[stationName]) {
                    let station = await StationRepository.findOne({
                        where: {
                            name: stationName
                        }
                    });
                    if (!station) {
                        station = await StationRepository.create({
                            name: stationName,
                            mac: mac
                        });
                        await StationRepository.save(station);
                    };
                    station.lastUpdate = new Date();
                    stations[stationName] = {...station};
                    stations[stationName].data = {};
                }
                if (!stations[stationName].data[globalData.dateString]) {
                    stations[stationName].data[globalData.dateString] = {};
                }
                if (!stations[stationName].data[globalData.dateString][hour]) {
                    stations[stationName].data[globalData.dateString][hour] = {
                        reference: count,
                        current: count
                    };
                } else {
                    stations[stationName].data[globalData.dateString][hour].current = count;
                }
                stations[stationName].lastUpdate = new Date();
                if (+hour != (new Date()).getHours()) {
                    console.log(hour, (new Date()).getHours())
                    console.log('updating time');
                    this.client?.publish(`${mac}/utc`, this.getTime() + '_' + this.getDate());
                }
            } catch (error) {
                console.error(error);
            }
        });

        MQTTService.listen("calib:connect", async (data) => {
            try {
                const {mac, name} = JSON.parse(data);
                let bench: any = await CalBenchRepository.findOne({where: {mac}});
                if (!bench) {
                    bench = CalibrationBenchController.createBench({name, mac});
                }
                bench.mac = mac;
                await CalBenchRepository.save(bench);
                console.log(bench);
                this.client?.publish(`${mac}/utc`, this.getTime() + '_' + this.getDate());
                setTimeout(()=>{
                    this.client?.publish(`${mac}/bench-id`, `${bench.id}`);
                }, 500);
            } catch (error) {

            }
        });
        MQTTService.listen("calib:batch-params", async (rawData) => {
            try {
                let [ mac, mode, rating, current, ambient, t1, t2, t3, t4] = JSON.parse(rawData);
                current = +current;
                ambient = +ambient;
                t1 = +t1;
                t2 = +t2;
                t3 = +t3;
                t4 = +t4;
                console.log({mac, mode, rating, current, ambient, t1, t2, t3, t4})
                const bench = await CalBenchRepository.findOne({
                    where: {
                        mac
                    }
                });
                let batch = await BatchRepository.findOne({
                    where: {
                        mode, rating, current, t1, t2, t3, t4, bench: bench.id as any
                    }
                });
                if (!batch) {
                    batch = await BatchRepository.create({
                        mode, rating, current, ambient, t1, t2, t3, t4, bench, timestamp: new Date()
                    });
                    await BatchRepository.save(batch);
                }
                this.client?.publish(`${mac}/batch-id`, `${batch.id}`);
            } catch (error) {

            }
        });
        MQTTService.listen("calib:data", async (rawData) => {
            try {
                let [barcode, batchID, benchID, triptTime, stationID, result] = JSON.parse(rawData);
                console.log({batchID, benchID, triptTime, stationID, result});
                result = [null, 'MCB_PASS', 'MCB_EARLY_TRIP', 'MCB_LATE_TRIP', 'MCB_NO_TRIP'][result];
                const batch = await BatchRepository.findOne({where: {id: +batchID}});
                const bench = await CalBenchRepository.findOne({where: {id: +benchID}, relations: ['pods']});
                if (batch && bench.pods[stationID - 1]) {
                    const entry = await PodEntryRepository.create({
                        barcode, 
                        tripTime: +triptTime,
                        result,
                        pod: bench.pods[stationID - 1],
                        batch,
                        timestamp: new Date()
                    });
                    await PodEntryRepository.save(entry);
                    console.log(entry);
                }
            } catch (error) {

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
        updateGlobalTimingParameters();
        setInterval(() => {
            updateGlobalTimingParameters();
            MQTTController.saveData();
        }, 10000);
    }
};

const mqttController = new MQTTController();
export default mqttController;