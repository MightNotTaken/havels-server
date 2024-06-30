import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "../v1/entity";

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any || 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities,
  migrations: [],
  subscribers: [],
});

const createDatabaseIfNotExists = (): Promise<boolean> => {
  return new Promise(async (res: any, rej: any) => {
    try {
      console.log('creating database');
      const connectionOptions = {
        ...AppDataSource.options,
        database: undefined
      };    
      const tempConnection = new DataSource(connectionOptions);
      await tempConnection.initialize();
      await tempConnection.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
      await tempConnection.destroy();
      res(true);
    } catch (error) {
      res(false)
    }
  });
};
export const initializeDB = () => {
  return new Promise(async (res, rej) => {
    try {
      res(await AppDataSource.initialize());
    } catch (error) {
      if (error.code === 'ER_BAD_DB_ERROR') {
        console.log('database does not exist');
        const databaseCreated = await createDatabaseIfNotExists();
        if (databaseCreated) {
          return res(await initializeDB());
        }
      }
      rej(error);
    } 
  });
}; 
 