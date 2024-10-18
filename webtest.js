// Declaração do web server, socket.io, filesystem, johnny-five
const { EtherPortClient } = require("etherport-client")
var app = require("express")(),
    server = require("http").Server(app),
    io = require("socket.io")(server),
    fs = require('fs'),
    five = require("johnny-five"), board,servo,led,sensor;

// board = new five.Board();    // StandardFirmata

board = new five.Board({     // StandardFirmataWiFi
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})

// Quando a placa estiver pronra
board.on("ready", function() {
  // inicia um LED no pino 16, piscando a cada 500ms
  led = new five.Led(16).strobe(500);
});

// Cria m servidor web escutando na porta 8080
console.log("Servidor na porta 8000");
server.listen(8000);

// Cria página para o servidor
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//function handler (req, res) {
//  fs.readFile(__dirname + '/index.html',
//  function (err, data) {
//    if (err) {
//      res.writeHead(500);
//      return res.end('Erro ao carregar index.html');
//    }
//    res.writeHead(200);
//    res.end(data);
//  });
//}

// Na  conexão inicial do Socket envia mensagem para o cliente
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'Olá' });
  // Se uma mensagem sobre o led for recebida
  socket.on('led', function (data) {
    console.log(data);
     if(board.isReady){    led.strobe(data.delay); } 
  });

});
