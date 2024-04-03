const WebSocket = require("ws");

const ws = new WebSocket("wss://ws.bitmex.com/realtime?subscribe=trade:xbtusd");

const timeFramesArr = ["1m", "5m", "15m", "1h"];
const frameDataObj = {};

let currentTimeStampMins;
let currentTimeStampHours;
let initialTimeStampObj = {};

function frames(frames) {
  for (let i = 0; i < frames.length; i++) {
    frameDataObj[frames[i]] = {
      open: null,
      low: null,
      high: null,
      close: null,
      timeStamp: null,
    };
    initialTimeStampObj[timeFramesArr[i]] = null;
  }
  console.log(frameDataObj);
  console.log(initialTimeStampObj);
}

frames(timeFramesArr);

function dataSetter(
  frameDataObj,
  timeFrame,
  data,
  currentTimeStamp,
  currentTimeStampMins
) {
  if (frameDataObj[timeFrame] && timeFrame.includes("m")) {
    if (initialTimeStampObj[timeFrame] == null) {
      //===> setInitial Values
      //   frameDataObj[timeFrame]["open"] =
      //     frameDataObj[timeFrame]["low"] =
      //     frameDataObj[timeFrame]["high"] =
      //     frameDataObj[timeFrame]["close"] =
      //       data;
      //   frameDataObj[timeFrame]["timeStamp"] = currentTimeStamp;
      initialTimeStampObj[timeFrame] = currentTimeStampMins;
    } else if (
      initialTimeStampObj[timeFrame] !== currentTimeStampMins &&
      currentTimeStampMins % parseInt(timeFrame) == 0
    ) {
      initialTimeStampObj[timeFrame] = currentTimeStampMins;
      if (frameDataObj[timeFrame]["timeStamp"] != null) {
        console.log(
          `//===== slot completed ${timeFrame} : `,
          frameDataObj[timeFrame]
        );
      }
      if (frameDataObj[timeFrame]["timeStamp"] === null) {
        frameDataObj[timeFrame]["open"] =
          frameDataObj[timeFrame]["low"] =
          frameDataObj[timeFrame]["high"] =
          frameDataObj[timeFrame]["close"] =
            data;
        frameDataObj[timeFrame]["timeStamp"] = currentTimeStamp;
      } else {
        frameDataObj[timeFrame]["open"] = frameDataObj[timeFrame]["close"];
        frameDataObj[timeFrame]["high"] =
          frameDataObj[timeFrame]["low"] =
          frameDataObj[timeFrame]["close"] =
            frameDataObj[timeFrame]["close"];
        frameDataObj[timeFrame]["timeStamp"] = currentTimeStamp;
      }
    } else {
      // console.log("/=== repeating ====//");
      if (data < frameDataObj[timeFrame]["low"])
        frameDataObj[timeFrame]["low"] = data;

      if (data > frameDataObj[timeFrame]["high"] || fra)
        frameDataObj[timeFrame["high"]] = data;

      frameDataObj[timeFrame]["close"] = data;
    }
  }
}

ws.on("open", function open() {
  ws.on("message", function message(data) {
    //console.log(`${data}`);
    const rawData = JSON.parse(data.toString());
    const dataArr = rawData.data;

    if (dataArr && dataArr.length > 0) {
      for (let i = 0; i < dataArr.length; i++) {
        let currentTimeStamp = new Date(dataArr[i]["timestamp"]);
        currentTimeStampMins = currentTimeStamp.getUTCMinutes();
        currentTimeStampHours = currentTimeStamp.getUTCHours();

        if (dataArr[i]["price"]) {
          const data = dataArr[i]["price"];
          for (let i = 0; i < timeFramesArr.length; i++) {
            if (
              frameDataObj[timeFramesArr[i]] &&
              timeFramesArr[i].includes("m")
            ) {
              dataSetter(
                frameDataObj,
                timeFramesArr[i],
                parseFloat(data),
                currentTimeStamp,
                currentTimeStampMins
              );
              //   if (initialTimeStampObj[timeFramesArr[i]] == null) {
              //     //===> setInitial Values
              //     frameDataObj[timeFramesArr[i]]["open"] =
              //       frameDataObj[timeFramesArr[i]]["low"] =
              //       frameDataObj[timeFramesArr[i]]["high"] =
              //       frameDataObj[timeFramesArr[i]]["close"] =
              //         data;
              //     frameDataObj[timeFramesArr[i]]["timeStamp"] = currentTimeStamp;
              //     initialTimeStampObj[timeFramesArr[i]] = currentTimeStampMins;
              //   } else if (
              //     initialTimeStampObj[timeFramesArr[i]] !==
              //       currentTimeStampMins &&
              //     currentTimeStampMins % parseInt(timeFramesArr[i]) == 0
              //   ) {
              //     console.log(
              //       `//===== slot completed ${timeFramesArr[i]} : `,
              //       frameDataObj[timeFramesArr[i]]
              //     );
              //     frameDataObj[timeFramesArr[i]]["open"] =
              //       frameDataObj[timeFramesArr[i]]["low"] =
              //       frameDataObj[timeFramesArr[i]]["high"] =
              //         frameDataObj[timeFramesArr[i]]["close"];
              //     frameDataObj[timeFramesArr[i]]["timeStamp"] = currentTimeStamp;
              //     initialTimeStampObj[timeFramesArr[i]] = currentTimeStampMins;
              //   } else {
              //     // console.log("/=== repeating ====//");
              //     if (data < frameDataObj[timeFramesArr[i]]["low"])
              //       frameDataObj[timeFramesArr[i]]["low"] = data;
              //     if (data > frameDataObj[timeFramesArr[i]]["high"])
              //       frameDataObj[timeFramesArr[i]]["high"] = data;
              //     frameDataObj[timeFramesArr[i]]["close"] = data;
              //   }
            }
          }
        }
      }
    }
  });
});
