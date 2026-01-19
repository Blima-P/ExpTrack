require("dotenv").config();
const { auth } = require("../src/config/firebase.admin");

async function testMiddlewares() {
  console.log("\n🧪 Testando Middlewares...\n");

  try {
    // Teste 1: Verificar se Firebase Auth está funcionando
    console.log("1️⃣  Testando Firebase Auth...");
    const users = await auth.listUsers(1);
    console.log(`   ✅ Firebase Auth OK (${users.users.length} usuário(s))\n`);

    // Teste 2: Criar token customizado para teste (se houver usuários)
    if (users.users.length > 0) {
      console.log("2️⃣  Criando token de teste...");
      const testUser = users.users[0];
      const customToken = await auth.createCustomToken(testUser.uid);

      console.log(`   ✅ Token criado para: ${testUser.email}`);
      console.log(`   📋 UID: ${testUser.uid}`);
      console.log(`   🔑 Token: ${customToken.substring(0, 50)}...\n`);

      console.log("   💡 Para testar o middleware:");
      console.log("   1. Use este token no frontend para obter um ID Token");
      console.log("   2. Ou crie um usuário e faça login no frontend");
      console.log("   3. Copie o ID Token do console do browser\n");
    } else {
      console.log("2️⃣  Nenhum usuário encontrado");
      console.log("   💡 Crie um usuário no frontend ou Firebase Console\n");
    }

    // Teste 3: Verificar estrutura de middlewares
    console.log("3️⃣  Verificando middlewares criados...");
    const middlewares = require("../src/middlewares");

    const expectedMiddlewares = [
      "authMiddleware",
      "errorHandler",
      "notFoundHandler",
      "validateRequest",
      "validateEmail",
      "validateOwnership",
      "validateTypes",
      "validateNumber",
    ];

    const missingMiddlewares = expectedMiddlewares.filter(
      (name) => !(name in middlewares)
    );

    if (missingMiddlewares.length > 0) {
      console.log(
        `   ❌ Middlewares faltando: ${missingMiddlewares.join(", ")}\n`
      );
    } else {
      console.log("   ✅ Todos os middlewares encontrados!\n");
    }

    console.log("🎉 Testes de middlewares concluídos!\n");
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

testMiddlewares();
