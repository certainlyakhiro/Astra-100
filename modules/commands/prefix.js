module.exports = new Object({
  config: new Object({
    name: "prefix",
    version: "1.0",
    author: "Rui",
    usage: "prefix",
    usePrefix: false,
  }),

  onStart: async ({
    box
  }) => {
    const { botPrefix } = global.Astra;

    box.reply(`Astra's Prefix: ${botPrefix}`);
  },
})