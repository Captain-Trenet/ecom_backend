const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv").config();

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfully..!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Database connection failed..!");
  });

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
