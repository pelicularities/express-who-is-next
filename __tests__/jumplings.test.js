const request = require("supertest");
const app = require("../src/app");

describe("/jumplings", () => {
  it("should respond correctly to GET when there are no jumplings", async () => {
    const { body } = await request(app).get("/jumplings").expect(200);
    expect(body).toEqual([]);
  });

  it("should respond correctly to POST with valid json", async () => {
    const newJumpling = { name: "Jumpling" };
    const { body } = await request(app)
      .post("/jumplings")
      .send(newJumpling)
      .expect(201);
    expect(body).toMatchObject(newJumpling);
    const { body: allJumplings } = await request(app).get("/jumplings");
    expect(allJumplings.length).toEqual(1);
  });

  it("should reject POST requests with invalid names", async () => {
    const newJumpling = { name: 12345 };
    await request(app).post("/jumplings").send(newJumpling).expect(422);
  });

  it("should reject POST requests without names", async () => {
    const newJumpling = { nickname: "Joey" };
    await request(app).post("/jumplings").send(newJumpling).expect(422);
  });

  it("should reject POST requests without json", async () => {
    await request(app).post("/jumplings").expect(400);
  });

  it("should GET a single jumpling", async () => {
    const expectedJumpling = { id: 1, name: "Jumpling" };
    const { body: actualJumpling } = await request(app)
      .get("/jumplings/Jumpling")
      .expect(200);
    expect(actualJumpling).toEqual(expectedJumpling);
  });

  it("should return 404 to GET requests for jumplings that don't exist", async () => {
    await request(app).get("/jumplings/3141592654").expect(404);
  });

  it("should update a jumpling in response to a valid PUT request", async () => {
    const updatedJumpling = { name: "Dumpling" };
    const { body: actualJumpling } = await request(app)
      .put("/jumplings/1")
      .send(updatedJumpling)
      .expect(200);
    expect(actualJumpling).toMatchObject(updatedJumpling);

    const { body: retrievedJumpling } = await request(app)
      .get("/jumplings/Dumpling")
      .expect(200);
    expect(retrievedJumpling).toMatchObject(updatedJumpling);
  });

  it("should not update a jumpling in response to an invalid PUT request", async () => {
    const updatedJumpling = { name: 31415 };
    await request(app).put("/jumplings/1").send(updatedJumpling).expect(422);
  });

  it("should return 404 to PUT requests for jumplings that don't exist", async () => {
    await request(app).put("/jumplings/3141592654").send({}).expect(404);
  });

  it("should reject PUT requests without json", async () => {
    await request(app).put("/jumplings/1").expect(400);
  });

  it("should DELETE a jumpling", async () => {
    const deletedJumpling = { name: "Dumpling" };
    const { body: actualJumpling } = await request(app)
      .delete("/jumplings/1")
      .expect(200);
    expect(actualJumpling).toMatchObject(deletedJumpling);
    await request(app).get("/jumplings/Jumpling").expect(404);
  });

  it("should return 404 to DELETE requests for jumplings that don't exist", async () => {
    await request(app).delete("/jumplings/3141592654").expect(404);
  });
});
