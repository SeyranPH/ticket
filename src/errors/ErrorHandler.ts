import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { HTTPError } from "./HTTPError";

export const ErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error.message);
    if (error && error instanceof HTTPError) {
      return res.status(error.status).send(error.message);
    }
    return res.status(500).send({ msg: 'internal error' });
};