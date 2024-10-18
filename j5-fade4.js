const { EtherPortClient } = require("etherport-client");
var five = require("johnny-five");

const board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
});

board.on("ready", function () {
  var led = new five.Led(16);

  console.log("Iniciando ciclo de fade in e fade out no LED");

  // Loop para fazer o fade in e fade out continuamente
  this.loop(6000, function () {
    led.fadeIn(3000); // Fade in em 3 segundos

    this.wait(3000, function () {
      led.fadeOut(3000); // Fade out em 3 segundos
    });
  });
});
