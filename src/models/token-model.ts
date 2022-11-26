import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from "sequelize-typescript";

import User from "./user-model";

@Table
class Token extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @Column(DataType.TEXT)
  refreshToken: string;

  @BelongsTo(() => User)
  user: User;
}

export default Token;
