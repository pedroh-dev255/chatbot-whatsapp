async function executarPing(client, message) {
    const start = new Date();
    await message.reply('🤖: Pong!');
    const end = new Date();
    const diff = end - start;

    await client.sendMessage(message.from, `🤖: ${diff} ms`);
  }
  
  module.exports = { executarPing };
  