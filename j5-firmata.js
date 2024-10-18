var five = require("johnny-five"),board, led;
board = new five.Board({port:"/dev/ttyUSB0"});
board.on("ready", function() {
  led = new five.Led(0);
  led.strobe(1000); // liga e desliga a cada segundo 
})
