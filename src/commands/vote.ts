import Discord from "discord.js";
import { Suggestion } from "../bot-types";
import { db } from "../utils/firebase";

const isNumeric = (str: any) => {
  if (typeof str != "string") return false;
  // @ts-ignore
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const alreadyVoted = (suggestion: Suggestion, id: string) => {
  return suggestion.votes.includes(id);
};

const vote = async (msg: Discord.Message, num: number) => {
  try {
    const res = await db
      .collection("suggestions")
      .orderBy("timestamp", "desc")
      .get();
    const suggestions = res.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Suggestion)
    );

    if (!suggestions.length) {
      msg.reply("There are to suggestions to vote to.");
    } else if (num > suggestions.length) {
      msg.reply("Can't vote on that.");
    } else if (alreadyVoted(suggestions[num - 1], msg.author.id)) {
      msg.reply("You already voted on that.");
    } else {
      let suggestionID = suggestions[num - 1].id;
      let votes: string[] = suggestions[num - 1].votes;
      votes.push(msg.author.id);
      try {
        await db.collection("suggestions").doc(suggestionID).update({
          votes,
        });

        let reply = "```\n";
        reply += `Voted on ${suggestions[num - 1].suggestion} \n`;
        reply += "```";

        msg.channel.send(reply);
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
    vote(msg, parseInt(number));
  } else {
    msg.reply("Invalid argument.");
  }
};
