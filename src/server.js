import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./apis/products/index.js";
import cors from "cors";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js";

const server = express();

const port = 3002;

//*************** MIDDLEWARE ***************//
server.use(cors());
server.use(express.json());

//*************** ENDPOINTS ***************//
server.use("/products", productsRouter);

//*************** ERRORHANDLER ***************//

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericServerErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
