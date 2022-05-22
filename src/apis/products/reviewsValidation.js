import { checkSchema } from "express-validator";

const newReviewsSchema = {
  comment: {
    isString: {
      errorMessage: "Comment must be a string",
    },
    optional: true,
  },
  rating: {
    isInt: {
      options: {
        min: 1,
        max: 5,
      },
      errorMessage: "Rating must be a number between 1 and 5",
    },
  },
};

const reviewsUpdateSchema = {
  comment: {
    isString: {
      errorMessage: "Comment must be a string",
    },
    optional: true,
  },
  rating: {
    isInt: {
      options: {
        min: 1,
        max: 5,
      },
      errorMessage: "Rating must be a number between 1 and 5",
    },
    optional: true,
  },
};
export const checkNewReviewsSchema = checkSchema(newReviewsSchema);
export const checkReviewsUpdateSchema = checkSchema(reviewsUpdateSchema);
