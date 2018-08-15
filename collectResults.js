module.exports = {
	inputResults: function(message, commands)
	{
		 inputResults(message, commands)
	},
	register: function(message, commands)
	{
		register(message, commands)
	},
	playerResults: function(message, commands)
	{
		playerResults(message, commands)
	},
	mapResults: function(message, commands)
	{
		mapResults(message, commands)
	},
	divResults: function(message, commands)
	{
		divResults(message, commands)
	},
	returnTemplate: function(message, commands)
	{
		returnTemplate(message, commands)
	},
	ADMIN_createTables: function(message, commands)
	{
		ADMIN_createTables(message, commands)
	}
};

const sqlite3 = require('sqlite3').verbose();
var jsonfile = require('jsonfile');
var config = require("./config");
var file = "players.json";
var jsonObj = jsonfile.readFileSync(file);
var AsciiTable = require('ascii-table')

winnerName = "";
loserName = "";
mapPlayedOn = "";
p1Pick = "";
p2Pick = "";
winningDiv = "";
losingDiv = "";
playerNamesIfDraw = [];
divBans = [];
mapBans = [];
errorInInput = false;
errorInInputString = "";
p1Name = "";
p2Name = "";

var divisions = ["3rd Armoured","4th Armoured","101st Airborne","2nd Infantry","2e Blindee","Demi-Brigade SAS",
			"7th Armoured","Guards Armoured","6th Airborne","15th Infantry","1st SSB","3rd Canadian Infantry",
			"1 Pancerna", "1st Infantry","Panzer-Lehr","12. SS-Panzer","1. SS-Panzer","2. Panzer","9. Panzer",
			"21. Panzer","116. Panzer", "17. SS-Panzergrenadier", "3. Fallschirmjager","16. Luftwaffe", 
			"91. Luftlande","Festung Groß-Paris","352. Infanterie", "716. Infanterie"];

var maps = ["Bois de Limors","Carpiquet","Caumont l'Evente","Cheux","Colleville","Colombelles",
			"Cote 112","Mont Ormel","Odon","Omaha","Pegasus Bridge","Pointe du Hoc","Carpiquet-Duellist",
			"Merderet","Odon River","Sainte Mere l'Eglise","Sainte Mere l'Eglise Duellists"];

//prints a template for users to copy and use
function returnTemplate(message, commands)
{
	message.channel.send(config.prefix + "results \nMap-Played: <> \nWinner: <> \n------------- \nP1-Name: <> \nP1-Pick: <> \nP1-Div-Ban-1: <> \nP1-Div-Ban-2: <>" 
	+" \nP1-Div-Ban-3: <> \nP1-Map-Ban-1: <>\nP1-Map-Ban-2: <>\nP1-Map-Ban-3: <>\n-------------\nP2-Name: <>\nP2-Pick: <>\nP2-Div-Ban-1: <>\n"
	+"P2-Div-Ban-2: <>\nP2-Div-Ban-3: <> \nP2-Map-Ban-1: <>\nP2-Map-Ban-2: <>\nP2-Map-Ban-3: <>\n")
}

function ADMIN_createTables(message, commands)
{
	if(message.author.id.indexOf(config.ADMIN_IDs) == -1)
	{
		message.channel.send("You are not authorized to use this command. This has been logged.");
		return null;
	} 

	let db = connect();
	let sqlPlayer = "CREATE TABLE IF NOT EXISTS players(Name text PRIMARY KEY, Wins integer NOT NULL, Draw integer NOT NULL, Loss integer NOT NULL, TotalPoints integer NOT NULL, WinPercent integer NOT NULL)";
	let sqlDivs = "CREATE TABLE IF NOT EXISTS divResults(Name text PRIMARY KEY, Wins integer NOT NULL, Draw integer NOT NULL, Loss integer NOT NULL, WinPercent integer NOT NULL, Picks integer NOT NULL, Bans integer NOT NULL)";
	let sqlMaps = "CREATE TABLE IF NOT EXISTS mapResults(Name text PRIMARY KEY, Picks integer NOT NULL, Bans integer NOT NULL)"
	db.serialize(function() 
	{
		db.run(sqlPlayer, function(err) 
		{
			if (err) 
			{
				console.log(err);
			}
			else 
			{
				message.channel.send("'players' table created if it doesn't exist.")
			}
		});

		db.run(sqlDivs, function(err) 
		{
			if (err) 
			{
				console.log(err);
			} 
			else 
			{
				message.channel.send("'divResults' table created if it doesn't exist.")
			}
		});

		db.run(sqlMaps, function(err) 
		{
			if (err) 
			{
				console.log(err);
			} 
			else 
			{
				message.channel.send("'mapResults' table created if it doesn't exist.")
			}
		});
	})

	//Now that the tables are created, we can populate them with the maps/divisions
	//doing it like this, rather than hand making, makes it easier to change the bot for another game
	for(map in maps)
	{
		db.run('INSERT INTO mapResults VALUES(?,?,?)', [maps[map],0,0], function(err) 
		{
			if (err) 
			{
				message.channel.send(err.message);
			} 
		});
	}

	message.channel.send("'mapResults' populated");

	for(div in divisions)
	{
		db.run('INSERT INTO divResults VALUES(?,?,?,?,?,?,?)', [divisions[div],0,0,0,0,0,0], function(err) 
		{
			if (err) 
			{
				message.channel.send(err.message);
			} 
		});
	}
	message.channel.send("'divResults' populated");

	db.close();
}


