import { AppDataSource } from "../../db";
import { Station } from "../entity/Station";
import wsUtil from "../utils/ws.util";


const stationRepo = AppDataSource.getRepository(Station);

class PulseStationController {
    initialize() {
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
                        }
                    }
                }
            } catch (error) {

            }

        });
    }
};

const psCtrl = new PulseStationController();
export default psCtrl;