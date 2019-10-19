process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../../app.js");

// before(done => {});

describe("POST /user/signup", () => {
  it("OK, signup works", done => {
    request(app)
      .post("/user/signup")
      .send({
        email: "kasunthenne@gmail.com",
        name: "Kasun Thennakoon",
        password: "1234Qwer#",
        user_type: "Buyer"
      })
      .expect(201)
      .then(res => {
        const body = res.body;
        expect(body).to.contain.property("message");
        expect(body).to.contain.property("userId");
        expect(body).to.contain.property("userType");
        expect(body).to.contain.property("name");
        expect(body).to.contain.property("token");
        done();
      })
      .catch(err => done(err));
  });
});
