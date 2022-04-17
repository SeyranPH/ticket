import { Router, Request, Response } from "express";

import { EventService } from "./EventService";

const EventRouter = Router();
EventRouter.post("/", createEvent);

async function createEvent(req: Request, res: Response) {
  const eventService = new EventService();
  const { eventname, hallName } = req.body;
  const event = await eventService.create({name: eventname, hallName});
  return res.send(event);
}

export { EventRouter };