#!/usr/bin/node

var _      = require('lodash');
var fs     = require('fs');
var LedRGB = require('./lib/led-rgb.js');

// Our config, overrides via config file.
var config = {
	pins: {
		red: 2,
		green: 3,
		blue: 4
	},
	defaultColor: 'white'
}
var configFile = process.env.HOME +'/.config/gpio-led-rgb/config.json';
if (fs.existsSync(configFile)) {
	try {
		config = _.defaults(require(configFile), config);
	} catch (e) {
		console.error('Failed loading configuration file', configFile + "\r\n", e.message);
		process.exit();
	}
}

// Inputs.
var command = process.argv[2];
var option  = process.argv[3];

// Available commands.
var localCommands = ['on', 'off', 'exit', 'config'];
var allCommands = _.values(LedRGB.colorNames).concat(localCommands);

// Do we know the command?
if (allCommands.indexOf(command) == -1) {
	console.log('Unsupported command:', command);
	process.exit();
}

// Good to go!
var led = new LedRGB.LedRGB(config.pins);

// Exit will unexport GPIO pins on SIGINT.
process.on('SIGINT', led.exit.bind(led));

// Is it a LedRGB color? That's easy.
if (localCommands.indexOf(command) == -1) {
	return led.color(command, option);
}

var commands = {
	config: console.log.bind(console, 'Current configuration:', JSON.stringify(config, false, '  ')),
	exit: led.exit.bind(led),
	off: led.off.bind(led),
	on: led.color.bind(led, config.defaultColor)
};

commands[command]();
