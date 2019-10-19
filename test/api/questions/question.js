process.env.NODE_ENV = "test";

const mongoose = require("mongoose");

const expect = require("chai").expect;
const request = require("supertest");

const User = require("../../../api/models/user");
const Question = require("../../../api/models/question");

const app = require("../../../app.js");

let userId;
let questionId;

before(() => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "test3@gmail.com",
    name: "Ishara Rathnayake",
    password: "123456",
    user_type: "Farmer"
  });
  user
    .save()
    .then(res => {
      userId = res._id;
      const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        question: "what are the most effective pesticides for bed bugs?",
        description: "Lorem ipsum dolor sit",
        hashtags: ["pestiside", "bed bugs", "paddy"],
        date: new Date(),
        user: userId
      });
      question
        .save()
        .then(res => {
          questionId = res._id;
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

describe("POST /questions", () => {
  it("OK, new question works", done => {
    request(app)
      .post("/questions")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .send({
        question: "what are the most effective pesticides for bed bugs?",
        description: "Lorem ipsum dolor sit",
        hashtags: ["pestiside", "bed bugs", "paddy"],
        userId: userId
      })
      .expect(201)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        expect(body).to.contain.property("createdQusetion");
        expect(body).to.contain.property("request");
        done();
      })
      .catch(err => done(err));
  });
});

describe("GET /questions", () => {
  it("OK, get all questions works", done => {
    request(app)
      .get("/questions")
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("count");
        expect(body).to.contain.property("questions");
        done();
      })
      .catch(err => done(err));
  });
});

describe("GET /questions/:questionId", () => {
  it("OK, get all questions works", done => {
    request(app)
      .get("/questions/" + questionId)
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("question");
        expect(body).to.contain.property("request");
        done();
      })
      .catch(err => done(err));
  });
});

describe("GET /questions/search/:searchText", () => {
  it("OK, search questions works", done => {
    request(app)
      .get("/questions/search/pestiside")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("count");
        expect(body).to.contain.property("questions");
        done();
      })
      .catch(err => done(err));
  });
});

describe("GET /questions/byUser/:userId", () => {
  it("OK, get questions by user id works", done => {
    request(app)
      .get("/questions/byUser/" + userId)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("count");
        expect(body).to.contain.property("questions");
        done();
      })
      .catch(err => done(err));
  });
});

describe("PATCH /questions/:questionId", () => {
  it("OK, update question works", done => {
    request(app)
      .patch("/questions/" + questionId)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .send({
        hashtags: ["pestiside", "bed_bugs", "tomato"]
      })
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        expect(body).to.contain.property("request");
        done();
      })
      .catch(err => done(err));
  });
});

describe("PATCH /questions/answer/:questionId", () => {
  it("OK, increase answer count works", done => {
    request(app)
      .patch("/questions/answer/" + questionId)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        done();
      })
      .catch(err => done(err));
  });
});

describe("DELETE /questions/:questionId", () => {
  it("OK, delete question works", done => {
    request(app)
      .delete("/questions/" + questionId + "/" + userId)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFyYTExcmF0aG5heWFrZUBnbWFpbC5jb20iLCJ1c2VySWQiOiI1ZDdkZTkyNjAxM2NjMjAwMDQ0MTEwZDAiLCJpYXQiOjE1Njg3MDU4OTAsImV4cCI6MTU3Mzg4OTg5MH0.oKAE5e7ZzIV-ZWdpBKWoCwupFXgXp7nYCS7ceHCgVWI"
      )
      .expect(200)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        expect(body).to.contain.property("request");
        done();
      })
      .catch(err => done(err));
  });
});
