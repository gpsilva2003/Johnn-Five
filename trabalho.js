var ssid = "DCC-LCI";
var password = "aluno.dcc!";
//wifi config and connect
var wifi;

var ip;

var wifi = require("Wifi");
wifi.connect(ssid, {password:password}, function(e) {
	if (e) {
		console.log('error during connect:',e);
		wifi.disconnect();
	} else {
		console.log('connected to',ssid);
		wifi.stopAP();
		ip = wifi.getIP().ip;
		console.log(ip);
		wifi.save();
	}
});

//monitoring stuff
var targetTemp = 30;
var LastReadTemp = 0;
var LastReadHumid = 0;
var LastReadRPM = 0;

let tempHasChanged = false;
let humidHasChanged = false;
let rotationHasChanged = false;

var delta = 0;
var lastInterruptTime = 0;
clearWatch();
pinMode(NodeMCU.D10, 'input_pullup');

//websocket stuff

function onPageRequest(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<!doctype html><html><head>');
	res.write('<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>');
	res.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>');
	res.write('<script>var ws = new WebSocket("ws://" + location.host + "/my_websocket","protocolOne");</script>');
	res.write('<script src="https://cdn.plot.ly/plotly-latest.min.js"></script><script>');
	res.write('$(document).ready(function() {');
	res.write('$("#testando").click(function(){ ws.send(\'{"name": "James Devilson","message": "Hello World!"}\');});');
	res.write('setInterval(function() {ws.onmessage = function(event){$("#temperatura").val(event.data);}}, 100);');
	res.write('let Temperatura = {x: [1, 2, 3, 7],y: [10, 15, 13, 17],type: "catter", name :"Temperatura"};');
	res.write('let Umidade = {x: [1, 2, 3, 4],y: [16, 5, 11, 9],type: "scatter", name:"Umidade"};');
	res.write('Temperatura.x.push(8);');
	res.write('console.log(Temperatura.x);');
	res.write('let data = [Temperatura, Umidade];');
	res.write('console.log(data);');
	res.write('Plotly.newPlot(myDiv, data);');
	res.write('});');
	res.write('</script>');
	res.write('</head><body>');
	res.write('<div><p id="testando">Testandu</p></div>');
	res.write('<div><h5>Temperature</h5><p id="Temperature">Temperature_Value</p></div>');
	res.write('<input id="temperatura" type="text" name="fname" value=""><br>');
	res.write('<div><h5>Umidade</h5><p id="Moisture">Moisture_Value</p></div>');
	res.write('<div><h5>PWM</h5><p id="Rotation">PWM_Value</p></div>');
	res.write('<div id="myDiv"><!-- Plotly chart will be drawn inside this DIV --></div>');
	res.end('</body></html>');
}

var server = require('ws').createServer(onPageRequest).listen(80);
var webSocket;
server.on("websocket", function(ws) {
	webSocket = ws;
	testee= '{"name": "James Devilson","message": "Hello World!"}';
	var ob = JSON.parse(testee);
	ws.on('message',function(msg) {var vai = JSON.parse(msg); print("[WS] " + vai.name); ws.send("Hello from Espruino!"); });

	//setInterval(function(){ws.send("verificando");}, 250);
	setInterval(function(){ 
		//if(tempHasChanged === true){ws.send("temp: " + LastReadTemp);tempHasChanged=false;}
		//if(humidHasChanged === true){ws.send("humid: " + LastReadHumid);humidHasChanged=false;}
		if(rotationHasChanged === true){ws.send("Rotation: " + LastReadRotation);rotationHasChanged=false;}
	}, 500);

	//ws.on('message',function(msg) { print(JSON.stringify(msg).name); });

	//ws.on('get:targetTemp', function() { ws.send(targetTemp); });

	//ws.send("Hello from Espruino!");

	ws.on('ping', function() {
	console.log("Got a ping");
});
});


//monitoring stuff


setWatch(function(e) {
  var d = e.time-lastInterruptTime;
  lastInterruptTime = e.time; 
  let rpm = 60 / (d*2);
  
  if(rpm != LastReadRPM){
    LastReadRPM = d;
    rotationHasChanged = true;
  }
  
  console.log(d);
}, NodeMCU.D10, {repeat: true, edge: 'falling'});

var dht = require("DHT22").connect(NodeMCU.D3);
setInterval(function()
{
	dht.read(function (a) {
		if(a.temp != LastReadTemp){
			LastReadTemp = a.temp;
			tempHasChanged = true;
			//webSocket.send('Temp has changed: ' + LastReadTemp);
			//webSocket.emit("change:temp", LastReadTemp);
			//console.log("temp: " + a.temp);
		}

		if(a.rh != LastReadHumid){
			LastReadHumid = a.rh;
			humidHasChanged = true;
			//webSocket.send('Humid has changed: ' + LastReadHumid);
			//server.emit("change:humid", LastReadHumid);
			//console.log("humid: " + a.rh);
		}
	});
}, 2000);
