import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";
import { findProductBySKU } from "../../lib/db/products.js";

const productsSchema = {
  description: {
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  name: {
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  brand: {
    isString: {
      errorMessage: "Brand must be a string",
    },
  },
  price: {
    isNumeric: {
      errorMessage: "Price must be a number",
    },
  },
  category: {
    isIn: {
      options: [["electronic", "cloth", "food"]],
      errorMessage:
        "Category must be one of the following: electronic, cloth, food",
    },
  },
  sku: {
    custom: {
      options: async (value) => {
        try {
          const product = await findProductBySKU(value);
          if (product) return Promise.reject("SKU already in use");
          else return product;
        } catch (error) {
          console.log(error);
        }
      },
    },
  },
};

const productsUpdateSchema = {
  description: {
    isString: {
      errorMessage: "Description must be a string",
    },
    optional: true,
  },
  name: {
    isString: {
      errorMessage: "Name must be a string",
    },
    optional: true,
  },
  brand: {
    isString: {
      errorMessage: "Brand must be a string",
    },
    optional: true,
  },
  price: {
    isNumeric: {
      errorMessage: "Price must be a number",
    },
    optional: true,
  },
  category: {
    isIn: {
      options: [["electronic", "cloth", "food"]],
      errorMessage:
        "Category must be one of the following: electronic, cloth, food",
    },
    optional: true,
  },
};

export const checksProductsSchema = checkSchema(productsSchema);

export const checksProductsUpdateSchema = checkSchema(productsUpdateSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      createError(400, `validation errors!`, { errorsList: errors.array() })
    );
  } else {
    next();
  }
};
