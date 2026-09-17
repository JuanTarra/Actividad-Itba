/**
 * Desencripta el archivo docs/errors.enc que contiene el listado de errores
 * intencionales del proyecto y sus efectos.
 *
 * Uso:
 *   ERRORS_PASSWORD="la_clave" node scripts/decrypt-errors.js
 *
 * También podés pasar la clave como primer argumento:
 *   node scripts/decrypt-errors.js "la_clave"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENC_FILE = path.join(__dirname, '..', 'docs', 'errors.enc');

function decrypt(password) {
  const raw = fs.readFileSync(ENC_FILE);

  const salt = raw.subarray(0, 16);
  const iv = raw.subarray(16, 28);
  const authTag = raw.subarray(28, 44);
  const encrypted = raw.subarray(44);

  const key = crypto.scryptSync(password, salt, 32);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}

const password = process.argv[2] || process.env.ERRORS_PASSWORD;

if (!password) {
  console.error('Falta la clave. Uso: node scripts/decrypt-errors.js "la_clave"');
  process.exit(1);
}

try {
  const text = decrypt(password);
  console.log(text);
} catch (err) {
  console.error('No se pudo desencriptar (clave incorrecta o archivo corrupto).');
  process.exit(1);
}
