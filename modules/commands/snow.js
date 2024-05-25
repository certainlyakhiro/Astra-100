const axios = require("axios");

module.exports = {
  config: {
    name: "snow",
    developer: "hazey_API",
    description: "Talk to snowflakeAI",
    usePrefix: false,
    cooldown: 2,
    usage: "snow [ query ]"
  },
  async onStart({ box, args }) {
    const query = args.join(" ");
    if (!query) {
      box.react("ℹ️");
      return box.send(`ℹ️ | Please provide a message`);
    }
    try {
      box.send(`Please wait..`);
      const response = await axios.get(`https://hashier-api-snowflake.vercel.app/api/snowflake?ask=${encodeURIComponent(query)}`);
      const answer = response.data.output;
      box.edit(`${answer}`);
    } catch (error) {
      console.log(error);
      box.react("🔴");
      box.send(`ERROR: ${error.message}`);
    }
  }
}