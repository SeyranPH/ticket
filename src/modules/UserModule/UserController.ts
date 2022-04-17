import { Router, Request, Response } from "express";

import { UserService } from "./UserService";

const userRouter = Router();
userRouter.post("/", createUser);

async function createUser(req: Request, res: Response) {
  const userService = new UserService();
  const { username, password } = req.body;
  const user = await userService.create({ username, password });

  return res.send(user);
}

export { userRouter };