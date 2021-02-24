const request = require("supertest");
const app = require("../src/app");

beforeAll(() => {
  const jumplings = [
    { id: 1, name: "Boon Xian" },
    { id: 2, name: "Grace" },
    { id: 3, name: "Melvin" },
    { id: 4, name: "Nix" },
  ];
  jumplings.forEach(async (jumpling) => {
    await request(app).post("/jumplings").send(jumpling);
  });
});

afterAll(() => {
  [1, 2, 3, 4].forEach(async (id) => {
    await request(app).delete(`/jumplings/${id}`);
  });
});

describe("/jumplings/presenter", () => {
  it("should return a random jumpling", async () => {
    const { body: randomJumpling } = await request(app)
      .get("/jumplings/presenter")
      .expect(200);
    expect(randomJumpling).toHaveProperty("id");
    expect(randomJumpling).toHaveProperty("name");
  });
});
