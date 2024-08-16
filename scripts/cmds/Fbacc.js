const accounts = [];

function generateAccount(email, password) {
  return `[Generate Successfully]\n` +
         `Email: ${email}\n` + 
         `Key: ${password}`;
}

module.exports = {
  config: {
    name: "fbaccount",
    aliases: ['fbacc'],
    version: "69",
    author: "?/zed | Ace",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Facebook Stock Account."
    },
    longDescription: {
      en: "Stock the Account in Facebook."
    },
    category: "𝗔𝗗𝗠𝗜𝗡/𝗢𝗪𝗡𝗘𝗥/𝗕𝗢𝗫𝗖𝗛𝗔𝗧/𝗡𝗢𝗧𝗖𝗠𝗗",
    guides: {
      en: "   {pn} add <email> <password>"
        + "\n{pn} get - get the account"
        + "\n{pn} list - To view account list"
    }
  }, 
  
  onStart: async function ({ api, event, args }) {
  const [action] = args;

  if (action === "get") {
    if (accounts.length > 0) {
      const { email, password } = accounts.shift();
      api.sendMessage(generateAccount(email, password), event.threadID);
    } else {
      api.sendMessage("No accounts available.", event.threadID);
    }
  } else if (action === "add") {
    const [, email, password] = args;
    if (email && password) {
      accounts.push({ email, password });
      api.sendMessage("Account added to stock.", event.threadID);
    } else {
      api.sendMessage("Invalid format. Please provide valid email and password to add to the stock.", event.threadID);
    }
  } else if (action === "list") {
    api.sendMessage(`Number of stocked accounts: ${accounts.length}`, event.threadID);
  } else {
    api.sendMessage("Invalid format. Usage: !fbacc get or !fbacc add <email> <password> or !fbacc list", event.threadID);
    }
  },
};
