import { Model } from 'sequelize';
import { Column, Table } from 'sequelize-typescript';

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
  age: number;

  @Column
  gender: 'male' | 'female';

  @Column
  location: string;
}
