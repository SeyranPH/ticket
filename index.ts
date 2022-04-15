import express, { Application, Request, Response } from "express";
import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";

import { config } from "./config";
import { router } from "./src/router";
import { AppDataSource } from "./src/DataSource";

const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

AppDataSource.initialize()
  .then(() => {

    console.log()
    app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
});
  })
  .catch((err: Error) => {
    console.log(err);
  });
