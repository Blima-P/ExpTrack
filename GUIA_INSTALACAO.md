# 🚀 Guia de Instalação - ExpTrack

## Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

- **Node.js** (versão 18+) - [Download](https://nodejs.org)
- **npm** (geralmente vem com Node.js)
- **Git** (opcional, para clonar o repositório)

Verifique as versões instaladas:
```bash
node --version
npm --version
```

---

## 📁 Estrutura do Projeto

```
ExpTrack/
├── Frontend/          # Aplicação React (Vite)
│   ├── src/
│   ├── .env.example   # Exemplo de variáveis (copie para .env)
│   ├── .env           # COPIE DO .env.example e preencha
│   ├── package.json
│   └── ...
├── backend/           # API Node.js/Express
│   ├── .env.example   # Exemplo de variáveis (copie para .env)
│   ├── .env           # Variáveis de ambiente
│   ├── firebase-key.json  # Credenciais Firebase (obtenha no console)
│   ├── package.json
│   └── ...
```

---

## ⚙️ Instalação do Frontend

### 1. Navegue até a pasta do Frontend
```bash
cd "ExpTrack Front/ExpTrack/Frontend"
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o arquivo .env

Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

**Edite o arquivo `.env` com:**
```dotenv
# URL da API Backend (certifique-se que a porta corresponde ao backend)
VITE_API_URL=http://localhost:5000/api

# Credenciais Firebase (iguais no backend)
VITE_FIREBASE_API_KEY=AIzaSyCs41eV5ClR1Dup4EeQOgH_hpPRLN8HnYU
VITE_FIREBASE_AUTH_DOMAIN=exptrack-5fcd9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=exptrack-5fcd9
VITE_FIREBASE_STORAGE_BUCKET=exptrack-5fcd9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=362926636262
VITE_FIREBASE_APP_ID=1:362926636262:web:eb711eb83be1e126540f27
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173` (ou outra porta disponível)

---

## ⚙️ Instalação do Backend

### 1. Navegue até a pasta do Backend
```bash
cd "ExpTrack Front/ExpTrack/backend"
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Obtenha as credenciais do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto **exptrack-5fcd9**
3. Vá para **Project Settings** (⚙️) > **Service Accounts**
4. Clique em **Generate New Private Key**
5. Um arquivo `exptrack-5fcd9-xxxxxxxx.json` será baixado

### 4. Configure o arquivo .env

Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

**Opção A: Usando arquivo JSON (Recomendado para desenvolvimento)**

1. Coloque o arquivo JSON baixado na pasta `backend/`
2. Renomeie para `firebase-key.json`
3. No `.env`, configure:
```dotenv
PORT=5000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
JWT_EXPIRES_IN=7d
```

**Opção B: Usando Base64 (Recomendado para produção)**

1. Converter o JSON para Base64:
   - Linux/Mac: `cat firebase-key.json | base64`
   - Windows PowerShell: `[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("firebase-key.json"))`
   
2. Cole o resultado no `.env`:
```dotenv
PORT=5000
NODE_ENV=development
FIREBASE_ADMIN_KEY_BASE64=SUA_CHAVE_EM_BASE64_AQUI
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
JWT_EXPIRES_IN=7d
```

### 5. Inicie o servidor

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

A API estará rodando em `http://localhost:5000`

---

## 🔐 Credenciais Firebase

### Por que preciso do Firebase?

O ExpTrack usa Firebase para:
- ✅ Autenticação de usuários
- ✅ Armazenamento de dados (Firestore)
- ✅ Upload de arquivos (Storage)

### Como obter as credenciais?

1. [Abra o Firebase Console](https://console.firebase.google.com)
2. Clique em **Selecionar um projeto**
3. Procure por **exptrack-5fcd9** ou crie um novo
4. Vá para **Configurações do Projeto** (⚙️)
5. Guias **Geral** e **Service Accounts**

⚠️ **IMPORTANTE**: Não compartilhe suas credenciais! Cada máquina deve ter seu próprio `.env`

---

## 🌐 Build para Produção

### Frontend
```bash
cd Frontend
npm run build
```

Gera a pasta `dist/` com os arquivos otimizados

### Backend
Configure as variáveis de ambiente para produção e execute:
```bash
npm start
```

---

## 📝 Comandos Úteis

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção  
- `npm run preview` - Preview do build
- `npm run lint` - Verifica qualidade do código

### Backend
- `npm start` - Inicia a API
- `npm run dev` - Inicia em modo desenvolvimento (com nodemon)

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'firebase'"
```bash
npm install firebase firebase-admin
```

### ❌ "Porta já em uso"

**Frontend** (usar outra porta):
```bash
npm run dev -- --port 5174
```

**Backend** (editar `.env`):
```
PORT=5001
```

### ❌ "ENOENT: no such file or directory, open 'firebase-key.json'"
- Certifique-se que `firebase-key.json` está na pasta `backend/`
- Ou use `FIREBASE_ADMIN_KEY_BASE64` no `.env`

### ❌ "Frontend não consegue conectar ao Backend"
1. Backend está rodando? (`npm run dev` na pasta backend/)
2. Verifique `VITE_API_URL` no `.env` do frontend
3. Porta do backend corresponde à URL? (padrão: 5000)
4. CORS está liberado? (verifique arquivo `.env` do backend)

### ❌ "Firebase: Error (auth/invalid-api-key)"
- Verifique as credenciais no `.env`
- Certifique-se que usou as credenciais corretas do Firebase

### ❌ "node_modules corrompido"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Checklist Final

- [ ] Node.js v18+ instalado
- [ ] npm instalado  
- [ ] `npm install` executado no Frontend
- [ ] `npm install` executado no Backend
- [ ] `.env` configurado no Frontend (com Firebase)
- [ ] `.env` configurado no Backend (com Firebase)
- [ ] `firebase-key.json` baixado e colocado em Backend/ (Opção A)
- [ ] Backend rodando: `npm run dev` porta 5000
- [ ] Frontend rodando: `npm run dev` porta 5173
- [ ] Frontend consegue acessar Backend (`http://localhost:5000/api`)
- [ ] Login funciona com Firebase

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console (Frontend e Backend)
2. Confirme que todas as dependências estão instaladas
3. Certifique-se de que as portas (5000, 5173) estão livres
4. Reinicie os servidores e limpe o cache do navegador
5. Verifique as credenciais do Firebase

---

**Versão**: 2.0  
**Data**: Janeiro 2026  
**Última atualização**: 2026-01-23

