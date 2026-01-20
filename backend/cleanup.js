const fs = require('fs');
const path = require('path');

const filesToDelete = [
  './app.js',
  './index.js'
];

filesToDelete.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Deletado: ${file}`);
    }
  } catch (err) {
    console.error(`❌ Erro ao deletar ${file}:`, err.message);
  }
});

console.log('✅ Limpeza concluída!');
