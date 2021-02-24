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
    const { body } = await request(app)
      .post("/jumplings")
      .send(newJumpling)
      .expect(422);
  });

  it("should reject POST requests without names", async () => {
    const newJumpling = { nickname: "Joey" };
    const { body } = await request(app)
      .post("/jumplings")
      .send(newJumpling)
      .expect(422);
  });

  it("should reject POST requests without json", async () => {
    const response = await request(app).post("/jumplings").expect(400);
  });

  it("should GET a single jumpling", async () => {
    const expectedJumpling = { id: 1, name: "Jumpling" };
    const { body: actualJumpling } = await request(app)
      .get("/jumplings/1")
      .expect(200);
    expect(actualJumpling).toEqual(expectedJumpling);
  });
});
