import Discord from "discord.js";
import { Suggestion } from "../bot-types";
import { db } from "../utils/firebase";

const getSuggestions = async (msg: Discord.Message) => {
  try {
    const res = await db
      .collection("suggestions")
      .orderBy("timestamp", "desc")
      .get();
    const suggestions = res.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Suggestion)
    );

    if (!suggestions.length) {
      let reply = "```\n";
      reply += "No Suggestions yet.\n";
      reply += "```";

      msg.channel.send(reply);
    } else {
      let reply = "```\n";
      reply += "Current Suggestions:\n";
      suggestions.map((e, i) => {
        reply += `${i + 1}. ${e.suggestion} (${e.votes.length} vote/s)\n`;
      });
      reply += "```";

      msg.channel.send(reply);
    }
  } catch (err) {
    console.log(err);
    msg.channel.send("`Something went wrong :(`");
  }
};

const getSuggestionsByID = async (msg: Discord.Message, id: string) => {
  try {
    const res = await db
      .collection("suggestions")
      .orderBy("timestamp", "desc")
      .where("user.id", "==", id)
      .get();
    const suggestions = res.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Suggestion)
    );

    let reply = "```\n";
    reply += `${msg.author.username}'s Suggestions:\n`;
    suggestions.map((e, i) => {
      reply += `${i + 1}. ${e.suggestion}\n`;
    });
    reply += "```";

    msg.channel.send(reply);
  } catch (err) {
    console.log(err);
    msg.channel.send("`Something went wrong :(`");
  }
};

module.exports = (msg: Discord.Message, args: string[]) => {
  if (!args.length) {
    getSuggestions(msg);
  } else if (args.join(" ").trim() === "mine") {
    getSuggestionsByID(msg, msg.author.id);
  } else {
    msg.reply("not a command");
  }
};
