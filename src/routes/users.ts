import { Request, Response } from "express";
import UserAPIModel from "../models/UserModel";
import { ParamsRequest } from "../types/requests";
import { Router } from "express";
import { usersRepository } from "../repositories/usersRepository";

const usersRouter = Router();

usersRouter.get(
  "/:id",
  (req: ParamsRequest<{ id: string }>, res: Response<UserAPIModel>) => {
    const user = usersRepository.getOneUser(req.params.id);
    res.json(user);
  }
);

usersRouter.get("/", (req: Request, res: Response<UserAPIModel[]>) => {
  const users = usersRepository.getAllUsers();
  res.json(users);
});

export default usersRouter;
