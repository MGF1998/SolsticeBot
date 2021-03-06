//Plays the topmost song in the queue
const ytdl = require("ytdl-core");
const setGame = require("./setGame");
const checkQueue = require("./checkQueue");

module.exports = function playFromQueue(bot, msg, item, args, options) {
    if (typeof bot._instance.VoiceConnection !== 'undefined' && bot._instance.VoiceConnection) {
        bot._instance.votes["Skip current Song"] = []; // reset vote skip
        msg.channel.send("Now Playing: " + item.name);
        bot._instance.currentlyPlaying = item.name;
        setGame(bot, item.name);

        if (item.stream) {
            let readable = ytdl(item.value, {
                'filter': 'audioonly'
            });
            bot._instance.dispatcher = bot._instance.VoiceConnection.playStream(readable);
            bot._instance.dispatcher.passes = 3;
        } else {
            bot._instance.dispatcher = bot._instance.VoiceConnection.playFile(item.value);
            bot._instance.dispatcher.passes = 3;
        }

        bot._instance.dispatcher.on('end', function () {
            const checkQueue = require("./checkQueue");
            bot._instance.playing = false;
            checkQueue(bot, msg, args, options);
        });
        bot._instance.playing = true;
    } else {
        setTimeout(function () {
            playFromQueue(bot, msg, item, args, options);
        }, 100);
    }
};