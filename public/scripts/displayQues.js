import { stopTimer, getTimeInterval } from "./timer.js";
import { populateDropArea, populateGrabArea } from "./drag_drop.js";
import { setFetchOptions, baseURL } from "./leaderboard.js";

let letterDropArea = document.getElementById("letter-drop-area");
let letterGrabArea = document.getElementById("letter-grab-area");
export let totalScore = 0;
export let completedFlag = false;
export function displayQues(currQues, ans, time, qstn, score, allQues) {
    let navigItems = document.querySelectorAll('.navig-item');
    let ansBox = document.querySelectorAll('.drop-letter');
    let next = document.getElementById('next');
    let ansString = "";
    let hint = document.getElementById('hint');
    ansBox.forEach((i) => {
        ansString += i.innerText.trim();
    });
    if (currQues === navigItems.length - 1) {
        next.innerText = "🏁";
    }
    if (ansString === ans) {
        navigItems[currQues - 1].style.backgroundColor = "green";
        score += 10;
        totalScore += 10;
    } else if (ansString !== ans && currQues <= navigItems.length) {
        navigItems[currQues - 1].style.backgroundColor = "red";
    }
    if (currQues <= navigItems.length - 1) {
        qstn = allQues[currQues].ques.toUpperCase();
        ans = allQues[currQues].ans.toUpperCase();
        showQuestion(qstn);
        hint.title = allQues[currQues].hint;
    }
    //displays score
    if (currQues === navigItems.length) {
        displayScore(score, time);
    }
    return [ans, score];
}

export function setThemeQuestion(theme) {
    const gameQues = document.getElementsByClassName('game-ques')[0];
    gameQues.innerText = `Find the ${theme.toUpperCase()} words!`;
}

export function resetNavig() {
    try {
        document.getElementsByClassName('total-score')[0].remove();
    } catch (err) {

    }
    let next = document.getElementById('next');
    next.innerHTML = "&#10153";
    let navigItems = document.querySelectorAll('.navig-item');
    navigItems.forEach((i) => {
        i.style.backgroundColor = "rgba(128, 128, 128, 0.685)";
    });
}

export function displayScore(score, time) {
    completedFlag = true;
    stopTimer();
    score = score + (time * 0.25);
    let body = document.body;
    updateUserScore(document.getElementsByClassName('user')[0].innerText.split(', ')[1],
        score,
        document.getElementsByClassName('game-ques')[0].innerText.split(' ')[2].toLowerCase());
    let scoreDiv = document.createElement('div');
    scoreDiv.className = "total-score";
    scoreDiv.innerHTML = `<h1>Your total score is : ${score}</h1>
    <br>
    <h2>Thank you choose any of the themes to play again</h2>`
    body.appendChild(scoreDiv);
    console.log("Your total score is : " + score);
    document.getElementById('game-body').style.filter = "blur(8px)";
    document.getElementById('sidenav-open-btn').click();
    document.getElementsByClassName('lb-tag')[0].click();
}

async function updateUserScore(name, score, theme) {
    let content = {
        name: name,
        score: score,
        theme: theme
    }
    const options = setFetchOptions(JSON.stringify(content))
    let data = await fetch(`${baseURL}leaderboard-update`, options);
}

//to display the respected questions
export function showQuestion(qstn) {
    populateGrabArea(letterGrabArea, qstn);
    populateDropArea(letterDropArea, qstn);
}