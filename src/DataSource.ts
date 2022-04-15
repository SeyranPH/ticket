import { DataSource, DataSourceOptions } from "typeorm";
import { entities } from "./entities";
import { dbConfig } from "../config";

const AppDataSource = new DataSource({
  entities,
  ...dbConfig,
} as DataSourceOptions);

export {AppDataSource}
