const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const bcrypt = require("bcryptjs");
const dbHandlers = require("../test/dbHandler");

beforeAll(async () => {
  await dbHandlers.connect();
});
afterAll(async () => {
  await dbHandlers.closeDatabase();
});

describe("POST /users/", () => {
  it("should create one user", async () => {
    const user = { username: "testUser", password: "testPassword" };
    const newUser = { ...user };
    const rounds = 10;
    const { body: createdUser } = await request(app)
      .post("/users/")
      .send(user)
      .expect(201);
    expect(createdUser.username).toEqual(user.username);
    expect(await bcrypt.compare(user.password, createdUser.password)).toEqual(
      true
    );
  });
});
