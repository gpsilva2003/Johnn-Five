const { EtherPortClient } = require("etherport-client")
//const { Board, Led, Pin } = require("johnny-five")
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var five = require("johnny-five");
//var board = new five.Board();
const board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})

board.on("ready", function() {
  var led = new five.Led(16);
  led.blink(1000);
  console.log("Led piscando com 0.5 Hz");

io.on("connection", function(socket) {
    console.log("conectado");
    socket.on("interval", function(data) {
      led.blink(data);
      console.log("Led piscando com "+ 1000/(2*data) +" Hz");
    });
  });
});


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/realtime.html");
});
console.log("Servidor na porta 8000");
server.listen(8000);
