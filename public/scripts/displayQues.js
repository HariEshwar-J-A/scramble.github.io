import { stopTimer, getTimeInterval } from "./timer.js";
import { populateDropArea, populateGrabArea } from "./drag_drop.js";
import { setFetchOptions, baseURL } from "./leaderboard.js";
// window.open(location.href, '_parent');

let letterDropArea = document.getElementById("letter-drop-area");
let letterGrabArea = document.getElementById("letter-grab-area");
export let totalScore = 0;
export let completedFlag = false;
//to check if a question is already evaluated
var valuatedFlag = new Array(6).fill(0);
const gameBody = document.getElementById("game-body");
const lbTag = document.getElementsByClassName("lb-tag")[0];
const menuOpen = document.getElementById("sidenav-open-btn");

export function setValuatedFlag(length) {
    valuatedFlag = new Array(length).fill(0);
}

export function displayQues(currQues, ans, time, qstn, score, allQues, themeAfterDrop) {
    let navigItems = document.querySelectorAll(".navig-item");
    let ansBox = document.querySelectorAll(".drop-letter");
    let next = document.getElementById("next");
    let ansString = "";
    let hint = document.getElementById("hint");
    //clear the question eval block
    document.getElementById('correct').style.display = "none";
    document.getElementById('wrong').style.display = "none";
    //clear nav items border
    navigItems.forEach((i) => {
        i.style.boxShadow = "0 0 5px 7px #000";
    });
    //gathers answer string together
    ansBox.forEach((i) => {
        ansString += i.innerText.trim();
    });

    if (currQues === navigItems.length - 1) {
        next.innerText = "🏁";
        next.title = "Click to finish and view the score";
    }
    if (ansString === ans) {
        //only if current question is already not validated
        navigItems[currQues - 1].style.backgroundColor = "green";
        if (valuatedFlag[currQues - 1] === 0) {
            score += 10;
            totalScore += 10;
            valuatedFlag[currQues - 1] = 1;
        }
    } else if (ansString !== ans && currQues <= navigItems.length) {
        navigItems[currQues - 1].style.backgroundColor = "red";
    }
    if (currQues <= navigItems.length - 1) {
        qstn = allQues[currQues].ques.toUpperCase();
        ans = allQues[currQues].ans.toUpperCase();
        showQuestion(
            themeAfterDrop[currQues].ques,
            themeAfterDrop[currQues].ans,
            qstn
        );
        hint.title = allQues[currQues].hint;
    }
    //displays score
    if (currQues === navigItems.length) {
        displayScore(score, time);
    } else {
        navigItems[currQues].style.boxShadow = "none";
    }
    return [ans, score];
}

//to evaluate the current question
export function checkFunction(ans, currQues, score) {
    let ansBox = document.querySelectorAll(".drop-letter");
    let navigItems = document.querySelectorAll(".navig-item");
    let ansString = "";
    //gathers answer string together
    let correct = document.getElementById('correct');
    let wrong = document.getElementById('wrong');
    ansBox.forEach((i) => {
        ansString += i.innerText.trim();
    });
    if (ansString === ans) {
        correct.style.display = "block";
        wrong.style.display = "none";
        navigItems[currQues].style.backgroundColor = "green";
        if (valuatedFlag[currQues] === 0) {
            score += 10;
            totalScore += 10;
            valuatedFlag[currQues] = 1;
        }
    } else if (ansString !== ans && currQues <= navigItems.length) {
        wrong.style.display = "block";
        correct.style.display = "none";
        navigItems[currQues].style.backgroundColor = "red";
    }
    return score;
}

export function setThemeQuestion(theme) {
    const gameQues = document.getElementsByClassName("game-ques")[0];
    gameQues.innerText = `${theme.toUpperCase()}`;
}

export function resetNavig() {
    try {
        document.getElementsByClassName("total-score")[0].remove();
    } catch (err) {}
    let next = document.getElementById("next");
    next.innerHTML = "&#10140";
    next.title = "click to move to next question";
    let navigItems = document.querySelectorAll(".navig-item");
    navigItems.forEach((i) => {
        i.style.backgroundColor = "burlywood";
    });
}

export async function displayScore(score, time) {
    completedFlag = true;
    stopTimer();
    score = score + (score * time * 0.0025);
    let body = document.body;
    await updateUserScore(
        document.getElementsByClassName("user")[0].innerText.split(", ")[1],
        score,
        document.getElementsByClassName("game-ques")[0].innerText.toLowerCase()
    );
    let scoreDiv = document.createElement("div");
    scoreDiv.className = "total-score";
    scoreDiv.innerHTML = `<h1>You scored :${score} points</h1><div class="restart">PLAY AGAIN</div<br>`;
    body.appendChild(scoreDiv);
    console.log("Your total score is : " + score);
    gameBody.style.filter = "blur(8px)";
    // valuatedFlag = new Array(6).fill(0);
    if (lbTag.id === 'clicked') {
        lbTag.click();
        lbTag.click();
    } else {
        lbTag.click();
    }
    finalAction();
}

export function finalAction() {
    console.log('final-action');
    const restart = document.getElementsByClassName('restart')[0];
    restart.addEventListener('click', (e) => {
        document.getElementById("theme-popup").style.display = 'flex';
        document.getElementsByClassName('total-score')[0].remove();
        if (menuOpen.style.marginLeft === '250px') {
            menuOpen.click();
            gameBody.style.filter = "blur(8px)";
        }
        if (lbTag.id === 'clicked') {
            lbTag.click();
        }
    });
}

async function updateUserScore(name, score, theme) {
    let content = {
        name: name,
        score: score,
        theme: theme,
    };
    const options = setFetchOptions(JSON.stringify(content));
    let data = await fetch(`${baseURL}leaderboard-update`, options);
}

//to display the respected questions
export function showQuestion(qstn, ans, themeQues) {
    populateGrabArea(letterGrabArea, qstn);
    populateDropArea(letterDropArea, ans, themeQues);
}