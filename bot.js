const Discord = require("discord.js");
const path = require('path');
const { token, Prefix, intervall, ChannelPost, PicArray, CandyDrop, Role1, Role1_, Role1Price, Role2, Role2_, Role2React, Role2Price, Role3, Role3_, Role3Price, RoleNoDm, ServerOwner } = require('./config.json');
const client = new Discord.Client();
const fetch = require('node-fetch');
var schedule = require('node-schedule');

var jsfiles;
client.commands = new Discord.Collection();
var Collection = client.commands;
i = 0;
var test;
BotRun = true;

const fs = require("fs");
client.JSONcandies = require("./candy.json");

client.on('ready', () => {
	client.setInterval(DropFunc, intervall);
	DropFunc();
	console.log('The bot is Online!');
});

const DropFunc = () => {
	if(BotRun) {
	const channel = client.channels.find(channel => channel.name === ChannelPost);
	let members = channel.guild.members.array();
	let randomID = members[Math.floor(Math.random() * members.length)].user.id;
	console.log(randomID);
	if (!channel.guild.members.find(mem => mem.id === randomID).roles.find("name", RoleNoDm)) {
		console.log("true");
		pic = Math.floor(Math.random() * PicArray);
		candy = Math.floor(Math.random() * CandyDrop);
		try { 
			let _CurrentCandy = client.JSONcandies[randomID].candies;
			channel.guild.members.find(mem => mem.id === randomID).send({files: ["pics/"+pic+".jpg"]});
			channel.guild.members.find(mem => mem.id === randomID).send("You grabbed " + candy + " candy.");
			client.JSONcandies[randomID] = {
				candies: candy + _CurrentCandy
			}
			fs.writeFile("./candy.json", JSON.stringify(client.JSONcandies, null, 4), err => {
				if (err) channel.guild.members.find(mem => mem.id === randomID).send("Failed adding the candy!");
			});
		} catch (e) {
			console.log("added to pocket");
			channel.guild.members.find(mem => mem.id === randomID).send("You grabbed " + candy + " candy.");
			client.JSONcandies[randomID] = {
				candies: candy
			}
			fs.writeFile("./candy.json", JSON.stringify(client.JSONcandies, null, 4), err => {
				if (err) channel.guild.members.find(mem => mem.id === randomID).send("Failed adding the candy!");
				channel.guild.members.find(mem => mem.id === randomID).send("Candy added to pocket");
			});
		}
	} else {
		DropFunc();
	}
	}
};

