import { Response } from "express";
import UserAPIModel from "../models/UserModel";
import { ParamsRequest } from "../types/requests";
import { Router } from "express";
import db from "../db/db";

const usersRouter = Router()

usersRouter.get(
  "/:id",
  (req: ParamsRequest<{ id: string }>, res: Response<UserAPIModel>) => {
    const { id } = req.params;
    const user = db.users.find((u) => u.id === id);
    res.json(user);
  }
);

export default usersRouter

