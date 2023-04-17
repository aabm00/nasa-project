const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("it should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "ZTM155",
    rocket: "ZTM Experimental IS1",
    target: "Kepler-186 f",
    launchDate: "July 18, 2032",
  };

  const launchDataWithoutDate = {
    mission: "ZTM155",
    rocket: "ZTM Experimental IS1",
    target: "Kepler-186 f",
  };

  const launchDataWithInvalidDate = {
    mission: "ZTM155",
    rocket: "ZTM Experimental IS1",
    target: "Kepler-186 f",
    launchDate: "Hello",
  };

  test("it should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("it should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("it should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
