var allMaps = {"Bois de Limors":true,"Carpiquet":true,"Caumont l'Evente":true,"Cheux":true,"Colleville":true,"Colombelles":true
				,"Cote 112":true,"Mont Ormel":true,"Odon":true,"Omaha":true,"Pegasus Bridge":true,"Pointe du Hoc":true,
				"Carpiquet-Duellist":true,"Merderet":true,"Odon River":true,"Sainte Mere l'Eglise":true,"Sainte Mere l'Eglise Duellists":true};


module.exports = {
	rmap: function (message, commands) 
	{
		randomMap(message, commands);
	},
	bannedMaps: function (message, commands)
	{
		bannedMaps(message, commands);
	},
	allMaps: function (message, commands) 
	{
		printAllMaps(message, commands);	
	},
	banMap: function (message, commands) 
	{
		banMap(message, commands);
	},	
	unbanMap: function (message, commands) 
	{
		unbanMap(message, commands);		
	},	
	resetMaps: function(message, commands) 
	{
		resetMaps(message, commands)
	}
};

function randomMap(message, commands)
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
	counter = 0;
}

//Global counter variable
var counter = 0;
function printMap(message, num)
{
	let rndMap = Math.floor(Math.random()*num);
	var toReturn = Object.keys(allMaps)[rndMap];

	if(counter > 20)
	{
		counter = 0;
		return "Error in picking map."
	} 
	else if(allMaps[Object.keys(allMaps)[rndMap]] == false) 
	{
		counter++;
		return printMap(message, num);
	}
	else
	{
		return toReturn;
	}
}

function bannedMaps(message, commands)
{
	var res = "";
	for (var key in allMaps) 
	{
		res = res.concat(key + " is " + allMaps[key] + "\n");
	}
	res = res.replace(/true/gi,"not banned. :heavy_check_mark:");
	res = res.replace(/false/gi,"banned. :x:");

	message.channel.send(res);
}

function printAllMaps(message, commands)
{
	var res = "";
	for (var key in allMaps) 
	{
		res = res.concat(key + "\n");
	}
	res = res.substring(0, res.length - 1);
	message.channel.send(res);
}

function banMap(message, commands)
{
	var st = cmdAppender(commands)
	for (key in allMaps) 
	{
		if(allMaps[key] == true && key.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ key + " has been banned.\n--------------------------------------------");
			allMaps[key] = false;
			bannedMaps(message, commands)
		}
	}
}

function unbanMap(message, commands)
{
	var st = cmdAppender(commands)
	for (key in allMaps) 
	{
		if(allMaps[key] == false && key.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ key + " has been unbanned.\n --------------------------------------------");
			allMaps[key] = true;
			bannedMaps(message, commands)
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

and yes, a copy of this exists in divisionFunction.js, I know..
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

function resetMaps(message, commands)
{
	message.channel.send("Map pool reset.");
	for (key in allMaps) 
	{
		allMaps[key] = true;
	}
}