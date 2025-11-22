# TrackMyPet Backend

API REST desenvolvida com NestJS para gerenciamento de pets e suas atividades.

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- MySQL (v8 ou superior)
- Conta Firebase (para notificações push)
- Conta AWS S3 (para armazenamento de arquivos)
- Conta de email SMTP (para envio de emails)

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd trackmypet-backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=trackmypet

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=TrackMyPet <your_email@gmail.com>

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name

# Firebase (deixe vazio se não usar notificações push)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### 4. Configurar Firebase (Opcional)

Se você deseja usar notificações push:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **Project Settings** > **Service Accounts**
4. Clique em **Generate New Private Key**
5. Salve o arquivo JSON baixado como `keys/firebase-service-account.json`

Alternativamente, você pode adicionar as credenciais no arquivo `.env`:

- `FIREBASE_PROJECT_ID`: ID do projeto Firebase
- `FIREBASE_CLIENT_EMAIL`: Email da service account
- `FIREBASE_PRIVATE_KEY`: Chave privada (mantenha as aspas e quebras de linha)

### 5. Criar e configurar o banco de dados

#### Opção 1: Executar script SQL completo (Recomendado)

Execute o script SQL que cria o banco de dados, tabelas e estrutura completa:

```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script SQL
source src/database/schema/trackmypet_db.sql

# Ou se preferir, copie e cole o conteúdo do arquivo no MySQL
```

O script `src/database/schema/trackmypet_db.sql` contém:

- Criação do banco de dados
- Todas as tabelas com suas estruturas
- Chaves estrangeiras e relacionamentos
- Índices para otimização

#### Opção 2: Criar banco vazio e usar TypeORM (Desenvolvimento)

```bash
# Acesse o MySQL
mysql -u root -p

# Crie apenas o banco de dados
CREATE DATABASE trackmypet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Inicie a aplicação para o TypeORM criar as tabelas
npm run start:dev
```

> **Nota**: Em desenvolvimento, o TypeORM está configurado com `synchronize: true`, o que cria automaticamente as tabelas. Em produção, sempre use o script SQL.

### 6. Popular o banco com dados iniciais (Seeds)

Execute o comando para criar dados iniciais:

```bash
npm run seed
```

Este comando irá:

- ✅ Criar usuário administrador padrão
- ✅ Popular espécies de animais (Cachorro, Gato, etc.)
- ✅ Popular raças para cada espécie

**Credenciais do Admin:**

- **Email**: admin@trackmypet.com
- **Senha**: Admin@123

## 🏃 Executar o projeto

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod

# Modo debug
npm run start:debug
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação da API

### Autenticação

Todas as rotas (exceto login e registro) requerem um token JWT no header:

```
Authorization: Bearer <seu_token>
```

### Principais Endpoints

#### Auth

- `POST /auth/register` - Criar nova conta
- `POST /auth/login` - Fazer login
- `POST /auth/verify-code` - Verificar código de email

#### Usuários

- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

#### Pets

- `GET /pets` - Listar pets do usuário
- `POST /pets` - Criar pet
- `PUT /pets/:id` - Atualizar pet
- `DELETE /pets/:id` - Deletar pet

#### Atividades

- `GET /activities` - Listar atividades do usuário
- `POST /activities` - Criar atividade personalizada
- `PUT /activities/:id` - Atualizar atividade
- `DELETE /activities/:id` - Deletar atividade

#### Agendamentos

- `GET /activity_schedules` - Listar agendamentos
- `GET /activity_schedules/today` - Atividades de hoje
- `POST /activity_schedules` - Criar agendamento
- `PUT /activity_schedules/:id` - Atualizar agendamento
- `DELETE /activity_schedules/:id` - Deletar agendamento

#### Histórico

- `GET /activity_history` - Listar histórico de atividades
- `POST /activity_history` - Registrar atividade completada
- `PUT /activity_history/:id` - Atualizar registro
- `DELETE /activity_history/:id` - Deletar registro

#### Notificações

- `GET /notifications` - Listar notificações
- `PUT /notifications/:id/read` - Marcar como lida

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🔒 Permissões

O sistema possui dois níveis de acesso:

### Admin

- Acesso total a todos os recursos
- Pode ver dados de todos os usuários

### Usuário Regular

- Acesso apenas aos próprios pets, atividades e agendamentos
- Não pode ver dados de outros usuários

## 📦 Estrutura do Projeto

```
src/
├── auth/                 # Autenticação JWT
├── users/                # Gerenciamento de usuários
├── pets/                 # Gerenciamento de pets
├── activities/           # Atividades customizadas
├── activity-schedules/   # Agendamento de atividades
├── activity-history/     # Histórico de completude
├── notifications/        # Sistema de notificações
├── firebase/             # Integração Firebase
├── s3/                   # Upload de arquivos S3
├── email/                # Envio de emails
├── database/
│   ├── entities/         # Entidades TypeORM
│   └── seeds/            # Seeds do banco
└── common/               # Guards, decorators, middlewares
```

## 🔄 Sistema de Notificações

O backend possui um scheduler automático que:

1. **A cada 30 segundos**: Verifica atividades agendadas para os próximos 30 minutos
2. **A cada 15 segundos**: Envia notificações pendentes via Firebase Cloud Messaging
3. **Prevenção de duplicatas**: Sistema triplo de proteção contra notificações duplicadas

Para que as notificações funcionem, o app mobile precisa:

- Estar configurado com Firebase
- Enviar o FCM token ao fazer login
- Ter permissões de notificação habilitadas

## 🛠️ Scripts Disponíveis

```bash
npm run start:dev        # Inicia em modo desenvolvimento
npm run start:prod       # Inicia em modo produção
npm run seed             # Executa seeds do banco
npm run format           # Formata código com Prettier
npm run lint             # Verifica erros com ESLint
npm run test             # Executa testes
```

## 📝 Licença

Este projeto está sob licença privada.
