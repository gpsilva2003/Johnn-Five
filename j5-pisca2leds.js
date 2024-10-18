const { EtherPortClient } = require("etherport-client")
var five = require("johnny-five");
// var board = new five.Board();   // StandardFirmata
const board = new five.Board({     // StandardFirmataWiFi
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})
board.on("ready", function() {
  var leds= new five.Leds([2,16]);
  console.log("Pulsando!");
  leds.strobe(500); // liga e desliga a cada meio segundo 
})
