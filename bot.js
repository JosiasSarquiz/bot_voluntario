const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const { IncomingWebhook } = require('@slack/webhook');

const token = 'RO70S5lUbT2tlRiyJNFVFm21';
const signingSecret = 'feaa23d352c7baf6a1e0af341672679a';
const webhookUrl = 'https://hooks.slack.com/services/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';

const web = new WebClient(token);
const events = createEventAdapter(signingSecret);
const webhook = new IncomingWebhook(webhookUrl);

const welcomeMessage = 'Bem-vindo(a) ao canal!';

const missionMessage = 'Nossa missão é ...';
const visionMessage = 'Nossa visão é ...';
const valuesMessage = 'Nossos valores são ...';

const swearWords = ['palavrão1', 'palavrão2', 'palavrão3'];

const aboutUsMessage = 'Nós somos ...';
const firstAidMessage = 'Em caso de emergência, ligue para o número de emergência e siga as instruções do operador.';

// Função para enviar mensagem para o canal
async function postMessage(channel, message) {
  try {
    const result = await web.chat.postMessage({ channel, text: message });
    console.log(`Mensagem enviada para o canal ${channel}: ${message}`);
  } catch (error) {
    console.error(`Erro ao enviar mensagem para o canal ${channel}: ${error}`);
  }
}

curl -X POST -H 'Content-type: application/json' --data '{"text":"Olá mundo!"}' https://hooks.slack.com/services/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

// Evento de boas-vindas para novos membros
events.on('team_join', async (event) => {
  const { id, name } = event.user;
  await postMessage('geral', `Olá <@${id}>, ${welcomeMessage}`);
});

// Comandos de bot
events.on('message', async (event) => {
  const { text, user, channel } = event;

  // Responder sobre missão, visão e valores
  if (text.includes('missão')) {
    await postMessage(channel, missionMessage);
  } else if (text.includes('visão')) {
    await postMessage(channel, visionMessage);
  } else if (text.includes('valores')) {
    await postMessage(channel, valuesMessage);
  }

  // Repreender o uso de palavrões
  if (swearWords.some((word) => text.toLowerCase().includes(word))) {
    await postMessage(channel, `<@${user}> Por favor, não use palavras ofensivas neste canal.`);
  }

  // Responder sobre instruções de nós e voltas e primeiros socorros
  if (text.includes('nós e voltas')) {
    await postMessage(channel, aboutUsMessage);
  } else if (text.includes('primeiros socorros')) {
    await postMessage(channel, firstAidMessage);
  }

  // Mover mensagens para canais apropriados
  if (text.includes('#canal1')) {
    await webhook.send({
      text,
      channel: '#canal1'
    });
  } else if (text.includes('#canal2')) {
    await webhook.send({
      text,
      channel: '#canal2'
    });
  }
});

// Iniciar o servidor e ouvir por eventos
events.start(process.env.PORT || 300)