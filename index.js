require('dotenv').config();

const bedrock = require('bedrock-protocol');

const host = process.env.MC_HOST;
const port = Number(process.env.MC_PORT || 19132);
const username = process.env.MC_USERNAME || 'GalacticBot';

if (!host) {
  console.error('Помилка: вкажи MC_HOST у змінних середовища.');
  process.exit(1);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Помилка: MC_PORT має бути числом від 1 до 65535.');
  process.exit(1);
}

console.log(`Підключення до ${host}:${port}...`);

const client = bedrock.createClient({
  host,
  port,
  username,
  offline: false,
  profilesFolder: './profiles',
  onMsaCode(data) {
    console.log('\nПотрібен вхід у Microsoft/Xbox.');
    if (data.verification_uri) console.log('Відкрий:', data.verification_uri);
    if (data.user_code) console.log('Код підтвердження:', data.user_code);
    console.log('Не передавай цей код іншим людям.\n');
  }
});

client.on('join', () => {
  console.log('Успішно авторизовано та підключено до сервера.');
});

client.on('spawn', () => {
  console.log('Бот з’явився у світі. Очікує на сервері.');
});

client.on('text', (packet) => {
  if (packet.message) console.log('[ЧАТ]', packet.source_name || 'Сервер', packet.message);
});

client.on('disconnect', (packet) => {
  console.log('Відключено від сервера:', packet);
});

client.on('error', (error) => {
  console.error('Помилка з’єднання:', error.message || error);
});

process.on('SIGINT', () => {
  console.log('\nЗавершення роботи бота...');
  try { client.disconnect('Bot stopped'); } catch {}
  process.exit(0);
});
