const request = require('supertest');
const app = require('../server'); // make sure server.js exports the app

describe('Auth Routes', () => {
  it('should return 400 if fields are missing', async () => {
    const res = await request(app).post('/api/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('All fields are required');
  });
});
