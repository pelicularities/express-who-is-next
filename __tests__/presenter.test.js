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
});
beforeEach(async () => {
  await Jumpling.create(jumplings);
});
afterEach(async () => {
  await dbHandlers.clearDatabase();
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
  it("should return each jumpling an equal number of times", async () => {
    const history = {};
    for (let i = 0; i < jumplings.length; i++) {
      const { body: randomJumpling } = await request(app).get(
        "/jumplings/presenter"
      );
      if (history[randomJumpling.name]) {
        history[randomJumpling.name]++;
      } else {
        history[randomJumpling.name] = 1;
      }
    }
    const occurrences = Object.values(history);
    expect(occurrences[0]).toEqual(occurrences[occurrences.length - 1]);
  });
  it("should return each jumpling an equal number of times even when jumplings are called more than once", async () => {
    const history = {};
    for (let i = 0; i < jumplings.length * 3; i++) {
      const { body: randomJumpling } = await request(app).get(
        "/jumplings/presenter"
      );
      if (history[randomJumpling.name]) {
        history[randomJumpling.name]++;
      } else {
        history[randomJumpling.name] = 1;
      }
    }
    const occurrences = Object.values(history);
    expect(occurrences[0]).toEqual(occurrences[occurrences.length - 1]);
  });
});
