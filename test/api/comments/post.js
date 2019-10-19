process.env.NODE_ENV = "test";

const mongoose = require("mongoose");

const User = require("../../../api/models/user");

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app.js");

let userId;

before(() => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "test@gmail.com",
    name: "Ishara Rathnayake",
    password: "123456",
    user_type: "Farmer"
  });
  user
    .save()
    .then(res => {
      userId = res._id;
    })
    .catch(err => {});
});

describe("POST /comments", () => {
  it("OK, creating a comment works", done => {
    request(app)
      .post("/comments")
      .send({
        postType: "PRODUCT",
        productId: "5d7e9bc809075c00040f20e7",
        userId: userId,
        content: "great product"
      })
      .expect(201)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        done();
      })
      .catch(err => done(err));
  });
});
