const login = require("./fca-unofficial");
const log = require("./log");

module.exports = async ({
  appState
}) => {
  const utils = global.utils;
  const {
    config
  } = global.Astra;
  let {
    currentUserID,
    apiData,
    eventData
  } = global.Data;

  login({
    appState
  }, (err, api) => {
    if (err) {
      const error = JSON.stringify(
        err, null, 2
      );
      return log.error(error);
    };

    apiData = api;
    currentUserID = api.getCurrentUserID();
    api.setOptions(config.fcaOptions);
    utils.loadAll({ api });

    api.listen(async (err, event) => {
      if (err) {
        const error = JSON.stringify(
          err, null, 2
        );
        return log.error(error);
      };

      if (
        event.senderID
        ===
        currentUserID
      ) return;

      require("./listen")({
        api,
        event
      });
    });
  });
};