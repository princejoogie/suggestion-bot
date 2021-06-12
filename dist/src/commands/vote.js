"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
const isNumeric = (str) => {
    if (typeof str != "string")
        return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
};
const alreadyVoted = (suggestion, id) => {
    return suggestion.votes.includes(id);
};
const vote = (msg, num) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield firebase_1.db
            .collection("suggestions")
            .orderBy("timestamp", "desc")
            .get();
        const suggestions = res.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        if (!suggestions.length) {
            msg.reply("There are to suggestions to vote to.");
        }
        else if (num > suggestions.length) {
            msg.reply("Can't vote on that.");
        }
        else if (alreadyVoted(suggestions[num - 1], msg.author.id)) {
            msg.reply("You already voted on that.");
        }
        else {
            let suggestionID = suggestions[num - 1].id;
            let votes = suggestions[num - 1].votes;
            votes.push(msg.author.id);
            try {
                yield firebase_1.db.collection("suggestions").doc(suggestionID).update({
                    votes,
                });
                let reply = "```\n";
                reply += `Voted on ${suggestions[num - 1].suggestion} \n`;
                reply += "```";
                msg.channel.send(reply);
            }
            catch (err) {
                console.log(err);
                msg.channel.send("`Something went wrong :(`");
            }
        }
    }
    catch (err) {
        console.log(err);
        msg.channel.send("`Something went wrong :(`");
    }
});
module.exports = (msg, args) => {
    const number = args.join("").trim();
    if (isNumeric(number)) {
        vote(msg, parseInt(number));
    }
    else {
        msg.reply("Invalid argument.");
    }
};
//# sourceMappingURL=vote.js.map