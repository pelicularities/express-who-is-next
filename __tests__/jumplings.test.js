const request = require("supertest");
const app = require("../src/app");

describe("/jumplings", () => {
  it("should respond correctly to GET when there are no jumplings", async () => {
    const response = await request(app).get("/jumplings").expect(200);
    expect(response.body).toEqual([]);
  });
});
