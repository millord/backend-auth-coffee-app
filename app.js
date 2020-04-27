const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middlewares
app.use("/api/v1/auth", userRoutes);

// connecting to db
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connnected"));

// creating the port
const port = process.env.PORT || 8000;

// start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
