var log = require("./logging");
var config = require("./config");
var admin = require("./adminCommands");

var AsciiTable = require('ascii-table');

var lastrequestTime = 0;

var sodbotReplies = ["hit!","miss! Mission failed. We'll get em next time!", "miss! Are you even trying to hit anymore?", "oh come on, that shot was pathetic... Put your back into it!",
"ping! Your shot bounced!", "you miss 100% of the shots you don't take, or in your case, 100% of those that you do as well...", "miss! Your shot couldn't hit the broad side of a barn!"];

function _miscEntryLoc(message, command, args)
{
    if(!config.module_miscCommands)
	{
		message.channel.send("The misc module is disabled.");
		return;
	}
	
    switch(command.toLowerCase())
	{
        case "panzerfaust":
		case "panzerschreck":
		case "bazooka":
		case "grenade":
		case "gammonbomb":
		case "potato":
        case "piat":
            shootThing(message);
            break;
        case "guide":
            guide(message);
            break;
        case "info":
            info(message);
            break;
        case "faction":
            faction(message);
            break;
        case "flip":
            flip(message);
            break;
		case "help":
			help(message, args)
			break;
		case "template":
			template(message)
			break;
	}
	
	//log the command
	log.generalCommandLogging(message, command);
}

//Returns axis or allies 
function faction(message)
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
function flip(message)
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
function info(message)
{
	let table = new AsciiTable('Info');
    table.setHeading('SODBOT ' + config.version);
	table.addRow("Written by mbetts in Node js 11.3.0.");
	table.addRow("Find any bugs? Please make an issue on the Github page below. ")
	table.addRow("https://github.com/matthewbetts96/DiscordBot");
	table.addRow("Hosted by Valh on AWS.");
	table.addRow("Original SODBOT by Scoutspirit and Chickendew.");
	table.setAlign(0, AsciiTable.CENTER)
    message.channel.send("``"+ table.toString() +"``");
}

function shootThing(message)
{
    if(rateLimiter())
	{
      if(Math.random() < 0.05)
        {
            message.reply(sodbotReplies[Math.floor(Math.random()*sodbotReplies.length)]);
        } 
        else 
        {
            message.reply("Miss!");
        }
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
		return false;
	}
}

function template(message)
{
	message.channel.send("```" + config.prefix + "results\nOutcome:\nMap Played:\nWinner:\nLoser:\n------------- \nP1 Name:  \nP1 Pick:\nP1 Div Ban 1:\nP1 Div Ban 2: "+
	"\nP1 Div Ban 3: \nP1 Map Ban 1:\nP1 Map Ban 2:\n-------------\nP2 Name: \nP2 Pick: \nP2 Div Ban 1:\nP2 Div Ban 2:\nP2 Div Ban 3:\nP2 Map Ban 1:\nP2 Map Ban 2:```")
}

//Replies with the defacto game manual, this can be expanded later to include more things
function guide(message)
{
    var table = new AsciiTable('Guides');

    table.setHeading('Title','Author','Link');

    table.addRow("Biggest game manual","Leenday","https://goo.gl/xkCkMZ");
    table.addRow("Penetration, Bounce and Critical Hits 101","/u/2VetOP","https://goo.gl/73FBRi");
    table.addRow("Optics and Stealth Table","/u/aletoledo","https://goo.gl/wKAWi6");
	table.addRow("SD Deck Builder","aqarius90","https://goo.gl/JebMaS");
	table.addRow("SD Hidden Data","LuxMiz", "https://goo.gl/hhGs22");

    message.channel.send("``"+ table.toString() +"``");
}

//Returns embedded message of all current commands
function help(message, args)
{
	if(args[0].toLowerCase().includes("maps"))
	{
		mapHelp(message)
	}
	else if(args[0].toLowerCase().includes("div"))
	{
		divHelp(message)
	}
	else if(args[0].toLowerCase().includes("misc"))
	{
		miscHelp(message)
	}
	else if(args[0].toLowerCase().includes("result"))
	{
		resultHelp(message)
	}
	else if(args[0].toLowerCase().includes("admin"))
	{
		adminHelp(message)
	} 
	else
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
}

function mapHelp(message)
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
        	value: "Ban a map. \nExample Usage: "+ config.prefix + "banmap Carpiquet, Caumont l'Evente" 
      	},{
        	name: config.prefix + "unbanmap",
        	value: "Unban a map. \nExample Usage: "+ config.prefix + "unbanmap Carpiquet, Caumont l'Evente" 
      	},{
        	name: config.prefix + "resetmaps",
        	value: "Reset all the banned maps. \nExample Usage: "+ config.prefix + "resetmaps" 
      	},{
        	name: config.prefix + "random",
        	value: "Returns a random set of divisions and a suitable map for the size given. \nExample Usage: "+ config.prefix + "random 4v4 or " + config.prefix + "random 2v1" 
      	}]
	}});
}

function divHelp(message)
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
        	value: "Ban a division. \nExample Usage: "+ config.prefix + "bandiv 12. SS-Panzer, 7th Armoured" 
      	},{
        	name: config.prefix + "unbandiv",
        	value: "Unban a division. \nExample Usage: "+ config.prefix + "unbandiv 7th Armoured, 12. SS-Panzer" 
      	},{
        	name: config.prefix + "resetdivs",
        	value: "Reset all the banned divisions. \nExample Usage: "+ config.prefix + "resetdivs" 
		  }]
	}});
}

function miscHelp(message)
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

function resultHelp(message)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "results",
        	value: "Use this command to input results with a given template. Do NOT input results unless you are in a tournament that calls for it. Abuse of this command may lead to you being blacklisted." 
      	},{
        	name: config.prefix + "template",
        	value: "Outputs a template that the is compatable with the results command." 
      	},{
        	name: config.prefix + "playerResults",
        	value: "Returns the results of the players in the league. 1st argument can be used to sort the table and 2nd argument to define asc/desc.\nExample " + config.prefix + "playerResults win asc" 
      	},{
        	name: config.prefix + "mapResults",
        	value: "Returns the results of the maps in the league. 1st argument can be used to sort the table and 2nd argument to define asc/desc.\nExample " + config.prefix + "mapResults pick desc" 
      	},{
        	name: config.prefix + "divResults",
        	value: "Returns the results of the divisions in the league. 1st argument can be used to sort the table and 2nd argument to define asc/desc.\nExample " + config.prefix + "divResults win asc" 
      	}]
	}});
}

function adminHelp(message)
{
	message.channel.send({embed: {
		color: 3447003,
		author: {
      		name: message.client.user.username,
      		icon_url: message.client.user.avatarURL
    	},
		fields: [{
        	name: config.prefix + "createTables",
        	value: "Creates the database file and tables. 'ADMINISTRATOR' permission required." 
		},{
			name: config.prefix + "blacklist",
        	value: "Blacklists a user and SODBOT will ignore all of said users requests. 'ADMINISTRATOR' permission required."
		},{
			name: config.prefix + "unblacklist",
        	value: "Unblacklists a user and SODBOT will stop ignoring all of said users requests. 'ADMINISTRATOR' permission required."
		},{
			name: config.prefix + "purge",
        	value: "Bulk deletes a number of messages in this channel. 'MANAGE MESSAGES' permission required."
		}]
	}});
}

module.exports = {
	miscEntryLoc: _miscEntryLoc
};