const { EtherPortClient } = require("etherport-client")
var five = require("johnny-five");

//board = new five.Board();           // StandardFirmata
const board = new five.Board({        // StandardFirmataWiFi
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})

board.on("ready", function() {
  led = new five.Led(16);
  console.log("Piscando...");
  led.strobe(500); // desliga a cada meio segundo
});