//the 'main' function that calls all the other function
function inputResults(message, commands)
{	
	message.channel.send("If you are submitting for a tournament on SODBOT 2.2.0 ignore the error messages. As long as you get a ping back from the bot, your results have gone through.")
	OLDresultGathering(message, commands)
	//leave method if the author of the message is not registered
	if(!userIsRegistered(message.author.id))
	{
		message.channel.send("You are not registered to submit results.");
		return null;
	} 
	resetGlobals();

	//get the maps that were banned
	getMapData(message, commands);

	//get the divisions that were banned
	getDivisionData(message, commands);

	//collect the names of the players
	if(!checkForDraw(message, commands))
	{
		winnerName = getNameFromInput(commands, 'Winner:');
		loserName = getNameFromInput(commands, 'Loser:');
	
		//work out which div actually won
		p1Name = getNameFromInput(commands, 'P1-Name:');
		p2Name = getNameFromInput(commands, 'P2-Name:');

		//take the names so we can work out what div the winner/loser was playing
		if(p1Name == winnerName)
		{
			winningDiv = p1Pick;
			losingDiv = p2Pick;
		} 
		else if(p2Name == winnerName) 
		{
			winningDiv = p2Pick;
			losingDiv = p1Pick;
		} 
		else 
		{
			message.channe.send("You should never see this message. If you do, something went very wrong...");
		}
	} 
	else 
	{
		playerNamesIfDraw.push(getNameFromInput(commands, 'P1-Name:'));
		playerNamesIfDraw.push(getNameFromInput(commands, 'P2-Name:'));
	}

	//return only an error code if there is an error in the submission
	if(errorInInput)
	{
		message.channel.send(errorInInputString);
	} 
	else 
	{
		message.channel.send("No errors in input. Committing results...");
		commitResults();
		message.channel.send("Results committed successfully.");

		//TODO we should return a string saying what they inputted
	}
}

