const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require("./config");
const admin = require("./adminCommands");
const valid = require("./validateData");
const query = require("./queryData");
var log = require("./logging");

const divs = require("./divisionFunctions");
const misc = require("./miscFunctions");
const maps = require("./mapFunctions");
const results = require("./resultsMain");

const token = config.token;

//runs once per message in a channel
bot.on('message', message => 
{
	if(message.content.startsWith(config.prefix))
	{
		findCommand(message); 
	}
});

function findCommand(message)
{
	var command = message.content.substr(1,message.content.length);
	command = command.replace(/ .*/,'');

	var args = message.content.substr(message.content.indexOf(' ')+1);
	args = args.split(/,/);

	for(st in args)
	{
		args[st] = args[st].trim();
	}

	//Checks if the author is blacklisted, exit if true and log attempt
	//saves us checking in every function
	if(admin.userInBlackListFile(message.author.id))
	{
		log.blackListedUserAccessAttempt(message, command);
		return;
	}

	switch(command.toLowerCase())
	{
		//map specific commands
		case "rmap": 		//random map
		case "bannedmaps": 	//all maps with banned/unbanned state
		case "allmaps": 	//all maps without banned/unbanned state
		case "banmap": 		//ban a map
		case "unbanmap": 	//unban a map
		case "resetmaps": 	//reset the map bannings
		case "random":
			maps.mapsEntryLoc(message, command, args)
			break;

		//map specific commands
		case "rdiv": 		//random map
		case "banneddivs": 	//all maps with banned/unbanned state
		case "alldivs": 	//all maps without banned/unbanned state
		case "bandiv": 		//ban a map
		case "unbandiv": 	//unban a map
		case "resetdivs": 	//reset the map bannings
			divs.divEntryLoc(message, command, args)
			break;

		//pew pew!
		case "panzerfaust":
		case "panzerschreck":
		case "bazooka":
		case "grenade":
		case "gammonbomb":
		case "potato":
		case "piat":
		//rest of the misc commands
		case "guide":
		case "info":
		case "faction":
		case "flip":
		case "help":
		case "template":
		//case "template": //TODO
			misc.miscEntryLoc(message, command, args);
			break;

		//admin commands
		case "blacklist":
			admin.blackList(message);
			break;
		case "unblacklist":
			admin.unBlackList(message);
			break;
		case "purge":
			admin.purge(message, args[0]);
			break;
		case "createtables":
			valid.admin_createTables(message);
			break;

		case "mapresults":
			query.mapResults(message, args);
			break;
		case "playerresults":
			query.playerResults(message, args);
			break;
		case "divresults":
			query.divResults(message, args);
			break;

		//commands that could be mistken
		case "ban":
			message.reply("Please specify ``banmap`` or ``bandiv``.");
			break; 

	}


	//This is a specific version of commands used for collecting results only
	args = message.content.substring(1,message.content.length).split(/\n/); //split on a new line only

	//trim spaces either side of entry
	for(st in args)
	{
		args[st] = args[st].trim();
	}

	if(args[0].toLowerCase() == "results" || args[0].toLowerCase() == "register")
	{
		results.resultsMain(message,args);
	}	
}

//runs only when bot comes online
bot.on('ready', () => {
	console.log('Bot Online!');
	//set the activity under the bot in the sidebar
	bot.user.setActivity("Use " + config.prefix + "help to see commands!")
});


//Catches errors that were causing the bot to crash, I think...
bot.on('error', console.error);


//Obscure bot token behind a hidden config file
bot.login(token);