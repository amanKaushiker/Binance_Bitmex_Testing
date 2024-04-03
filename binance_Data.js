const WebSocket = require("ws");

const ws = new WebSocket(
  "wss://fstream.binance.com/stream?streams=btcusdt@trade"
);

ws.on("open", function open() {
  ws.on("message", function message(data) {
    //console.log(`${data}`);

    const rawData = JSON.parse(data.toString());

    console.log("//================================//");
    console.log("raw data : ", rawData.data);
  });
});
