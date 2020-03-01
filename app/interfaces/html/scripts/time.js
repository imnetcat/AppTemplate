
setInterval(getServerNow(), 43200000);
async function getServerNow(){
  let result = await makeRequest("GETSERVERTIME", "POST", document.location);
  document.getElementById("time").innerText = result;
}

setInterval(async function(){
  var outdate = document.getElementById("time").innerText;
  var sec = parseInt(outdate.split(":")[2]);
  var min = parseInt(outdate.split(":")[1]);
  var hour = parseInt(outdate.split(":")[0].split(" ")[2]);
  var year = parseInt(outdate.split("-")[0]);
  var month = parseInt(outdate.split("-")[1]);
  var day = parseInt(outdate.split("-")[2].split(" ")[0]);

  sec = sec + 1;
  if(sec == 60){
    sec = 0;
    min = min + 1;
  }
  if(min == 60){
    min = 0;
    hour = hour + 1;
  }
  if(hour == 24){
    hour = 0;
    day = day + 1;
  }
  if(day == 31){
    day = 1;
    month = month + 1;
  }
  if(month == 12){
    month = 1;
    year = year + 1;
  }

  if(day < 10){
    day = String("0") + String(day);
  }
  if(month < 10){
    month = String("0") + String(month);
  }
  if(sec < 10){
    sec = String("0") + String(sec);
  }
  if(min < 10){
    min = String("0") + String(min);
  }
  if(hour < 10){
    hour = String("0") + String(hour);
  }

  var date = year + "-" + month + "-" + day + " | " + hour + ":" + min + ":" + sec;
  document.getElementById("time").innerText = date;
}, 1000);
