// Synchronous delay of 100 ms
var now = new Date(),
   dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
   monthOfYear = ["January","February","March","April","May","June","July","August","September","October","November","December"];

g3.evaluator.getInstance().console.log('"delay-100ms.js": ' + dayOfWeek[now.getDay()] + ', ' + now.getDate() + ' ' + monthOfYear[now.getMonth()] + ', ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
while(new Date().getTime() - now < 100 );
now = new Date();
g3.evaluator.getInstance().console.log('Hello from "delay-100ms.js": ' + dayOfWeek[now.getDay()] + ', ' + now.getDate() + ' ' + monthOfYear[now.getMonth()] + ', ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
