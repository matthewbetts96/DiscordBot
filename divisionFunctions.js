var maps = require("./mapFunctions");

var allies = {"3rd Armoured":true,"4th Armoured":true,"101st Airborne":true,"2nd Infantry":true,"2e Blindee":true,"Demi-Brigade SAS":true,
			"7th Armoured":true,"Guards Armoured":true,"6th Airborne":true,"15th Infantry":true,"1st SSB":true,"3rd Canadian Infantry":true,
			"1 Pancerna":true, "1st Infantry":true};

var axis = {"Panzer-Lehr":true,"12. SS-Panzer":true,"1. SS-Panzer":true,"2. Panzer":true,"9. Panzer":true,"21. Panzer":true,
			"116. Panzer":true, "17. SS-Panzergrenadier":true, "3. Fallschirmjager":true,"16. Luftwaffe":true, "91. Luftlande":true,
			"Festung Groß-Paris":true,"352. Infanterie":true, "716. Infanterie":true};

module.exports = {
	rdiv: function (message, commands) 
	{
		divSide(message, commands);
	},
	bannedDivs: function(message, commands)
	{
		bannedDivs(message, commands);
	},
	allDivs: function (message, commands) 
	{
		printAllDivs(message, commands);	
	},
	banDiv: function (message, commands) 
	{
		ban(message, commands);	
	},	
	unbanDiv: function (message, commands) 
	{
		unban(message, commands);	
	},	
	resetDivs: function(message, commands) 
	{
		resetDivs(message, commands);
	},
	selectRandDivAllies: function(message)
	{
		selectRandDivAllies(message)
	},
	selectRandDivAxis: function(message)
	{
		selectRandDivAxis(message)
	},
	randomSetup: function(message, commands)
	{
		randomSetup(message, commands)
	}
};


function printAllDivs(message, commands)
{
	var res = "";
	for (var div in allies) 
	{
		res = res.concat(div + "\n");
	}
	res = res.concat("-------------------------\n");
	for (var div in axis) 
	{
		res = res.concat(div + "\n");
	}
	message.channel.send(res);
}

function bannedDivs(message, commands)
{
	var res = "";

	for(var div in allies)
	{
		res = res.concat(div + " is " + allies[div]+ "\n");
	}
	res = res.concat("--------------------------------------------\n");
	for(var div in axis)
	{
		res = res.concat(div + " is " + axis[div]+ "\n");
	}

	res = res.replace(/true/gi,"not banned. :heavy_check_mark:");
	res = res.replace(/false/gi,"banned. :x:");

	message.channel.send(res);
}

function resetDivs(message, commands)
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

//function to unban divs from the pool 
function ban(message, commands)
{
	var st = cmdAppender(commands)
	for (div in allies) 
	{
		if(allies[div] == true && div.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ div + " has been banned.\n--------------------------------------------");
			allies[div] = false;
		}
	}

	for (div in axis) 
	{
		if(axis[div] == true && div.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ div + " has been banned.\n--------------------------------------------");
			axis[div] = false;
		}
	}
	bannedDivs(message, commands);
}	

//function to unban divs from the pool 
function unban(message, commands)
{
	var st = cmdAppender(commands)
	for (div in allies) 
	{
		if(allies[div] == false && div.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ div + " has been banned.\n--------------------------------------------");
			allies[div] = true;
		}
	}

	for (div in axis) 
	{
		if(axis[div] == false && div.toLowerCase() == st.toLowerCase())
		{
			message.channel.send("--------------------------------------------\n"+ div + " has been banned.\n--------------------------------------------");
			axis[div] = true;
		}
	}
	bannedDivs(message, commands);
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
	return res;
}
//takes an input (allies || axis) and (calls a function that) outputs a random division from that side
function divSide(message, commands)
{
	var st ="";
	try 
	{
		var st = commands[1].toLowerCase() 
	}
	catch(err) 
	{
		console.log("ERROR: Cannot lowercase undefined.")
		st = "";
	}
	switch(st)
	{
		case "allies":
			message.channel.send(selectRandDivAllies(message));
			break;
		case "axis":
			message.channel.send(selectRandDivAxis(message));
			break;
		default:
			message.reply("Unknown side parameter. Please use 'allies' or 'axis'.");
	}	
}

//Returns a random allies faction if it is true, else, repeats
function selectRandDivAllies(message)
{
	var rnd = Math.floor(Math.random()*14);
	var i = 0;
	for(div in allies)
	{
		if(rnd == i)
		{
			if(allies[rnd] == false)
			{
				selectRandDivAllies();
			}
			else 
			{
				return div;
			}
		}
		i++
	}
}

//Returns a random axis faction if it is true, else, repeats
function selectRandDivAxis(message)
{
	var rnd = Math.floor(Math.random()*14);
	var i = 0;
	for(div in axis)
	{
		if(rnd == i)
		{
			if(axis[rnd] == false)
			{
				selectRandDivAxis()
			}
			else 
			{
				return div;
			}
		}
		i++
	}
}

//random setup is here as it requires methods from both div and map files
function randomSetup(message, commands)
{
	var playersNum = "1"
	var alliedDivs = "";
	var axisDivs = "";
	var playersNum = "";
	try 
	{
		var playersNum = commands[1].charAt(0);
		//allied divs 
		for (var i = 0; i < playersNum; i++) {
			alliedDivs = alliedDivs.concat(selectRandDivAllies(message) + "\n");
		};  
		//axis divs
		for (var j = 0; j < playersNum; j++) {
			axisDivs = axisDivs.concat(selectRandDivAxis(message) + "\n");
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
		maps.rmap(message, commands);
	} 
	else 
	{
		message.reply("Unknown size parameter. Please use 1v1, 2v2 etc");
	}
}