import { AppDataSource } from "../../db";
import { HourlyCount } from "../entity/HourlyStationCount";
import { Station } from "../entity/Station";
import wsUtil from "../utils/ws.util";


const stationRepo = AppDataSource.getRepository(Station);
const hourCountRepo = AppDataSource.getRepository(HourlyCount);

let stationList = {};
let hourlyCountList = {};

class PulseStationController {

    getDateString(raw = false): any {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (raw) {
            return date;
        }
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    async loadInitialData() {
        const stations = await stationRepo.find();
        for (let station of stations) {
            stationList[station.name] = station;
            // await this.loadHourlyCount(station);
        }
        setInterval(async () => {
            const hourlyCountToSave = [];
            for (let date in hourlyCountList) {
                for (let station in hourlyCountList[date]) {
                    for (let hour in hourlyCountList[date][station]) {
                        let data = {...hourlyCountList[date][station][hour]}
                        if (data.changed) {
                            hourlyCountList[date][station][hour].changed = false;
                            delete data.changed;
                            hourlyCountToSave.push(data);
                        }
                    }
                }
            }
            if (hourlyCountToSave.length) {
                console.log(await hourCountRepo.save(hourlyCountToSave))
            }
        }, 10000);
    }

    async loadHourlyCount(station, i) {
        
        if (!hourlyCountList) {
            hourlyCountList = {};
        }
        if (!hourlyCountList[this.getDateString()]) {
            hourlyCountList = {};
            hourlyCountList[this.getDateString()] = {}
        }
        if (!hourlyCountList[this.getDateString()][station.name]) {
            hourlyCountList[this.getDateString()][station.name] = {}
        }
        // for (let i=0; i<24; i++) {
            let criteria = {
                station,
                hour: i,
                date: this.getDateString(true) as any
            };
            if (!hourlyCountList[this.getDateString()][station.name][i]) {
                let saved = await hourCountRepo.findOne({
                    where: criteria
                });
                if (!saved) {
                    saved = await hourCountRepo.create({
                        hour: i,
                        date: this.getDateString(true) as any,
                        station: station,
                        count: 0
                    });
                    await hourCountRepo.save(saved);
                }
                hourlyCountList[this.getDateString()][station.name][i] = saved;
            }
        // }
    }

    async initialize() {
        wsUtil.dataPipelines['ps'].subscribe(async (rawData) => {
            try {
                const {event, data} = rawData;
                switch (event) {
                    case 'connect': {
                        const {mac, stations} = data;
                        for (let name of stations) {
                            let savedStation = await stationRepo.findOne({
                                where: {
                                    mac, name
                                }
                            });
                            if (!savedStation) {
                                savedStation = await stationRepo.create({
                                    mac,
                                    name
                                });
                                await stationRepo.save(savedStation);
                            } else {
                                console.log("saved station", savedStation)
                            }
                            stationList[savedStation.name] = savedStation;
                        }
                    } break;
                    case 'data': {
                        const {mac, station, data} = rawData.data;
      
                            for (let hourCount of data) {
                                console.log(mac, station, data)
                                const [hour, count] = hourCount.split(':').map(x => +x);
                                let hourlyCount = null;
                                try {
                                    hourlyCount = hourlyCountList[this.getDateString()][station][hour];
                                } catch (error) {
                                    
                                } finally {
                                    if (!hourlyCount) {
                                        this.loadHourlyCount(stationList[station], hour);
                                    }
                                    hourlyCount = hourlyCountList[this.getDateString()][station][hour];
                                }
                                hourlyCount.count = count;
                                hourlyCount.changed = true;
                                // await hourCountRepo.save(hourlyCount);
                            }
                            
                    } break;

                }
            } catch (error) {

            }

        });
        
        await this.loadInitialData();
    }
};

const psCtrl = new PulseStationController();
export default psCtrl;