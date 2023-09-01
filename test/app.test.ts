import sinon from "sinon";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { NextFunction, Response, Request, response } from "express";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../controller/authController";
// import server from '../server';
import app from "../server";

chai.use(chaiHttp);

describe("Signup Function Testing", () => {
  let req: any;
  let res: Partial<Response>;

  beforeEach(() => {
    res = {};
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new user and return 200", async function () {
    this.timeout(5000);

    const newUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };

    const response = await chai.request(app).post("/signup").send(newUser);

    expect(response.status).to.equal(200);
  });

  it("should return 400 if username already exists", async () => {
    const newUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };

    const response = await chai.request(app).post("/signup").send(newUser);

    expect(response.status).to.equal(400);
  });
});

describe("Login Function Testing", async () => {
  let req: any; // Change this to match your request structure
  let res: Partial<Response>;
  let next: any; // Change this to match your NextFunction type

  beforeEach(() => {
    req = Promise<Request>;
    // res = Promise<Response>;
    next = Promise<NextFunction>;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should wait for 10 seconds", () => {
    setTimeout(() => {}, 30000);
  });

  it("should return 400 if no such username found", async function () {
    this.timeout(5000);

    const findOneStub = sinon.stub(User, "findOne").resolves(response);

    const res = await chai
      .request(app)
      .post("/login")
      .send({ name: "nonExistentUser", password: "password123" });

    expect(res.status).to.be.equals(400);
    // expect(res.body).to.deep.equal({ msg: 'No such username found' });

    const fetchedUser = sinon.assert.calledWith(findOneStub, {
      name: "nonExistentUser",
    });

    expect(fetchedUser).to.be.undefined;
  });

  it("should return 401 if invalid password", async () => {
    const user = {
      name: "dummy4",
      password: "invalidpassword",
    };

    const result1: boolean = false;

    const returnedUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };
    const findOneStub = sinon.stub(User, "findOne").resolves(returnedUser);
    const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(result1);

    const res = await chai.request(app).post("/login").send(user);

    expect(res.status).to.be.equal(401);

    sinon.assert.calledWith(findOneStub, { name: "dummy4" });
    sinon.assert.calledWith(
      bcryptCompareStub,
      user.password,
      returnedUser.password
    );

    expect(result1).to.be.equal(false);

    findOneStub.restore();
    bcryptCompareStub.restore();
  });

  it("should return 200 if username and password is valid", async function () {
    this.timeout(5000);
    const user = {
      name: "dummy4",
      password: "password",
    };

    const res = await chai.request(app).post("/login").send(user);

    expect(res.status).to.be.equal(200);
  });

  //   it("should return 200 if username and password is valid", async function () {
  //     this.timeout(5000);
  //     const user = {
  //       name: "likhit5mar",
  //       password: "pass",
  //     };

  //     // const result2: boolean = false;

  //     // const findOneStub = sinon.stub(User, "findOne").resolves(returnedUser);
  //     // const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(result2);

  //     const res = await chai.request(app).post("/login").send(user);

  //     expect(res.status).to.be.equal(200);

  //     // const result = sinon.assert.calledWith(findOneStub, { name: "dummy4" });
  //     // sinon.assert.calledWith(
  //     //   bcryptCompareStub,
  //     //   user.password,
  //     //   returnedUser.password
  //     // );
  //     // expect(result.status).to.be.equal

  //     // expect(result2).to.be.equal(false);

  //     // findOneStub.restore();
  //     // bcryptCompareStub.restore();
  //   });
});
