require("dotenv").config();

/**
 * Configurações centralizadas da aplicação
 * Todas as variáveis de ambiente em um lugar
 */
const config = {
  // Servidor
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // CORS
  cors: {
    origin: (origin, callback) => {
      // Permitir requisições sem origin (ex: Postman) ou de localhost nas portas 3000, 5173, 5174, 5175
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origem não permitida pelo CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // Firebase (apenas para referência, não usado diretamente)
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
};

/**
 * Validar variáveis de ambiente obrigatórias
 */
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("\n❌ Variáveis de ambiente obrigatórias não definidas:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\n💡 Verifique o arquivo .env\n");
  process.exit(1);
}

// Exibir configurações no modo desenvolvimento
if (config.nodeEnv === "development") {
  console.log("\n⚙️  Configurações carregadas:");
  console.log(`   Porta: ${config.port}`);
  console.log(`   Ambiente: ${config.nodeEnv}`);
  console.log(`   CORS Origin: ${config.cors.origin}`);
  console.log(`   Firebase Project: ${config.firebase.projectId}`);
  console.log("");
}

module.exports = config;
