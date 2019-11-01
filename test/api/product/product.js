process.env.NODE_ENV = "test";

const mongoose = require("mongoose");

const expect = require("chai").expect;
const request = require("supertest");

const User = require("../../../api/models/user");
const Product = require("../../../api/models/product");

const app = require("../../../app.js");

let userId;
let productId;

before(() => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "test5@gmail.com",
    name: "Ishara Rathnayake",
    password: "123456",
    user_type: "Farmer"
  });
  user
    .save()
    .then(res => {
      userId = res._id;
      console.log(userId);
      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: "Potato",
        price: 128,
        amount: 2000,
        description:
          "Potatoes were first domesticated in the Andes in South America up to 10,000 years ago. Spanish explorers introduced them to Europe in the early 16th century.",
        location: "NuwaraEliya",
        date: new Date(),
        productImage:
          "https://cdn-prod.medicalnewstoday.com/content/images/articles/280/280579/potatoes-can-be-healthful.jpg",
        user: userId,
        timelineId: "5d921d306e96d70a28989127",
        latitude: 5.217896,
        longitude: 8.31452
      });
      product
        .save()
        .then(res => {
          productId = res._id;
          console.log(productId);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

describe("POST /products", () => {
  it("OK, new product works", done => {
    console.log(userId);
    request(app)
      .post("/products")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .set("Content-Type", "multipart/form-data")
      .field("name", "Tomato")
      .field("price", 12)
      .field("amount", 5000)
      .field("location", "Nuwaraeliya")
      .field(
        "description",
        "Potatoes were first domesticated in the Andes in South America up to 10,000 years ago. Spanish explorers introduced them to Europe in the early 16th century."
      )
      .field("userId", String(userId))
      .field("timelineId", "5d921d306e96d70a28989127")
      .field("latitude", "5.217896")
      .field("longitude", "8.31452")
      .attach(
        "productImage",
        "D:/NodeJS/node-rest-shop/uploads/1558612339690managing-redis.jpg"
      )
      .expect(201)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        expect(body).to.contain.property("userName");
        expect(body).to.contain.property("productId");
        expect(body).to.contain.property("date");
        expect(body).to.contain.property("user");
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("request");
        done();
      })
      .catch(err => done(err));
  });
});
