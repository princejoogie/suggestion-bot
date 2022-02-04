import Discord from "discord.js";
import { getSuggestions } from "../helpers";
import { Suggestion } from "../bot-types";
import { db } from "../utils/firebase";

const isNumeric = (str: any) => {
  if (typeof str != "string") return false;
  // @ts-ignore
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const isAuthorOrAdmin = (suggestion: Suggestion, msg: Discord.Message) => {
  return (
    suggestion.user.id === msg.author.id ||
    msg.member?.hasPermission("ADMINISTRATOR") ||
    msg.member?.hasPermission("BAN_MEMBERS")
  );
};

const deleteVote = async (msg: Discord.Message, num: number) => {
  try {
    const suggestions = await getSuggestions(msg);

    if (!suggestions.length) {
      msg.reply("There are no suggestions to delete.");
    } else if (num > suggestions.length) {
      msg.reply("Can't delete that.");
    } else if (!isAuthorOrAdmin(suggestions[num - 1], msg)) {
      msg.reply(
        "You can only delete your own votes. Or ask an admin to delete it."
      );
    } else {
      let suggestionID = suggestions[num - 1].id;
      try {
        await db
          .collection("channels")
          .doc(msg.channel.id)
          .collection("suggestions")
          .doc(suggestionID)
          .delete();
        msg.react("👍");
      } catch (err) {
        console.log(err);
        msg.channel.send("`Something went wrong :(`");
      }
    }
  } catch (err) {
    console.log(err);
    msg.channel.send("`Something went wrong :(`");
  }
};

module.exports = (msg: Discord.Message, args: string[]) => {
  const number = args.join("").trim();
  if (isNumeric(number)) {
    deleteVote(msg, parseInt(number));
  } else {
    msg.reply("Invalid argument.");
  }
};
