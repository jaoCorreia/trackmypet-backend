const fs = require('fs');
const path  = require('path');
let newVersionCode = 0;

const type = process.argv[2];
if(!['major', 'minor', 'patch'].includes(type)){
    console.error("Use: node bump-version.js [major|minor|patch]");
    process.exit(1);
}

const filePath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));

let [major, minor, patch] = pkg.version.split(".").map(Number);

if(type === "major") major++;
if(type === "minor") minor++;
if(type === "patch") patch++;

const newVersion = `${major}.${minor}.${patch}`;
console.log(`New version: ${newVersion}`);

pkg.version = newVersion;
fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
console.log("✔ Versionamento atualizado!");