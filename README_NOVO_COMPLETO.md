# 💰 ExpTrack - Gerenciador de Despesas

Um aplicativo web moderno para controlar e gerenciar suas despesas pessoais com múltiplos temas visuais.

## 🎯 Features

✅ **Autenticação com Firebase**  
✅ **Cadastro de despesas com categorias**  
✅ **Múltiplos temas visuais** (Padrão, Claro, Escuro, Grêmio)  
✅ **Gráficos interativos** (Por despesa e por categoria)  
✅ **Dashboard com resumo de gastos**  
✅ **Edição e exclusão de despesas**  
✅ **Gerenciamento de categorias**  
✅ **Responsivo em todas as telas**  

---

## 🛠️ Tecnologias

### Frontend
- **React 19** - Interface do usuário
- **Vite** - Bundler rápido
- **Tailwind CSS** - Estilo responsivo
- **Recharts** - Gráficos interativos
- **Firebase** - Autenticação e dados
- **React Router** - Navegação

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Firebase Admin SDK** - Autenticação backend
- **Firestore** - Banco de dados NoSQL

---

## 🚀 Quick Start (5 minutos)

### Pré-requisitos
- Node.js v18+ ([Download](https://nodejs.org))
- npm (vem com Node.js)
- Conta no [Firebase](https://firebase.google.com)

### 1️⃣ Frontend
```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Acesse: `http://localhost:5173`

### 2️⃣ Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Roda na porta: `5000`

---

## 📖 Documentação Completa

Para instruções detalhadas, configuração Firebase e troubleshooting:

👉 **[Leia GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md)**

---

## 📁 Estrutura do Projeto

```
ExpTrack/
├── Frontend/                  # Aplicação React
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── backend/                   # API Node.js
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── .env.example
│   └── package.json
│
├── GUIA_INSTALACAO.md         # Guia passo a passo
└── .gitignore
```

---

## 🎨 Temas

- 🌈 **Padrão** - Preto com bege/ouro
- ☀️ **Claro** - Branco com azul
- 🌙 **Escuro** - Slate com indigo
- ⚽ **Grêmio** - Preto com cyan

---

## 📝 Comandos

### Frontend
```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run lint     # Verificar código
```

### Backend
```bash
npm start        # Produção
npm run dev      # Desenvolvimento
```

---

## 🐛 Problemas Comuns

| Erro | Solução |
|------|---------|
| `Cannot find module` | `npm install` |
| Porta em uso | Mudar porta em `.env` |
| Firebase error | Verificar `.env` e `firebase-key.json` |
| Frontend não conecta | Confirmar `VITE_API_URL` |

**Mais soluções em [GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md)**

---

## 📊 Endpoints da API

```
POST   /api/auth/register      # Registrar
POST   /api/auth/login         # Login
GET    /api/expenses           # Listar despesas
POST   /api/expenses           # Criar despesa
PUT    /api/expenses/:id       # Atualizar
DELETE /api/expenses/:id       # Deletar
GET    /api/categories         # Listar categorias
POST   /api/categories         # Criar categoria
DELETE /api/categories/:id     # Deletar
```

---

## ✅ Checklist Inicial

- [ ] Node.js v18+ instalado
- [ ] `npm install` Frontend
- [ ] `npm install` Backend
- [ ] `.env` configurado (copiar de `.env.example`)
- [ ] `firebase-key.json` no backend
- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 5173

---

## 🤝 Contribuições

1. Fork o projeto
2. Crie sua feature (`git checkout -b feature/nova-feature`)
3. Commit mudanças (`git commit -m 'Add nova-feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ - Janeiro 2026**
