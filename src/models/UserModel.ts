type UserAPIModel = {
  id: string; // ? PK
  firstName: string;
  lastName: string;
  dateOfBirthday: string;
  gender: "male" | "female";
  email: string;
};

export type UserCreateModel = Omit<UserAPIModel, "id">;

export type UserUpdateModel = Omit<UserCreateModel, "email">;

export default UserAPIModel;
