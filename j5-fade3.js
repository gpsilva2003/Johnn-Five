const { EtherPortClient } = require("etherport-client")
var five = require("johnny-five");
// var board = new five.Board();

const board = new five.Board({     // StandardFirmataWiFi
    port: new EtherPortClient({
      host: "192.168.31.175",
      port: 3030,
    }),
    repl: false,
  })

board.on("ready", function() {
  // Assumindo que um LED está conectado ao pino 9 
  // Isso vai acendê-lo com metade o brilho 
  // PWM é modo para escrever sinais com largura  
  // de pulso variável em um pino digital
  this.pinMode(2, five.Pin.PWM);
  console.log("Gerando sinal PWM")
  for (var i=0;i < 255;i++){
  this.wait(100, function() {
    // Turn it off...
    board.analogWrite(2, i);
  });
  }
})
