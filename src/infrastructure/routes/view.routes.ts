import express from "express";
import { ViewController } from "../../application/controllers/view.controller";
import { ProductService } from "../../application/services/product.service";
import { OrderService } from "../../application/services/order.service";
import { ProductJsonRepository } from "../../models/persistence/product.json.repository";
import { OrderJsonRepository } from "../../models/persistence/order.json.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { UserService } from "../../application/services/user.service";
import { UserJsonRepository } from "../../models/persistence/user.json.repository";
import { OrderDetailService } from "../../application/services/order-detail.service";

const viewRoutes = express.Router();
const userRepository = new UserJsonRepository();
const productRepository = new ProductJsonRepository();
const orderRepository = new OrderJsonRepository();
const productService = new ProductService(productRepository);
const orderService = new OrderService(orderRepository);
const userService = new UserService(userRepository);
const orderDetailService = new OrderDetailService(orderService, userService, productService);
const viewController = new ViewController(productService, orderService, userService, orderDetailService);
viewRoutes.use(authMiddleware);

viewRoutes.get("/", (req, res) => {
    console.log(res.locals.user);
  if (res.locals.user) {
    viewController.renderWelcome(req, res);
  } else {
    res.redirect('/login');
  }
});

viewRoutes.get("/login", (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    viewController.renderLogin(req, res);
  }
});

viewRoutes.get("/register", viewController.renderRegister.bind(viewController));
viewRoutes.get("/reset-password", viewController.renderResetPassword.bind(viewController));

viewRoutes.get("/products", viewController.renderProductList.bind(viewController));
viewRoutes.get("/products/new", adminMiddleware, viewController.renderProductForm.bind(viewController));
viewRoutes.get("/products/:id/edit", adminMiddleware, viewController.renderEditProductForm.bind(viewController));
viewRoutes.get("/products/:id", viewController.renderProductDetails.bind(viewController));
viewRoutes.get("/orders", viewController.renderOrderList);
viewRoutes.get("/orders/:id/edit", adminMiddleware, viewController.renderEditOrder.bind(viewController));

viewRoutes.get("/users", adminMiddleware, viewController.renderUserList.bind(viewController));
viewRoutes.get("/users/:id/edit", adminMiddleware, viewController.renderEditUser.bind(viewController));

export default viewRoutes;
