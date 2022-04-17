import { Router, Request, Response, NextFunction } from "express";

import { TicketService } from "./TicketService";

const userRouter = Router();
userRouter.post("/", makeReservation);
userRouter.get("/event/:id", getEventAvailability);
userRouter.get("/user/:id", getUserAvailability);

async function makeReservation(req: Request, res: Response, next: NextFunction) {
    try{
        const ticketService = new TicketService();
        const { ticketPlaces, eventName, userId } = req.body;
        await ticketService.makeReservation(ticketPlaces, eventName, userId);
        return res.sendStatus(201);
    }
    catch(e){
        console.error(e)
        next(e);
    }
}

async function getEventAvailability(req: Request, res: Response) {
    const eventId = req.params.id;
    const ticketService = new TicketService();
    const unavailableTickets = await ticketService.getEventAvailability(eventId);
    return res.status(200).send({unavailableTickets});
}

async function getUserAvailability(req: Request, res: Response) {
    const userId = req.params.id;
    const ticketService = new TicketService();
    const unavailableTickets = await ticketService.getUserAvailability(userId);
    return res.status(200).send({unavailableTickets});
}



export { userRouter };
