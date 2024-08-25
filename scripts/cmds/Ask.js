,cmd install Ask.js const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userId, messageID) {
  const services = [
    { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: userId } },
    { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
    { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
  ];

  let response = "𝙃𝙚𝙮, 𝙢𝙮 𝙣𝙖𝙢𝙚 𝙞𝙨 𝙥𝙤𝙨𝙞𝙩𝙞𝙫𝙚 𝙖𝙞 𝙖𝙨𝙠 𝙢𝙚 𝙖𝙣𝙮 𝙦𝙪𝙚𝙨𝙩𝙞𝙤𝙣𝙨 𝙢𝙖𝙝𝙖𝙡 ✏, 𝙄'𝙡𝙡 𝙗𝙚 𝙝𝙖𝙥𝙥𝙮 𝙩𝙤 𝙖𝙣𝙨𝙬𝙚𝙧 𝙮𝙤𝙪";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
  }

  return { response, messageID };
}

 module.exports = {
  config: {
    name: 'ai',
    author: 'mark pogi',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage(`\n╭┈◈『 ♠︎ 』 𝙔𝙐𝙏𝘼 𝘼𝙄 ☪️
┆
╰┈◈➤\nPlease provide a question or statement.\n━━━━━━━━━━━━━━━━
𝙤𝙬𝙣𝙚𝙧: https://www.facebook.com/bilat1552`, event.threadID, event.messageID);
      return;
    }

    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
    api.sendMessage(`\n╭┈◈『 ♠︎ 』 𝙔𝙐𝙏𝘼 𝘼𝙄 ☪️
┆
╰┈◈➤\n${response}\n━━━━━━━━━━━━━━━━
𝙊𝙬𝙣𝙚𝙧 2𝙣𝙙 𝙖𝙘𝙘: https://www.facebook.com/profile.php?id=61563419107727`, event.threadID, messageID);
  },
  onChat: async function ({ event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
      message.reply(`\n╭┈◈『 ♠︎ 』 𝙔𝙐𝙏𝘼 𝘼𝙄 ☪️
┆
╰┈◈➤\n${response}\n━━━━━━━━━━━━━━━━
𝙈𝙮 𝙤𝙬𝙣𝙚𝙧: https://www.facebook.com/bilat1552`, messageID);
    }
  }
};