function getDivisionData(message, commands)
{
	let keyWords = ["P1-Div-Ban-1", "P1-Div-Ban-2", "P1-Div-Ban-3","P2-Div-Ban-1", "P2-Div-Ban-2", "P2-Div-Ban-3"];
	let res = "";
	let continueLooking = true;

	for(key in keyWords)
	{
		for(cmd in commands)
		{
			if(commands[cmd].includes(keyWords[key]))
			{
				var i = cmd;
				++i;
				while(continueLooking)
				{
					//concat every word until one of them contains a >, this denotes the end of the entry
					res = res.concat(commands[i] + " ");
					try 
					{
						if(commands[i].includes(">"))
						{
							continueLooking = false;
						}
					} 
					catch(err) {}
					++i;
				}
				res = res.replace(/,/gi,"");
				res = res.replace(/</gi,"");
				res = res.replace(/>/gi,"");
				res = res.trim();

				if(!divisions.includes(res))
				{
					errorInInput = true;
					errorInInputString = errorInInputString.concat("Unknown division in " + keyWords[key] +". " + res + " does not exist.\n");
				}
				else 
				{
					divBans.push(res);
				}
				res = "";
				continueLooking = true;
			}
		}
	}

	for(cmd in commands)
	{
		if(commands[cmd].includes("P1-Pick:"))
		{
			var i = cmd;
			++i;
			while(continueLooking)
			{
				//concat every word until one of them contains a >, this denotes the end of the entry
				res = res.concat(commands[i] + " ");
				try 
				{
					if(commands[i].includes(">"))
					{
						continueLooking = false;
					}
				} 
				catch(err) {}
				++i;
			}
			res = res.replace(/,/gi,"");
			res = res.replace(/</gi,"");
			res = res.replace(/>/gi,"");
			res = res.trim();

			if(!divisions.includes(res))
			{
				errorInInput = true;
				errorInInputString = errorInInputString.concat("Unknown division in 'P1-Pick:'. " + res + " does not exist.\n");
			}
			else 
			{
				p1Pick = res;
			}
			res = "";
			continueLooking = true;
		}

		if(commands[cmd].includes("P2-Pick:"))
		{
			var i = cmd;
			++i;
			while(continueLooking)
			{
				//concat every word until one of them contains a >, this denotes the end of the entry
				res = res.concat(commands[i] + " ");
				try 
				{
					if(commands[i].includes(">"))
					{
						continueLooking = false;
					}
				} 
				catch(err) {}
				++i;
			}
			res = res.replace(/,/gi,"");
			res = res.replace(/</gi,"");
			res = res.replace(/>/gi,"");
			res = res.trim();

			if(!divisions.includes(res))
			{
				errorInInput = true;
				errorInInputString = errorInInputString.concat("Unknown division in 'P2-Pick:'. " + res + " does not exist.\n");
			}
			else 
			{
				p2Pick = res;
			}
			res = "";
			continueLooking = true;
		}
	}
}

function getMapData(message, commands)
{
	let keyWords = ["P1-Map-Ban-1","P1-Map-Ban-2","P1-Map-Ban-3","P2-Map-Ban-1","P2-Map-Ban-2","P2-Map-Ban-3"];
	let res = "";
	let mapPlayed = "";
	let continueLooking = true;

	for(key in keyWords)
	{
		for(cmd in commands)
		{
			if(commands[cmd].includes(keyWords[key]))
			{
				var i = cmd;
				++i;
				while(continueLooking)
				{
					//concat every word until one of them contains a >, this denotes the end of the entry
					res = res.concat(commands[i] + " ");
					try 
					{
						if(commands[i].includes(">"))
						{
							continueLooking = false;
						}
					} 
					catch(err) {}
					++i;
				}
				res = res.replace(/,/gi,"");
				res = res.replace(/</gi,"");
				res = res.replace(/>/gi,"");
				res = res.trim();

				if(!maps.includes(res))
				{
					errorInInput = true;
					errorInInputString = errorInInputString.concat("Unknown map in " + keyWords[key] +". " + res + " does not exist.\n");
				}
				else 
				{
					mapBans.push(res);
				}
				res = "";
				continueLooking = true;
			}
		}
	}

	for (cmd in commands)
	{
		if(commands[cmd].includes('Map-Played:'))
		{
			var j = cmd;
			++j;
			while(continueLooking)
			{
				//concat every word until one of them contains a >, this denotes the end of the entry
				mapPlayed = mapPlayed.concat(commands[j] + " ");
				try 
				{
					if(commands[j].includes(">"))
					{
						continueLooking = false;
					}
				} 
				catch(err) {}
				++j;
			}
			mapPlayed = mapPlayed.replace(/,/gi,"");
			mapPlayed = mapPlayed.replace(/</gi,"");
			mapPlayed = mapPlayed.replace(/>/gi,"");
			mapPlayed = mapPlayed.trim();

			if(!maps.includes(mapPlayed))
			{
				errorInInput = true;
				errorInInputString = errorInInputString.concat("Unknown map in 'Map-Played:'. " + mapPlayed + " does not exist.\n");
			}
			else 
			{
				mapPlayedOn = mapPlayed;
			}
			continueLooking = true;
		}
	}
}

