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
const addSuggestion = (suggestion) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection("suggestions").add(suggestion);
});
module.exports = (msg, args) => {
    var _a;
    const suggestion = args.join(" ");
    const user = {
        id: msg.author.id,
        photoURL: (_a = msg.author.avatarURL()) !== null && _a !== void 0 ? _a : "",
        name: msg.author.username,
    };
    const data = {
        suggestion,
        user,
        timestamp: firebase_1.timestamp(),
        votes: [],
    };
    addSuggestion(data);
    msg.reply("Suggestion Added!");
};
//# sourceMappingURL=suggest.js.map