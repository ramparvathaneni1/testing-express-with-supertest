const request = require("supertest");
const { app, server } = require("../app");

describe("Test all API paths", () => {
  test("It should respond with 'Hello World!'", async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Hello World!");
    expect(response.statusCode).toBe(200);
  });

  test("It should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "John Doe", email: "john.doe@example.com" });
    expect(response.body).toEqual({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  test("It should update a user", async () => {
    const response = await request(app).put("/users/123").send({
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });
    expect(response.body).toEqual({
      id: "123",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });
    expect(response.statusCode).toBe(200);
  });

  test("It should delete a user", async () => {
    const response = await request(app).delete("/users/123");
    expect(response.body).toEqual({ id: "123" });
    expect(response.statusCode).toBe(200);
  });
});

afterAll((done) => {
  // Closing the connection allows Jest to exit successfully.
  server.close();
  done();
});
