const { EtherPortClient } = require("etherport-client")
var five = require("johnny-five");
//board = new five.Board();
const board = new five.Board({     // StandardFirmataWiFi
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})
board.on("ready", function() {
  var byte = 0;
  this.pinMode(16, this.MODES.PWM);
  board.digitalWrite(16, 0);
  console.log("Apagando o LED")
  setInterval(function() {
    board.analogWrite(16, (byte += 20));
  }, 500);
})
