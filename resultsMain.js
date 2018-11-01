var AsciiTable = require('ascii-table')
var admin = require("./adminCommands");
var log = require("./logging");
var config = require("./config");

var vData = require("./validateData");

const sqlite3 = require('sqlite3').verbose();
var jsonfile = require('jsonfile');

var file = "players.json";
var jsonObj = jsonfile.readFileSync(file);

function _resultsMain(message,args)
{

	if(!config.module_resultsCommands)
	{
		message.channel.send("The results module is disabled.");
		return;
	}

	if(args[0].toLowerCase() == "register")
	{
		//registering for the results entries
		register(message)
	} 
	else if(!userIsRegistered(message.author.id))
	{
		message.channel.send("You are not registered to submit results.");
		return;
	} 
	else
	{
		//now we validate the data
		message.channel.send("Validating input...");
		let errors = vData.validateData(message,args);
		
		if(errors[0])
		{
			message.channel.send(errors[1]);
		} 
		else 
		{
			message.channel.send("Results committed successfully.");
		}
	}
}

//Returns true or false based off of if the users id is registered
function userIsRegistered(user)
{
	for(var i = 0, len = jsonObj.users.length; i < len; i++) 
	{
		if(user == jsonObj.users[i].discordID)
		{
			return true;
		} 
	}
	return false;
}

//Registered a new user if unregistered
function register(message)
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
				//todo add log input
				console.log(username + ' added to the json file and database.');
				message.reply("Database updated. Welcome to the rankings.");
			}
		});
		db.close();
	} 
	else 
	{
		message.reply("You are already registered.");
	}  
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

module.exports = {
	resultsMain: _resultsMain,
};


