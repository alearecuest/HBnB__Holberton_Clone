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

describe("User API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "strongPass123"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).not.toHaveProperty("password");
    expect(res.body.email).toBe("testuser@example.com");
  });

  it("should not allow registration with invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        firstName: "Bad",
        lastName: "Email",
        email: "notanemail",
        password: "abcde23"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});