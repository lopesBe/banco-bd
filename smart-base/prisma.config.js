// Configuração do Prisma CLI.
// O .env fica na RAIZ do repositório (compartilhado com docker-compose e Java),
// então carregamos explicitamente ../.env (e, se existir, smart-base/.env).
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

module.exports = {
  schema: path.join('prisma', 'schema.prisma'),
};
