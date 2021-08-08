const request = require("supertest");
const server = require("../build/setup.js").app;

//providevalid credentials for test case 1
describe("Authentication Endpoints", () => {
  it("unauthorized app user", async () => {
    const res = await request(server).post("/authService/startSession").send({
      sapNo: "a241456",
      password: "1111",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual(false);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("You are not authorized to use this app");
  });
  // it('invalid user session', async () => {
  //   const res = await request(server)
  //     .post('/authService/startSession')
  //     .send({
  //       sapNo: 'a241092',
  //       password: '1111',
  //     })
  //   expect(res.statusCode).toEqual(200)
  //   expect(res.body.status).toEqual(false)
  //   expect(res.body).toHaveProperty('message')
  //   expect(res.body.message).toEqual('Invalid login details provided')
  // })
  // it('Missing request parameters', async () => {
  //   const res = await request(server)
  //     .post('/authService/startSession')
  //     .send({
  //       sapNo: '',
  //       password: '',
  //     })
  //   expect(res.statusCode).toEqual(400)
  //   expect(res.body.status).toEqual(false)
  //   expect(res.body).toHaveProperty('message')
  //   expect(res.body.message).toEqual("Service request failed")
  //   expect(res.body).toHaveProperty('errorLevel')
  //   expect(res.body.errorLevel).toEqual("validation")
  // })
  it("proper user session", async () => {
    const res = await request(server).post("/authService/startSession").send({
      sapNo: "A241092",
      password: "123456",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual(true);
    expect(res.body).toHaveProperty("authtoken");
  });
});
