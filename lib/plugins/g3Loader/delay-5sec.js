// Synchronous delay of 5 seconds
var now = new Date(),
   dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
   monthOfYear = ["January","February","March","April","May","June","July","August","September","October","November","December"];

g3.evaluator.getInstance().console.log('"delay-5sec.js": ' + dayOfWeek[now.getDay()] + ', ' + now.getDate() + ' ' + monthOfYear[now.getMonth()] + ', ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
while(new Date().getTime() - now < 5000 );
now = new Date();
g3.evaluator.getInstance().console.log('Hello from "delay-5sec.js": ' + dayOfWeek[now.getDay()] + ', ' + now.getDate() + ' ' + monthOfYear[now.getMonth()] + ', ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
