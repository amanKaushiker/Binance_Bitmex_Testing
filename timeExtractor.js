function timer(time) {
  console.log("//============ timer ==================//");

  console.log("hours : ", time.getUTCHours());

  console.log("mins : ", time.getUTCMinutes());

  console.log("seconds : ", time.getUTCSeconds());

  console.log("miliseconds : ", time.getUTCMilliseconds());
}

timer(new Date(1711696200015));

//timer(new Date(1711628760000));

function timer2(milliseconds) {
  console.log("//====================================================//");
  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
  console.log("hours : ", hours);

  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  console.log("minutes : ", minutes);

  const seconds = Math.floor((milliseconds / 1000) % 60);
  console.log("seconds : ", seconds);

  const milseconds = Math.floor(milliseconds % 1000);
  console.log("milliseconds : ", milseconds);
}

timer2(1711696200015);

//timer2(1711628760000);

function roundOff_Timestamp(val) {
  let unixTimeStamp = val;
  unixTimeStamp = unixTimeStamp - Math.floor(unixTimeStamp % 60000);
  timer2(unixTimeStamp);
}

roundOff_Timestamp(1711697400000);
