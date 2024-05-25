module.exports = new Object({
  config: new Object({
    name: "uid",
    version: "1.0",
    description: "get uid",
    author: "Rui",
    role: 0,
    usePrefix: false,
  }),

  onStart: async ({ api, event }) => {
    if (!event.messageReply) {
      api.shareContact(
        `Your ID: ${event.senderID}`,
        event.senderID,
        event.threadID
      );
    } else {
      api.shareContact(
        `Replied User's ID: ${event.messageReply.senderID}`,
        event.messageReply.senderID,
        event.threadID
      );
    }
  },
});