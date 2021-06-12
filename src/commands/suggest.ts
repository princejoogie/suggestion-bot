import Discord from "discord.js";
import { db, timestamp } from "../utils/firebase";
import { Suggestion, User } from "../bot-types";

const addSuggestion = async (suggestion: Suggestion) => {
  await db.collection("suggestions").add(suggestion);
};

module.exports = (msg: Discord.Message, args: string[]) => {
  const suggestion = args.join(" ");
  const user: User = {
    id: msg.author.id,
    photoURL: msg.author.avatarURL() ?? "",
    name: msg.author.username,
  };
  const data: Suggestion = {
    suggestion,
    user,
    timestamp: timestamp(),
    votes: [],
  };

  addSuggestion(data);

  msg.reply("Suggestion Added!");
};
