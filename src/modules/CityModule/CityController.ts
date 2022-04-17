import { Router, Request, Response } from "express";

import { CityService } from "./CityService";

const cityRouter = Router();
cityRouter.post("/", createCity);

async function createCity(req: Request, res: Response) {
  const cityService = new CityService();
  const { cityname } = req.body;
  const city = await cityService.create(cityname);
  return res.send(city);
}

export { cityRouter };