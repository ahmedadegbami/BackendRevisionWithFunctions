import { read } from "fs";
import fs from "fs-extra";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const { writeJSON, readJSON, writeFile, unlink } = fs;

// const dataFolderPath1 = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "../../data"
// );

const dataFolderPath = join(process.cwd(), "./src/data");
const productsJsonPath = join(dataFolderPath, "products.json");
const publicProductsFolder = join(process.cwd(), "./public/img/products");

export const getProducts = () => readJSON(productsJsonPath);

export const writeProducts = (productsArray) =>
  writeJSON(productsJsonPath, productsArray);

export const saveProductsImages = (filename, contentAsBuffer) =>
  writeFile(join(publicProductsFolder, filename), contentAsBuffer);

export const deleteProductsImages = (filename) =>
  unlink(join(publicProductsFolder, "../../", filename));
