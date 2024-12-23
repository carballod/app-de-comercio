import { ProductController } from "../../application/controllers/product.controller";
import { ProductService } from "../../application/services/product.service";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import express from "express";
import { ProductMongoRepository } from "../persistence/product.mongo.repository";

const productRoutes = express.Router();
const productRepository = new ProductMongoRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRoutes.use(authMiddleware);
productRoutes.get(
  "/",
  productController.getAllProducts.bind(productController)
);
productRoutes.get(
  "/:id",
  productController.getProductById.bind(productController)
);
productRoutes.post(
  "/",
  adminMiddleware,
  productController.addProduct.bind(productController)
);
productRoutes.put(
  "/:id",
  adminMiddleware,
  productController.updateProduct.bind(productController)
);
productRoutes.delete(
  "/:id",
  adminMiddleware,
  productController.deleteProduct.bind(productController)
);

export default productRoutes;
