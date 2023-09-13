const { executarPing } = require('./comandos/ping.js');
const { executarHelp } = require('./comandos/help.js');
const {
  adicionarLembrete,
  listarLembretes,
  excluirLembrete,
  verificarLembretes,
} = require('./comandos/lembretes.js');

// Função para processar comandos
async function processarComando(client, message) {
  const { from, body } = message;
  const comando = body.toLowerCase();

  if (comando === '!ping') {
    await executarPing(client, message);
  } else if (comando === '!help') {
    await executarHelp(client, message);
  } else if (comando.startsWith('!lembrete')) {
    const args = comando.split(' ');
  
    if (args.length === 1 || args[1] === 'help' || args[1] === 'ajuda') {
      await client.sendMessage(
        from,
        'Como usar o comando:\n\n!lembrete <mensagem> <data dd/mm/aaaa> <hora HH:MM>\n!lembrete hoje <mensagem> <hora HH:MM>\n!lembrete lista\n'
      );
    } else if (args[1] === 'hoje') {
      if (args.length < 4) {
        await client.sendMessage(
          from,
          'Formato incorreto. Use: !lembrete hoje <mensagem> <hora HH:MM>'
        );
      } else {
        const usuario = from;
        const lembrete = args.slice(2, -2).join(' ');
        const hora = args[args.length - 1];
        const dataAtual = new Date();
        const data = `${dataAtual.getDate()}/${
          dataAtual.getMonth() + 1
        }/${dataAtual.getFullYear()}`;
  
        // Adicionar o lembrete
        const lembreteAdicionado = adicionarLembrete(usuario, lembrete, data, hora);
  
        if (lembreteAdicionado) {
          await client.sendMessage(from, 'Lembrete adicionado com sucesso para hoje!');
        } else {
          await client.sendMessage(from, 'Formato de data ou hora inválido.');
        }
      }
    } else if (args[1] === 'lista') {
      const usuario = from;
      const lista = listarLembretes(usuario);
  
      if (lista.length === 0) {
        await client.sendMessage(from, 'Você não tem lembretes salvos.');
      } else {
        let resposta = 'Seus lembretes:\n\n';
        lista.forEach((lembrete, index) => {
          resposta += `${index + 1}. Data/Hora: ${lembrete.data} ${lembrete.hora}, Lembrete: ${lembrete.lembrete}\n`;
        });
        await client.sendMessage(from, resposta);
      }
    } else {
      const usuario = from;
      const lembrete = args.slice(1, -2).join(' ');
      const data = args[args.length - 2];
      const hora = args[args.length - 1];
  
      // Adicionar o lembrete
      const lembreteAdicionado = adicionarLembrete(usuario, lembrete, data, hora);
  
      if (lembreteAdicionado) {
        await client.sendMessage(from, 'Lembrete adicionado com sucesso!');
      } else {
        await client.sendMessage(from, 'Formato de data ou hora inválido.');
      }
    }
  }
  
}

module.exports = { processarComando, verificarLembretes };
