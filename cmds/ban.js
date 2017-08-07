const getUserID = require("./../modules/getuserid");
const IDtoUser = require("./../modules/idtouser");
const discord = require("discord.js");

const attemptBan = function(bot,msg,target,reason){
    if (!bot.guilds.get(msg.guild.id).members.has(target)) {
        msg.channel.send(`I identified the user, but they're not in the guild. Attempting to ban nontheless...`); 
    } else if (bot.guilds.get(msg.guild.id).members.get(target).highestRole.calculatedPosition >= msg.member.highestRole.calculatedPosition) {
         msg.channel.send(`The user you're targeting has an equal or higher role than you!`);
         return;
    }
    msg.guild.ban(target,reason).then(user=>msg.channel.send(`${user.username} was banned from the server.`)).catch(err=>`Something went wrong... I couldn't ban this user.\n\`\`\`${err}\`\`\``);
};

module.exports = function(bot,msg,args,options){
    if (!args[0]){
        msg.channel.send(`You didn't tell me who you'd like to ban!`);
        return;
    } 
    let selected_users = getUserID(bot,args[0],msg.guild.id);
    let ban_reason = args[1] ? args[1] : "No reason given.";
    let target;
    if (!selected_users) {
        msg.channel.send(`I couldn't find this user...`);
        return;
    } else if (selected_users.length > 1) {
        let reply = `Enter the number only.\n`;
        for (let i=0;i<selected_users.length;i++){
            let user = IDtoUser(bot,selected_users[i],msg.guild.id);
            reply += `\`${i}|\` ${user.username}#${user.discriminator}\n`;
        }
        msg.channel.send(reply);
        let listener = new discord.MessageCollector(msg.channel,data=>data.author.id===msg.author.id&&Number(data.content)>-1&&Number(data.content)<selected_users.length,{time:10000,maxMatches:1});
        listener.on("end",(collection,reason)=>{
            if (reason==="time") {
                msg.channel.send(`Message collector timed out.`);
                return;
            }
            let keys = Array.from(collection.keys());
            target = selected_users[collection.get(keys[0]).content];
            attemptBan(bot,msg,target,ban_reason);
        });
    } else {
        target = selected_users[0];
        attemptBan(bot,msg,target,ban_reason);
    }
};