module.exports = async function ({
  api,
  fonts,
  event,
  box,
  log
}) {
  const { onReply, commands } = global.Astra;
  const args = event.body.split(" ");

  if (event.messageReply) {
    try {
      const { messageReply: replier = {} } = event;

      if (onReply.has(replier.messageID)) {
        const { cmdName, ...data } = onReply.get(replier.messageID);
        const cmdFile = commands.get(cmdName);

        await cmdFile.onReply({
          api,
          event,
          fonts,
          args,
          box,
          log,
          data: data,
          cmdName,
        });
      }
    } catch (error) {
      box.reply(`❌ | An error occured while executing command: ${command}.
        
Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
    }
  }
};