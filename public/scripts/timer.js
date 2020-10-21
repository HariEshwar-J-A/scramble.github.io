import { totalScore, displayScore } from './displayQues.js'
export var time = 300;
export var stopTime = new Date();
export var startTime = new Date();
export var timeInterval;
var timer;
let tempTime;
stopTime.setSeconds(stopTime.getSeconds() + time);
let timerHTML = document.querySelector('.timer');
export function startTimer() {
    startTime = new Date();
    stopTime = new Date();
    stopTime.setSeconds(startTime.getSeconds() + time);
    timer = setInterval(runTimer, 1000);
    timerHTML.style.color = "white";
}

export function runTimer() {
    startTime.setSeconds(startTime.getSeconds() + 1);
    timeInterval = stopTime - startTime;
    timeInterval /= 1000;
    if (timeInterval >= 60) tempTime = `${Math.floor(timeInterval/60)} : ${Math.floor(timeInterval%60)}`;
    else tempTime = `0 : ${timeInterval}`;
    timerHTML.innerHTML = tempTime;
    if (timeInterval == 30) alert("Only 30s remaining,Hurry Up!");
    if (timeInterval < 60) timerHTML.style.color = "red";
    if (timeInterval == 0) {
        timerHTML.innerHTML = `0:0`;
    }
    // console.log(timeInterval);
    if (timeInterval === 0) {
        stopTimer();
        displayScore(totalScore, 0);
    }
}

export function getTimeInterval() {
    return timeInterval;
}

export function stopTimer() {
    clearInterval(timer);
}