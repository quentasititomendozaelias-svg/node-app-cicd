const request = require('supertest');
const app = require('../src/index');

describe('API Tests', () => {
  test('GET /health - debe retornar status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('GET / - debe retornar mensaje de bienvenida', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
  });
});
