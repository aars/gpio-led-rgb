var pinNr = process.argv[2];
var val   = (process.argv[3] !== undefined) ? process.argv[3] : 1;

if (!pinNr) {
	console.error('provide gpio pin number');
	process.exit();
}

var Gpio = require('onoff').Gpio;
var pin  = new Gpio(pinNr, 'out');
pin.writeSync(val);
