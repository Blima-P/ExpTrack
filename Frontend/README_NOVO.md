# ExpTrack Frontend

Uma aplicação frontend moderna e interativa para controle de gastos, desenvolvida com React, Vite e Tailwind CSS.

## 🚀 Funcionalidades

- **Autenticação Segura**: Login e registro com Firebase
- **Gerenciamento de Categorias**: Crie e organize suas categorias de gastos com cores personalizadas
- **Registro de Gastos**: Adicione, edite e delete seus gastos facilmente
- **Dashboard Interativo**: Visualize seus gastos totais e filtrados por categoria
- **Design Responsivo**: Interface bonita e funcional em dispositivos móveis e desktops

## 📋 Pré-requisitos

- Node.js (versão 16+)
- npm ou yarn
- Backend rodando em `http://localhost:3000`

## 🛠️ Instalação

1. Entre na pasta do Frontend:
```bash
cd Frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` baseado em `.env.example`:
```bash
VITE_API_URL=http://localhost:3000/api
```

## 🎯 Uso

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── CategoryManager.jsx
│   ├── ExpenseForm.jsx
│   ├── ExpenseList.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/          # Context API para estado global
│   └── AuthContext.jsx
├── pages/            # Páginas da aplicação
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── services/         # Serviços de API
│   └── api.js
├── App.jsx           # Componente principal
├── index.css         # Estilos globais com Tailwind
└── main.jsx          # Entrada da aplicação
```

## 🎨 Tecnologias

- **React 19**: Framework JavaScript
- **Vite**: Build tool rápido
- **Tailwind CSS**: Framework CSS utilitário
- **React Router**: Roteamento
- **Axios**: Cliente HTTP
- **Context API**: Gerenciamento de estado

## 🔐 Segurança

- Token JWT armazenado no localStorage
- Rotas protegidas com autenticação
- Validação de entrada do usuário
- Interceptadores de requisição para adicionar token automaticamente

## 📱 Componentes Principais

### AuthContext
Gerencia autenticação e estado do usuário globalmente

### ProtectedRoute
Protege rotas que exigem autenticação

### Dashboard
Página principal com visão geral dos gastos, gerenciamento de categorias e gastos

### ExpenseForm
Formulário para criar novos gastos

### ExpenseList
Lista de gastos com opções de editar e deletar

### CategoryManager
Gerenciar categorias com cores personalizadas

## 🐛 Troubleshooting

**Erro de conexão com o backend?**
- Certifique-se de que o servidor backend está rodando em `http://localhost:3000`
- Verifique o arquivo `.env.local` com a URL correta do backend

**Token expirado?**
- Faça login novamente
- O token será armazenado automaticamente

## 📝 Notas

- A aplicação usa a mesma URL base do backend (localhost:3000)
- Proxying está configurado no Vite para desenvolvimento local
- Para produção, ajuste a URL do backend no arquivo `.env.local`

## 🤝 Contribuindo

Sinta-se livre para abrir issues e pull requests para melhorias!

## 📄 Licença

MIT
