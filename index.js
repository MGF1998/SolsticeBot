//################### Vars #######################

const discord = require("discord.js");
let settings = require("./settings");
const commands = require("./commands");
const commandKeys = Object.keys(commands);
const parseCommands = require("./modules/parseCommands");
const bot = new discord.Client();

//################## Functions ###################

const prefixCheck = function(msg){
    for (let i=0;i<settings.prefixes.length;i++) {
        if (msg.content.startsWith(settings.prefixes[i])) {
            return true;
        }
    }
    return false;
};

const commandCheck = function(msg){
    for (let i=0; i<commandKeys.length; i++) {
        if (commands[commandKeys[i]].aliases.indexOf(call.name.toLowerCase()) > -1) {
            return commands[commandKeys[i]];
        }
    }
    return false;
};

//################## Bot Events ##################

bot.on("ready",()=>{
    console.log("Solstice is ready. Logged in as "+bot.user.username);
});
bot.on("message", (msg)=>{
    if (msg.author.bot) { //Bot messages are ignored.
        return;
    }
    if (prefixCheck(msg)){ //Did the message start with one of the defined prefixes?
        let raw = msg.content.substring(settings.prefix.length);
        let call = parseCommands(raw);
        let calledCommand = commandCheck(call);
        if (calledCommand) {

            //Access Checks are put in place here.

            let fn = calledCommand.function;
            if (typeof fn === 'function') {
                let args = call.args;
                let options = {
                    "callname": call.name,
                    "settings": settings,
                };
                fn(bot, msg, args, options);
            } else {
                throw new Error("Fatal | Command was detected, but there is no associated function in commands.js.");
            }
        }
    }
});

bot.login(settings.token);