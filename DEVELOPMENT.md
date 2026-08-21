# 🔧 Guia de Desenvolvimento

## Setup do Projeto

```bash
# Instale as dependências
npm install

# Configure o .env
cp .env.example .env

# Instale dependências do cliente
cd client && npm install && cd ..
```

## Rodando Localmente

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run client
```

## Estrutura de Pastas

```
server/
├── models/          # Schemas MongoDB
├── routes/          # Endpoints da API
├── middleware/      # Autenticação e validações
└── index.js         # Servidor principal

client/
├── public/          # Arquivos estáticos
├── src/
│   ├── pages/       # Páginas da aplicação
│   ├── components/  # Componentes reutilizáveis
│   ├── styles/      # CSS
│   ├── App.js       # Componente principal
│   └── index.js     # Entry point
└── package.json
```

## Adicionando Novas Funcionalidades

### 1. Criar um novo Model

**server/models/NewModel.js:**
```javascript
const mongoose = require('mongoose');

const newModelSchema = new mongoose.Schema({
  // seus campos aqui
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NewModel', newModelSchema);
```

### 2. Criar uma nova Rota

**server/routes/newroute.js:**
```javascript
const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Suas rotas aqui
router.get('/', auth, (req, res) => {
  res.json({ message: 'Sua resposta' });
});

module.exports = router;
```

**Registrar em server/index.js:**
```javascript
app.use('/api/newroute', require('./routes/newroute'));
```

### 3. Criar uma nova Página React

**client/src/pages/NewPage.js:**
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NewPage.css';

function NewPage() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div className="container">
      {/* Seu conteúdo */}
    </div>
  );
}

export default NewPage;
```

**Adicionar em client/src/App.js:**
```javascript
import NewPage from './pages/NewPage';

// Na seção de Routes:
<Route path="/newpage" element={<NewPage />} />
```

## Padrão de Código

### Backend
- Use async/await
- Middleware de autenticação para rotas protegidas
- Validações com express-validator
- Respostas padronizadas

### Frontend
- Componentes funcionais com Hooks
- CSS Modules ou estilos inline
- Requisições com axios
- Armazenamento de token no localStorage

## Variáveis de Ambiente

```env
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=sua_chave_super_secreta
NODE_ENV=development
```

## Testing

Para testar a API, use o Postman ou Insomnia com exemplos:

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

## Troubleshooting

### "Cannot find module"
- Certifique-se de ter rodado `npm install`

### "MongoDB connection failed"
- Verifique sua MONGODB_URI no .env
- Certifique-se de que MongoDB está rodando

### "Port already in use"
- Mude a PORT no .env
- Ou: `kill -9 $(lsof -t -i:5000)`

## Performance

- Use índices MongoDB para queries frequentes
- Implemente paginação em listas grandes
- Comprima imagens antes de upload
- Use cache de sessão

## Segurança

✅ Sempre use HTTPS em produção
✅ Validate todas as entradas
✅ Use helmet.js para headers HTTP
✅ Implemente rate limiting
✅ Não exponha seu JWT_SECRET
✅ Use CORS apropriadamente

---

**Happy Coding! 🚀**
