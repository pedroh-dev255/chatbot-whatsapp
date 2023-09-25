async function executarHelp(client, message) {
    const comandosDisponiveis = [
      '!ping - Verificar a latência do servidor',
      '!help - Mostrar esta lista de comandos',
      '!lembrar - Inicia sistema de lembrete.\n'
    ];
  
    const listaDeComandos = comandosDisponiveis.join('\n');
    await client.sendMessage(message.from, `🤖: Comandos disponíveis:\n${listaDeComandos}`);
  }
  
  module.exports = { executarHelp };