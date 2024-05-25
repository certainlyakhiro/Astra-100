process.on("unhandledRejection", (error) => console.error(error));
process.on("unhandledException", (error) => console.error(error));

const moment = require("moment-timezone");
const express = require("express");
const figlet = require("figlet");
const fs = require("fs-extra");
const chalk = require("chalk");

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

const log = require("./source/log");
const configFile = fs.readFileSync(
  "./jsonfiles/config.json"
);
const config = JSON.parse(configFile);
const currentTime = moment.tz(
  config.timeZone
).format("LT");
const PORT = process.env.PORT || 3000;
const app = new express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(require("./routes/root"));

global.Astra = new Object({
  startTime: new Date(),
  config: config,
  botPrefix: config.botPrefix,
  botAdmins: config.botAdmins,
  commands: new Map(),
  events: new Map(),
  onReply: new Map(),
  cooldowns: new Object(),
  reactions: new Object(),
});

global.Data = new Object({
  currentUserID: null,
  apiData: null,
  eventData: null,
  allUsersID: new Map(),
  allThreadsID: new Map(),
});

async function start() {
  const utils = require("./utils");
  global.utils = utils;
  const appState = await fs.readJSON(
    "./jsonfiles/cookies.json"
  );

  figlet.text("Astra", (err, data) => {
    if (err) return log.error(err);

    console.log(chalk.magenta(data));
    console.log(chalk.blue(
      `> BoT Name: ${config.botName}`
    ));
    console.log(chalk.blue(
      `> BoT User: ${config.botUser}`
    ));
    console.log(chalk.blue(
      `> Current Time: ${currentTime}`
    ));
    console.log();

    require("./source/login")({
      appState
    });
  });
};

start();