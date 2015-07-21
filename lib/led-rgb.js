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

function LedRGB(options) {
	this.options = options || {};
	this.pins = _.defaults(this.options.pins || {}, {
		red: 20,
		green: 21,
		blue: 16
	});
	this._pins = {};

	this.on = false;
	this.states = {
		red: false,
		green: false,
		blue: false
	};

	this.colorNames = {
		red: 'red', r: 'red',
		green: 'green', g: 'green',
		blue: 'blue', b: 'blue',
		purple: 'purple', p: 'purple'
	};

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
		_.values(this._pins).forEach(function (gpio) {
			gpio.unexport();
		});

		process.exit();
	},

	on: function () {
		console.log('on!');
	},

	off: function () {
		_.values(this.pins).forEach(this._pinOff.bind(this));
	},

	_multiple: function (pins, off) {
		pins.forEach(function (pin) {
			return off ? this._pinOff(pin) : this._pinOn(pin);
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

	color: function (color, op) {
		if (!this.colorNames[color]) {
			return console.error('Unsupported color');
		}

		this[this.colorNames[color]](op === 'off');
	}
}


module.exports = LedRGB;
