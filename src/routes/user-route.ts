import { Router } from "express";
import UserController from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.registration);
userRouter.post("/login", userController.login);
userRouter.post("/avatar/upload", authMiddleware, userController.uploadAvatar);
userRouter.get("/logout", userController.logout);
userRouter.get("/refresh", userController.refresh);
userRouter.get("/", authMiddleware, userController.getAll);
userRouter.get("/:id", authMiddleware, userController.getById);

export default userRouter;
