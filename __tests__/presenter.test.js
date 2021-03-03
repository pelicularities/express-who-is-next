const request = require("supertest");
const app = require("../src/app");
const Jumpling = require("../src/models/jumpling.model");
const dbHandlers = require("../test/dbHandler");
const jumplings = [
  { name: "Boon Xian" },
  { name: "Grace" },
  { name: "Melvin" },
  { name: "Nix" },
];
beforeAll(async () => {
  await dbHandlers.connect();
  await Jumpling.create(jumplings);
});
afterAll(async () => {
  await dbHandlers.closeDatabase();
});

describe("/jumplings/presenter", () => {
  it("should return a random jumpling", async () => {
    const { body: randomJumpling } = await request(app)
      .get("/jumplings/presenter")
      .expect(200);
    expect(randomJumpling).toHaveProperty("_id");
    expect(randomJumpling).toHaveProperty("name");
  });
});
