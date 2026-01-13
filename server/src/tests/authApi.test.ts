import request from "supertest";
import app from "../app";
import { AppDataSource } from "../ormconfig";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
});

describe("Auth API", () => {
  it("should login a registered user and return JWT", async () => {
    await request(app).post("/api/v1/users").send({
      firstName: "Log",
      lastName: "InUser",
      email: "login@example.com",
      password: "testpass1"
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@example.com",
      password: "testpass1"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should not login with incorrect password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@example.com",
      password: "badpass"
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});