const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Gerando par de chaves RSA...\n');

// Criar pasta keys se não existir (na raiz do projeto)
const keysDir = path.join(__dirname, '..', 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// Salvar em arquivos PEM na pasta keys/
const privateKeyPath = path.join(keysDir, 'private.pem');
const publicKeyPath = path.join(keysDir, 'public.pem');

fs.writeFileSync(privateKeyPath, privateKey);
fs.writeFileSync(publicKeyPath, publicKey);

console.log('✅ Chaves geradas com sucesso!\n');
console.log('📄 Arquivos salvos em:');
console.log(`   • ${privateKeyPath}`);
console.log(`   • ${publicKeyPath}\n`);
console.log('📋 Adicione estas linhas no seu arquivo .env:\n');
console.log('─'.repeat(80));
console.log(`JWT_PRIVATE_KEY_PATH='./keys/private.pem'`);
console.log(`JWT_PUBLIC_KEY_PATH='./keys/public.pem'`);
console.log('─'.repeat(80));
console.log('\n⚠️  IMPORTANTE:');
console.log('   • Nunca commite a pasta keys/ no Git');
console.log('   • Adicione keys/ no .gitignore');
console.log('   • Use chaves diferentes em produção\n');