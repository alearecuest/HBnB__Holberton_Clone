import request from "supertest";
import app from "../app";
import { AppDataSource } from "../../ormconfig";

let jwt: string;
let placeId: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  await request(app).post("/api/v1/users").send({
    firstName: "Reviewer",
    lastName: "McTest",
    email: "review@example.com",
    password: "testpass3"
  });
  const resLogin = await request(app).post("/api/v1/auth/login").send({
    email: "review@example.com",
    password: "testpass3"
  });
  jwt = resLogin.body.token;

  const resPlace = await request(app)
    .post("/api/v1/places")
    .set("Authorization", `Bearer ${jwt}`)
    .send({
      title: "ReviewHouse",
      description: "Para reviews",
      price: 120,
      latitude: 1,
      longitude: 1,
    });
  placeId = resPlace.body.id;
});

afterAll(async () => {
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
});

describe("Review API", () => {
  it("should create a review when authenticated for an existing place", async () => {
    const res = await request(app)
      .post("/api/v1/reviews")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        rating: 5,
        comment: "¡Excelente!",
        placeId
      });
      console.log(res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("rating", 5);
    });

  it("should reject review creation when not authenticated", async () => {
    const res = await request(app)
      .post("/api/v1/reviews")
      .send({
        rating: 4,
        comment: "Sin login",
        placeId
      });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

  it("should list all reviews for a place", async () => {
    await request(app)
      .post("/api/v1/reviews")
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        rating: 4, 
        comment: "Otra review para verificar",
        placeId
      });
    const res = await request(app)
      .get(`/api/v1/reviews/place/${placeId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("place");
    expect(res.body[0].place.id).toBe(placeId);
  });
});