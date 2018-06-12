//Original SOD-BOT by 
//Node JS rewrite/refactor by mbetts

const Discord = require('discord.js');
const bot = new Discord.Client();
var config = require("./config");

const token = config.token;
bot.on('ready', () => {
  console.log('I am ready!');
});

//hardcoded auth list,l can change to role based in the future
var authorized = ["84696940742193152"]

//3rd line is 3v3 (and less) only
var allMaps = {"Bois de Limors":true,"Carpiquet":true,"Caumont l'Evente":true,"Cheux":true,"Colleville":true,"Colombelles":true
				,"Cote 112":true,"Mont Ormel":true,"Odon":true,"Omaha":true,"Pegasus Bridge":true,"Pointe du Hoc":true,
				"Carpiquet-Duellist":true,"Merderet":true,"Odon River":true,"Sainte Mere l'Eglise":true,"Sainte Mere l'Eglise Duellists":true};


bot.on('message', message => 
{
	if(message.content.startsWith(config.prefix))
	{
		var commands = message.content.substring(1,message.content.length).split(" ");
		//lower case everything
		switch(commands[0].toLowerCase())
		{
			case "info":
				info(message)
				break;
			case "piat":
				piat(message)
				break;
			case "ping":
				ping(message)
				break;
			case "help":
				help(message)
				break;
			case "flip":
				flip(message)
				break;   
			case "faction":
				faction(message)
				break;
			case "ban":
				ban(message, commands)
				break;
			case "guide":
				guide(message)
				break;
			case "maps":
				maps(message)
				break;
			case "map":
				map(message, commands)
				break;
			case "reset":
				resetMapPool(message)
				break;
			default:

				break;
		}
	}
});

function maps(message)
{
	var st1 = "";
	var st2 = "";
	var res = "";

	for (var key in allMaps) {
		st1 = key + " is " + allMaps[key] + "\n"
		st2 = st2.concat(st1);
	}

	res = st2.replace(/true/gi,"not banned. :heavy_check_mark:"); //no idea how this works, but hey
	res = res.replace(/false/gi,"banned. :x:");

	message.channel.send(res);
}

function map(message, commands)
{
	try {
		var st = commands[1].toLowerCase() 
	}
	catch(err) {
		console.log("ERROR: Cannot lowercase NULL. Throwing exception.")
		st = "";
	}
	switch(st)
	{
		case "1v1":
			printMap(message, 16)
			break;
		case "2v2":
			printMap(message, 16)
			break;
		case "3v3":
			printMap(message, 16)
			break;
		case "4v4":
			printMap(message, 11)
			break;
		default:
			message.reply("Unknown size parameter. Please use 1v1, 2v2 etc")
	}
}

function printMap(message, num)
{
	var rnd = Math.floor(Math.random()*num);
	var i = 0;
	for (key in allMaps) {
		if(rnd == i)
		{
			if(allMaps[key] == false)
			{
				printMap(message, num) //NOTE TO SELF: FIX POSSIBLE INFINITE RECURSION PROBLEM WHEN ALL MAPS ARE BANNED 
			} 
			else 
			{
				message.reply(key);
			}
		}
		i++;
	}
}

//Replies with the defacto game manual, this can be expanded later to include more things
function guide(message)
{
	message.reply("https://steamcommunity.com/sharedfiles/filedetails/?id=1276910882");
}

//Returns heads or tails 
function faction(message)
{
	if(Math.random() > 0.5)
	{
		message.reply('Axis!');
	} else {
		message.reply('Allies!');
	}
}

//Returns heads or tails 
function flip(message)
{
	if(Math.random() > 0.5)
	{
		message.reply('Heads!');
	} else {
		message.reply('Tails!');
	}
}

//Simple ping command that returns the ping of the bot
function ping(message)
{
	message.reply('Pong! API Latency is ' + Math.round(bot.ping) + 'ms');
}

//Returns embedded message of all current commands
function help(message)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "help",
        	value: "Shows this message."
      	},{
        	name: config.prefix +"maps",
        	value: "Displays all maps and their banned state."
      	},{
        	name: config.prefix +"map (1v1/2v2/3v3/4v4)",
        	value: "Picks a random, unbanned map of the defined size."
      	},{
        	name: config.prefix +"ban MAP_NAME",
        	value: "Bans a map."
      	},{
        	name: config.prefix +"reset",
        	value: "Resets all the map bans."
      	},{
        	name: config.prefix +"piat",
        	value: "Fires SOD-BOT's piat! Are you able to hit?"
      	},{
        	name: config.prefix +"flip",
        	value: "Flips a coin."
      	},{
        	name: config.prefix +"faction",
        	value: "Picks a random faction."
      	},{
        	name: config.prefix +"guide", //TODO
        	value: "Displays a list of guides for Steel Division."
      	},{
       		name: config.prefix +"ping",
        	value: "Pings the bot. Prints API Latency."
      	},{
        	name: config.prefix +"info", //TODO
        	value: "Shows info about the bot."
      	}]
	}});
}

