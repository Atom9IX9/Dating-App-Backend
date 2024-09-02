import db from "../db/db";

class UsersRepository {
  getAllUsers() {
    const users = db.users
    return users
  }

  getOneUser(id: string) {
    const user = db.users.find((u) => u.id === id)
    return user
  }
}

export const usersRepository = new UsersRepository()