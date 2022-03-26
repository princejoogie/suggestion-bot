import Discord from "discord.js";
import { db } from "../utils/firebase";
import { Suggestion } from "../bot-types";

interface IOptions {
  userId?: string;
  resolved?: boolean;
}

export const getSuggestions = async (
  msg: Discord.Message,
  options?: IOptions
) => {
  try {
    const collection = options?.resolved ? "resolved" : "suggestions";
    let res;
    if (options?.userId) {
      res = await db
        .collection("channels")
        .doc(msg.channel.id)
        .collection(collection)
        .where("user.id", "==", options.userId)
        .orderBy("timestamp", "desc")
        .get();
    } else {
      res = await db
        .collection("channels")
        .doc(msg.channel.id)
        .collection(collection)
        .orderBy("timestamp", "desc")
        .get();
    }
    const suggestions = res.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Suggestion)
    );

    return suggestions;
  } catch (err) {
    console.log(err);
    msg.channel.send("`Something went wrong :(`");
    return [];
  }
};

export const isNumeric = (str: any) => {
  if (typeof str != "string") return false;
  // @ts-ignore
  return !isNaN(str) && !isNaN(parseFloat(str));
};

export const isAuthorOrAdmin = (
  suggestion: Suggestion,
  msg: Discord.Message
) => {
  return (
    suggestion.user.id === msg.author.id ||
    msg.member?.hasPermission("ADMINISTRATOR") ||
    msg.member?.hasPermission("BAN_MEMBERS")
  );
};
