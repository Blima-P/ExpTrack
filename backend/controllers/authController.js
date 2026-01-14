const { auth, db } = require('../config/firebaseAdmin');
const { clientAuth } = require('../config/firebaseClient');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getCurrentTimestamp } = require('../utils/firestoreHelpers');
const { sendPasswordResetEmail } = require('firebase/auth'); 

/**
 * Registrar novo usuário
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validação básica
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e nome são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Criar usuário no Firebase Auth usando Client SDK
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      email,
      password
    );

    const user = userCredential.user;

    // Salvar dados adicionais no Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      name: name,
      createdAt: getCurrentTimestamp()
    });

    // Obter token
    const idToken = await user.getIdToken();

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        uid: user.uid,
        email: user.email,
        name: name,
        token: idToken
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    
    // Mensagens de erro mais amigáveis
    let message = 'Erro ao registrar usuário';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Este email já está em uso';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido';
    } else if (error.code === 'auth/weak-password') {
      message = 'Senha muito fraca';
    }

    res.status(400).json({
      success: false,
      message: message,
      error: error.message
    });
  }
};

/**
 * Login de usuário
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Autenticar com Firebase Client SDK
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );

    const user = userCredential.user;

    // Obter dados do usuário do Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    // Obter token
    const idToken = await user.getIdToken();

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        token: idToken
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    
    let message = 'Erro ao fazer login';
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      message = 'Email ou senha incorretos';
    } else if (error.code === 'auth/user-not-found') {
      message = 'Usuário não encontrado';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido';
    }

    res.status(401).json({
      success: false,
      message: message,
      error: error.message
    });
  }
};

/**
 * Obter dados do usuário autenticado
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    // userId está disponível através do authMiddleware
    const userId = req.userId;

    // Buscar dados do usuário no Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      data: {
        uid: userId,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do usuário',
      error: error.message
    });
  }
};


/**
 * Resetar senha via email
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validação básica
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Enviar email de redefinição de senha
    await sendPasswordResetEmail(clientAuth, email);

    res.status(200).json({
      success: true,
      message: 'Email de redefinição de senha enviado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao enviar email de redefinição:', error);

    let message = 'Erro ao enviar email de redefinição';
    if (error.code === 'auth/user-not-found') {
      message = 'Usuário não encontrado';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido';
    }

    res.status(400).json({
      success: false,
      message: message,
      error: error.message
    });
  }
};


module.exports = {
  register,
  login,
  getMe,
  resetPassword
};