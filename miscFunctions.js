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

function mapHelp(message, commands)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "rmap",
        	value: "Returns a random map of a certain size. \nExample Usage: "+ config.prefix + "rmap 2v2" 
      	},{
        	name: config.prefix + "bannedmaps",
        	value: "Returns a list of banned maps. \nExample Usage: "+ config.prefix + "bannedmaps" 
      	},{
        	name: config.prefix + "allmaps",
        	value: "Returns a list of all maps. \nExample Usage: "+ config.prefix + "allmaps" 
      	},{
        	name: config.prefix + "banmap",
        	value: "Ban a map. \nExample Usage: "+ config.prefix + "banmap Carpiquet" 
      	},{
        	name: config.prefix + "unbanmap",
        	value: "Unban a map. \nExample Usage: "+ config.prefix + "unbanmap Carpiquet" 
      	},{
        	name: config.prefix + "resetmaps",
        	value: "Reset all the banned maps. \nExample Usage: "+ config.prefix + "resetmaps" 
      	}]
	}});
}

function divHelp(message, commands)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "rdiv",
        	value: "Returns a random division of a faction. \nExample Usage: "+ config.prefix + "rdiv allies" 
      	},{
        	name: config.prefix + "banneddivs",
        	value: "Returns a list of banned divisions. \nExample Usage: "+ config.prefix + "banneddivs" 
      	},{
        	name: config.prefix + "alldivs",
        	value: "Returns a list of all divisions. \nExample Usage: "+ config.prefix + "alldivs" 
      	},{
        	name: config.prefix + "bandiv",
        	value: "Ban a division. \nExample Usage: "+ config.prefix + "bandiv 12. SS-Panzer" 
      	},{
        	name: config.prefix + "unbandiv",
        	value: "Unban a division. \nExample Usage: "+ config.prefix + "unbandiv 7th Armoured" 
      	},{
        	name: config.prefix + "resetdivs",
        	value: "Reset all the banned divisions. \nExample Usage: "+ config.prefix + "resetdivs" 
      	},{
        	name: config.prefix + "random",
        	value: "Returns a random set of divisions and a map for the size given. \nExample Usage: "+ config.prefix + "random 4v4" 
      	}]
	}});
}

function miscHelp(message, commands)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix +"piat",
        	value: "FIRE THE PIAT. Can you hit?\nExample Usage: "+ config.prefix + "piat"
      	},{
        	name: config.prefix +"guide",
        	value: "Shows some of the player written guides.\nExample Usage: "+ config.prefix + "guide"
      	},{
        	name: config.prefix +"faction",
        	value: "Returns Allies or Axis.\nExample Usage: "+ config.prefix + "faction"
      	},{
        	name: config.prefix +"flip",
        	value: "Flip a coin. Duh. \nExample Usage: "+ config.prefix + "flip"
      	},{
        	name: config.prefix +"info",
        	value: "Shows info about the bot.\nExample Usage: "+ config.prefix + "info"
      	}]
	}});
}

function resultHelp(message, commands)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "results",
        	value: "Use this command to input results with a given template. Do NOT input results unless you are in a torunament that calls for it." 
      	},{
        	name: config.prefix + "template",
        	value: "Outputs a template that the is compatable with the results command." 
      	},{
        	name: config.prefix + "playerResults",
        	value: "Returns the results of the players in the league. 1st argument can be used to sort the table." 
      	},{
        	name: config.prefix + "mapResults",
        	value: "Returns the results of the maps in the league. 1st argument can be used to sort the table."  
      	},{
        	name: config.prefix + "divResults",
        	value: "Returns the results of the divisions in the league. 1st argument can be used to sort the table." 
      	}]
	}});
}

function adminHelp(message, commands)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "createTables",
        	value: "Creates the database file and tables. Admin use only." 
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
}

//Returns embedded message of all current commands
function help(message, commands)
{
	if(commands[1] == undefined)
	{
		message.channel.send({embed: {
			color: 3447003,
			author: {
				  name: message.client.user.username,
				  icon_url: message.client.user.avatarURL
			},
			fields: [{
				name: config.prefix + "help",
				value: "Gives this message." 
			  },{
				name: config.prefix + "help maps",
				value: "Gives help info about map commands." 
			  },{
				name: config.prefix + "help div",
				value: "Gives help info about division commands." 
			  },{
				name: config.prefix + "help misc",
				value: "Gives help info about misc commands." 
			  },{
				name: config.prefix + "help result",
				value: "Gives help info about result commands." 
			  },{
				name: config.prefix + "help admin",
				value: "Gives help info about admin commands." 
			  }]
		}});
	} 
	else if(commands[1].toLowerCase().includes("maps"))
	{
		mapHelp(message, commands)
	}
	else if(commands[1].toLowerCase().includes("div"))
	{
		divHelp(message, commands)
	}
	else if(commands[1].toLowerCase().includes("misc"))
	{
		miscHelp(message, commands)
	}
	else if(commands[1].toLowerCase().includes("result"))
	{
		resultHelp(message, commands)
	}
	else if(commands[1].toLowerCase().includes("admin"))
	{
		adminHelp(message, commands)
	} 
	else
	{
		message.channel.send("I don't know what that argument is. Try " + config.prefix + "help for more info.")
	} 
}