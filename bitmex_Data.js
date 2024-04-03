const WebSocket = require("ws");

const ws = new WebSocket("wss://ws.bitmex.com/realtime?subscribe=trade:xbtusd");

// ws.on("open", function open() {
//   ws.on("message", function message(data) {
//     //console.log(`${data}`);

//     const rawData = JSON.parse(data.toString());

//     console.log("//================================//");
//     console.log("raw data : ", rawData);
//   });
// });

let currentTimeStampMins;
let initialTimeStampMins;

let count = 0;
let dataSlot = {
  open: null,
  close: null,
  low: null,
  high: null,
  timestamp: null,
};

ws.on("open", function open() {
  ws.on("message", function message(data) {
    //console.log(`${data}`);
    const rawData = JSON.parse(data.toString());
    const dataArr = rawData.data;

    if (dataArr && dataArr.length > 0) {
      for (let i = 0; i < dataArr.length; i++) {
        count++;

        currentTimeStampMins = new Date(dataArr[i]["timestamp"]);
        if (initialTimeStampMins == undefined) {
          initialTimeStampMins = currentTimeStampMins.getUTCMinutes();
          dataSlot.open =
            dataSlot.low =
            dataSlot.high =
            dataSlot.close =
              dataArr[i]["price"];
          dataSlot.timestamp = currentTimeStampMins;
        } else if (
          initialTimeStampMins != currentTimeStampMins.getUTCMinutes()
        ) {
          console.log("//=== previous 1 min completed : ", dataSlot);

          initialTimeStampMins = currentTimeStampMins.getUTCMinutes();
          dataSlot.open = dataSlot.low = dataSlot.high = dataSlot.close;
          dataSlot.timestamp = currentTimeStampMins;
        } else {
          if (dataArr[i]["price"] < dataSlot.low)
            dataSlot.low = dataArr[i]["price"];

          if (dataArr[i]["price"] > dataSlot.high)
            dataSlot.high = dataArr[i]["price"];

          dataSlot.close = dataArr[i]["price"];
        }
      }
    }
  });
});
