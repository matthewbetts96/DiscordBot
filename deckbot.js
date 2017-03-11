const Discord = require('discord.js');
const bot = new Discord.Client();
var config = require("./config");

const token = config.token;
bot.on('ready', () => {
  console.log('I am ready!');
});

var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('deckcodes'); 
db.run("CREATE TABLE IF NOT EXISTS codes (dc DECKCODE, dn NATION)");

/*
Authorized peeps:
	mbetts = 84696940742193152
	valh = 211930367693684738
	Razzmann = 206069773694533635
*/

//These users are perm authed, other users can be authed 
var authorized = ["84696940742193152","211930367693684738","206069773694533635"]

bot.on('message', message => {
	if(message.content.startsWith(config.prefix)){
		var commands = message.content.substring(1,message.content.length).split(" ");
		switch(commands[0]){
			case "authtest":
				if(authorized.indexOf(message.author.id) > -1){
					message.reply("You are authed.");
					break;
				}
				message.reply("You are not authed.");
				break;
			case "myid":
				message.reply(message.author.id);
				break;
			case "authuser":
				if(authorized.indexOf(message.author.id) == -1){
					message.reply("You are not authorized to do that.");
					break;
				}
				userID = commands[1];
				authorized.push(userID);
				message.channel.sendMessage(authorized);
				break;
			case "update":
				if(authorized.indexOf(message.author.id) == -1){
					message.reply("You are not authorized to do that.");
					break;
				}
				dcodes = commands[1];
				dnations = commands[2];
				db.serialize(function() {   
					var stmt = db.prepare("INSERT INTO codes VALUES (?,?)");     	
					stmt.run(dcodes, dnations);  
				}); 
				break;
			case "generate":
				nation = commands[1];
				db.serialize(function() {
					db.each("SELECT rowid AS id, dc, dn FROM codes", function(err, row){
						if(row.dn == nation){
							message.reply(row.dc);
						}
					});
				});
				break;
			case "listall":
				if(authorized.indexOf(message.author.id) == -1){
					message.reply("You are not authorized to do that.");
					break;
				}
				message.reply("");
				db.serialize(function() {
					db.each("SELECT rowid AS id, dc, dn FROM codes", function(err, row){
						message.channel.sendMessage(row.dc + " : " + row.dn);
					});
				});
				break;
			case "help":
				message.channel.sendMessage("!help - shows this list\n");
			default:
                message.channel.sendMessage("Unknown command.");
		}
	}
});

bot.login(token);










