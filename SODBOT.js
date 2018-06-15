const Eris = require('eris');
const http = require('http');
const express = require('express');
const app = express();

const bot = new Eris(process.env.TOKEN);  


app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);


bot.on('ready', () => {                                
    console.log('Ready!');                            
});

//hardcoded auth list,l can change to role based in the future
//mbetts, berto, chickendew, valh, vulcan
var authorized = ["84696940742193152","403249767611760641", "207790233087901696", "211930367693684738", "157207837561454593"]

//3rd line is 3v3 (and less) only
var allMaps = {"Bois de Limors":true,"Carpiquet":true,"Caumont l'Evente":true,"Cheux":true,"Colleville":true,"Colombelles":true
				,"Cote 112":true,"Mont Ormel":true,"Odon":true,"Omaha":true,"Pegasus Bridge":true,"Pointe du Hoc":true,
				"Carpiquet-Duellist":true,"Merderet":true,"Odon River":true,"Sainte Mere l'Eglise":true,"Sainte Mere l'Eglise Duellists":true};

 
bot.on('messageCreate', message => 
{
	if(message.content.startsWith('$'))
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

	bot.createMessage(message.channel.id, res);
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
			bot.createMessage(message.channel.id, "Unknown size parameter. Please use 1v1, 2v2 etc")
	}
}

function printMap(message, num)
{
	var rnd = Math.floor(Math.random()*num);
	var i = 0;
  var key;
	for (key in allMaps) {
		if(rnd == i)
		{
			if(allMaps[key] == false)
			{
				printMap(message, num) //NOTE TO SELF: FIX POSSIBLE INFINITE RECURSION PROBLEM WHEN ALL MAPS ARE BANNED 
			} 
			else 
			{
				bot.createMessage(message.channel.id, key);
			}
		}
		i++;
	}
}

//Replies with the defacto game manual, this can be expanded later to include more things
function guide(message)
{
	bot.createMessage(message.channel.id, "https://steamcommunity.com/sharedfiles/filedetails/?id=1276910882");
}

//Returns heads or tails 
function faction(message)
{
	if(Math.random() > 0.5)
	{
		bot.createMessage(message.channel.id, 'Axis!');
	} else {
		bot.createMessage(message.channel.id, 'Allies!');
	}
}

//Returns heads or tails 
function flip(message)
{
	if(Math.random() > 0.5)
	{
		bot.createMessage(message.channel.id, 'Heads!');
	} else {
		bot.createMessage(message.channel.id, 'Tails!');
	}
}

/*
//Simple ping command that returns the ping of the bot
function ping(message)
{
  bot.createMessage(message.channel.id, 'Pong! API Latency is ' + Math.round(bot.ping) + 'ms');
}*/

//Returns embedded message of all current commands
function help(message)
{
	bot.createMessage(message.channel.id,{embed: {
		color: 3447003,
		fields: [{
        	name: "$help",
        	value: "Shows this message."
      	},{
        	name: "$maps",
        	value: "Displays all maps and their banned state."
      	},{
        	name: "$map (1v1/2v2/3v3/4v4)",
        	value: "Picks a random, unbanned map of the defined size."
      	},{
        	name: "$ban MAP_NAME",
        	value: "Bans a map."
      	},{
        	name: "$reset",
        	value: "Resets all the map bans."
      	},{
        	name: "$piat",
        	value: "Fires SOD-BOT's piat! Are you able to hit?"
      	},{
        	name: "$flip",
        	value: "Flips a coin."
      	},{
        	name: "$faction",
        	value: "Picks a random faction."
      	},{
        	name: "$guide", //TODO
        	value: "Displays a list of guides for Steel Division."
      	},{
        	name: "$info", //TODO
        	value: "Shows info about the bot."
      	}]
	}});
}

//Returns 'Miss' to all users, 75% chance of returning 'Hit' to an auth'd user
function piat(message)
{
	if(authorized.indexOf(message.author.id) > -1 && Math.random() > 0.75)
  { 
		bot.createMessage(message.channel.id,"Hit!");
	} 
  else 
  {
		bot.createMessage(message.channel.id,"Miss!");
	}
}

