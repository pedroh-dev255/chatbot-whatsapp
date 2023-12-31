const { Client } = require('whatsapp-web.js');
const { processarComando } = require('./src/comandos.js');
const qrcode = require('qrcode');
const express = require('express');
const http = require('http');

const app = express();
let server;
const client = new Client();

client.on('qr', async (qrCode) => {
  // Exibe o QR code no terminal
  qrcode.toString(qrCode, { type: 'terminal' }, (err, url) => {
    if (err) {
      console.error('Erro ao gerar QR code:', err);
    } else {
      console.log(url);
    }
  });

  // Configure o servidor web e inicie somente quando o QR code for gerado
  server = http.createServer(app);

  app.get('/qrcode', async (req, res) => {
    try {
      const qrDataURL = await qrcode.toDataURL(qrCode);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`<img src="${qrDataURL}" alt="QR Code">`);
      res.end();
    } catch (err) {
      console.error('Erro ao criar QR code:', err);
      res.status(500).send('Erro ao criar QR code.');
    }
  });

  server.listen(1024, () => {
    console.log('Servidor rodando em http://localhost:1024/qrcode');
  });
});

client.on('authenticated', (session) => {
  console.log('Sessão autenticada com sucesso!');
  // Você pode salvar a sessão para evitar a autenticação em futuras execuções

  // Encerre o servidor web após a autenticação
  if (server) {
    server.close();
    console.log('Servidor web encerrado após a autenticação.');
  }
});

client.on('ready', () => {
  console.log('Sessão pronta para uso!');
  // Agora você pode começar a interagir com o WhatsApp aqui
});

client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação:', msg);
});

client.on('message', (message) => {
  // Processa comandos
  processarComando(client, message);
});

// Inicie a conexão com o WhatsApp
client.initialize();