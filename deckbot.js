const Discord = require("discord.js");
const discordbot = new Discord.Client();
const config = require('./config.json');

var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('deckcodes');  

var dcodes = [];
var dnations = [];
dcodes.push("Deckcode1");
dnations.push("Nation1");

dcodes.push("Deckcode2");
dnations.push("Nation2");

dcodes.push("Deckcode3");
dnations.push("Nation3");

dcodes.push("Deckcode4");
dnations.push("Nation4");

dcodes.push("Deckcode5");
dnations.push("Nation5");
  
db.serialize(function() {  
	db.run("CREATE TABLE IF NOT EXISTS codes (id INT, dc DECKCODE, dn NATIONS)");  
  
	var stmt = db.prepare("INSERT INTO codes VALUES (?,?,?)"); 
		
	for (var i = 0; i < dcodes.length; i++) {       	
		stmt.run(i, dcodes[i], dnations[i]);  
	}  	
});   

discordbot.on("message", function(message) {
    if(message.content.startsWith(config.prefix)){
        var commands = message.content.substring(1,message.content.length).split(" ");
        switch(commands[0]){
            case "random":
				var randnum = Math.floor(Math.random() * dcodes.length)
				message.reply("Random Deck : " + dcodes[randnum] + " : " + dnations[randnum])
                break;
            default:
                message.channel.sendMessage("Yes, ban Razzmann!");
        }
    }
});

discordbot.on('ready', () => {
  console.log('I am ready!');
});

discordbot.login(config.token);