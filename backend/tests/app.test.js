const request = require('supertest');

// Mocks para evitar dependências externas durante os testes
jest.mock('../config/firebaseAdmin', () => {
  const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'test-user' });

  const collection = jest.fn(() => ({
    doc: jest.fn().mockReturnThis(),
    add: jest.fn().mockResolvedValue({ id: 'doc-id' }),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ empty: true, docs: [], exists: false, data: () => ({}) })
  }));

  return {
    auth: { verifyIdToken },
    db: { collection }
  };
});

jest.mock('../config/firebaseClient', () => ({
  clientAuth: {}
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn()
}));

const app = require('../app');

describe('App', () => {
  it('responde ao health check', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.endpoints).toBeDefined();
  });

  it('retorna 404 para rotas inexistentes', async () => {
    const response = await request(app).get('/rota-inexistente');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('exige token nas rotas protegidas', async () => {
    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
