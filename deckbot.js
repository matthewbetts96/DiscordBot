const Discord = require("discord.js");
const discordbot = new Discord.Client();
const config = require('./config.json');

discordbot.on("message", function(message) {
    if(message.content.startsWith(config.prefix)){
        var commands = message.content.substring(1,message.content.length).split(" ");
        switch(commands[0]){
            case "wargame":
                message.reply("test message");
                break;
            default:
                message.channel.sendMessage("boo!!");
        }
    }
});

discordbot.on('ready', () => {
  console.log('I am ready!');
});


function WargameCommands(){

}


discordbot.login(config.token);