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
│   ├── package.json
│   ├── .env
│   └── ...
├── backend/           # API Node.js/Express
│   ├── app.js
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

Edite o arquivo `.env` e configure:
```
VITE_API_URL=http://localhost:3000/api
```

> **Nota**: Se a API estiver em outro servidor, atualize a URL

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

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do backend com:
```
PORT=3000
NODE_ENV=development
```

Se usar Firebase, adicione as credenciais:
```
FIREBASE_API_KEY=sua_chave_aqui
FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
```

### 4. Inicie o servidor
```bash
npm start
# ou para desenvolvimento
npm run dev
```

A API estará rodando em `http://localhost:3000`

---

## 🔑 Configuração do Firebase

Se o projeto usa Firebase:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Obtenha as credenciais do projeto
3. Configure em `Frontend/src/config/firebaseClient.js` e `backend/config/firebaseAdmin.js`

---

## 🌐 Build para Produção

### Frontend
```bash
cd Frontend
npm run build
```

Gera a pasta `dist/` com os arquivos otimizados

### Backend
Prepare o servidor para rodar em produção:
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

### Porta já em uso
Se a porta 5173 ou 3000 já estiver em uso:

**Frontend**:
```bash
npm run dev -- --port 5174
```

**Backend**:
Altere a porta no arquivo `.env` ou `app.js`

### Problemas de conexão Frontend-Backend
1. Verifique se o backend está rodando
2. Confirme a URL do backend em `.env`
3. Verifique CORS no backend

### Node modules corrompido
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Checklist Final

- [ ] Node.js v18+ instalado
- [ ] npm instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env` configurado corretamente
- [ ] Backend rodando (`npm start`)
- [ ] Frontend rodando (`npm run dev`)
- [ ] Frontend consegue acessar backend em `VITE_API_URL`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme que todas as dependências estão instaladas
3. Certifique-se de que as portas estão livres
4. Reinicie os servidores

---

**Versão**: 1.0  
**Data**: Janeiro 2026
