import { Router, Request, Response, NextFunction } from "express";

import { TicketService } from "./TicketService";

const ticketRouter = Router();
ticketRouter.post("/", makeReservation);
ticketRouter.get("/event/:id", getEventAvailability);
ticketRouter.get("/user/:id", getUserReservations);

async function makeReservation(req: Request, res: Response, next: NextFunction) {
    try{
        const ticketService = new TicketService();
        const { ticketPlaces, eventId, userId } = req.body;
        const paymentId = await ticketService.makeReservation(ticketPlaces, eventId, userId);
        return res.status(201).send({paymentId});
    }
    catch(e){
        next(e);
    }
}

async function getEventAvailability(req: Request, res: Response, next: NextFunction) {
    try {
        const eventId = req.params.id;
        const ticketService = new TicketService();
        const unavailableTickets = await ticketService.getEventAvailability(eventId);
        if (unavailableTickets.length === 0) {
            return res.status(200).send({availableTickets: "All tickets are available"});
        }
        return res.status(200).send({unavailableTickets});
    }
    catch(e){
        next(e);
    }

}

async function getUserReservations(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id;
        const ticketService = new TicketService();
        const reservedTickets = await ticketService.getUserReservations(userId);

        return res.status(200).send({reservedTickets});
    }
    catch(e){
        next(e);
    }
}



export { ticketRouter };
