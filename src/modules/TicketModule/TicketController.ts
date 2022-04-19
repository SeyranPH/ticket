import { Router, Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import { TicketService } from "./TicketService";

const ticketRouter = Router();
ticketRouter.post(
    "/",
    body("ticketPlaces").isArray(),
    body('eventId').isString().isLength({min: 36, max: 36}).withMessage('eventId must be a string'), 
    body('userId').isString().isLength({min: 36, max: 36}).withMessage('userId must be a string'),
    makeReservation
);
ticketRouter.get(
    "/event/:id", 
    param('eventId').isString().isLength({min: 36, max: 36}).withMessage('eventId must be a string'), 
    getEventAvailability
);
ticketRouter.get(
    "/user/:id", 
    param('userId').isString().isLength({min: 36, max: 36}).withMessage('userId must be a string'), 
    getUserReservations);

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
