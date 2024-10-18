const { EtherPortClient } = require("etherport-client")
const { Board, Led, Pin } = require("johnny-five")
const keypress = require("keypress")

const board = new Board({
  port: new EtherPortClient({
    host: "192.168.31.175",
    port: 3030,
  }),
  repl: false,
})

keypress(process.stdin)
const LED_PIN = 2

board.on("ready", () => {
  console.log("Placa pronta")
  var led = new Led(LED_PIN)
  console.log("Use as setas para Cima e para Baixo para piscar/parar o LED. 'Q' termina o programa.")

  process.stdin.resume()
  process.stdin.setEncoding("utf8")
  process.stdin.setRawMode(true)

  process.stdin.on("keypress", (ch, key) => {
    if (!key) {
      return
    }

    if (key.name === "q" || key.name === "Q") {
      console.log("Terminando")
      process.exit()
    } else if (key.name === "up") {
      console.log("Piscando o LED")
      led.blink()
    } else if (key.name === "down") {
      console.log("Parando de piscar")
      led.stop()
    }
  })
})
