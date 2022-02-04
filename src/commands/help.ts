import Discord, { MessageEmbed } from "discord.js";

const helps = [
  {
    name: "`suggest <text>`",
    description: "Adds your suggestion in database",
  },
  {
    name: "`list`",
    description: "List all suggestions",
  },
  {
    name: "`list mine`",
    description: "List all your suggestions",
  },

  {
    name: "`delete <number>`",
    description: "Delete your suggestion (use after `list`)",
  },
  {
    name: "`vote <number>`",
    description: "Vote a suggestion (use after `list`)",
  },
  {
    name: "`unvote <number>`",
    description: "Unvote your suggestion (use after `list`)",
  },
];

module.exports = (msg: Discord.Message) => {
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Help")
    .setDescription("prefix: `>`");
  helps.map((e, i) => {
    embed.addField(`${i + 1}. ${e.name}`, e.description);
  });
  msg.channel.send(embed);
};
