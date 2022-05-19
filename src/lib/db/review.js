import { getProducts, writeProducts } from "../fs/tools.js";
import createError from "http-errors";
import { findProductById } from "./products.js";
import uniqid from "uniqid";

export const saveNewReview = async (productId, newReviewData) => {
  const products = await getProducts();
  const foundproduct = products.findIndex(
    (product) => product.id === productId
  );
  if (foundproduct !== -1) {
    products[foundproduct].reviews.push({
      ...newReviewData,
      id: uniqid(),
      createdAt: new Date(),
    });
    await writeProducts(products);
    return products[foundproduct];
  } else {
    throw createError(404, `Product with id ${productId} not found`);
  }
};

export const findReviewById = async (productId, reviewId) => {
  const product = await findProductById(productId);
  const foundReview = product.reviews.find((review) => review.id === reviewId);
  if (foundReview) {
    return foundReview;
  }
  throw createError(404, `Review with id ${reviewId} not found`);
};
