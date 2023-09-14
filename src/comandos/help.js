async function executarHelp(client, message) {
    const comandosDisponiveis = [
      '!ping - Verificar a latência do servidor',
      '!help - Mostrar esta lista de comandos',
      'Como usar o comando !lembrete:\n\n!lembrete <mensagem> <data dd/mm/aaaa> <hora HH:MM>\n!lembrete lista\n'
    ];
  
    const listaDeComandos = comandosDisponiveis.join('\n');
    await client.sendMessage(message.from, `🤖: Comandos disponíveis:\n${listaDeComandos}`);
  }
  
  module.exports = { executarHelp };