"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_json_1 = require("../config.json");
const constants_1 = require("../constants");
const client = new discord_js_1.default.Client();
const getCommands = () => {
    const cmds = [];
    const dir = path_1.default.join(constants_1.BASE_DIR, "src", "commands");
    fs_1.default.readdir(dir, (err, files) => {
        if (!err) {
            files.forEach((file) => cmds.push(file.replace(".ts", "")));
        }
    });
    return cmds;
};
const commands = getCommands();
client.once("ready", () => {
    console.log("Suggestion Bot running, DO NOT CLOSE!");
});
client.on("message", (msg) => {
    if (msg.channel.id === config_json_1.channelID && msg.content.startsWith(config_json_1.prefix)) {
        let args = msg.content.split(" ");
        const cmd = args[0].substring(1, args[0].length);
        if (commands.includes(cmd)) {
            args.splice(0, 1);
            const useCommand = require(path_1.default.join(constants_1.BASE_DIR, "src", "commands", `${cmd}.ts`));
            useCommand(msg, args);
        }
    }
});
client.login(config_json_1.token);
//# sourceMappingURL=index.js.map