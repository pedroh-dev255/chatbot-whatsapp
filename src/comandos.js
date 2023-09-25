const { executarPing } = require('./comandos/ping.js');
const { executarHelp } = require('./comandos/help.js');
const { processarLembrete } = require('./comandos/lembretes.js');

// Função para processar comandos
async function processarComando(client, message) {
  const sender = message.from;
  const { from, body } = message;
  const comando = body.toLowerCase();

  if (comando === '!ping') {
    await executarPing(client, message);
  } else if (comando === '!help') {
    await executarHelp(client, message);
  } else if (comando === '!lembrar') {
    await processarLembrete(client, message);
  }
}

module.exports = { processarComando };
