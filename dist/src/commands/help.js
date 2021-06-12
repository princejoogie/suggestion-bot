"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (msg) => {
    let reply = "```\n";
    reply += "!suggest <your suggestion here>";
    reply += "```";
    msg.channel.send(reply);
};
//# sourceMappingURL=help.js.map