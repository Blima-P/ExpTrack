const { auth, db } = require("../config/firebaseAdmin");
const { getCurrentTimestamp } = require("../utils/firestoreHelpers");

/**
 * Atualizar nome do usuário
 * PUT /api/users/me
 */
const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.uid;

    // Validação
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Nome inválido",
      });
    }

    const trimmedName = name.trim();

    // Atualizar no Firestore
    await db.collection("users").doc(userId).update({
      name: trimmedName,
      updatedAt: getCurrentTimestamp(),
    });

    // Atualizar no Firebase Auth
    await auth.updateUser(userId, {
      displayName: trimmedName,
    });

    res.status(200).json({
      success: true,
      message: "Nome atualizado com sucesso",
      data: {
        uid: userId,
        name: trimmedName,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar nome do usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar nome do usuário",
      error: error.message,
    });
  }
};

module.exports = {
  updateUserName,
};