//Returns 'Miss' to all users, 50/50 chance of returning 'Hit' to an auth'd user
function piat(message)
{
	if(authorized.indexOf(message.author.id) > -1 && Math.random() > 0.25){
		message.reply("Hit!");
	} else {
		message.reply("Miss!");
	}
}

//function 
function ban(message, commands)
{
	//I hate doing this, but it won't work any other way 
	if(commands[1].toLowerCase().includes("bois"))
	{
		editAllMapsArray(0)
		message.reply("Bois de Limors Banned.");
	}
	else if(commands[1].toLowerCase().includes("carp") && !commands[1].toLowerCase().includes("dual") && !commands[1].toLowerCase().includes("carpiquet-duellist") )
	{
		editAllMapsArray(1)
		message.reply("Carpiquet Banned.");
	}
	else if(commands[1].toLowerCase().includes("caum"))
	{
		editAllMapsArray(2)
		message.reply("Caumont l'Evente Banned.");
	}
	else if(commands[1].toLowerCase().includes("cheu"))
	{
		editAllMapsArray(3)
		message.reply("Cheux Banned.");
	}
	else if(commands[1].toLowerCase().includes("coll"))
	{
		editAllMapsArray(4)
		message.reply("Colleville Banned.");
	}
	else if(commands[1].toLowerCase().includes("colo"))
	{
		editAllMapsArray(5)
		message.reply("Colombelles Banned.");
	}
	else if(commands[1].toLowerCase().includes("cote"))
	{
		editAllMapsArray(6)
		message.reply("Cote 112 Banned.");
	}
	else if(commands[1].toLowerCase().includes("mont"))
	{
		editAllMapsArray(7)
		message.reply("Mont Ormel Banned.");
	}
	else if(commands[1].toLowerCase().includes("odon") && !commands[1].toLowerCase().includes("river"))
	{
		editAllMapsArray(8)
		message.reply("Odon Banned.");
	}
	else if(commands[1].toLowerCase().includes("omah"))
	{
		editAllMapsArray(9)
		message.reply("Omaha Banned.");
	}
	else if(commands[1].toLowerCase().includes("pega"))
	{
		editAllMapsArray(10)
		message.reply("Pegasus Bridge Banned.");
	} 
	else if(commands[1].toLowerCase().includes("point"))
	{
		editAllMapsArray(11)
		message.reply("Pointe du Hoc Banned.");
	} 
	else if((commands[1].toLowerCase().includes("carp") && commands[1].toLowerCase().includes("dual")) || commands[1].toLowerCase().includes("carpiquet-duellist"))
	{
		editAllMapsArray(12)
		message.reply("Carpiquet-Duellist Banned.");
	}
	else if(commands[1].toLowerCase().includes("merd"))
	{
		editAllMapsArray(13)
		message.reply("Merderet Banned.");
	}
	else if(commands[1].toLowerCase().includes("odon") && commands[1].toLowerCase().includes("river"))
	{
		editAllMapsArray(14)
		message.reply("Odon-River Banned.");
	}
	else if(commands[1].toLowerCase().includes("saint") && !commands[1].toLowerCase().includes("dual") && !commands[1].toLowerCase().includes("sainte mere l'eglise duellists") )
	{
		editAllMapsArray(15)
		message.reply("Sainte Mere l'Eglise Banned.");
	}
	else if(commands[1].toLowerCase().includes("saint"))
	{
		editAllMapsArray(16)
		message.reply("Sainte Mere l'Eglise Duellists Banned.");
	}
	var messageToSend = "----------------------------------------------------------" + maps(message, 16) + "----------------------------------------------------------"
	message.channel.send(messageToSend);
	//print all 17 maps
	//maps(message, 16)
	//message.channel.send("----------------------------------------------------------");
}	

function editAllMapsArray(num)
{
	var i = 0;
	for (key in allMaps) {
		if(i == num){
			allMaps[key] = false;
			//console.log("key: " +key + " + map[key] :" + allMaps[key]);
		}
		i++;
	}
}

function resetMapPool(message)
{
	message.channel.send("Map pool reset.");
	for (key in allMaps) {
		allMaps[key] = true;
	}
}

function info(message)
{
	message.channel.send("WIP");
}

//Obscure bot token behind a hidden config file
bot.login(token);










