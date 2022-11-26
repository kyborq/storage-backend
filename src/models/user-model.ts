import { Table, Column, Model, HasOne } from "sequelize-typescript";
import Token from "./token-model";

@Table
class User extends Model {
  @Column
  login!: string;

  @Column
  password!: string;

  @Column
  email!: string;

  @Column
  avatar!: string;

  @HasOne(() => Token, { foreignKey: "userId" })
  token: Token;
}

export default User;
