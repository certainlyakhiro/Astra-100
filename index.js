const log = require("./source/log");
const {
  spawn
} = require("child_process");

async function start() {
  const bot = await spawn(
    "bun astra.js", {
      env: process.env,
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    },
  );

  bot.on("close", (code) => {
    if (code === 2) {
      log.info("Astra is restarting...");
      start();
    };
  });
};

start();