const app = require('./app');

const PORT = process.env.PORT || 3000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

// Tratar erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Exceção não capturada:', err);
});

// Manter o processo ativo
process.stdin.resume();