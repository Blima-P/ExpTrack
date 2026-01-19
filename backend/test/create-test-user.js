require('dotenv').config();
const { auth } = require('../src/config/firebase.admin');

async function createTestUser() {
  try {
    const user = await auth.createUser({
      email: 'boquinha@example.com',
      password: 'senha123456',
      displayName: 'Usuário Boquinha',
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log('   Email:', user.email);
    console.log('   UID:', user.uid);
    console.log('\n💡 Use estas credenciais no frontend para fazer login');

  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  Usuário já existe');
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

createTestUser();