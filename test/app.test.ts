import sinon from "sinon";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { NextFunction, Response, Request, response } from "express";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../server";
import sinonChai from "sinon-chai";

chai.use(chaiHttp);
chai.use(sinonChai);

describe("Signup Function Testing", () => {
  let req: any;
  let res: Partial<Response>;

  before(async() => {
    // await User.deleteMany({});
    res = {};
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new user and return 200", async function () {

    // this.timeout(100000);

    const newUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };

    const findOneStub = sinon.stub(User,"findOne").resolves(null);
    const saveStub = sinon.stub(User,"create").resolves();
    const response = await chai.request(app).post("/signup").send(newUser);

    expect(response.status).to.be.equal(200);
    expect(findOneStub).to.have.been.calledWith({name : "dummy4"});
    expect(saveStub).to.have.been.calledWith();
  });

  it("should return 400 if username already exists", async () => {
    const newUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };

    const saveStub = sinon.stub(User,"create").resolves();

    const findOneStub = sinon.stub(User,"findOne").resolves(newUser)
    const response = await chai.request(app).post("/signup").send(newUser);

    expect(response.status).to.be.equal(400);
    expect(findOneStub).to.have.been.calledWith({name : "dummy4"});

    expect(saveStub).not.to.have.been.calledWith();
  });
});

describe("Login Function Testing", async () => {
  let req: any;
  let res: Partial<Response>;
  let next: any;

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
    expect(res.body).to.deep.equal({ msg: 'No such username found' });

    const fetchedUser = sinon.assert.calledWith(findOneStub, {
      name: "nonExistentUser",
    });

    expect(findOneStub).to.have.been.calledWith({name : "nonExistentUser"});
    expect(fetchedUser).to.be.undefined;
  });

  it("should return 401 if invalid password", async () => {
    const user = {
      name: "dummy4",
      password: "invalidpassword",
    };

    const returnedUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };
    const findOneStub = sinon.stub(User, "findOne").resolves(returnedUser);
    const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(false);

    const res = await chai.request(app).post("/login").send(user);

    expect(res.status).to.be.equal(401);
    expect(findOneStub).to.have.been.calledWith({name : "dummy4"});
    bcryptCompareStub.restore();
  });

  it("should return 200 if username and password are valid", async function () {
    // this.timeout(5000);
    const user = {
      name: "dummy4",
      password: "password",
    };

    const returnedUser = {
      name: "dummy4",
      mobile_no: 9445582495,
      _id: "asjdkf;kals;df",
      password: "password",
      emp_code: "i1",
      blood_grp: "O+ve",
    };

    const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(true);
    const findOneStub = sinon.stub(User, "findOne").resolves(returnedUser);
    // const jwtVerifyStub = sinon.stub(generateAccessToken, "verify").resolves(null);

    const res = await chai.request(app).post("/login").send(user);

    expect(findOneStub).to.have.been.calledWith({ name: "dummy4" });
    expect(res.status).to.be.equal(200);
  });
});
