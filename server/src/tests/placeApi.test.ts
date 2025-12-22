import request from "supertest";
import app from "../app";
import { AppDataSource } from "../../ormconfig";

let jwt: string;

beforeAll(async () => {
  await AppDataSource.initialize();
  await request(app).post("/api/v1/users").send({
    firstName: "Place",
    lastName: "Creator",
    email: "place@example.com",
    password: "testpass2"
  });
  const res = await request(app).post("/api/v1/auth/login").send({
    email: "place@example.com",
    password: "testpass2"
  });
  jwt = res.body.token;
});

afterAll(async () => {
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
});

describe("Place API", () => {
  it("should create a new place when authenticated", async () => {
    const res = await request(app)
      .post("/api/v1/places")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        title: "Casa test",
        description: "Casa para test",
        price: 100,
        latitude: -34.6,
        longitude: -58.4,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Casa test");
  });

  it("should reject place creation when not authenticated", async () => {
    const res = await request(app)
      .post("/api/v1/places")
      .send({
        title: "Rechazada",
        description: "No auth",
        price: 105,
        latitude: 0,
        longitude: 0,
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});