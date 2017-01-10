module.exports = function (msg, type, src) {
    if (dispatcher) {
        dispatcher.end("Halted due to two audio files playing at the same time");
    }
    const userVoiceID = msg.member.voiceChannelID;
    userVoice = msg.guild.channels.get(userVoiceID);
    userVoice.join().then(connection => {
        if (type === "file") {
            dispatcher = connection.playFile('./sounds/' + src);
        } else if (type === "stream") {
            dispatcher = connection.playStream(src);
        } else {
            console.log("What the fuck, man?");
        }
        dispatcher.on('speaking', (event, listener) => {
            if (!event) {
                userVoice.leave();
                dispatcher = null;
                setGame(settings.default_game);
            }
        });
    });
};