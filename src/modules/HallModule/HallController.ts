import { Router, Request, Response } from "express";

import { HallService } from "./HallService";

const hallRouter = Router();
hallRouter.post("/", createHall);

async function createHall(req: Request, res: Response) {
  const hallService = new HallService();
  const hall = await hallService.create(req.body);
  return res.send(hall);
}

export { hallRouter };