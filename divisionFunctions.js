var AsciiTable = require('ascii-table')

var admin = require("./adminCommands");
var log = require("./logging");
var config = require("./config");

var allies = {"3rd Armoured":true,"4th Armoured":true,"101st Airborne":true,"2nd Infantry":true,"2e Blindee":true,"Demi-Brigade SAS":true,
			"7th Armoured":true,"Guards Armoured":true,"6th Airborne":true,"15th Infantry":true,"1st SSB":true,"3rd Canadian Infantry":true,
			"1 Pancerna":true, "1st Infantry":true};

var axis = {"Panzer-Lehr":true,"12. SS-Panzer":true,"1. SS-Panzer":true,"2. Panzer":true,"9. Panzer":true,"21. Panzer":true,
			"116. Panzer":true, "17. SS-Panzergrenadier":true, "3. Fallschirmjager":true,"16. Luftwaffe":true, "91. Luftlande":true,
			"Festung GroB-Paris":true,"352. Infanterie":true, "716. Infanterie":true};


var rdivCounter = 0;

function _divEntryLoc(message, command, args)
{
	if(!config.module_divCommands)
	{
		message.channel.send("The maps module is disabled.");
		return;
	}

	switch(command.toLowerCase())
	{
		case "unbandiv": //random map
			unbandiv(message, args);
			break;
		case "bandiv": //random map
			bandiv(message, args);
			break;
		case "rdiv":
			rdiv(message, args);
			break;
		case "alldivs":
			alldivs(message);
			break;
		case "resetdivs":
			resetdivs(message);
			break;
		case "banneddivs":
			bannedDivs(message, args);
		default:
			break;
	}
	//log the command
	log.generalCommandLogging(message, command);
}

function rdiv(message, args)
{
	var st ="";
	try 
	{
		var st = args[0].toLowerCase() 
	}
	catch(err) 
	{
		console.log("ERROR: Cannot lowercase undefined.")
		st = "";
	}
	switch(st)
	{
		case "allies":
			message.reply(_selectRandDivAllies(message));
			break;
		case "axis":
			message.reply(_selectRandDivAxis(message));
			break;
		default:
			message.reply("Unknown side parameter. Please use 'allies' or 'axis'.");
	}
}

//Returns a random allies faction if it is true, else, repeats
function _selectRandDivAllies(message)
{
	let rndDiv = Math.round(Math.random()*Object.keys(allies).length);
	let toReturn = Object.keys(allies)[rndDiv];
	if(rdivCounter > 200)
	{
		return "Error in picking division."
	} 
	else if(allies[Object.keys(allies)[rndDiv]] == false)
	{
		rdivCounter++;
		return _selectRandDivAllies(message);
	} 
	else
	{
		return toReturn;
	}
}

//Returns a random axis faction if it is true, else, repeats
function _selectRandDivAxis(message)
{
	let rndDiv = Math.round(Math.random()*Object.keys(axis).length);
	let toReturn = Object.keys(axis)[rndDiv];

	if(rdivCounter > 200)
	{
		return "Error in picking division."
	} 
	else if(axis[Object.keys(axis)[rndDiv]] == false)
	{
		rdivCounter++;
		return _selectRandDivAxis(message);
	} 
	else
	{
		return toReturn;
	}
}

function unbandiv(message, args)
{
	//ban all "op divs"
	if(args[0].toLowerCase() == "op")
	{
		message.channel.send(config.prefix + "unbandiv 4th Armoured, 7th Armoured, 2e Blindee, 1. SS-Panzer, 2. Panzer")
		return;
	}
	//ban all "dlc divs"
	if(args[0].toLowerCase() == "dlc")
	{
		message.channel.send(config.prefix + "unbandiv 4th Armoured, 7th Armoured, Demi-Brigade SAS, 1st SSB, 1st Infantry 1. SS-Panzer, 2. Panzer, 16. Luftwaffe, Festung GroB-Paris, 9. Panzer")
		return;
	}

	let divsUnbanned = '';
	for(div in args)
	{
		for (key in allies) 
		{
			if(args[div].toLowerCase() === key.toLowerCase())
			{
				divsUnbanned = divsUnbanned + key + ", ";
				allies[key] = true;
			}
		}
	}

	for(div in args)
	{
		for (key in axis) 
		{
			if(args[div].toLowerCase() === key.toLowerCase())
			{
				divsUnbanned = divsUnbanned + key + ", ";
				axis[key] = true;
			}
		}
	}

	divsUnbanned = divsUnbanned.slice(0, -2);
	message.channel.send('``'+ divsUnbanned + " have been unbanned.``");
	bannedDivs(message, args);
}

function bandiv(message, args)
{
	//ban all "op divs"
	if(args[0].toLowerCase() == "op")
	{
		message.channel.send(config.prefix + "bandiv 4th Armoured, 7th Armoured, 2e Blindee, 1. SS-Panzer, 2. Panzer")
		return;
	}
	//ban all "dlc divs"
	if(args[0].toLowerCase() == "dlc")
	{
		message.channel.send(config.prefix + "bandiv 4th Armoured, 7th Armoured, Demi-Brigade SAS, 1st SSB, 1st Infantry, 1. SS-Panzer, 2. Panzer, 16. Luftwaffe, Festung GroB-Paris, 9. Panzer")
		return;
	}

	let divsBanned = '';
	for(div in args)
	{
		for (key in allies) 
		{
			if(args[div].toLowerCase() === key.toLowerCase())
			{
				divsBanned = divsBanned + key + ", ";
				allies[key] = false;
			}
		}
	}

	for(div in args)
	{
		for (key in axis) 
		{
			if(args[div].toLowerCase() === key.toLowerCase())
			{
				divsBanned = divsBanned + key + ", ";
				axis[key] = false;
			}
		}
	}

	divsBanned = divsBanned.slice(0, -2);
	message.channel.send('``'+ divsBanned + " have been banned.``");
	bannedDivs(message, args);
}

function bannedDivs(message, args)
{
	let alliedDiv = "";
	let axisDiv = "";
	let alliedState = "";
	let axisState = "";

	let table = new AsciiTable('Banned Divisions');
	table.setHeading('Allied Divs','Banned?','Axis Divs','Banned?');

	for (i = 0; i <= 13; i++) { 

		alliedDiv = Object.keys(allies)[i];
		axisDiv = Object.keys(axis)[i];

		if(allies[alliedDiv] === true)
		{
			alliedState = "Not Banned"
		} else {
			alliedState = "**BANNED**"
		}

		if(axis[axisDiv] === true)
		{
			axisState = "Not Banned"
		} else {
			axisState = "**BANNED**"
		}
	
		table.addRow(alliedDiv, alliedState, axisDiv, axisState);
	}
	message.channel.send("``" + table.toString() + "``");
}

function alldivs(message)
{
	var table = new AsciiTable('Divisions');
	
	table.setHeading('Allies','Axis');

	for (i = 0; i <= 13; i++) { 
		table.addRow(Object.keys(allies)[i], Object.keys(axis)[i]);
	}
	message.channel.send("``"+ table.toString() +"``");
}

function resetdivs()
{
	for (div in allies) 
	{
		allies[div] = true;
	}
	for (div in axis) 
	{
		axis[div] = true;
	}
	message.channel.send("Division bans reset.");
}

module.exports = {
	divEntryLoc: _divEntryLoc,
	selectRandDivAxis: _selectRandDivAxis,
	selectRandDivAllies: _selectRandDivAllies
};