const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { processarComando } = require('./src/comandos.js'); // Importe o módulo de comandos

// Crie um novo cliente WhatsApp
const client = new Client();

// Evento que é disparado quando a sessão é autenticada
client.on('authenticated', (session) => {
  console.log('Sessão autenticada com sucesso!');
  // Você pode salvar a sessão para evitar a autenticação em futuras execuções
});

// Evento que é disparado quando o QR code é gerado
client.on('qr', (qrCode) => {
  // Exibe o QR code no terminal
  qrcode.generate(qrCode, { small: true });
});

// Evento que é disparado quando a sessão é pronta para ser usada
client.on('ready', () => {
  console.log('Sessão pronta para uso!');
  // Agora você pode começar a interagir com o WhatsApp aqui
});

// Evento que é disparado quando ocorre um erro
client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação:', msg);
});

// Evento que é disparado quando uma mensagem é recebida
client.on('message', (message) => {
  // Processa comandos
  processarComando(client, message);
});

// Inicie a conexão com o WhatsApp
client.initialize();
