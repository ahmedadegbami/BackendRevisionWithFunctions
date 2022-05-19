import express from "express";
import multer from "multer";
import {
  saveNewProduct,
  findproducts,
  findProductById,
  findproductbyIdandUpdate,
  findproductbyIdandDelete,
} from "../../lib/db/products.js";
import { saveNewReview, findReviewById } from "../../lib/db/review.js";
import {
  checksProductsSchema,
  checksProductsUpdateSchema,
  checkValidationResult,
} from "./productsValidation.js";
import { checkNewReviewsSchema } from "./reviewsValidation.js";

const productsRouter = express.Router();

productsRouter.post(
  "/",
  checksProductsSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newProduct = await saveNewProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await findproducts();
    if (req.query && req.query.category) {
      const filteredProducts = products.filter(
        (product) => product.category === req.query.category
      );
      res.send(filteredProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productsRouter.put(
  "/:productId",
  checksProductsUpdateSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const updatedProduct = await findproductbyIdandUpdate(
        req.params.productId,
        req.body
      );
      res.send(updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    await findproductbyIdandDelete(req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/:productId/image",
  multer().single(),
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.post(
  "/:productId/review",
  checkNewReviewsSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const newReview = await saveNewReview(req.params.productId, req.body);
      res.status(201).send(newReview);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/:productId/review", async (req, res, next) => {
  try {
    const product = await findProductById(req.params.productId);
    res.send(product.reviews);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/review/:reviewId", async (req, res, next) => {
  try {
    const review = await findReviewById(
      req.params.productId,
      req.params.reviewId
    );
    res.send(review);
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId/review/:reviewId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

productsRouter.delete(
  "/:productId/review/:reviewId",
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
