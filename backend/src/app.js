const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares');

const app = express();

// ===== MIDDLEWARES GLOBAIS =====

// CORS - Permitir requisições do frontend
app.use(cors(config.cors));

// Body parser - Parsear JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (desenvolvimento)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// ===== ROTAS =====

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API - Expense Tracker',
    version: '2.0.0',
    status: 'online',
    documentation: '/api',
  });
});

// Todas as rotas da API com prefixo /api
app.use('/api', routes);

// ===== TRATAMENTO DE ERROS =====

// 404 - Rota não encontrada (DEVE vir antes do errorHandler)
app.use(notFoundHandler);

// Error handler global (SEMPRE POR ÚLTIMO)
app.use(errorHandler);

module.exports = app;