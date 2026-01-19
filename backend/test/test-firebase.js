require("dotenv").config();
const { admin, db, auth } = require("../src/config/firebase.admin");

async function testFirebase() {
  console.log("\n🧪 Testando Firebase Admin SDK...\n");

  try {
    // Teste 1: Verificar inicialização
    console.log("✅ Admin SDK inicializado");
    console.log(`   Projeto: ${admin.app().options.projectId}`);

    // Teste 2: Testar conexão com Auth
    console.log("\n🔐 Testando Firebase Auth...");
    const listUsers = await auth.listUsers(1);
    console.log(
      `✅ Auth conectado (${listUsers.users.length} usuário(s) encontrado(s))`
    );

    // Teste 3: Testar conexão com Firestore
    console.log("\n📦 Testando Firestore...");
    const testCollection = await db.collection("_test").limit(1).get();
    console.log("✅ Firestore conectado");

    console.log("\n🎉 Todos os testes passaram!\n");
  } catch (error) {
    console.error("\n❌ Erro nos testes:", error.message);
    console.error("\n🔍 Verifique:");
    console.error("   - Arquivo .env está preenchido corretamente");
    console.error("   - FIREBASE_PRIVATE_KEY tem aspas e \\n");
    console.error("   - Firestore está ativado no Firebase Console");
    console.error("   - Firebase Authentication está ativado\n");
    process.exit(1);
  }
}

testFirebase();
