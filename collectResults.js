module.exports = {
	resultGathering: function(message, commands)
	{
		 resultGathering(message, commands)
	}
};

/*
How results should be posted (MUST BE ONE COMMENT) replays must go as a seperate comment below

$results
Map-Played: <>
Winner: <>
-------------
P1-Name: <>
P1-Pick: <>
P1-Div-Ban-1: <>
P1-Div-Ban-2: <>
P1-Map-Ban-1: <>
P1-Map-Ban-2: <>
-------------
P2-Name: <>
P2-Pick: <>
P2-Div-Ban-1: <>
P2-Div-Ban-2: <>
P2-Map-Ban-1: <>
P2-Map-Ban-2: <>
-------------
Screenshot: <> <-WE RECCOMEND UPLOADING TO IMGUR/REDDIT OR ANOTHER IMAGE HOSTING SITE RATHER THAN DIRECT UPLOAD TO DISCORD

*/

function resultGathering(message, input)
{
	var keyWords = ["Map-Played:","Winner:","P1-Name:","P1-Pick:","P1-Div-Ban-1:","P1-Div-Ban-2:","P1-Map-Ban-1:","P1-Map-Ban-2:",
					"P2-Name:","P2-Pick:","P2-Div-Ban-1:","P2-Div-Ban-2:","P2-Map-Ban-1:","P2-Map-Ban-2:","Screenshot:"];
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