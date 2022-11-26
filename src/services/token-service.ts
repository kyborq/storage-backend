import { verify, sign } from "jsonwebtoken";

import Token from "../models/token-model";

class TokenService {
  generateTokens(payload: string | object | Buffer) {
    const accessToken = sign(payload, "JWT_ACCESS_SECRET", {
      expiresIn: "30m",
    });

    const refreshToken = sign(payload, "JWT_REFRESH_SECRET", {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = verify(token, "JWT_ACCESS_SECRET");
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, "JWT_REFRESH_SECRET");
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await Token.findOne({
      where: {
        userId,
      },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await Token.create({
      userId,
      refreshToken,
    });

    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await Token.destroy({
      where: {
        refreshToken,
      },
    });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({
      where: {
        refreshToken,
      },
    });
    return tokenData;
  }
}

export const tokenService = new TokenService();

export default TokenService;
