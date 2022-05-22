import createError from "http-errors";
import uniqid from "uniqid";
import { getProducts, writeProducts } from "../fs/tools.js";

export const saveNewProduct = async (newproductData) => {
  const products = await getProducts();
  const newProduct = {
    ...newproductData,
    id: uniqid(),
    createdAt: new Date(),
    reviews: [],
  };
  products.push(newProduct);
  await writeProducts(products);
  return newProduct;
};

export const findproducts = () => getProducts();

export const findProductById = async (productId) => {
  const products = await getProducts();
  const foundproduct = products.find((product) => product.id === productId);
  if (foundproduct) {
    return foundproduct;
  } else {
    throw createError(404, `Product with id ${productId} not found`);
  }
};

export const findproductbyIdandUpdate = async (productId, updatedProduct) => {
  const products = await getProducts();
  const foundproduct = products.findIndex(
    (product) => product.id === productId
  );
  if (foundproduct !== -1) {
    products[foundproduct] = {
      ...products[foundproduct],
      ...updatedProduct,
      updatedAt: new Date(),
    };
    await writeProducts(products);
    return products[foundproduct];
  } else {
    throw createError(404, `Product with id ${productId} not found`);
  }
};

export const findproductbyIdandDelete = async (productId) => {
  const products = await getProducts();
  const remproducts = products.filter((product) => product.id !== productId);
  if (products.length === remproducts.length) {
    throw createError(404, `Product with id ${productId} not found`);
  } else {
    await writeProducts(remproducts);
  }
};

// THIS DONE TO CHECK IF A VALUE EXISTS IN THE DATABASE
export const findProductBySKU = async (sku) => {
  const products = await getProducts();

  const foundProduct = products.find((product) => product.sku === sku);

  if (foundProduct) return foundProduct;
  else throw createError(404, `Product with id ${sku} not found!`);
};
