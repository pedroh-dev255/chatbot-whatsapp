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
  } else if (comando.startsWith('!lembrar')) {
    const args = comando.split(' ');

    if (args.length === 1 || args[1] === 'help' || args[1] === 'ajuda') {
      await client.sendMessage(
        from,
        'Como usar o comando:\n\n!lembrar <mensagem> <data dd/mm/aaaa> <hora HH:MM>\n!lembrar hoje <mensagem> <hora HH:MM>\n!lembrar lista\n!lembrar excluir <número>'
      );
    } else if (args[1] === 'hoje') {
      const usuario = from;
      const lembrete = args.slice(2, -1).join(' ');
      const hora = args[args.length - 1];
      const dataAtual = new Date();
      const data = `${dataAtual.getDate()}/${
        dataAtual.getMonth() + 1
      }/${dataAtual.getFullYear()}`;

      // Adicionar o lembrete
      const lembreteAdicionado = adicionarLembrete(usuario, lembrete, data, hora);

      if (lembreteAdicionado) {
        await client.sendMessage(from, 'Lembrete adicionado com sucesso!');
      } else {
        await client.sendMessage(from, 'Formato de data ou hora inválido.');
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
    } else if (args[1] === 'excluir') {
      const usuario = from;
      const numero = parseInt(args[2], 10);

      if (!isNaN(numero)) {
        const lembreteRemovido = excluirLembrete(usuario, numero);

        if (lembreteRemovido) {
          await client.sendMessage(
            from,
            `Lembrete removido com sucesso: ${lembreteRemovido.data} ${lembreteRemovido.hora}, ${lembreteRemovido.lembrete}`
          );
        } else {
          await client.sendMessage(from, 'Número de lembrete inválido.');
        }
      } else {
        await client.sendMessage(from, 'Número de lembrete inválido.');
      }
    }
  }
}

module.exports = { processarComando, verificarLembretes };
