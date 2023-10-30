import request from "supertest";
import app from "../app.mjs";

describe("POST /new", () => {
  describe("When the request is valid", () => {
    // should save new appointment
    // should return json object with id from the database
    // should return 200 status code
    test("should save new appointment", async () => {
      const tomorrow = new Date();
      const date = tomorrow.getTime();

      const response = await request(app)
        .post("/meet/new")
        .send({
          meetName: "Test",
          dates: [date],
          startTime: "10:00",
          endTime: "11:00",
        });
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

describe("GET /meet/:id", () => {
  test("Valid meet id", async () => {
    const response = await request(app).get("/meet/tQAryTT");
    expect(response.statusCode).toBe(200);
  });
  test("Not valid meet id", async () => {
    const response = await request(app).get("/meet/doesntexist");
    expect(response.statusCode).toBe(400);
  });
});

describe("POST /meet/:id", () => {
  test("Date data are valid", async () => {
    const response = await request(app)
      .post("/meet/tQAryTT")
      .send({
        username: "Test",
        dates: [{ date: new Date().getTime(), isOnline: true }],
      });
    expect(response.statusCode).toBe(200);
  });
  test("Date is not valid", async () => {
    const response = await request(app)
      .post("/meet/tQAryTT")
      .send({
        username: "Test",
        dates: [{ date: new Date() }],
      });
    expect(response.statusCode).toBe(400);
  });
});
