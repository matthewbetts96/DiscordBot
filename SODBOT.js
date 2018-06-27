//Original SOD-BOT by 
//Node JS rewrite/refactor by mbetts

const Discord = require('discord.js');
const bot = new Discord.Client();
var config = require("./config");

const token = config.token;
bot.on('ready', () => {
  console.log('I am ready!');
});

//3rd line is 3v3 (and less) only
var allMaps = {"Bois de Limors":true,"Carpiquet":true,"Caumont l'Evente":true,"Cheux":true,"Colleville":true,"Colombelles":true
				,"Cote 112":true,"Mont Ormel":true,"Odon":true,"Omaha":true,"Pegasus Bridge":true,"Pointe du Hoc":true,
				"Carpiquet-Duellist":true,"Merderet":true,"Odon River":true,"Sainte Mere l'Eglise":true,"Sainte Mere l'Eglise Duellists":true};

var divs = ["3rd Armoured","4th Armoured","101st Airborne","2nd Infantry","2e Blindee","Demi-Brigade SAS","7th Armoured","Guards Armoured",
			"6th Airborne","15th Infantry","1st SSB","3rd Canadian Infantry", "1 Pancerna", "1st Infantry", "-----------","Panzer-Lehr",
			"12. SS-Panzer","1. SS-Panzer","2. Panzer","9. Panzer","21. Panzer", "116. Panzer", "17. SS-Panzergrenadier", "3. Fallschirmjager",
			"16. Luftwaffe", "91. Luftlande", "Festung Groß-Paris","352. Infanterie", "716. Infanterie"];

//time since the last time a command was called
var lastrequestTime = 0;
var currentTime = new Date().getTime();

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
	//lower case everything
	switch(commands[0].toLowerCase())
	{
		case "info":
			info(message)
			break;
		case "piat":
			if(rateLimiter())
			{
				piat(message)
			}
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
		case "unban":
			unban(message, commands)
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
		case "results": 
			resultGathering(message, commands)
			break;
		case "allmaps":
			allmaps(message)
			break;
		case "alldivs":
			alldivs(message)
			break;
		default:
			break;
	}
}

//A simple rate limiter
//Ignores requests if they are within 1 second of eachother and will 
//not respond unless one second has passed since the last request (currently subject to change)
function rateLimiter()
{
	var currentTime = new Date().getTime();
	if(currentTime - lastrequestTime > 1000)
	{
		lastrequestTime = currentTime;
		return true;
	} 
	else 
	{
		console.log("Too much spam detected");
		return false;
	}
}

function allmaps(message)
{
	var res = "";
	for (var key in allMaps) 
	{
		res = res.concat(key + "\n");
	}
	res = res.substring(0, res.length - 1);
	message.channel.send(res);
}

function alldivs(message)
{
	var res = "";
	for (var dv of divs) 
	{
		res = res.concat(dv + "\n");
	}
	res = res.substring(0, res.length - 1);
	message.channel.send(res);
}

/*
How results should be posted (MUST BE ONE COMMENT) replays must go as a seperate comment below

$results
Map-Played: <>
Winner: <>
-------------
P1-Name: <>
P1-Pick: <>
P1-Div-Ban-1: <>
P1-Div-Ban-2: <>
P1-Map-Ban-1: <>
P1-Map-Ban-2: <>
-------------
P2-Name: <>
P2-Pick: <>
P2-Div-Ban-1: <>
P2-Div-Ban-2: <>
P2-Map-Ban-1: <>
P2-Map-Ban-2: <>
-------------
Screenshot: <> <-WE RECCOMEND UPLOADING TO IMGUR/REDDIT OR ANOTHER IMAGE HOSTING SITE RATHER THAN DIRECT UPLOAD TO DISCORD

*/

function resultGathering(message, input)
{
	var keyWords = ["Map-Played:","Winner:","P1-Name:","P1-Pick:","P1-Div-Ban-1:","P1-Div-Ban-2:","P1-Map-Ban-1:","P1-Map-Ban-2:",
					"P2-Name:","P2-Pick:","P2-Div-Ban-1:","P2-Div-Ban-2:","P2-Map-Ban-1:","P2-Map-Ban-2:","Screenshot:"];
	var res = "";
	fs = require('fs');
	var continueLooking = true;

	//for each keyword
	for(key in keyWords)
	{
		//loop through each input
		for(i in input)
		{
			//if the input at pos 'i' includes the keyword
			if(input[i].includes(keyWords[key]))
			{
				//increment one over to the word next to the keyword
				var j = i;
				++j;
				//loop until we say stop
				while(continueLooking)
				{
					//concat every word until one of them contains a >, this denotes the end of the entry
					res = res.concat(input[j] + " ");
					//a bit abusive of try catch, but eh
					try 
					{
						if(input[j].includes(">"))
						{
							continueLooking = false;
							res = res.concat(",");
						}
					} 
					// it will always throw an error on the very final input 
					// because includes on 'undefined' is invalid
					catch(err) 
					{
						continueLooking = false;
						res = res.concat(",");
					}
					++j;
				}
			}
			continueLooking = true;
		}
	}

	//now we replace all '<','>'
	for(st in res)
	{
		res = res.replace(">","");
		res = res.replace("<","")
	}
	//delete the very last space and ',' and add a new line
	res = res.substring(0, res.length - 2);
	res = res.concat("\n");

	fs.appendFile('results.csv', res, function (err) {
		if (err) 
		{
			return console.log(err);
		}
	});

	//Return a message with what was entered, this is to give feedback on 
	//results entered without having to go and check the file itself
	message.reply("Results recorded. Values entered were: " + res);
}

