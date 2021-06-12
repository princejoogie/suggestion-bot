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
const dotenv = require("dotenv");
dotenv.config();
const token = process.env.BOT_TOKEN;
const getCommands = () => {
    const cmds = [];
    const dir = path_1.default.join(constants_1.BASE_DIR, "./src", "./commands");
    fs_1.default.readdir(dir, (err, files) => {
        if (!err) {
            const extension = process.env.NODE_ENV === "DEVELOPMENT" ? ".ts" : ".js";
            files.forEach((file) => cmds.push(file.replace(extension, "")));
        }
    });
    return cmds;
};
const commands = getCommands();
client.once("ready", () => {
    console.log(`Running in ${process.env.NODE_ENV}`);
    console.log("Suggestion Bot running, DO NOT CLOSE!");
});
client.on("message", (msg) => {
    if (msg.channel.id === config_json_1.channelID && msg.content.startsWith(config_json_1.prefix)) {
        let args = msg.content.split(" ");
        const cmd = args[0].substring(1, args[0].length);
        if (commands.includes(cmd)) {
            args.splice(0, 1);
            const extension = process.env.NODE_ENV === "DEVELOPMENT" ? ".ts" : ".js";
            const useCommand = require(path_1.default.join(constants_1.BASE_DIR, "src", "commands", `${cmd}${extension}`));
            useCommand(msg, args);
        }
    }
});
client.login(token);
//# sourceMappingURL=index.js.map