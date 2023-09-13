// src/comandos/lembretes.js
const fs = require('fs');

// Carregar lembretes do arquivo
let lembretes = {};

if (fs.existsSync('lembretes.json')) {
  const fileContents = fs.readFileSync('lembretes.json', 'utf-8');
  try {
    lembretes = JSON.parse(fileContents);
  } catch (err) {
    console.error('Erro ao analisar o arquivo de lembretes:', err);
  }
}

// Função para adicionar um lembrete
function adicionarLembrete(usuario, lembrete, data, hora) {
  if (!lembretes[usuario]) {
    lembretes[usuario] = [];
  }

  // Validar a data e hora
  const dataRegex = /^(\d{2}\/\d{2}\/\d{4})$/;
  const horaRegex = /^(\d{2}:\d{2})$/;
  if (!data.match(dataRegex) || !hora.match(horaRegex)) {
    return false; // Não salva lembrete inválido
  }

  lembretes[usuario].push({ lembrete, data, hora });

  // Salvar a lista de lembretes no arquivo
  fs.writeFileSync('lembretes.json', JSON.stringify(lembretes));
  return true; // Lembrete adicionado com sucesso
}

// Função para listar os lembretes de um usuário
function listarLembretes(usuario) {
  const lista = lembretes[usuario] || [];
  return lista;
}

// Função para excluir um lembrete de um usuário
function excluirLembrete(usuario, numero) {
  const lista = lembretes[usuario] || [];

  if (numero >= 1 && numero <= lista.length) {
    const lembreteRemovido = lista.splice(numero - 1, 1)[0];
    // Atualizar a lista de lembretes do usuário
    lembretes[usuario] = lista;
    // Salvar a lista atualizada no arquivo
    fs.writeFileSync('lembretes.json', JSON.stringify(lembretes));
    return lembreteRemovido;
  } else {
    return null;
  }
}

function verificarLembretes(client) {
  setInterval(() => {
    const agora = new Date();
    for (const usuario in lembretes) {
      const lista = lembretes[usuario];
      for (let i = 0; i < lista.length; i++) {
        const lembrete = lista[i];
        const dataHoraLembrete = new Date(`${lembrete.data} ${lembrete.hora}`);
        if (agora >= dataHoraLembrete) {
          // Envie o lembrete para o usuário
          enviarLembrete(client, usuario, lembrete.lembrete);
          // Remova o lembrete da lista
          lista.splice(i, 1);
          i--; // Decrementa para continuar na próxima posição
        }
      }
    }
    // Salvar a lista atualizada no arquivo
    fs.writeFileSync('lembretes.json', JSON.stringify(lembretes));
  }, 10000); // Verifica a cada 10 segundos
}

async function enviarLembrete(client, usuario, lembrete) {
  await client.sendMessage(usuario, `Lembrete: ${lembrete}`);
}

module.exports = {
  adicionarLembrete,
  listarLembretes,
  excluirLembrete,
  verificarLembretes,
};
