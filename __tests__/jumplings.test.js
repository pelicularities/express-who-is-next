const request = require("supertest");
const app = require("../src/app");
const Jumpling = require("../src/models/jumpling.model");
const dbHandlers = require("../test/dbHandler");
const createJWTToken = require("../src/utils/jwt");

describe("/jumplings", () => {
  let token;
  beforeAll(async () => {
    await dbHandlers.connect();
    token = createJWTToken("yoloauth");
  });
  afterAll(async () => {
    await dbHandlers.clearDatabase();
    await dbHandlers.closeDatabase();
  });

  it("should respond to GET with an empty array when there are no jumplings", async () => {
    const { body } = await request(app).get("/jumplings").expect(200);
    expect(body).toEqual([]);
  });

  it("should create a jumpling in response to a valid POST request", async () => {
    const newJumpling = { name: "Jumpling" };
    const { body } = await request(app)
      .post("/jumplings")
      .send(newJumpling)
      .set("Cookie", `token=${token}`)
      .expect(201);
    expect(body).toMatchObject(newJumpling);
    const { body: allJumplings } = await request(app).get("/jumplings");
    expect(allJumplings.length).toEqual(1);
  });

  it("should reject unauthorised POST requests", async () => {
    const newJumpling = { name: "Jumpling" };
    await request(app).post("/jumplings").send(newJumpling).expect(401);
  });

  it("should reject POST requests with invalid names", async () => {
    const newJumpling = { name: 12345 };
    await request(app)
      .post("/jumplings")
      .send(newJumpling)
      .set("Cookie", `token=${token}`)
      .expect(422);
  });

  it("should reject POST requests without names", async () => {
    const newJumpling = { nickname: "Joey" };
    await request(app)
      .post("/jumplings")
      .send(newJumpling)
      .set("Cookie", `token=${token}`)
      .expect(422);
  });

  it("should reject POST requests without json", async () => {
    await request(app)
      .post("/jumplings")
      .set("Cookie", `token=${token}`)
      .expect(400);
  });

  it("should GET an array of jumplings", async () => {
    const { body: arrayOfJumplings } = await request(app)
      .get("/jumplings")
      .expect(200);
    expect(Array.isArray(arrayOfJumplings)).toEqual(true);
  });

  it("should GET a single jumpling when given a /:name", async () => {
    const expectedJumpling = { name: "Jumpling" };
    const { body: actualJumpling } = await request(app)
      .get("/jumplings/Jumpling")
      .expect(200);
    expect(actualJumpling).toMatchObject(expectedJumpling);
  });

  it("should return 404 to GET requests for jumplings that don't exist", async () => {
    await request(app).get("/jumplings/3141592654").expect(404);
  });

  it("should update a jumpling in response to a valid PUT request", async () => {
    const updatedJumpling = { name: "Dumpling" };
    const {
      body: { _id: jumplingId },
    } = await request(app).get("/jumplings/Jumpling");
    const { body: actualJumpling } = await request(app)
      .put(`/jumplings/${jumplingId}`)
      .send(updatedJumpling)
      .set("Cookie", `token=${token}`)
      .expect(200);
    expect(actualJumpling).toMatchObject(updatedJumpling);

    const { body: retrievedJumpling } = await request(app)
      .get("/jumplings/Dumpling")
      .expect(200);
    expect(retrievedJumpling).toMatchObject(updatedJumpling);
  });

  it("should reject unauthorised PUT requests", async () => {
    const updatedJumpling = { name: "Dumpling" };
    const {
      body: { _id: jumplingId },
    } = await request(app).get("/jumplings/Dumpling");
    await request(app)
      .put(`/jumplings/${jumplingId}`)
      .send(updatedJumpling)
      .expect(401);
  });

  it("should not update a jumpling in response to an invalid PUT request", async () => {
    const updatedJumpling = { name: 31415 };
    const {
      body: { _id: jumplingId },
    } = await request(app).get("/jumplings/Dumpling");
    await request(app)
      .put(`/jumplings/${jumplingId}`)
      .set("Cookie", `token=${token}`)
      .send(updatedJumpling)
      .expect(422);
  });

  it("should return 404 to PUT requests for jumplings that don't exist", async () => {
    await request(app)
      .put("/jumplings/603ddcc33237ca2baa869cbd")
      .send({})
      .set("Cookie", `token=${token}`)
      .expect(404);
  });

  it("should reject PUT requests without json", async () => {
    await request(app).put("/jumplings/1").expect(400);
  });

  it("should DELETE a jumpling", async () => {
    const deletedJumpling = { name: "Dumpling" };
    const { _id: jumplingID } = await Jumpling.findOne(deletedJumpling);
    const { body: actualJumpling } = await request(app)
      .delete(`/jumplings/${jumplingID}`)
      .set("Cookie", `token=${token}`)
      .expect(200);
    expect(actualJumpling).toMatchObject(deletedJumpling);
    await request(app).get("/jumplings/Jumpling").expect(404);
  });

  it("should reject unauthorised DELETE requests", async () => {
    const deletedJumpling = await Jumpling.create({ name: "Dumpling" });
    const { _id: jumplingID } = await Jumpling.findOne(deletedJumpling);
    await request(app).delete(`/jumplings/${jumplingID}`).expect(401);
  });

  it("should return 404 to DELETE requests for jumplings that don't exist", async () => {
    await request(app)
      .delete("/jumplings/603ddcc33237ca2baa869cbd")
      .set("Cookie", `token=${token}`)
      .expect(404);
  });
});
