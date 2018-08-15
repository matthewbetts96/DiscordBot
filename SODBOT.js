const Discord = require('discord.js');
const bot = new Discord.Client();

var config = require("./config");
var divisions = require("./divisionFunctions");
var misc = require("./miscFunctions");
var maps = require("./mapFunctions");
var gathering = require("./collectResults");

var token = config.token;

bot.on('message', message => 
{
	if(message.content.startsWith(config.prefix))
	{
		findCommand(message); 
	}
});

function findCommand(message)
{
	var commands = message.content.substring(1,message.content.length).split(/\n| /); //split on a new line and spaces
	for(cmd in commands)
	{
		commands[cmd].replace(" ",""); //replace whitespace with nothing
	}

	switch(commands[0].toLowerCase())
	{
		//map specific commands
		case "rmap": //random map
			maps.rmap(message, commands);
			break;
		case "bannedmaps": //all maps with tick or cross
			maps.bannedMaps(message, commands);
			break;
		case "allmaps": // all maps without tick/cross
			maps.allMaps(message, commands);
			break;
		case "banmap": // ban a map
			maps.banMap(message, commands);
			break;
		case "unbanmap": //unban a map
			maps.unbanMap(message, commands);
			break;
		case "resetmaps": //reset the map bannings
			maps.resetMaps(message, commands);
			break;

		//division specific commands
		case "rdiv":
			divisions.rdiv(message, commands);
			break;
		case "banneddivs": //all divs with tick or cross
			divisions.bannedDivs(message, commands);
			break;
		case "alldivs":
			divisions.allDivs(message, commands);
			break;
		case "bandiv":
			divisions.banDiv(message, commands);
			break;
		case "unbandiv":
			divisions.unbanDiv(message, commands);
			break;
		case "resetdivs":
			divisions.resetDivs(message, commands);
			break;
		case "random":
			divisions.randomSetup(message, commands);
			break;
			
		//misc commands
		case "panzerfaust":
		case "panzerschreck":
		case "bazooka":
		case "grenade":
		case "gammonbomb":
		case "potato":
		case "piat":
			misc.shootThing(message, commands);
			break;
		case "guide":
			misc.guide(message, commands);
			break;
		case "flip":
			misc.flip(message, commands);
			break;
		case "faction":
			misc.faction(message, commands);
			break;
		case "info":
			misc.info(message, commands);
			break;
		case "help":
			misc.help(message, commands);
			break;

		//commands that people might get wrong
		case "reset":
			message.reply("Please specify, ``$resetmaps`` or ``$resetdivs``.")
			break;
		case "ban":
			message.reply("Please specify, ``$banmap`` or ``$bandiv``.")
			break;

		//stuff to do with results
		case "results":
			gathering.inputResults(message, commands);
			break;
		case "register":
			gathering.register(message, commands);
			break;
		case "template":
			break;
		case "playerresults":
			gathering.playerResults(message, commands);
			break;
		case "mapresults":
			gathering.mapResults(message, commands);
			break;
		case "divresults":
			gathering.divResults(message, commands);
			break;

		//admin only commands 

		//don't use this if there is already a database
		case "createtables":
			gathering.ADMIN_createTables(message, commands);
			break;

	}
}

//Obscure bot token behind a hidden config file
bot.login(token);