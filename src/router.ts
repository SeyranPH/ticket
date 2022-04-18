import {Router} from 'express';
import {userRouter} from './modules/UserModule/UserController';
import {cityRouter} from './modules/CityModule/CityController';
import { hallRouter } from './modules/HallModule/HallController';
import {eventRouter} from './modules/EventModule/EventController';
import {paymentRouter} from './modules/PaymentModule/PaymentController';
import {ticketRouter} from './modules/TicketModule/TicketController';



const router = Router();

router.use('/user', userRouter);
router.use('/city', cityRouter);
router.use('/hall', hallRouter);
router.use('/event', eventRouter);
router.use('/payment', paymentRouter);
router.use('/ticket', ticketRouter);

export {router}

