import UserAPIModel from "../models/UserModel";

const db = {
  users: [
    {
      dateOfBirthday: "01/01/2009",
      email: "email@gmail.com",
      firstName: "Yaroslav",
      gender: "male",
      id: "asdhckdllellldnvnsdjr3d",
      lastName: "Vorobyov",
    },
  ] as UserAPIModel[],
};

export default db;
export type DB = typeof db
