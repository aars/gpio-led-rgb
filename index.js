#!/usr/bin/node

var _      = require('lodash');
var LedRGB = require('./lib/led-rgb.js');
var led = new LedRGB();

// Inputs.
var command = process.argv[2];
var option  = process.argv[3];

// Available commands.
var localCommands = ['on', 'off', 'exit'];
var allCommands = _.values(led.colorNames).concat(localCommands);

// Do we know the command?
if (allCommands.indexOf(command) == -1) {
	return console.error('Unsupported command:', command);
}

// Is it a LedRGB color? That's easy.
if (localCommands.indexOf(command) == -1) {
	return led.color(command, option);
}

var commands = {
	exit: led.exit,
	off: led.off
};

commands[command]();

process.on('SIGINT', led.exit);
