import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";

import { PaymentService } from "./PaymentService";

const paymentRouter = Router();
paymentRouter.post(
    "/", 
    body('paymentId').isString().isLength({min: 36, max: 36}).withMessage('paymentId must be a string'),
    body('userId').isString().isLength({min: 36, max: 36}).withMessage('userId must be a string'),
    purchaseTickets);

async function purchaseTickets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const paymentService = new PaymentService();
    const { paymentId, userId } = req.body;
    const tickets = await paymentService.purchaseTickets(paymentId, userId);
    return res.status(200).json(tickets);
  } catch (e) {
    next(e);
  }
}

export { paymentRouter };
