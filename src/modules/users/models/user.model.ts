import { Column, Table, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  dateOfBD: string;

  @Column
  age: number;

  @Column
  gender: 'male' | 'female';

  @Column
  location: string;
}
