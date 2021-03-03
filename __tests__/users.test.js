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
    const { body: createdUser } = await request(app)
      .post("/users/")
      .send(user)
      .expect(201);
    expect(createdUser.username).toEqual(user.username);
    expect(await bcrypt.compare(user.password, createdUser.password)).toEqual(
      true
    );
  });
  it("should not allow a second user to be created with the same username", async () => {
    const user = { username: "testUser", password: "testPassword2" };
    await request(app).post("/users/").send(user).expect(422);
  });
  it("should throw an error without a valid username (includes invalid symbols)", async () => {
    const user = { username: 123, password: "testPassword3" };
    await request(app).post("/users/").send(user).expect(422);
  });
  it("should throw an error without a valid username (too short)", async () => {
    const user = { username: "yo", password: "testPassword3" };
    await request(app).post("/users/").send(user).expect(422);
  });
  it("should throw an error without a valid password (too short)", async () => {
    const user = { username: "testUser2", password: "1234567" };
    await request(app).post("/users/").send(user).expect(422);
  });
});
