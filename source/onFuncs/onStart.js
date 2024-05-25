const _ = require("lodash");

module.exports = async ({
  api, event, log, box, fonts
}) => {
  if (!event.body) return;
  const {
    botPrefix,
    botAdmins,
    cooldowns,
    commands,
  } = global.Astra;

  try {
    let [command, ...args] = event.body
      .trim()
      .split(" ");

    if (
      event.body.startsWith(botPrefix)
    ) {
      command = command.slice(
        botPrefix.length
      );
    };

    const cmdName = command && command.toLowerCase();
    const i = commands.get(cmdName);
    
    if (i) { 
      if (i.config.role === 1) {
        if (
          !_.includes(
            botAdmins,
            Number(event.senderID)
          )
        ) {
          box.reply(`❌ | You dont have permission to use command: ${command}`);
          return;
        };
      };

      if (i.config.role === 2) {
        const { threadID } = event;
        if (
          !threadID.adminIDs.includes(
            event.senderID
          )
        ) {
          box.reply("❌ | You dont have permission to use command: ${command}");
        };
      };

      const now = Date.now();
      const cooldownKey = `${event.senderID}_${command.toLowerCase()}`;
      const cooldownTime = i.config.cooldown || 0;
      const cooldownExpiration = cooldowns[cooldownKey] || 0;
      const secondsLeft = Math.ceil((cooldownExpiration - now) / 1000);

      if (cooldownExpiration && now < cooldownExpiration) {
        return box.reply(
          `❌ | Please wait ${secondsLeft}s to use this command!`
        );
      };

      cooldowns[cooldownKey] = now + cooldownTime * 1000;

      const usePrefix = i.config.usePrefix !== false;

      if (usePrefix && !event.body.toLowerCase().startsWith(botPrefix)) {
        return;
      };

      try {
        await i.onStart({
          cmdName,
          api,
          event,
          args,
          log,
          box,
          fonts
        });
      } catch (error) {
        box.reply(`❌ | An error occured while executing command: ${command}.
        
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
      };
    } else if (event.body.startsWith(botPrefix)) {
      box.reply(
        `❌ | The command ${command ? `"${command}"` : "that you are using"} doesn't exist, use ${botPrefix}help to view available commands`,
      );
    };
  } catch (error) {
    log.error(error);
  };
};