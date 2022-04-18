import { Router, Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { PaymentService } from "./PaymentService";

const paymentRouter = Router();
paymentRouter.post("/", purchaseTickets);

async function purchaseTickets(req: Request, res: Response, next: NextFunction) {
    try{
        const paymentService = new PaymentService();
        const { paymentId, userId } = req.body;
        const tickets = await paymentService.purchaseTickets(paymentId, userId);
        return res.status(200).json(tickets);
    }
    catch(e){
        next(e);
    }
}

export {paymentRouter};