import bcrypt from "bcrypt";

import User from "../models/user-model";
import { tokenService } from "./token-service";

class UserService {
  async registation(login: string, password: string) {
    const existing = await User.findOne({
      where: { login },
    });

    if (existing) {
      throw "Пользователь существует";
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const user = await User.create({ login, password: hashPassword });
    const tokens = tokenService.generateTokens({
      id: user.id,
      login: user.login,
    });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: { id: user.id, login: user.login } };
  }

  async login(login: string, password: string) {
    const existing = await User.findOne({
      where: { login },
    });

    if (!existing) {
      throw "Пользователь не найден";
    }

    const isPasswordCorrect = await bcrypt.compare(password, existing.password);
    if (!isPasswordCorrect) {
      throw "Неверный пароль";
    }

    const user = { id: existing.id, login: existing.login };
    const tokens = tokenService.generateTokens({ ...user });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, user: user };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw "Вы не авторизованы";
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw "Вы не авторизованы";
    }

    const user = await User.findOne({
      where: userData["id"],
    });
    const tokens = tokenService.generateTokens({
      id: user.id,
      login: user.login,
    });

    await tokenService.saveToken(user.id, tokens.refreshToken);
    return { ...tokens, user: { id: user.id, login: user.login } };
  }

  async getAll() {
    const users = await User.findAll();
    return users;
  }

  async getUser(id: number) {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    return user;
  }
}

export const userService = new UserService();

export default UserService;
