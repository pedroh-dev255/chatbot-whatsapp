const schedule = require('node-schedule');
const reminders = {};

async function askForReminderText(client, chat, sender) {
  await client.sendMessage(sender, '👾: O que deseja ser lembrado? (Responda com o texto do lembrete ou "cancelar" para cancelar)');

  return new Promise((resolve) => {
    client.on('message', function listener(message) {
      if (message.from === sender) {
        resolve(message.body);
        client.removeListener('message', listener);
      }
    });
  });
}

async function askForReminderDateTime(client, chat, sender) {
  await client.sendMessage(sender, '👾: Quando deseja ser lembrado? (Responda com a data no formato DD/MM/YYYY e a hora no formato HH:mm ou "cancelar" para cancelar)');

  return new Promise((resolve) => {
    client.on('message', function listener(message) {
      if (message.from === sender) {
        resolve(message.body);
        client.removeListener('message', listener);
        client.sendMessage(sender, '👍 Lembrete agendado com sucesso!');
      }
    });
  });
}

// Função para aguardar a resposta do usuário de maneira síncrona
async function waitForUserResponse(client, sender) {
  return new Promise((resolve) => {
    client.on('message', function listener(message) {
      if (message.from === sender) {
        resolve(message.body);
        client.removeListener('message', listener);
      }
    });
  });
}

async function scheduleReminder(client, sender, text, dateTime) {
  const [date, time] = dateTime.split(' ');
  const [day, month, year] = date.split('/');
  const [hours, minutes] = time.split(':');

  const rule = new schedule.RecurrenceRule();
  rule.year = parseInt(year);
  rule.month = parseInt(month) - 1; // Mês começa em 0 (janeiro é 0, fevereiro é 1, etc.)
  rule.date = parseInt(day);
  rule.hour = parseInt(hours);
  rule.minute = parseInt(minutes);

  const job = schedule.scheduleJob(rule, () => {
    client.sendMessage(sender, `👾 Lembrete: ${text}`);
    // Enviar mensagem de confirmação
    
  });

  // Armazena o lembrete programado
  reminders[sender] = job;
}

async function processarLembrete(client, message) {
  const sender = message.from;
  const chat = await message.getChat();

  const reminderText = await askForReminderText(client, chat, sender);

  if (!reminderText) {
    client.sendMessage(sender, '👾: Lembrete cancelado.');
    return;
  }

  const reminderTime = await askForReminderDateTime(client, chat, sender);

  if (!reminderTime) {
    client.sendMessage(sender, '👾: Lembrete cancelado.');
    return;
  }

  scheduleReminder(client, sender, reminderText, reminderTime);
}

module.exports = {
  processarLembrete,
};
