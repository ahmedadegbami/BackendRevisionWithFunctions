import { read } from "fs";
import fs from "fs-extra";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const { writeJson, readJSON, writeFile, unlink } = fs;

// const dataFolderPath1 = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "../../data"
// );

const dataFolderPath = join(process.cwd(), "./src/data");
const productsJsonPath = join(dataFolderPath, "products.json");

export const getProducts = () => readJSON(productsJsonPath);

export const writeProducts = (productsArray) =>
  writeJson(productsJsonPath, productsArray);
