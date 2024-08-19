const fs = require("fs-extra");
const { utils } = global;
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    shortDescription: "Change bot's prefix",
    longDescription: "Change the command prefix of the bot in your chat box or the entire bot system (admin only)",
    category: "config",
    guide: {
      vi: "   {pn} <new prefix>: change the prefix in your chat box"
        + "\nExample:"
        + "\n{pn} #"
        + "\n{pn} <new prefix> -g: change the prefix in the bot system (admin only)"
        + "\nExample:"
        + "\n{pn} # -g"
        + "\n{pn} reset: reset the prefix in your chat box to default",
      en: "   {pn} <new prefix>: change the prefix in your chat box"
        + "\nExample:"
        + "\n{pn} #"
        + "\n{pn} <new prefix> -g: change the prefix in the bot system (admin only)"
        + "\nExample:"
        + "\n{pn} # -g"
        + "\n{pn} reset: reset the prefix in your chat box to default"
    }
  },

  langs: {
    vi: {
      reset: "The prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change the prefix of the bot system",
      confirmGlobal: "Please react to this message to confirm the prefix change for the entire bot system",
      confirmThisThread: "Please react to this message to confirm the prefix change for your chat box",
      successGlobal: "The prefix of the bot system has been changed to: %1",
      successThisThread: "The prefix of your chat box has been changed to: %1",
      myPrefix: "𝑯𝑬𝒀 𝑰 𝑨𝑴 𝙢𝙖𝙧𝙠 𝙗𝙤𝙩 𝑴𝒀 𝑷𝑹𝑬𝑭𝑰𝑿???\n\n🌐 Bot System Prefix: %1\nYour Chat Box Prefix: %2\n\n📘|💠𝗗𝗔𝗧𝗘 𝗔𝗡𝗗 𝗧𝗜𝗠𝗘: %3\n\n𝗢𝗪𝗡𝗘𝗥: 𝐦𝐚𝐫𝐤 𝐩𝐨𝐠𝐢ツ\n\n𝗕𝗢𝗧 𝗖𝗥𝗘𝗔𝗧𝗢𝗥: 𝙢𝙖𝙧𝙠 𝙥𝙤𝙜𝙟"
    },
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change the prefix of the bot system",
      confirmGlobal: "Please react to this message to confirm the prefix change for the entire bot system",
      confirmThisThread: "Please react to this message to confirm the prefix change for your chat box",
      successGlobal: "The prefix of the bot system has been changed to: %1",
      successThisThread: "The prefix of your chat box has been changed to: %1",
      myPrefix: "\n𝑯𝑬𝒀 𝑰 𝑨𝑴 𝐌𝐚𝐫𝐤 𝑩𝑶𝑻 𝑴𝒀 𝑷𝑹𝑬𝑭𝑰𝑿???\n\n\n𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥: https://www.facebook.com/bilat1552\n\n𝗕𝗢𝗧 𝗖𝗥𝗘𝗔𝗧𝗢𝗥: 𝐦𝐚𝐫𝐤\n\n⚙ 𝗕𝗼𝘁 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅: [ %1 ]\n💬𝗬𝗼𝘂𝗿 𝗖𝗵𝗮𝘁 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅: [ %2 ]\n\n\n 📘|💠𝗗𝗔𝗧𝗘 𝗔𝗡𝗗 𝗧𝗜𝗠𝗘:\n %3\n"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] === 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g") {
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    }
    else {
      formSet.setGlobal = false;
    }

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      return () => {
        const philippinesTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
        return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID), philippinesTime));
      };
    }
    else if (event.body && event.body.toLowerCase() === "timezone philippines") {
      return () => {
        return message.reply(getLang("philippinesTimezone"));
      };
    }
  }
};
