import {Router} from 'express';
import {userRouter} from './modules/UserModule/UserController';
import {cityRouter} from './modules/CityModule/CityController';

const router = Router();

router.use('/users', userRouter);
router.use('/cities', cityRouter);

export {router}

