const { EtherPortClient } = require("etherport-client")
var five = require("johnny-five");
//var board = new five.Board();     // StandardFirmata
const board = new five.Board({      // StandarsFirmataWiFi
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})
board.on("ready", function() {      // Não está funcionando
  var leds= new five.Leds([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  console.log("Pulsando!");
  leds.pulse; // liga e desliga a cada segundo 
})
