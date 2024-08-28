const minecraftFacts = [ 
	"Call of Duty Mobile was released on October 1, 2019.",
		"The game is available on both iOS and Android devices.",
		"The world's oldest known recipe is for beer.",
		"Bananas are berries, but strawberries are not.",
		"Cows have best friends and can become stressed when they are separated.",
		"The shortest war in history was between Britain and Zanzibar on August 27, 1896; Zanzibar surrendered after 38 minutes.",
		"The average person walks the equivalent of three times around the world in a lifetime.",
		"Polar bears are left-handed.",
		"The unicorn is Scotland's national animal.",
		"A group of flamingos is called a 'flamboyance'.",
		"There are more possible iterations of a game of chess than there are atoms in the known universe.",
		"The smell of freshly-cut grass is actually a plant distress call.",
		"A day on Venus is longer than its year.",
		"Honeybees can recognize human faces.",
		"Wombat poop is cube-shaped.",
		"The first oranges weren't orange.",
		"The longest time between two twins being born is 87 days.",
		"A bolt of lightning is six times hotter than the sun.",
		"A baby puffin is called a puffling.",
		"A jiffy is an actual unit of time: 1/100th of a second.",
		"The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
		"There's a species of jellyfish that is biologically immortal.",
		"The Eiffel Tower can be 6 inches taller during the summer due to the expansion of the iron.",
		"The Earth is not a perfect sphere; it's slightly flattened at the poles and bulging at the equator.",
		"A hummingbird weighs less than a penny.",
		"Koalas have fingerprints that are nearly identical to humans'.",
		"There's a town in Norway where the sun doesn't rise for several weeks in the winter, and it doesn't set for several weeks in the summer.",
		"A group of owls is called a parliament.",
		"The fingerprints of a koala are so indistinguishable from humans' that they have on occasion been confused at a crime scene.",
		"The Hawaiian alphabet has only 13 letters.",
		"The average person spends six months of their life waiting for red lights to turn green.",
		"A newborn kangaroo is about 1 inch long.",
		"The oldest known living tree is over 5,000 years old.",
		"Coca-Cola would be green if coloring wasn't added to it.",
		"A day on Mars is about 24.6 hours long.",
		"The Great Wall of China is not visible from space without aid.",
		"A group of crows is called a murder.",
		"There's a place in France where you can witness an optical illusion that makes you appear to grow and shrink as you walk down a hill.",
		"The world's largest desert is Antarctica, not the Sahara."
		];


const randomFact = minecraftFacts[Math.floor(Math.random() * minecraftFacts.length)];

const moment = require("moment-timezone");
const manilaTime = moment.tz('Asia/Manila');
const formattedDateTime = manilaTime.format('MMMM D, YYYY h:mm A');

const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Send notification from admin to all box"
		},
		category: "owner",
		guide: {
			en: "{pn} <tin nhắn>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm",
			notification: "Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)",
			sendingNotification: "Bắt đầu gửi thông báo từ admin bot đến %1 nhóm chat",
			sentNotification: "✅ Đã gửi thông báo đến %1 nhóm thành công",
			errorSendingNotification: "Có lỗi xảy ra khi gửi đến %1 nhóm:\n%2"
		},
		en: {
			missingMessage: "Please enter the message you want to send to all groups",
			notification: "📬𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗙𝗥𝗢𝗠 𝗔𝗗𝗠𝗜𝗡 𝗧𝗢 𝗔𝗟𝗟 𝗖𝗛𝗔𝗧 𝗚𝗥𝗢𝗨𝗣S",
			sendingNotification: "Start sending notification from admin bot to %1 chat groups",
			sentNotification: "✅ Sent notification to %1 groups successfully",
			errorSendingNotification: "An error occurred while sending to %1 groups:\n%2"
		}
	},

	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
		const { delayPerGroup } = envCommands[commandName];
		if (!args[0])
			return message.reply(getLang("missingMessage"));
		const formSend = {
			body: `${getLang("notification")}\n࿇═━━━✥◈✥━━══ ࿇\n             📘𝗠𝗘𝗦𝗦𝗔𝗚𝗘:\n              “${args.join(" ")}“\n࿇══━━✥◈✥━━══ ࿇\n📅 | ⏰ 𝗗𝗔𝗧𝗘 𝗔𝗡𝗗 𝗧𝗜𝗠𝗘 :\n${formattedDateTime}\n\n📍𝗥𝗮𝗻𝗱𝗼𝗺 𝗤𝘂𝗼𝘁𝗲𝘀: ${randomFact}\n\nℹ | type ,callad [your own prompt] to message admin. `,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
			)
		};

		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
		message.reply(getLang("sendingNotification", allThreadID.length));

		let sendSucces = 0;
		const sendError = [];
		const wattingSend = [];

		for (const thread of allThreadID) {
			const tid = thread.threadID;
			try {
				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});
				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {
			try {
				await sended.pending;
				sendSucces++;
			}
			catch (e) {
				const { errorDescription } = e;
				if (!sendError.some(item => item.errorDescription == errorDescription))
					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});
				else
					sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
			}
		}

		let msg = "";
		if (sendSucces > 0)
			msg += getLang("sentNotification", sendSucces) + "\n";
		if (sendError.length > 0)
			msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`, ""));
		message.reply(msg);
	}
};
