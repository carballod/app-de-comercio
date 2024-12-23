import express from "express";
import { UserController } from "../../application/controllers/user.controller";
import { UserService } from "../../application/services/user.service";
import { AuthService } from "../../application/services/auth.service";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { UserMongoRepository } from "../persistence/user.mongo.repository";

const userRoutes = express.Router();
const userRepository = new UserMongoRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);
const userController = new UserController(userService, authService);

userRoutes.post("/login", userController.login);
userRoutes.post("/", userController.register);  
userRoutes.post("/reset-password", userController.resetPassword);
userRoutes.post("/logout", userController.logout);

userRoutes.use(adminMiddleware);
userRoutes.get("/", userController.getAllUsers);
userRoutes.get("/:id", userController.getUserById);
userRoutes.put("/:id", userController.updateUser);
userRoutes.delete("/:id", userController.deleteUser);

export default userRoutes;
