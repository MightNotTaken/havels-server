import { buffer } from "stream/consumers";
import { AppDataSource } from "../../db";
import { CalibrationBench } from "../entity/calibration-bench/Bench";
import { CalibrationPod } from "../entity/calibration-bench/Pod";
import { CalibrationPodEntry } from "../entity/calibration-bench/Entry";

const BenchRepository = AppDataSource.getRepository(CalibrationBench);
const PodRepository = AppDataSource.getRepository(CalibrationPod);
const PodEntryRepository = AppDataSource.getRepository(CalibrationPodEntry);

class CalibrationBenchController {
    static buffer: any = {};
    public async initialize() {
        for (let i=0; i<3; i++) {
            try {
                const name = `bench-${i}`;
                const bench = await BenchRepository.findOne({
                    where: {
                        name
                    }
                });
                if (!bench) {
                    await CalibrationBenchController.createBench(name);
                }
            } catch (error) {
                console.error();
            }
        }
        console.log('calibration benches initialized');
    }

    public async parseBuffer(data: any) {
        try {
            data = JSON.parse(data);
            if (!data.bench) {
                return;
            }
            const keys = ['index', 'cal', 'ver', 'bar', 'shift'];
            let completed = true;
            for (let key of keys) {
                let buffer = CalibrationBenchController.buffer;
                if (!buffer[data.bench]) {
                    buffer[data.bench] = {};
                }
                if (data[key]) {
                    buffer[data.bench][key] = data[key];
                }
                if (!buffer[data.bench][key]) {
                    completed = false;
                }
            }
            if (completed) {
                const {index, ver, cal, bar, shift} = CalibrationBenchController.buffer[data.bench];
                let bench: any =  await BenchRepository.findOne({
                    where: {
                        name: data.bench
                    },
                    relations: ['pods']
                });
                if (!bench) {
                    bench = CalibrationBenchController.createBench(data.bench);
                }
                const pod = bench.pods[+index];
                const date = new Date();
                const entry = await PodEntryRepository.create({
                    verificationString: ver,
                    calibrationString: cal,
                    barcode: bar,
                    shift,
                    date,
                    pod
                });
                await PodEntryRepository.save(entry);
                delete CalibrationBenchController.buffer[data.bench];
            }
        } catch (error) {
            console.error(error);
        }
    }

    static async createBench(name: string) {
        try {
            const bench = await BenchRepository.create({
                name
            });
            await BenchRepository.save(bench);
            for (let i=0; i<24; i++) {
                const pod = await PodRepository.create({
                    name: `pod-${i}`
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