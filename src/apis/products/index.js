import express from "express";
import multer from "multer";
import {
  saveNewProduct,
  findproducts,
  findProductById,
  findproductbyIdandUpdate,
  findproductbyIdandDelete,
} from "../../lib/db/products.js";
import {
  saveNewReview,
  findReviewById,
  findReviewByIdAndUpdate,
  findReviewByIdAndDelete,
} from "../../lib/db/review.js";
import {
  checksProductsSchema,
  checksProductsUpdateSchema,
  checkValidationResult,
} from "./productsValidation.js";
import {
  checkNewReviewsSchema,
  checkReviewsUpdateSchema,
} from "./reviewsValidation.js";
import { extname } from "path";
import {
  saveProductsImages,
  deleteProductsImages,
} from "../../lib/fs/tools.js";
import createError from "http-errors";
import { validationResult } from "express-validator";

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
    const product = await findProductById(req.params.productId);

    await deleteProductsImages(product.imageUrl);

    await findproductbyIdandDelete(req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/:productId/image",
  multer({
    limits: 1 * 1024 * 1024,
    fileFilter: (req, file, next) => {
      if (file.mimetype !== "image/gif" && file.mimetype !== "image/jpeg") {
        next(createError(400, "Only GIF allowed!"));
      } else {
        next(null, true);
      }
    },
  }).single("productPicture"),
  async (req, res, next) => {
    try {
      // save file in public folder (name will be something like op1k23pk123p21k3.gif)
      const fileName = req.params.productId + extname(req.file.originalname);
      await saveProductsImages(fileName, req.file.buffer);

      // update the product record with the image url
      const updatedProduct = await findproductbyIdandUpdate(
        req.params.productId,
        { imageUrl: "/img/products/" + fileName }
      );
      res.send(updatedProduct);
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

productsRouter.put(
  "/:productId/review/:reviewId",
  checkReviewsUpdateSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const updatedReview = await findReviewByIdAndUpdate(
        req.params.productId,
        req.params.reviewId,
        req.body
      );
      res.send(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete(
  "/:productId/review/:reviewId",
  async (req, res, next) => {
    try {
      const reviews = await findReviewByIdAndDelete(
        req.params.productId,
        req.params.reviewId
      );
      res.send(reviews);
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
