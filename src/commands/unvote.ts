import Discord from "discord.js";
import { getSuggestions } from "../helpers";
import { Suggestion } from "../bot-types";
import { db } from "../utils/firebase";

const isNumeric = (str: any) => {
  if (typeof str != "string") return false;
  // @ts-ignore
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const notIncluded = (suggestion: Suggestion, id: string) => {
  return !suggestion.votes.includes(id);
};

const unVote = async (msg: Discord.Message, num: number) => {
  try {
    const suggestions = await getSuggestions(msg);

    if (!suggestions.length) {
      msg.reply("There are no suggestions to unvote to.");
    } else if (num > suggestions.length) {
      msg.reply("Can't unvote on that.");
    } else if (notIncluded(suggestions[num - 1], msg.author.id)) {
      msg.reply("You have not voted on that.");
    } else {
      let suggestionID = suggestions[num - 1].id;
      let votes: string[] = suggestions[num - 1].votes;
      votes = votes.filter((e) => e !== msg.author.id);
      try {
        await db
          .collection("channels")
          .doc(msg.channel.id)
          .collection("suggestions")
          .doc(suggestionID)
          .update({
            votes,
          });

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
    unVote(msg, parseInt(number));
  } else {
    msg.reply("Invalid argument.");
  }
};
