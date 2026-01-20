# ExpTrack 📊

O **ExpTrack** é uma ferramenta desenvolvida para simplificar a gestão financeira pessoal através da automação de folhas de cálculo. O objetivo é transformar registos de gastos diários em insights visuais automáticos.

## 🚀 Funcionalidades
- **Visualização Dinâmica:** Geração de gráficos interativos para análise de consumo
- **Categorização:** Separação inteligente de despesas (Lazer, Alimentação, Contas Fixas, etc.)
- **Autenticação:** Sistema de login/registro com Firebase Auth
- **API RESTful:** Backend Node.js/Express com Firestore

## 🛠️ Tecnologias
**Backend:**
- Node.js + Express 5
- Firebase Admin SDK
- Firebase Auth
- Cloud Firestore
- Jest + Supertest (testes)

**Frontend:**
- React + Vite
- TailwindCSS
- React Router
- Axios

## 📋 Pré-requisitos
- Node.js >= 16
- npm ou yarn
- Conta Firebase (credenciais de serviço)

## 🔧 Setup em nova máquina

### 1. Clone e instale dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 2. Configure credenciais Firebase

**Backend:** Copie `.env.example` para `.env` e preencha:

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` com uma destas opções:

**Opção A (Recomendada):** Use base64 da chave de serviço:
```bash
# Linux/Mac
cat serviceAccountKey.json | base64 -w 0

# Windows PowerShell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("serviceAccountKey.json"))
```

Cole o resultado em:
```
FIREBASE_ADMIN_KEY_BASE64=sua_chave_base64_aqui
```

**Opção B:** Aponte para o arquivo JSON:
```
GOOGLE_APPLICATION_CREDENTIALS=C:/caminho/absoluto/serviceAccountKey.json
```

**Opção C:** Coloque `serviceAccountKey.json` em `backend/`

**Frontend:** Configure variáveis do Firebase Client em `Frontend/.env`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 3. Execute

**Backend:**
```bash
cd backend
npm run dev    # modo desenvolvimento (nodemon)
# ou
npm start      # modo produção
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

Acesse: http://localhost:5173

## 🧪 Testes

```bash
cd backend
npm test
```

## 📁 Estrutura do Projeto

```
ExpTrack/
├── backend/
│   ├── app.js              # Configuração Express
│   ├── index.js            # Entry point
│   ├── config/             # Firebase setup
│   ├── controllers/        # Lógica de negócio
│   ├── middlewares/        # Auth, error handler
│   ├── routes/             # Rotas da API
│   ├── utils/              # Helpers Firestore
│   └── tests/              # Testes Jest
├── Frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas (Login, Dashboard...)
│   │   ├── context/        # Context API (Auth)
│   │   └── services/       # API client (Axios)
│   └── public/
└── README.md
```

## 🔐 Endpoints da API

**Autenticação:**
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário (protegida)
- `POST /api/auth/reset-password` - Reset de senha

**Categorias:** (todas protegidas)
- `POST /api/categories` - Criar
- `GET /api/categories` - Listar
- `PUT /api/categories/:id` - Atualizar
- `DELETE /api/categories/:id` - Deletar

**Despesas:** (todas protegidas)
- `POST /api/expenses` - Criar
- `GET /api/expenses` - Listar
- `PUT /api/expenses/:id` - Atualizar
- `DELETE /api/expenses/:id` - Deletar

**Usuários:**
- `PUT /api/users/me` - Atualizar nome (protegida)

---
*Projeto desenvolvido a fins de estudos e organização pessoal*

*Feito por Pedro Braga de Lima e André Queiroz de Araújo Viana*
