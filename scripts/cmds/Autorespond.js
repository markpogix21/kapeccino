module.exports = {
config: {
name: "autorespondsnoprefix",
version: "1.0.0",
author: "Kyle",//don't change author niqqa kung ayaw mong sagadin ko pwet mo. 
cooldown: 4,
role: 0,
shortDescription: "Autoresponds with replies",
longDescription: "auto responsev2 With users niggAs ",
category: "fun",
guide: "𝗮𝘂𝘁𝗼𝗿𝗲𝘀𝗽𝗼𝗻𝗱",
},
onStart: async ({ api, event }) => {
// Blank onStart function as per the request
},
onChat: async ({ api, event }) => {
const { body, messageID, threadID } = event;

// Replies to specific words
const replies = {
"angas": "Uwu ako lang to lods😉", 
"Ulol": "tangina mo gago pa kiss nga",
"gf": " si Trisha na maganda",
"pogi": "Si jake https://www.facebook.com/profile.php?id=61559945955416", 
"Pogi": "mas pogi owner ko  https://www.facebook.com/profile.php?id=61559945955416",
"Ganda": "ganda padaw para maka chamba!!",
"Lods": "oh anu pogi ba si mark !!",
"nigga": "racist!!",
"tangina": "tangina modin gago",

};

// Reply based on triggers
for (const [trigger, reply] of Object.entries(replies)) {
if (body.toLowerCase().includes(trigger)) {
api.sendMessage(reply, threadID, messageID);
}
}
},
};
