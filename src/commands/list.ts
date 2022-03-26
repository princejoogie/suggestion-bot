import Discord, { MessageEmbed } from "discord.js";
import { getSuggestions } from "../helpers";
import { Suggestion } from "../bot-types";
import { db } from "../utils/firebase";

const listSuggestions = async (msg: Discord.Message) => {
  try {
    const suggestions = await getSuggestions(msg);
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("All suggestions");

    if (suggestions.length > 0) {
      suggestions.map((e, i) => {
        embed.addField(
          `${i + 1}. (${e.votes.length} vote/s)`,
          `${e.suggestion}`
        );
      });
    } else {
      embed.addField("No Suggestions yet.", "use `>suggest` to add one");
    }

    msg.channel.send(embed);
  } catch (err) {
    console.log(err);
    msg.channel.send("`Something went wrong :(`");
  }
};

const listResolved = async (msg: Discord.Message) => {
  try {
    const resolvedSuggestions = await db
      .collection("channels")
      .doc(msg.channel.id)
      .collection("resolved")
      .orderBy("timestamp", "desc")
      .get();

    const resolved = resolvedSuggestions.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Suggestion)
    );

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Resolved Suggestions");

    if (resolved.length > 0) {
      resolved.map((e, i) => {
        embed.addField(
          `${i + 1}. ${e.suggestion} (${e.votes.length} vote/s)`,
          `Suggested by: ${e.user.name}`
        );
      });
    } else {
      embed.addField(
        "No Resolved Suggestions yet.",
        "use `>resolve` to add one"
      );
    }

    msg.channel.send(embed);
  } catch (err) {
    msg.channel.send("`Something went wrong :(`");
  }
};

const listSuggestionsByID = async (msg: Discord.Message, id: string) => {
  try {
    const suggestions = await getSuggestions(msg, id);
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Suggestions")
      .setDescription(`suggestions by <@${id}>`)
      .setThumbnail(msg.author.avatarURL() ?? "");

    if (suggestions.length > 0) {
      suggestions.map((e) => {
        embed.addField(`(${e.votes.length} vote/s)`, `${e.suggestion}`);
      });
    } else {
      embed.addField("No Suggestions yet.", "use `>suggest` to add one");
    }

    msg.channel.send(embed);
  } catch (err) {
    console.log(err);
    msg.channel.send("`Something went wrong :(`");
  }
};

module.exports = (msg: Discord.Message, args: string[]) => {
  if (!args.length) {
    listSuggestions(msg);
  } else if (args.join(" ").trim() === "mine") {
    listSuggestionsByID(msg, msg.author.id);
  } else if (args.join(" ").trim() === "resolved") {
    listResolved(msg);
  } else {
    msg.reply("Not a command.");
  }
};
