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
  var led = new five.Led(16);
  // Apaga a intensidade do brilho (NodeMCU)
  console.log("Apagando o LED")
  led.fadeIn();
  // Aumenta a intensidade depois de 3 segundos (NodeMCU)
  // (parâmetro em ms)
  console.log("Acendendo o LED")
  this.wait(3000, function() {
    led.fadeOut();
  });

});
