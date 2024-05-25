module.exports = async function ({
  api,
  message,
  event,
  log,
  fonts
}) {
  const { events } = global.client;
  if (!event.body) return;

  try {
    for (const { config, onEvent } of events.values()) {
      if (event && config.name) {
        const args = event.body?.split("");
        await onEvent({
          api,
          box,
          event,
          log,
          fonts,
          args
        });
      }
    }
  } catch (error) {
    box.reply(`❌ | An error occured while executing event: ${config.name}.

Message: ${error.message}
ErrorType: ${error.name}
Stack: ${error.stack}`);
  };
};