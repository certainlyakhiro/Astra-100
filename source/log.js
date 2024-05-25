const moment = require("moment-timezone");
const chalk = require("chalk");

const config = require(
  "../jsonfiles/config"
);
const currentTime = moment.tz(
  config.timeZone
).format("LT");

const log = new Object({
  info: (message) => {
    console.log(chalk.grey(`[ ${currentTime} | ℹ️ ]: ${message}`));
  },
  warn: (message) => {
    console.log(chalk.yellow(`[ ${currentTime} | ⚠️ ]: ${message}`));
  },
  success: (message) => {
    console.log(chalk.green(`[ ${currentTime} | ✅ ]: ${message}`));
  },
  error: (message) => {
    console.error(chalk.red(`[ ${currentTime} | ❌ ]: ${message}`));
  },
});

module.exports = log;