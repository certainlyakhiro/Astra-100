const log = require("./log");

module.exports = async ({
  api, event
}) => {
  const onStart = require("./onFuncs/onStart");
  const onReply = require("./onFuncs/onReply");
  const onEvent = require("./onFuncs/onEvent");
  const fonts = require("./fonts");

  const {
    reactions
  } = global.Astra;
  
  const box = new Object({
    react: (emoji) => {
      api.setMessageReaction(emoji, event.messageID, () => {}, true);
    },
    reply: (msg) => {
      return new Promise((res) => {
        api.sendMessage(
          msg,
          event.threadID,
          (_, info) => res(info),
          event.messageID,
        );
      });
    },
    add: (uid) => {
      api.addUserToGroup(uid, event.threadID);
    },
    kick: (uid) => {
      api.removeUserFromGroup(uid, event.threadID);
    },
    send: (msg) => {
      return new Promise((res) => {
        api.sendMessage(msg, event.threadID, (_, info) => res(info));
      });
    },
    edit: (msg, mid) => {
      return new Promise((res) => api.editMessage(msg, mid, () => res(true)));
    },
    waitForReaction: (body, next = "") => {
      return new Promise(async (resolve, reject) => {
        const i = await message.reply(body);
        reactions[i.messageID] = {
          resolve,
          reject,
          event: i,
          next,
          author: event.senderID,
        };
        log.info(`New pending reaction at: `, i, reactions);
      });
    },
  });

  if (event.type == "message_reaction" && reactions[event.messageID]) {
    log.info(`Detected Reaction at ${event.messageID}`);
    const {
      resolve,
      reject,
      event: i,
      author,
      next,
    } = reactions[event.messageID];
    try {
      if (author === event.userID) {
        log.info(`${event.reaction} Resolved Reaction at ${event.messageID}`);
        delete reactions[event.messageID];
        if (next) {
          message.edit(next, i.messageID);
        }

        resolve?.(event);
      } else {
        log.info(`${event.reaction} Pending Reaction at ${event.messageID} as author got reacted`);
      }
    } catch (err) {
      console.log(err);
      reject?.(err);
    } finally {};
  };
  
  switch (event.type) {
    case "message":
    case "message_reply":
    case "message_unsend":
      onStart({
        api, event, log, box, fonts
      });
      onReply({
        api, event, log, box, fonts
      });
      break;
    case "event":
      onEvent({
        api, event, log, box, fonts
      });
      break;
  };
};