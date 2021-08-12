const request = require("supertest");
const app = require("../app");

/*
describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(500);
  });
});*/

describe("Test Single File Upload.", () => {
  test("Teste apload txt", async () => {
    console.log(`${__dirname}/upload.txt`);
    const response = await request(app)
      .post("/upload")
      .type("multipart/form-data")
      .attach("uploaded_file", `${__dirname}/upload.txt`)
      .field(
        "token",
        ""
      );
    expect(response.statusCode).toBe(200);
  });
});
