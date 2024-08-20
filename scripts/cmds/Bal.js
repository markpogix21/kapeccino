module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.2",
		author: "mark pogi ",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person"
		},
		category: "economy",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn}: view your money"
				+ "\n   {pn} <@tag>: view the money of the tagged person"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$"
		},
		en: {
			money: `╞════𖠁🏛𖠁════╡

💸💰 𝙮𝙤𝙪 𝙝𝙖𝙫𝙚 𝙢𝙤𝙣𝙚𝙮 💸💰
         %1$
╞════𖠁🏛𖠁════╡
 𝙮𝙤𝙪 𝙣𝙚𝙚𝙙 𝙩𝙤 𝙥𝙡𝙖𝙮 𝙩𝙤 𝙜𝙚𝙩 𝙢𝙤𝙧𝙚 𝙢𝙤𝙣𝙚𝙮 𝙥𝙡𝙖𝙮 𝙨𝙡𝙤𝙩 𝙩𝙤 𝙢𝙖𝙠𝙚 𝙢𝙤𝙧𝙚 𝙢𝙤𝙣𝙚𝙮 😾━━━━━━━━━━━━━━`,
			moneyOf: "%1 has %2$"
		}
	},

	onStart: async function ({ message, usersData, event, getLang }) {
		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
			}
			return message.reply(msg);
		}
		const userData = await usersData.get(event.senderID);
		message.reply(getLang("money", userData.money));
	}
};
