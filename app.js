const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// body parser
app.use(express.json());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

module.exports = app;
