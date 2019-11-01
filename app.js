require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const likeRoutes = require("./api/routes/likes");
const commentRoutes = require("./api/routes/comments");
const questionRoutes = require("./api/routes/questions");
const advertisementRoutes = require("./api/routes/advertisements");
const ratingRoutes = require("./api/routes/rating");
const complaintRoutes = require("./api/routes/complaints");
const articleRoutes = require("./api/routes/articles");
const timelineRoutes = require("./api/routes/timelines");

const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);

if (process.env.NODE_ENV === "test") {
  mockgoose.helper
    .reset()
    .then(() => {
      console.log("Db is erased");
    })
    .catch(err => {
      console.log("db is errrors", err);
      if (err) t.fail("Unable to reset test database");
    });

  mockgoose.prepareStorage().then(() => {
    mongoose
      .connect(
        "mongodb+srv://ishara11rathnayake:" +
          process.env.MONGO_ATLAS_PW +
          "@node-shop-socjh.mongodb.net/test?retryWrites=true",
        { useNewUrlParser: true, useCreateIndex: true }
      )
      .then(() => {
        console.log("Db is connected");
      })
      .catch(err => {
        console.log("db is errrors", err);
      });
  });
} else {
  mongoose
    .connect(
      "mongodb+srv://ishara11rathnayake:" +
        process.env.MONGO_ATLAS_PW +
        "@node-shop-socjh.mongodb.net/test?retryWrites=true",
      { useNewUrlParser: true, useCreateIndex: true }
    )
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch(err => {
      console.log(err);
    });
}
// mongoose.set("useCreateIndex", true);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/questions", questionRoutes);
app.use("/advertisements", advertisementRoutes);
app.use("/ratings", ratingRoutes);
app.use("/complaints", complaintRoutes);
app.use("/articles", articleRoutes);
app.use("/timelines", timelineRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
