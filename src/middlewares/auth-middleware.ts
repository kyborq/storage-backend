import { tokenService } from "../services/token-service";

export const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log(req.headers);
    if (!authorizationHeader) {
      return next("AuthHeader is missing");
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next("AccessToken is Missing");
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next("UserData is missing");
    }

    req.user = userData;
    next();
  } catch (e) {
    return next("ApiError.UnauthorizedError()");
  }
};
