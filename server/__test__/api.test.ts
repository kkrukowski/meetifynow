import request from "supertest";
import app from "../app";

describe("POST /new", () => {
  describe("When the request is valid", () => {
    // should save new appointment
    // should return json object with id from the database
    // should return 200 status code
    test("should save new appointment", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await request(app)
        .post("/meet/new")
        .send({
          name: "Test",
          availableDates: [tomorrow],
        });
      console.warn(response.body);
      expect(response.statusCode).toBe(200);
    });
  });
  describe("When date is missing", () => {
    // should return 400 status code
    // should return error message
    test("should return 404", async () => {
      const response = await request(app).post("/meet/new").send({
        name: "Test",
      });
      expect(response.statusCode).toBe(400);
    });
  });
  describe("When date is invalid", () => {
    // should return 400 status code
    // should return error message
    test("should return 404", async () => {
      const response = await request(app)
        .post("/meet/new")
        .send({
          name: "Test",
          availableDates: ["invalid date"],
        });
      expect(response.statusCode).toBe(400);
    });
  });
  describe("When name is missing", () => {
    // should return 400 status code
    // should return error message
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    test("should return 404", async () => {
      const response = await request(app)
        .post("/meet/new")
        .send({
          availableDates: [tomorrow],
        });
      expect(response.statusCode).toBe(400);
    });
  });
});
