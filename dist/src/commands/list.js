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
const getSuggestions = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield firebase_1.db
            .collection("suggestions")
            .orderBy("timestamp", "desc")
            .get();
        const suggestions = res.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        if (!suggestions.length) {
            let reply = "```\n";
            reply += "No Suggestions yet.\n";
            reply += "```";
            msg.channel.send(reply);
        }
        else {
            let reply = "```\n";
            reply += "Current Suggestions:\n";
            suggestions.map((e, i) => {
                reply += `${i + 1}. ${e.suggestion} (${e.votes.length} vote/s)\n`;
            });
            reply += "```";
            msg.channel.send(reply);
        }
    }
    catch (err) {
        console.log(err);
        msg.channel.send("`Something went wrong :(`");
    }
});
const getSuggestionsByID = (msg, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield firebase_1.db
            .collection("suggestions")
            .orderBy("timestamp", "desc")
            .where("user.id", "==", id)
            .get();
        const suggestions = res.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        let reply = "```\n";
        reply += `${msg.author.username}'s Suggestions:\n`;
        suggestions.map((e, i) => {
            reply += `${i + 1}. ${e.suggestion}\n`;
        });
        reply += "```";
        msg.channel.send(reply);
    }
    catch (err) {
        console.log(err);
        msg.channel.send("`Something went wrong :(`");
    }
});
module.exports = (msg, args) => {
    if (!args.length) {
        getSuggestions(msg);
    }
    else if (args.join(" ").trim() === "mine") {
        getSuggestionsByID(msg, msg.author.id);
    }
    else {
        msg.reply("not a command");
    }
};
//# sourceMappingURL=list.js.map