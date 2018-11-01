var AsciiTable = require('ascii-table');

var admin = require("./adminCommands");
var log = require("./logging");
var config = require("./config");
var div = require("./divisionFunctions");

var allMaps = {"Bois de Limors":true,"Carpiquet":true,"Caumont l'Evente":true,"Cheux":true,"Colleville":true,"Colombelles":true
				,"Cote 112":true,"Mont Ormel":true,"Odon":true,"Omaha":true,"Pegasus Bridge":true,"Pointe du Hoc":true,
				"Carpiquet-Duellist":true,"Merderet":true,"Odon River":true,"Sainte Mere l'Eglise":true,"Sainte Mere l'Eglise Duellists":true};
var rmapCounter = 0;

function _mapsEntryLoc(message, command, args)
{
	//Checks if module is enabled
	if(!config.module_mapCommands)
	{
		message.channel.send("The maps module is disabled.");
		return;
	}

	//now we find out what they wanted to call
	switch(command.toLowerCase())
	{
		case "unbanmap": //random map
			unbanmap(message, args);
			break;
		case "banmap": //random map
			banmap(message, args);
			break;
		case "rmap":
			rMap(message, args);
			break;
		case "allmaps":
			maps(message);
			break;
		case "resetmaps":
			resetMaps(message);
			break;
		case "random":
			random(message, args);
			break;
		case "bannedmaps":
			bannedMaps(message);
			break;
		default:
			break;
	}
	//log the command
	log.generalCommandLogging(message, command);
}

function random(message, args)
{
	//Exit if args[0] is not a string that is structured like (int)(any string)(int)
	if(isNaN(parseInt(args[0].charAt(0))) | isNaN(parseInt(args[0].charAt(2))))
	{
		message.channel.send("Error. Please retry.") 
		return;
	}

	//OLD VERSION FOR VULCAN ONLY
	if(message.author.id == '157207837561454593')
	{
		oldRandomForVulcan(message, args)
		return;
	}

	let allies = parseInt(args[0].charAt(0));
	let axis = parseInt(args[0].charAt(2));

	let largestInput = Math.max(allies, axis);
	let table = new AsciiTable("Random " + allies + "v" + axis);

	if(largestInput >= 4)
	{
		table.setHeading('Map : ',printMap(message, 11));
	} 
	else 
	{
		table.setHeading('Map : ', printMap(message, 16));
	}
	table.addRow("ALLIES", "AXIS");

	let alliesInput = '';
	let axisInput = '';
	for(i = 1; i <= largestInput; i++)
	{
		alliesInput = 'N/A';
	    axisInput = 'N/A';
		if(i <= allies)
		{
			alliesInput = div.selectRandDivAllies(message);
		}
		if(i <= axis)
		{
			axisInput = div.selectRandDivAxis(message)
		} 
		table.addRow(alliesInput, axisInput);
	}
	table.setAlign(0, AsciiTable.CENTER).setAlign(1, AsciiTable.CENTER)

	message.channel.send("``" + table.toString() + "``");
}

//old version of the random function so Vulcan can use it on his stream
function oldRandomForVulcan(message, args)
{
	var playersNum = "1"
	var alliedDivs = "";
	var axisDivs = "";
	var playersNum = "";

	console.log(args)
	try 
	{
		var playersNum = args[0].charAt(0);
		//allied divs 
		for (var i = 0; i < playersNum; i++) {
			alliedDivs = alliedDivs.concat(div.selectRandDivAllies(message) + "\n");
		};  
		//axis divs
		for (var j = 0; j < playersNum; j++) {
			axisDivs = axisDivs.concat(div.selectRandDivAxis(message) + "\n");
		}; 
	}
	catch(err) 
	{
		console.log("ERROR: " + err)
	}

	var res = "";
	if(playersNum != "")
	{
		res = res.concat(alliedDivs + "\n");
		res = res.concat("-----------VS-----------\n");
		res = res.concat(axisDivs + "\n");
		res = res.concat("-----------on-----------\n");
		message.channel.send(res);
		rMap(message, args);
	} 
	else 
	{
		message.reply("Unknown size parameter. Please use 1v1, 2v2 etc");
	}
}

function banmap(message, args)
{
	let mapsBanned = '';
	for(map in args)
	{
		for (key in allMaps) 
		{
			if(args[map].toLowerCase() === key.toLowerCase())
			{
				mapsBanned = mapsBanned + key + ", ";
				allMaps[key] = false;
			}
		}
	}

	mapsBanned = mapsBanned.slice(0, -2);
	message.channel.send('``'+ mapsBanned + " have been banned.``");
	bannedMaps(message)
}

function unbanmap(message, args)
{
	let mapsBanned = '';
	for(map in args)
	{
		for (key in allMaps) 
		{
			if(args[map].toLowerCase() === key.toLowerCase())
			{
				mapsBanned = mapsBanned + key + ", ";
				allMaps[key] = true;
			}
		}
	}

	mapsBanned = mapsBanned.slice(0, -2);
	message.channel.send('``'+ mapsBanned + " have been unbanned.``");
	bannedMaps(message)
}

function bannedMaps(message)
{
	var isBanned = '';
	var table = new AsciiTable('Banned Maps');
	table.setHeading('Map Name','Banned?');

	for (var key in allMaps) 
	{
		if(allMaps[key] == true)
		{
			isBanned = "Not Banned";
		} 
		else 
		{
			isBanned = "**BANNED**";
		}

		table.addRow(key, isBanned);
	}
	message.channel.send("``" + table.toString() + "``");
}

function rMap(message, args)
{
	try 
	{
		var st = args[0].toLowerCase() 
	}
	catch(err) 
	{
		console.log("ERROR: Cannot lowercase nothing. Throwing exception.")
		st = "";
	}
	switch(st)
	{
		case "1v1":
			message.channel.send(printMap(message, 16));
			break;
		case "2v2":
			message.channel.send(printMap(message, 16));
			break;
		case "3v3":
			message.channel.send(printMap(message, 16));
			break;
		case "4v4":
			message.channel.send(printMap(message, 11)); //only first 11 maps are 4v4 compatable
			break;
		default:
			message.reply("Unknown size parameter. Please use 1v1, 2v2 etc")
	}
	rmapCounter = 0;
}

function printMap(message, num)
{
	let rndMap = Math.round(Math.random()*num);
	let toReturn = Object.keys(allMaps)[rndMap];

	if(rmapCounter > 200)
	{
		rmapCounter = 0;
		return "Error in picking map."
	} 
	else if(allMaps[Object.keys(allMaps)[rndMap]] == false) 
	{
		rmapCounter++;
		return printMap(message, num);
	}
	else
	{
		return toReturn;
	}
}

function resetMaps(message)
{
	for (key in allMaps) 
	{
		allMaps[key] = true;
	}
	message.channel.send("Map pool reset.");
}

function maps(message)
{
	var res = "";
	for (var key in allMaps) 
	{
		res = res.concat(key + "\n");
	}
	res = res.substring(0, res.length - 1);
	message.channel.send("```"+res+"```");
}

module.exports = {
	mapsEntryLoc: _mapsEntryLoc
};