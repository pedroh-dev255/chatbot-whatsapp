const { Client, NoAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');

const client = new Client({
    authStrategy: new NoAuth()
});

// Objeto para armazenar os lembretes programados
const reminders = {};

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    const sender = message.from;
    const body = message.body.toLowerCase();

    if (body === '!ping') {
        const startTime = Date.now();

        client.sendMessage(sender, 'Calculando ping...').then(sentMessage => {
            const endTime = Date.now();
            const latency = endTime - startTime;

            client.sendMessage(sender, `Pong! Latencia: ${latency}ms`);
        });
    } else if (body === '!lembrar') {
        const chat = await message.getChat();
        const reminderText = await askForReminderText(chat, sender);

        if (!reminderText) {
            client.sendMessage(sender, 'Lembrete cancelado.');
            return;
        }

        const reminderTime = await askForReminderTime(chat, sender);

        if (!reminderTime) {
            client.sendMessage(sender, 'Lembrete cancelado.');
            return;
        }

        scheduleReminder(sender, reminderText, reminderTime);
    }
});

client.initialize();

// Função para perguntar ao usuário o texto do lembrete
async function askForReminderText(chat, sender) {
    await client.sendMessage(sender, '👾: O que deseja ser lembrado? (Responda com o texto do lembrete ou "cancelar" para cancelar)');

    const response = await waitForUserResponse(sender);

    if (response.toLowerCase() === 'cancelar') {
        return null;
    }

    return response;
}

// Função para perguntar ao usuário o horário do lembrete
async function askForReminderTime(chat, sender) {
    await client.sendMessage(sender, '👾: A que horas deseja ser lembrado? (Responda com o horário no formato HH:mm ou "cancelar" para cancelar)');

    const response = await waitForUserResponse(sender);

    if (response.toLowerCase() === 'cancelar') {
        return null;
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(response)) {
        await client.sendMessage(sender, 'Formato de horário inválido. Use o formato HH:mm.');
        return askForReminderTime(chat, sender);
    }

    return response;
}

// Função para aguardar a resposta do usuário de maneira síncrona
function waitForUserResponse(sender) {
    return new Promise(resolve => {
        client.on('message', function listener(message) {
            if (message.from === sender) {
                resolve(message.body);
                client.removeListener('message', listener);
            }
        });
    });
}

// Função para agendar um lembrete
function scheduleReminder(sender, text, time) {
    const [hours, minutes] = time.split(':');
    const rule = new schedule.RecurrenceRule();
    rule.hour = parseInt(hours);
    rule.minute = parseInt(minutes);

    const job = schedule.scheduleJob(rule, () => {
        client.sendMessage(sender, `Lembrete: ${text}`);
    });

    // Armazena o lembrete programado
    reminders[sender] = job;
}