//function 
function ban(message, commands)
{
	//I hate doing this, but it won't work any other way 
	if(commands[1].toLowerCase().includes("bois"))
	{
		editAllMapsArray(0)
		bot.createMessage(message.channel.id,"Bois de Limors Banned.");
	}
	else if(commands[1].toLowerCase().includes("carp") && !commands[1].toLowerCase().includes("dual") && !commands[1].toLowerCase().includes("carpiquet-duellist") )
	{
		editAllMapsArray(1)
		bot.createMessage(message.channel.id,"Carpiquet Banned.");
	}
	else if(commands[1].toLowerCase().includes("caum"))
	{
		editAllMapsArray(2)
		bot.createMessage(message.channel.id,"Caumont l'Evente Banned.");
	}
	else if(commands[1].toLowerCase().includes("cheu"))
	{
		editAllMapsArray(3)
		bot.createMessage(message.channel.id,"Cheux Banned.");
	}
	else if(commands[1].toLowerCase().includes("coll"))
	{
		editAllMapsArray(4)
		bot.createMessage(message.channel.id,"Colleville Banned.");
	}
	else if(commands[1].toLowerCase().includes("colo"))
	{
		editAllMapsArray(5)
		bot.createMessage(message.channel.id,"Colombelles Banned.");
	}
	else if(commands[1].toLowerCase().includes("cote"))
	{
		editAllMapsArray(6)
		bot.createMessage(message.channel.id,"Cote 112 Banned.");
	}
	else if(commands[1].toLowerCase().includes("mont"))
	{
		editAllMapsArray(7)
		bot.createMessage(message.channel.id,"Mont Ormel Banned.");
	}
	else if(commands[1].toLowerCase().includes("odon") && !commands[1].toLowerCase().includes("river"))
	{
		editAllMapsArray(8)
		bot.createMessage(message.channel.id,"Odon Banned.");
	}
	else if(commands[1].toLowerCase().includes("omah"))
	{
		editAllMapsArray(9)
		bot.createMessage(message.channel.id,"Omaha Banned.");
	}
	else if(commands[1].toLowerCase().includes("pega"))
	{
		editAllMapsArray(10)
		bot.createMessage(message.channel.id,"Pegasus Bridge Banned.");
	} 
	else if(commands[1].toLowerCase().includes("point"))
	{
		editAllMapsArray(11)
		bot.createMessage(message.channel.id,"Pointe du Hoc Banned.");
	} 
	else if((commands[1].toLowerCase().includes("carp") && commands[1].toLowerCase().includes("dual")) || commands[1].toLowerCase().includes("carpiquet-duellist"))
	{
		editAllMapsArray(12)
		bot.createMessage(message.channel.id,"Carpiquet-Duellist Banned.");
	}
	else if(commands[1].toLowerCase().includes("merd"))
	{
		editAllMapsArray(13)
		bot.createMessage(message.channel.id,"Merderet Banned.");
	}
	else if(commands[1].toLowerCase().includes("odon") && commands[1].toLowerCase().includes("river"))
	{
		editAllMapsArray(14)
		bot.createMessage(message.channel.id,"Odon-River Banned.");
	}
	else if(commands[1].toLowerCase().includes("saint") && !commands[1].toLowerCase().includes("dual") && !commands[1].toLowerCase().includes("sainte mere l'eglise duellists") )
	{
		editAllMapsArray(15)
		bot.createMessage(message.channel.id,"Sainte Mere l'Eglise Banned.");
	}
	else if(commands[1].toLowerCase().includes("saint"))
	{
		editAllMapsArray(16)
		bot.createMessage(message.channel.id,"Sainte Mere l'Eglise Duellists Banned.");
	}
  var res = "-------------------------------------------------------------" + maps(message, 16)
	bot.createMessage(message.channel.id, res);

}	

function editAllMapsArray(num)
{
	var i = 0;
  var key;
	for (key in allMaps) {
		if(i == num){
			allMaps[key] = false;
		}
		i++;
	}
}

function resetMapPool(message)
{
  var key;
	bot.createMessage(message.channel.id,"Map pool reset.");
	for (key in allMaps) {
		allMaps[key] = true;
	}
}

function info(message)
{
	bot.createMessage(message.channel.id,"SODBOT 2.0.\nWritten by mbetts in Node js 7.7.2.\nOriginal SODBOT work by Scoutspirit and Chickendew.\nFind any bugs? Ping mbetts for fixes/troubleshooting.");
}

bot.connect();                                       
