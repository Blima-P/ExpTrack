# ✅ CHECKLIST - Clone e Instalação

Siga estes passos EXATAMENTE para o projeto funcionar corretamente após clonar.

---

## 1️⃣ Clone do Repositório

```bash
git clone <url-do-repositorio>
cd "ExpTrack Front/ExpTrack"
```

**Você deve ter estas pastas:**
- ✅ `Frontend/`
- ✅ `backend/`
- ✅ `GUIA_INSTALACAO.md`

---

## 2️⃣ Instalar Dependências do Frontend

```bash
cd Frontend
npm install
```

**Verifique se criou:**
- ✅ Pasta `node_modules/`
- ✅ Arquivo `package-lock.json`

---

## 3️⃣ Configurar Frontend

```bash
# Copiar variáveis de exemplo
cp .env.example .env
```

**Abra `.env` e confirme que tem:**
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
(e as outras variáveis)
```

---

## 4️⃣ Instalar Dependências do Backend

```bash
cd ../backend
npm install
```

**Verifique se criou:**
- ✅ Pasta `node_modules/`
- ✅ Arquivo `package-lock.json`

---

## 5️⃣ Configurar Backend

### Opção A: Com arquivo Firebase (Recomendado)

```bash
# Copiar variáveis de exemplo
cp .env.example .env
```

1. Baixe o arquivo `firebase-key.json` do [Firebase Console](https://console.firebase.google.com)
2. Coloque o arquivo na pasta `backend/`

**Seu `.env` deve ter:**
```
PORT=5000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=qualquer_string_secreta_aqui
JWT_EXPIRES_IN=7d
```

### Opção B: Com Base64 (Para CI/CD)

Se não conseguir usar arquivo:
1. Converta o JSON para Base64
2. Cole em `.env`:
```
FIREBASE_ADMIN_KEY_BASE64=SEU_BASE64_AQUI
```

---

## 6️⃣ Verificar Estrutura Final

```
ExpTrack/
├── Frontend/
│   ├── node_modules/        ✅ Criado por npm install
│   ├── package-lock.json    ✅ Criado por npm install
│   ├── .env                 ✅ Criado por você
│   ├── .env.example         ✅ Original
│   └── ...
│
├── backend/
│   ├── node_modules/        ✅ Criado por npm install
│   ├── package-lock.json    ✅ Criado por npm install
│   ├── .env                 ✅ Criado por você
│   ├── .env.example         ✅ Original
│   ├── firebase-key.json    ✅ Baixado do Firebase
│   └── ...
```

---

## 7️⃣ Rodar o Projeto

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

**Você deve ver:**
```
VITE v7.3.1 ready in 1234 ms
➜ Local: http://localhost:5000/
```

### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
```

**Você deve ver:**
```
VITE v7.3.1 ready in 1234 ms
➜ Local: http://localhost:5173/
```

---

## 8️⃣ Testar Conexão

1. Abra `http://localhost:5173` no navegador
2. Tente fazer login
3. Se funcionar, pronto! ✅

---

## ❌ Se Algo der Errado

### "Cannot find module 'firebase'"
```bash
npm install firebase
```

### "ENOENT: no such file or directory, open 'firebase-key.json'"
- Verifique se baixou o arquivo
- Verifique se está na pasta `backend/`
- Verifique o nome do arquivo

### "Porta 5000 já em uso"
Edite `.env` do backend:
```
PORT=5001
```

### "CORS error"
Verifique se `CORS_ORIGIN` no `.env` do backend está correto:
```
CORS_ORIGIN=http://localhost:5173
```

### "node_modules corrompido"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Precisa de Ajuda?

1. Veja [GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md) para detalhes
2. Verifique os logs do console (Frontend e Backend)
3. Confirme que as portas (5000, 5173) estão livres

---

**Última atualização: 23 de Janeiro de 2026**
