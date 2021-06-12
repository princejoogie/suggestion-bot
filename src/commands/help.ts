import Discord from "discord.js";

module.exports = (msg: Discord.Message) => {
  let reply = "```\n";
  reply += "!suggest <your suggestion here>";
  reply += "```";
  msg.channel.send(reply);
};
