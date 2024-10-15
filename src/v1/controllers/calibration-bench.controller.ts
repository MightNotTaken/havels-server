import { buffer } from "stream/consumers";
import { AppDataSource } from "../../db";
import { CalibrationBench } from "../entity/calibration-bench/Bench";
import { CalibrationPod } from "../entity/calibration-bench/Pod";
import { CalibrationPodEntry } from "../entity/calibration-bench/Entry";

const BenchRepository = AppDataSource.getRepository(CalibrationBench);
const PodRepository = AppDataSource.getRepository(CalibrationPod);
const PodEntryRepository = AppDataSource.getRepository(CalibrationPodEntry);

export class CalibrationBenchController {
    static buffer: any = {};
    public async initialize() {
        for (let i=1; i<=3; i++) {
            try {
                // const name = `bench-${i}`;
                // const bench = await BenchRepository.findOne({
                //     where: {
                //         name
                //     }
                // });
                // if (!bench) {
                //     await CalibrationBenchController.createBench(name);
                // }
            } catch (error) {
                console.error();
            }
        }
        // console.log('calibration benches initialized');
    }
    static async createBench(data: any) {
        try {
            const {name, mac} = data;
            const bench = await BenchRepository.create({
                name,
                mac
            });
            await BenchRepository.save(bench);
            for (let i=1; i<=24; i++) {
                const pod = await PodRepository.create({
                    name: `pod-${i}`,
                    stationID: i
                });
                pod.bench = bench;
                await PodRepository.save(pod);
            }
            return await BenchRepository.findOne({
                where: {
                    name
                },
                relations: ['pods']
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

const calibrationBenchController = new CalibrationBenchController();
export default calibrationBenchController;