var prefix = Prefix;
client.on('message', message => {	
	let user = message.author;
	if (message.channel.type === "text"){
	if (message.member.roles.find(r => r.name === Role2_)) { 
		
		message.react(Role2React); 
	} 
	if (message.content.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		console.log(command);
		if (command === "shop") {
			let Firembed = new Discord.RichEmbed()
				.setColor(0x00AE86)
				.setAuthor("??Trick or treat🍬","https://i0.wp.com/metro.co.uk/wp-content/uploads/2018/10/gettyimages-830209310.jpg?quality=90&strip=all&zoom=1&resize=644%2C505&ssl=1")		
				.addField(prefix + " NoDm", "No longer receive DM's by bots!")
				.addField(prefix + " pocket", "Shows collected candy.")
				.addField(prefix + " " + Role1, "Pay " + Role1Price + " candy to get the pumpkin role " + Role1_)
				.addField(prefix + " " + Role2, "Pay " + Role2Price + " candy to get the devil role " + Role2_)
				.addField(prefix + " " + Role3, "Pay " + Role3Price + " candy for the unique ghost role " + Role3_)
				.setFooter("Requested by " + message.author.tag)
				.setTimestamp()
			client.channels.find(channel => channel.name === ChannelPost).send({embed: Firembed});
		}
		if (command === "candyoff" && message.author.id == ServerOwner) {
			BotRun = false;
			const channel = client.channels.find(channel => channel.name === ChannelPost);
			channel.guild.members.find(mem => mem.id === ServerOwner).send("Bot turned off!");
		}
		if (command === "pocket") {
			try {
			let _CurrentCandy = client.JSONcandies[message.author.id].candies; 
			client.channels.find(channel => channel.name === ChannelPost).send("You have " + _CurrentCandy + " candy!");
			} catch (e) {
			client.channels.find(channel => channel.name === ChannelPost).send("No candies found");
			}
		}
	        if (command === "nodm") {
			let NoDM = message.guild.roles.find(r => r.name === RoleNoDm);
			let member = message.mentions.members.first();
			message.member.addRole(NoDM).catch(console.error);
			client.channels.find(channel => channel.name === ChannelPost).send("You will no longer receive dms!");
		}
		if (command === Role1) {
			let PumpkinR = message.guild.roles.find(r => r.name === Role1_);
			let member = message.mentions.members.first();
			console.log(message.member.id);
			try { 
				let _CurrentCandy = client.JSONcandies[message.member.id].candies;
				if (_CurrentCandy >= Role1Price) {
					client.JSONcandies[message.member.id] = {
						candies: _CurrentCandy - Role1Price
					}
					fs.writeFile("./candy.json", JSON.stringify(client.JSONcandies, null, 4), err => {
					if (err) client.channels.find(channel => channel.name === ChannelPost).send("Couldnt take candy from your pocket.");
					});
					message.member.addRole(PumpkinR).catch(console.error);
					client.channels.find(channel => channel.name === ChannelPost).send("You payed " + Role1Price + " candy for the " + Role1 + " role!");
				} else {
					client.channels.find(channel => channel.name === ChannelPost).send("You dont have " + Role1Price + " candy.");
				}
			} catch (e) {
				client.channels.find(channel => channel.name === ChannelPost).send("You dont have " + Role1Price + " candy.");
			}
			
		}
		if (command === Role2) {
			let DevilR = message.guild.roles.find(r => r.name === Role2_); 
			let member = message.mentions.members.first();
			console.log(message.member.id);
			try { 
				let DevilR = message.guild.roles.find(r => r.name === Role2_);
				let _CurrentCandy = client.JSONcandies[message.member.id].candies;
				if (_CurrentCandy >= Role2Price) {
					client.JSONcandies[message.member.id] = {
						candies: _CurrentCandy - Role2Price
					}
					fs.writeFile("./candy.json", JSON.stringify(client.JSONcandies, null, 4), err => {
					if (err) client.channels.find(channel => channel.name === ChannelPost).send("Couldnt take candy from your pocket.");
					});
					message.member.addRole(DevilR).catch(console.error);
					client.channels.find(channel => channel.name === ChannelPost).send("You payed " + Role2Price + " candy for the " + Role2 + " role!");
				} else {
					client.channels.find(channel => channel.name === ChannelPost).send("You dont have " + Role2Price + " candy.");
				}
			} catch (e) {
				client.channels.find(channel => channel.name === ChannelPost).send("You dont have " + Role2Price + " candy.");
			}
			
		}
		if (command === Role3) {
			let GhostR = message.guild.roles.find(r => r.name === Role3_);
			let member = message.mentions.members.first();
			console.log(message.member.id);
			try { 
				let _CurrentCandy = client.JSONcandies[message.member.id].candies;
				if (_CurrentCandy >= Role3Price) {
					client.JSONcandies[message.member.id] = {
						candies: _CurrentCandy - Role3Price
					}
					fs.writeFile("./candy.json", JSON.stringify(client.JSONcandies, null, 4), err => {
					if (err) client.channels.find(channel => channel.name === ChannelPost).send("Couldnt take candy from your pocket.");
					});
					message.member.addRole(GhostR).catch(console.error);
					client.channels.find(channel => channel.name === ChannelPost).send("You payed " + Role3Price + " candy for the " + Role3 + " role!");
				} else {
					client.channels.find(channel => channel.name === ChannelPost).send("You dont have " + Role3Price + " candy.");
				}
			} catch (e) {
				client.channels.find(channel => channel.name === ChannelPost).send("You dont have " + Role3Price + " candy.");
			}
			
		}
	}
	}
});





client.login(token);