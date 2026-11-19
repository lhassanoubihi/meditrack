const request = require('supertest');
const app = require('../src/server');

describe('Health Check API', () => {
  it('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('MediTrack API');
  });
});
