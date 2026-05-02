import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { User } from "./user.model";
import { Hobby } from "@/modules/hobbies/models/hobby.model";

@Table
export class UserHobby extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Hobby)
  @Column
  hobbyId: number;
}