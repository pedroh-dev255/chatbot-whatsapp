const { Client, NoAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { configureBotCommands } = require('./src/comandos');
const storage = require('node-persist');

const client = new Client({
  authStrategy: new NoAuth(),
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

// Load the saved session if available
storage.init().then(async () => {
  const sessionData = await storage.getItem('whatsapp-session');
  if (sessionData) {
    client.applySession(sessionData);
  }

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.initialize();

  configureBotCommands(client);
});

// Save the authentication session when it changes
client.on('authenticated', session => {
  storage.setItem('whatsapp-session', session);
});

// Save the authentication session when it logs out
client.on('disconnected', reason => {
  if (reason === 'disconnected' || reason === 'replaced') {
    storage.removeItem('whatsapp-session');
  }
});