function getNameFromInput(commands, keyword)
{
	var name = "";
	let continueLooking = true;

	for(cmd in commands)
	{
		if(commands[cmd].includes(keyword))
		{
			var i = cmd;
			++i;
			while(continueLooking)
			{
				//concat every word until one of them contains a >, this denotes the end of the entry
				name = name.concat(commands[i] + " ");
				try 
				{
					if(commands[i].includes(">"))
					{
						continueLooking = false;
					}
				} 
				catch(err) {}
				++i;
			}
		}
	}

	if(!name.includes("@"))
	{
		errorInInputString = errorInInputString.concat("Unknown value in " + keyword +", input must contain an @ user. \n");
		errorInInput = true;
		return name;
	}

	name = name.replace("@","");
	name = name.replace(/,/gi,"");
	name = name.replace(/</gi,"");
	name = name.replace(/>/gi,"");
	name = name.replace(/!/gi,"");
	name = name.trim();

	if(userIsRegistered(name))
	{
		return getUsernameFromID(name);
	} 
	else 
	{
		errorInInput = true;
		errorInInputString = errorInInputString.concat("Unknown value in " + keyword +". " + name + " does not exist.\n");
		return name;
	}
}

function commitResults()
{
	db = connect();

	//if it isn't a draw run this portion 
	if(playerNamesIfDraw === undefined || playerNamesIfDraw.length == 0)
	{
		db.serialize(function() 
		{
			db.run('UPDATE players SET Wins = Wins + 1 WHERE name = ?', [winnerName], function(err)
			{
				if (err) 
				{
		   			throw err;
		  		} 
			});
			db.run('UPDATE players SET Loss = Loss + 1 WHERE name = ?', [loserName], function(err)
			{
				if (err) 
				{
		   			throw err;
		  		} 
			});
			db.run('UPDATE players SET TotalPoints = Wins*3 + Draw', function(err)
			{
				if (err) 
				{
			   		throw err;
			  	} 
			});

			//update win % of the players now
			db.run('UPDATE players SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [winnerName], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});

			db.run('UPDATE players SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [loserName], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});

			//now we do the divisions, one wins one loses (obviously)
			db.run('UPDATE divResults SET Wins = Wins + 1 WHERE name = ?', [winningDiv], function(err)
			{
				if (err) 
				{
			   		throw err;
			  	} 
			});

			db.run('UPDATE divResults SET Loss = Loss + 1 WHERE name = ?', [losingDiv], function(err)
			{
				if (err) 
				{
			   		throw err;
			  	} 
			});

			//Update Win percentage of the divisions
			db.run('UPDATE divResults SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [winningDiv], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});

			db.run('UPDATE divResults SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [losingDiv], function(err)
			{
				if (err) 
				{
			   		throw err;
				}
			});
			
		})
	} 
	else 
	{
		//if it is a draw run this
		var p1 = playerNamesIfDraw[0];
		var p2 = playerNamesIfDraw[1];
		db.serialize(function() 
		{
			//Update players draw column and total points
			db.run('UPDATE players SET Draw = Draw + 1 WHERE name = ?', [p1], function(err)
			{
				if (err) 
				{
		   			throw err;
		  		} 
			});
			db.run('UPDATE players SET Draw = Draw + 1 WHERE name = ?', [p2], function(err)
			{
				if (err) 
				{
		   			throw err;
		  		} 
			});
			db.run('UPDATE players SET TotalPoints = Wins*3 + Draw', function(err)
			{
				if (err) 
				{
			   		throw err;
			  	} 
			});

			//update win %

			db.run('UPDATE players SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [p1], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});

			db.run('UPDATE players SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [p2], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});

			//update divisions draw column
			db.run('UPDATE divResults SET Draw = Draw + 1 WHERE name = ?', [p1Pick], function(err)
			{
				if (err) 
				{
			   		throw err;
			  	} 
			});

			db.run('UPDATE divResults SET Draw = Draw + 1 WHERE name = ?', [p2Pick], function(err)
			{
				if (err) 
				{
			   		throw err;
			  	} 
			});


			//update divisions win % now
			db.run('UPDATE divResults SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [p1Pick], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});

			db.run('UPDATE divResults SET WinPercent = CAST(Wins AS float)/(CAST(Wins AS float) + CAST(Draw AS float) + CAST(Loss AS float))*100 WHERE name = ?', [p2Pick], function(err)
			{
				if (err) 
				{
			   		throw err;
				} 
			});
		})
	}

	//submit div bans
	for (div in divBans)
	{
		db.serialize(function() 
		{
			db.run('UPDATE divResults SET Bans = Bans + 1 WHERE name = ?', [divBans[div]], function(err)
			{
				if (err) 
				{
		   			throw err;
		  		} 
			});
		})
	}

	//submit map bans
	for (map in mapBans)
	{
		db.serialize(function() 
		{
			db.run('UPDATE mapResults SET Bans = Bans + 1 WHERE name = ?', [mapBans[map]], function(err)
			{
				if (err) 
				{
		   			throw err;
		  		} 
			});
		})
	}

	//submit what map was played on & what divs were played
	db.serialize(function() 
	{
		db.run('UPDATE mapResults SET Picks = Picks + 1 WHERE name = ?', [mapPlayedOn], function(err)
		{
			if (err) 
			{
		   		throw err;
		  	} 
		});

		db.run('UPDATE divResults SET Picks = Picks + 1 WHERE name = ?', [p1Pick], function(err)
		{
			if (err) 
			{
		   		throw err;
		  	} 
		});

		db.run('UPDATE divResults SET Picks = Picks + 1 WHERE name = ?', [p2Pick], function(err)
		{
			if (err) 
			{
		   		throw err;
		  	} 
		});
	})

	db.close();
}

//Prints results of the player table as a single string
function playerResults(message, commands)
{
	db = connect();
	let possibleSortBys = ["Wins", "Draw", "Loss", "Pts", "Win"];
	let sortBy = ''

	if(possibleSortBys.includes(commands[1]))
	{
		sortBy = commands[1];
		if(commands[1] == 'Win')
		{	
			if(commands[2].includes('%'))
			{
				sortBy = 'WinPercent'
			}
		} 
		else if(commands[1].includes('Pts')) 
		{
			sortBy = 'TotalPoints'
		}
	} 
	else 
	{
		sortBy = 'Wins'
		message.channel.send("Unknown sorting parameter. Defaulting to 'Wins'.");
	}

	let table = new AsciiTable('Players: Sorted by ' + sortBy);
	table.setHeading('Name', 'Wins', 'Draw', 'Loss', 'Pts', 'Win %')
	db.serialize(function() 
	{
		db.each('SELECT * FROM players ORDER BY ' + sortBy + ' DESC', function(err, row)
		{
			if (err) 
			{
		   		console.log(err);
		   		callback(err);
		  	} 
		  	else 
		  	{
				let winPercent2dp =  row.WinPercent;
				winPercent2dp = winPercent2dp.toFixed(2);
				table.addRow(row.Name, row.Wins, row.Draw, row.Loss, row.TotalPoints, winPercent2dp);
		  	}
		}, function() {
			message.channel.send("```" + table.toString() + "```");
		})
	})
	db.close();
}

function mapResults(message, commands)
{
	db = connect();

	let possibleSortBys = ["Picks", "Bans"];
	let sortBy = '';

	if(possibleSortBys.includes(commands[1]))
	{
		sortBy = commands[1];
	} 
	else 
	{
		sortBy = 'Picks'
		message.channel.send("Unknown sorting parameter. Defaulting to 'Picks'.");
	}

	var table = new AsciiTable('Maps: Sorted by ' + sortBy);
	table.setHeading('Name','Picks', 'Bans')
	db.serialize(function() 
	{
		db.each('SELECT * FROM mapResults ORDER BY Picks DESC', function(err, row)
		{
			if (err) 
			{
		   		console.log(err);
		   		callback(err);
		  	} 
		  	else 
		  	{
				table.addRow(row.Name, row.Picks, row.Bans);
		  	}
		}, function() {
			message.channel.send("```" + table.toString() + "```");
		})
	})
	db.close();
}

function divResults(message, commands)
{
	db = connect();
	let possibleSortBys = ["Wins", "Draw", "Loss", "Picks", "Bans", "Win"];
	let sortBy = ''

	if(possibleSortBys.includes(commands[1]))
	{
		sortBy = commands[1];
		if(commands[1] == 'Win')
		{	
			if(commands[2].includes('%'))
			{
				sortBy = 'WinPercent'
			}
		} 
	} 
	else 
	{
		sortBy = 'Wins'
		message.channel.send("Unknown sorting parameter. Defaulting to 'Wins'.");
	}

	message.channel.send("Due to Discord Character limitations, only the top 20 divisions are shown.");

	let table = new AsciiTable('Divisions: Sorted by ' + sortBy);
	table.setHeading('Name', 'Wins', 'Draw', 'Loss', 'Picks', 'Bans', 'Win %')

	db.serialize(function() 
	{
		db.each('SELECT * FROM divResults ORDER BY Wins DESC LIMIT 20', function(err, row)
		{
			if (err) 
			{
		   		console.log(err);
		   		callback(err);
		  	} 
		  	else 
		  	{
				let winPercent2dp =  row.WinPercent;
				winPercent2dp = winPercent2dp.toFixed(2);
				table.addRow(row.Name, row.Wins, row.Draw, row.Loss, row.Picks, row.Bans, winPercent2dp);
		  	}
		}, function() {
			message.channel.send("```" + table.toString() + "```");
		})
	})
	db.close();
}

//Registered a new user if unregistered
function register(message, commands)
{
	if(!userIsRegistered(message.author.id)){
		let db = connect();
		let discordID = message.author.id;
		let username = message.author.username;
		let newUser = {username, discordID};

		//push the new user to the json file
		jsonObj.users.push(newUser);
		jsonfile.writeFileSync(file, jsonObj);

		//create an empty row within the table for this user
		db.run('INSERT INTO players VALUES(?,?,?,?,?,?)', [username,0,0,0,0,0], function(err) 
		{
			if (err) 
			{
				message.channel.send(err.message);
				return console.log(err.message);
			} 
			else 
			{
				console.log(username + ' added to the json file and database.');
				message.channel.send("Database updated. Welcome to the rankings.");
			}
		});
		db.close();
	} 
	else 
	{
		message.channel.send("You are already registered.");
	}  
}

//returns the users name from an ID
function getUsernameFromID(user)
{
	user = user.replace(/" "/g,"");
	for(var i = 0, len = jsonObj.users.length; i < len; i++) 
	{
		if(user == jsonObj.users[i].discordID)
		{
			return jsonObj.users[i].username;
		} 
	}
}

//Returns true or false based off of if the users name or id is registered
function userIsRegistered(user)
{
	for(var i = 0, len = jsonObj.users.length; i < len; i++) 
	{
		if(user == jsonObj.users[i].discordID)
		{
			return true;
		} 
		else if(user == jsonObj.users[i].username)
		{
			return true;
		}
	}
	return false;
}

//checks the input for any mention of a draw
function checkForDraw(message, commands)
{
	for(cmd in commands)
	{
		if(commands[cmd].toLowerCase().includes('draw'))
		{
			return true;
		}
	}
	return false; 
}

//resets globals, must be called once per submission at the start
function resetGlobals()
{
	winnerName = "";
	loserName = "";
	mapPlayedOn = "";
	p1Name = "";
	p1Pick = "";
	p2Name = "";
	p2Pick = "";
	mapBans = [];
	divBans = [];
	playerNamesIfDraw = [];
	errorInInput = false;
	errorInInputString = "";
	divBans = [];
	mapBans = [];
	winningDiv = "";
	losingDiv = "";
}

//Creates a connection to the results database
//calling this method MUST be paired with a 'db.close();' in the same method
function connect()
{
	var db = new sqlite3.Database('./resultsDB.db', (err) => {
  		if (err) 
  		{
    		console.error(err.message);
  		}
	});
	return db;
}


//This is the OLD way of doing it, once the torunaments using this format are removed, this section will be deleted
function OLDresultGathering(message, input)
{
	var keyWords = ["Map-Played:","Winner:","P1-Name:","P1-Pick:","P1-Div-Ban-1:","P1-Div-Ban-2:","P1-Div-Ban-3:","P1-Map-Ban-1:","P1-Map-Ban-2:","P1-Map-Ban-3:",
					"P2-Name:","P2-Pick:","P2-Div-Ban-1:","P2-Div-Ban-2:","P2-Div-Ban-3:","P2-Map-Ban-1:","P2-Map-Ban-2:","P2-Map-Ban-3:"];
	var res = "";
	fs = require('fs');
	var continueLooking = true;
	if(input.length < 3)
	{
		message.reply("Error. Please double check the correct way to enter results in your corresponding tournament PDF.");
	} else {
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
				message.reply("Error in submitting: " + err);
			}
			message.reply("Results recorded. Values entered were: " + res);
		});
	}
}