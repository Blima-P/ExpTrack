# ExpTrack Backend

## Descrição
ExpTrack é uma aplicação backend desenvolvida em Node.js para gerenciar categorias, despesas e usuários. O projeto utiliza o Firebase para autenticação e armazenamento de dados, seguindo uma arquitetura modular e organizada.

## Estrutura do Projeto
A estrutura do projeto está organizada da seguinte forma:

```
package.json
server.js
serviceAccountKey.json
src/
  app.js
  config/
    firebase.admin.js
    index.js
  controllers/
    category.controller.js
    expense.controller.js
    user.controller.js
  middlewares/
    auth.middleware.js
    errorHandler.js
    index.js
    validateRequest.js
  routes/
    category.routes.js
    expense.routes.js
    index.js
    user.routes.js
  services/
  utils/
    firestore.helpers.js
    response.helpers.js
  test/
    create-test-user.js
    test-firebase.js
    test-middlewares.js
```

## Funcionalidades
- Gerenciamento de categorias.
- Gerenciamento de despesas.
- Gerenciamento de usuários.
- Autenticação e autorização utilizando Firebase.
- Validação de requisições e tratamento de erros.

## Pré-requisitos
- Node.js (v14 ou superior)
- Conta no Firebase com um projeto configurado.
- Arquivo `serviceAccountKey.json` para autenticação com o Firebase Admin SDK.

## Instalação
1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd backend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Adicione o arquivo `serviceAccountKey.json` na raiz do projeto.

## Uso
1. Inicie o servidor:
   ```bash
   npm start
   ```
2. O servidor estará disponível em `http://localhost:5000` por padrão.

## Scripts Disponíveis
- `npm start`: Inicia o servidor.

## Estrutura de Pastas
- **`src/config`**: Configurações do Firebase e outras configurações globais.
- **`src/controllers`**: Lógica de controle para categorias, despesas e usuários.
- **`src/middlewares`**: Middlewares para autenticação, validação e tratamento de erros.
- **`src/routes`**: Definição das rotas da aplicação.
- **`src/services`**: Lógica de negócios e integração com serviços externos.
- **`src/utils`**: Funções auxiliares reutilizáveis.
- **`test`**: Scripts de teste para validação da aplicação.

## Contribuição
1. Faça um fork do projeto.
2. Crie uma nova branch:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

