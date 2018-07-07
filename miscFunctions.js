var config = require("./config");

module.exports = {
	shootThing: function(message, commands)
	{
		if(rateLimiter())
		{
			shootThing(message, commands);
		}
	},
	guide: function(message, commands)
	{
		guide(message, commands)
	},
	info: function(message, commands)
	{
		info(message, commands)
	},
	faction: function(message, commands)
	{
		faction(message, commands)
	},
	flip: function(message, commands)
	{
		flip(message, commands)
	},
	info: function(message, commands)
	{
		info(message, commands)
	},
	help: function(message, commands)
	{
		help(message, commands)
	}
};

//A simple rate limiter
//Ignores requests if they are within 1 second of eachother and will 
//not respond unless one second has passed since the last request (currently subject to change)
var lastrequestTime = 0;

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
        	name: config.prefix + "rmap",
        	value: "Returns a random map of a certain size. \nExample Usage: $rmap 2v2" 
      	},{
        	name: config.prefix + "bannedmaps",
        	value: "Returns a list of banned maps. \nExample Usage: $bannedmaps" 
      	},{
        	name: config.prefix + "allmaps",
        	value: "Returns a list of all maps. \nExample Usage: $allmaps" 
      	},{
        	name: config.prefix + "banmap",
        	value: "Ban a map. \nExample Usage: $banmap Carpiquet" 
      	},{
        	name: config.prefix + "unbanmap",
        	value: "Unban a map. \nExample Usage: $unbanmap Carpiquet" 
      	},{
        	name: config.prefix + "resetmaps",
        	value: "Reset all the banned maps. \nExample Usage: $resetmaps" 
      	},{
        	name: config.prefix + "rdiv",
        	value: "Returns a random division of a faction. \nExample Usage: $rdiv allies" 
      	},{
        	name: config.prefix + "banneddivs",
        	value: "Returns a list of banned divisions. \nExample Usage: $banneddivs" 
      	},{
        	name: config.prefix + "alldivs",
        	value: "Returns a list of all divisions. \nExample Usage: $alldivs" 
      	},{
        	name: config.prefix + "bandiv",
        	value: "Ban a division. \nExample Usage: $banmap 12. SS-Panzer" 
      	},{
        	name: config.prefix + "unbandiv",
        	value: "Unban a division. \nExample Usage: $unbandiv Carpiquet" 
      	},{
        	name: config.prefix + "resetdivs",
        	value: "Reset all the banned divisions. \nExample Usage: $resetdivs" 
      	},{
        	name: config.prefix + "random",
        	value: "Returns a random set of divisions and a map for the size given. \nExample Usage: $random 4v4" 
      	},{
        	name: config.prefix + "help",
        	value: "Shows this message. \nExample Usage: $help" 
      	},{
        	name: config.prefix +"piat",
        	value: "FIRE THE PIAT. Can you hit?\nExample Usage: $piat"
      	},{
        	name: config.prefix +"guide",
        	value: "Shows some of the player written guides.\nExample Usage: $guide"
      	},{
        	name: config.prefix +"faction",
        	value: "Returns Allies or Axis.\nExample Usage: $faction"
      	},{
        	name: config.prefix +"flip",
        	value: "Flip a coin. Duh. \nExample Usage: $flip"
      	},{
        	name: config.prefix +"info",
        	value: "Shows info about the bot.\nExample Usage: $info"
      	}]
	}});
}

function shootThing(message, commands)
{
	if(Math.random() < 0.01)
	{
		message.reply("Hit!");
	}
	else if(Math.random() < 0.02)
	{
		message.reply("Are you even trying to hit anymore?");
	}
	else if(Math.random() < 0.03)
	{
		message.reply("Oh come on, that shot was pathetic... you missed by a mile!");
	}
	else if(Math.random() < 0.10)
	{
		message.reply("Ping! Your shot bounced!");
	} 
	else 
	{
		message.reply("Miss!");
	}
}

//Replies with the defacto game manual, this can be expanded later to include more things
function guide(message, commands)
{
	message.reply("https://steamcommunity.com/sharedfiles/filedetails/?id=1276910882\nhttps://www.reddit.com/r/Steel_Division/comments/8amqp1/optics_and_stealth_table/\nhttps://www.reddit.com/r/Steel_Division/comments/6bjnnn/math_division_normandy_44penetration_bounce_and/");
}

//Returns heads or tails 
function faction(message, commands)
{
	if(Math.random() >= 0.5)
	{
		message.reply('Axis!');
	} 
	else 
	{
		message.reply('Allies!');
	}
}

//Returns heads or tails 
function flip(message, commands)
{
	if(Math.random() >= 0.5)
	{
		message.reply('Heads!');
	} 
	else 
	{
		message.reply('Tails!');
	}
}

//Returns a simple info card about the bot
function info(message, commands)
{
	message.channel.send("SODBOT 2.2.0\nWritten by mbetts in Node js 10.5.0.\nHosted by Valh on EC2.\nOriginal SODBOT work by Scoutspirit and Chickendew.\nFind any bugs? Ping mbetts or Valh for fixes/troubleshooting.");
}
