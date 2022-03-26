import Discord from "discord.js";
import { db } from "../utils/firebase";
import { getSuggestions, isAuthorOrAdmin, isNumeric } from "../helpers";

const resolveSuggesstion = async (msg: Discord.Message, num: number) => {
  try {
    const suggestions = await getSuggestions(msg);
    const suggestion = suggestions[num - 1];

    if (!suggestions.length) {
      msg.reply("There are no suggestions to resolve.");
    } else if (num > suggestions.length) {
      msg.reply("Suggestion does not exist.");
    } else if (!isAuthorOrAdmin(suggestion, msg)) {
      msg.reply("Only moderators can resolve suggestions.");
    } else {
      const channelRef = db.collection("channels").doc(msg.channel.id);

      try {
        await Promise.all([
          channelRef.collection("resolved").add(suggestion),
          channelRef.collection("suggestions").doc(suggestion.id).delete(),
        ]);
        msg.react("✅");
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
    resolveSuggesstion(msg, parseInt(number));
  } else {
    msg.reply("Invalid argument.");
  }
};