function maps(message)
{
	var st1 = "";
	var st2 = "";
	var res = "";

	for (var key in allMaps) 
	{
		st1 = key + " is " + allMaps[key] + "\n"
		st2 = st2.concat(st1);
	}

	res = st2.replace(/true/gi,"not banned. :heavy_check_mark:"); //gotta love regex eh?
	res = res.replace(/false/gi,"banned. :x:");

	message.channel.send(res);
}

function map(message, commands)
{
	try 
	{
		var st = commands[1].toLowerCase() 
	}
	catch(err) 
	{
		console.log("ERROR: Cannot lowercase nothing. Throwing exception.")
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
			printMap(message, 11) //only first 11 maps are 4v4 compatable
			break;
		default:
			message.reply("Unknown size parameter. Please use 1v1, 2v2 etc")
	}
}

function printMap(message, num)
{
	var rnd = Math.floor(Math.random()*num);
	var i = 0;
	for (key in allMaps) 
	{
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
        	value: "Shows this message. \nUsage: $help" 
      	},{
        	name: config.prefix +"allmaps",
        	value: "Displays all maps.\nUsage: $allmaps"
      	},{
        	name: config.prefix +"alldivs",
        	value: "Displays all divisions.\nUsage: $alldivs"
      	},{
        	name: config.prefix +"map",
        	value: "Picks a random, unbanned map of the defined size.\nUsage: $maps 1v1|2v2|3v3|4v4"
      	},{
      		name: config.prefix +"maps",
        	value: "Displays all maps and their banned state.\nUsage: $maps"
      	},{
        	name: config.prefix +"ban",
        	value: "Bans a map.\nUsage: $ban Carpiquet"
      	},{
        	name: config.prefix +"reset",
        	value: "Resets all the map bans.\nUsage: $reset"
      	},{
        	name: config.prefix +"piat",
        	value: "Fires SOD-BOT's piat! Are you able to hit?\nUsage: $piat"
      	},{
        	name: config.prefix +"flip",
        	value: "Flips a coin.\nUsage: $flip"
      	},{
        	name: config.prefix +"faction",
        	value: "Picks a random faction.\nUsage: $faction"
      	},{
        	name: config.prefix +"guide", //TODO need to fill this with more stuff
        	value: "Displays a list of guides for Steel Division.\nUsage: $guide"
      	},{
       		name: config.prefix +"ping",
        	value: "Pings the bot. Prints API Latency.\nUsage: $ping"
      	},{
        	name: config.prefix +"info", 
        	value: "Shows info about the bot.\nUsage: $info"
      	},{
        	name: config.prefix +"results", 
        	value: "Please consult your specific tournaments PDF on how to properly submit results."
      	}]
	}});
}

//Returns 'Miss' to all users, 50/50 chance of returning 'Hit' to an auth'd user
function piat(message)
{
	if(Math.random() < 0.01)
	{
		message.reply("Hit!");
	}
	else if(Math.random() < 0.30)
	{
		message.reply("Ping! Your shot bounced!");
	} 
	else 
	{
		message.reply("Miss!");
	}
}

//function to unban maps 
function unban(message, commands)
{
	var st = cmdAppender(commands)
	for (key in allMaps) 
	{
		if(allMaps[key] == false && key.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ key + " has been unbanned.\n --------------------------------------------");
			allMaps[key] = true;
			maps(message)
		}
	}
}

//function to ban maps from the pool 
function ban(message, commands)
{
	var st = cmdAppender(commands)
	for (key in allMaps) 
	{
		if(allMaps[key] == true && key.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ key + " has been banned.\n--------------------------------------------");
			allMaps[key] = false;
			maps(message)
		}
	}
}	

/*
turns the rest of the comment into a single string rather than in seperate list indexes

ie. 
message = ban pointe du hoc 
commands[0] = ban
commands[1] = pointe
commands[2] = du
commands[3] = hoc

returns commands[1] -> commands[size] as a string concat

ie. returns 'pointe du hoc' 
*/ 
function cmdAppender(commands)
{
	var res = "";
	var i = 0;
	for(st in commands)
	{
		if(i >= 1)
		{
			res = res.concat(commands[st]);
			res = res.concat(" ");
		}
		i++;
	}
	res = res.slice(0, -1); //slice off the last space 
	console.log(res);
	return res;
}

function resetMapPool(message)
{
	message.channel.send("Map pool reset.");
	for (key in allMaps) 
	{
		allMaps[key] = true;
	}
}

function info(message)
{
	message.channel.send("SODBOT 2.1.1\nWritten by mbetts in Node js 10.5.0.\nHosted by Valh on EC2.\nOriginal SODBOT work by Scoutspirit and Chickendew.\nFind any bugs? Ping mbetts or Valh for fixes/troubleshooting.");
}

//Obscure bot token behind a hidden config file
bot.login(token);
