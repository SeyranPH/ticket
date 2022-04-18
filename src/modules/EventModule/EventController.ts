import { Router, Request, Response } from "express";

import { EventService } from "./EventService";

const eventRouter = Router();
eventRouter.post("/", createEvent);

async function createEvent(req: Request, res: Response) {
  const eventService = new EventService();
  const { name, hallName } = req.body;
  const event = await eventService.create({name, hallName});
  return res.send(event);
}

export { eventRouter };