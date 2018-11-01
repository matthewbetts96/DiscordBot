var jsonfile = require('jsonfile');
const fs = require('fs');
 
var config = require("./config");
var log = require("./logging");
 
var file = "userblackList.json";
var jsonObj = jsonfile.readFileSync(file);
var users = jsonObj.users;

//Blacklists a user from being able to use SODBOT
function _blackList(message)
{
    //Checks if module is enabled
    if(!config.module_adminCommands)
    {
        message.channel.send("The admin module is disabled.");
        return;
    }
 
    //checks if the user has the permission
    if(!message.member.hasPermission('ADMINISTRATOR', true))
    {
        message.channel.send("Error. 'ADMINISTRATOR' permission is needed to invoke this command.");
        return;
    }
 
    //Checks to see if there's at least 1 mention in the comment
    if(message.mentions.members.size == 0)
    {
        message.channel.send("Error. No user mentions found.");
        return;
    }
 
    let blackListedBy = message.author.id;
    let blackListedUser = message.mentions.members.first().id;
 
    if(_userInBlackListFile(blackListedUser))
    {
        message.channel.send("Error. User is already blacklisted.");
        return;
    }
 
    let newBlackListedUser = {blackListedUser, blackListedBy};
 
    //push to the json file
    jsonObj.users.push(newBlackListedUser);
    jsonfile.writeFileSync(file, jsonObj);
 
    //Log the event
    log.blackListLogging(blackListedUser, blackListedBy);
}
 
function _unBlackList(message)
{
    //Checks if module is enabled
    if(!config.module_adminCommands)
    {
        message.channel.send("The admin module is disabled.");
        return;
    }
 
    //checks if the user has the permission
    if(!message.member.hasPermission('ADMINISTRATOR', true))
    {
        message.channel.send("Error. 'ADMINISTRATOR' permission is needed to invoke this command.");
        return;
    }
 
    //Checks to see if there's at least 1 mention in the comment
    if(message.mentions.members.size == 0)
    {
        message.channel.send("Error. No user mentions found.");
        return;
    }
 
    let blackListedUser = message.mentions.members.first().id;
 
    if(!_userInBlackListFile(blackListedUser))
    {
        message.channel.send("Error. User is not blacklisted.");
        return;
    }
 
    jsonObj.users = users.filter((user) => { return user.blackListedUser !== blackListedUser });
    fs.writeFileSync(file, JSON.stringify(jsonObj, null, 2));

    //Log the event
    log.unblackListLogging(blackListedUser, message.channel.author);
}
 
//Bulk removes messages from a channel, user must have 'MANAGE MESSAGES' permission
function _purge(message, num)
{
    //Checks if module is enabled
    if(!config.module_adminCommands)
    {
        message.channel.send("The admin module is disabled.");
        return;
    }
 
    //Checks if the user has the permission to manage messages (ie could delete messages one by one)
    if(!message.member.hasPermission('MANAGE_MESSAGES', true))
    {
        message.channel.send("Error. 'MANAGE_MESSAGES' permission is needed to invoke this command.");
        return;
    }
 
    //Checks if number entered is actually a number
    if(isNaN(num))
    {
        message.channel.send("Error. " + num + " is not an integer.");
        return;
    }
 
    //we'll restrict the number of messages being able to be deleted at once
    if(num > 10)
    {
        message.channel.send("Error. " + num + " is too large. Please choose a number less than 10.");
        return;
    }
 
    //parse the input (a string) to an integer
    var number = parseInt(num);
 
    //Deletes messages, we add one to automatically include the command calling this function
    message.channel.bulkDelete(number + 1)
        .then(messages => console.log(`Bulk deleted ${messages.size} messages. Invoked by ` + message.author.username))
        .catch(console.error);
   
    //Log this command
    log.purgeLogging(number, message);
    message.channel.send(":no_entry_sign:**PURGING COMPLETE**:no_entry_sign:");
    message.channel.bulkDelete(1);
}
 
//Checks if a user is blacklisted
function _userInBlackListFile(user)
{
    for(let i = 0, len = jsonObj.users.length; i < len; i++)
    {
        if(user == jsonObj.users[i].blackListedUser)
        {
            return true;
        }
    }
    return false;
}

module.exports = {
    unBlackList: _unBlackList,
    blackList: _blackList,
    userInBlackListFile: _userInBlackListFile,
    purge: _purge
};