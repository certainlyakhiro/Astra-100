const fs = require("fs-extra");
const { bold, sans } = require(process.cwd() + "/source/fonts.js");

module.exports = new Object({
  config: new Object({
    name: "restart",
    description: "restart bot system",
    author: "Rui",
    usage: "{pn}",
    role: 1,
  }),

  onStart: async ({ api, event }) => {
    const startTime = Date.now();

    const info = await api.sendMessage(`${bold("💽 | Restart")}
━━━━━━━━━━━━━━━
${sans("Bot is Restarting...")}`, event.threadID);

    await fs.writeFile(
      `${__dirname}/tmp/restart.txt`,
      `${info.threadID}_${info.messageID}_${startTime}`
    );

    process.exit(2);
  },

  onLoad: async ({ api }) => {
    const filePath = `${__dirname}/tmp/restart.txt`;

    if (fs.existsSync(filePath)) {
      const data = await fs.readFile(filePath, 'utf8');
      const [threadID, messageID, startTime] = data.split('_');

      const restartTime = parseInt(startTime);
      const elapsedTimeInSeconds = Math.floor((Date.now() - restartTime) / 1000);

      await api.editMessage(`${bold("💽 | Restart")}
━━━━━━━━━━━━━━━
${sans("Bot has Restarted!")}
${sans(`Elapsed Time: ${elapsedTimeInSeconds} seconds`)}`, messageID);

      await fs.remove(filePath);
    }
  },
});