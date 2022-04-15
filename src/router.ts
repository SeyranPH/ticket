import {Router} from 'express';
import {userRouter} from './modules/UserModule/UserController';

const router = Router();

router.use('/users', userRouter);

export {router}

