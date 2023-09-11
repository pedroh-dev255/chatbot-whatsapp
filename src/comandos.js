const { Client, NoAuth } = require('whatsapp-web.js');
const schedule = require('node-schedule');

function configureBotCommands(client) {
  client.on('message', async message => {
    const sender = message.from;
    const body = message.body.toLowerCase();

    if (body === '!help') {
      sendHelpMessage(sender, client);
    } else if (body === '!ping') {
      handlePing(sender, client);
    } else if (body.startsWith('!lembrar')) {
      handleLembrar(message, sender, client);
    }
  });
}

function sendHelpMessage(sender, client) {
  const helpMessage = `👾: *Sistemas Integrados no Bot*:
  !ping - Verifica Latencia do servidor.
  !lembrar - Inicia sistema de lembrete.
  `;
  client.sendMessage(sender, helpMessage);
}

function handlePing(sender, client) {
  const startTime = Date.now();

  client.sendMessage(sender, '👾: Pong!').then(sentMessage => {
    const endTime = Date.now();
    const latency = endTime - startTime;

    client.sendMessage(sender, `👾: ${latency}ms`);
  });
}

async function handleLembrar(message, sender, client) {
  const chat = await message.getChat();
  const body = message.body.toLowerCase();

  if (body.includes('hoje')) {
    const reminderTime = await askForReminderTime(chat, sender, client);
    if (!reminderTime) {
      client.sendMessage(sender, '👾: Lembrete cancelado.');
      return;
    }

    scheduleReminder(sender, body.replace('!lembrar hoje', ''), reminderTime, client);
  } else {
    const reminderText = await askForReminderText(chat, sender, client);
    if (!reminderText) {
      client.sendMessage(sender, '👾: Lembrete cancelado.');
      return;
    }

    const reminderDate = await askForReminderDate(chat, sender, client);

    if (!reminderDate) {
      client.sendMessage(sender, '👾: Lembrete cancelado.');
      return;
    }

    const reminderTime = await askForReminderTime(chat, sender, client);

    if (!reminderTime) {
      client.sendMessage(sender, '👾: Lembrete cancelado.');
      return;
    }

    scheduleReminder(sender, reminderText, reminderDate + ' ' + reminderTime, client);
  }
}

async function askForReminderText(chat, sender, client) {
  await client.sendMessage(sender, '👾: O que deseja ser lembrado? (Responda com o texto do lembrete ou "cancelar" para cancelar)');

  const response = await waitForUserResponse(sender, client);

  if (response.toLowerCase() === 'cancelar') {
    return null;
  }

  return response;
}

async function askForReminderDate(chat, sender, client) {
  await client.sendMessage(sender, '👾: Em que data deseja ser lembrado? (Responda com a data no formato DD/MM/AAAA ou "cancelar" para cancelar)');

  const response = await waitForUserResponse(sender, client);

  if (response.toLowerCase() === 'cancelar') {
    return null;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(response)) {
    await client.sendMessage(sender, '👾: Formato de data inválido. Use o formato DD/MM/AAAA.');
    return askForReminderDate(chat, sender, client);
  }

  return response;
}

async function askForReminderTime(chat, sender, client) {
  await client.sendMessage(sender, '👾: A que horas deseja ser lembrado? (Responda com o horário no formato HH:mm ou "cancelar" para cancelar)');

  const response = await waitForUserResponse(sender, client);

  if (response.toLowerCase() === 'cancelar') {
    return null;
  }

  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(response)) {
    await client.sendMessage(sender, '👾: Formato de horário inválido. Use o formato HH:mm.');
    return askForReminderTime(chat, sender, client);
  }

  return response;
}

function waitForUserResponse(sender, client) {
  return new Promise(resolve => {
    client.on('message', function listener(message) {
      if (message.from === sender) {
        resolve(message.body);
        client.removeListener('message', listener);
      }
    });
  });
}

function scheduleReminder(sender, text, time, client) {
  const [hours, minutes] = time.split(':');
  const rule = new schedule.RecurrenceRule();
  rule.hour = parseInt(hours);
  rule.minute = parseInt(minutes);

  const job = schedule.scheduleJob(rule, () => {
    client.sendMessage(sender, `👾 Lembrete: ${text}`);
  });
}

module.exports = {
  configureBotCommands,
};
