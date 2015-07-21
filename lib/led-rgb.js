var _       = require('lodash');
var Promise = require('bluebird');
var winston = require('winston');
var logger  = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			colorize: 'all'
		})
	]
});
var Gpio    = require('onoff').Gpio;

var colorNames = module.exports.colorNames = {
		red: 'red', r: 'red',
		green: 'green', g: 'green',
		blue: 'blue', b: 'blue',
		purple: 'purple', p: 'purple',
		white: 'white', w: 'white'
};

function LedRGB(pins) {
	if (!pins) throw new Error('Missing GPIO pin configuration');

	this.pins  = pins;
	this._pins = {};

	this.colorNames = colorNames;

	this._init();
};

LedRGB.prototype = {
	_init: function () {
		var self = this;

		Object.keys(this.pins).forEach(function (color) {
			var pin = self.pins[color];
			self._pins[pin] = new Gpio(pin, 'out');
		});
	},

	_pinOn: function (pin) {
		winston.info('pinOn', pin);
		this._pins[pin].writeSync(1);
	},
	_pinOff: function (pin) {
		winston.info('pinOff', pin);
		this._pins[pin].writeSync(0);
	},

	exit: function () {
		winston.info('exit');
		_.values(this._pins).forEach(function (gpio) {
			gpio.unexport();
		});

		process.exit();
	},

	off: function () {
		_.values(this.pins).forEach(this._pinOff.bind(this));
	},

	_multiple: function (pins, off) {
		var self = this;

		pins.forEach(function (pin) {
			return off ? self._pinOff(pin) : self._pinOn(pin);
		});
	},

	red:   function (off) {
		var pin = this.pins.red;
		return (off) ? this._pinOff(pin) : this._pinOn(pin);
	},
	green: function (off) {
		var pin = this.pins.green;
		return (off) ? this._pinOff(pin) : this._pinOn(pin);
	},
	blue:  function (off) {
		var pin = this.pins.blue;
		return (off) ? this._pinOff(pin) : this._pinOn(pin);
	},
	purple: function (off) {
		return this._multiple([this.pins.blue, this.pins.red], off);
	},
	white: function (off) {
		return this._multiple([this.pins.red, this.pins.green, this.pins.blue], off);
	},

	color: function (color, op) {
		if (!this.colorNames[color]) {
			return console.error('Unsupported color');
		}

		this[this.colorNames[color]](op === 'off');
	}
}


module.exports.LedRGB = LedRGB;
