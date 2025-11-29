const fs = require('fs');
const path  = require('path');
const { execSync } = require("child_process");

const filePath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));
const version = pkg.version;
const tag = `v${version}`;

function tagExists(tagName) {
  try {
    execSync(`git rev-parse ${tagName}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

try {
  const tagAlreadyExists = tagExists(tag);

  if (tagAlreadyExists) {
    console.log(`⚠️ Tag ${tag} já existe, pulando criação...`);
  } else {
    console.log(`🔖 Criando tag ${tag}...`);

    execSync(`git add .`);
    
    try {
      execSync(`git diff-index --quiet HEAD --`);
      console.log('📝 Nenhuma mudança para commitar, pulando commit...');
    } catch {
      execSync(`git commit -m "release: ${tag}"`, { stdio: "inherit" });
    }

    execSync(`git tag ${tag}`, { stdio: "inherit" });
  }

  execSync(`git push`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });

  console.log(`✔ Tag ${tag} enviada com sucesso!`);
} catch (e) {
  console.error("Erro ao criar/enviar tag:", e.message);
}