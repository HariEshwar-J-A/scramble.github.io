import { stopTimer, getTimeInterval } from "./timer.js";
import { populateDropArea, populateGrabArea } from "./drag_drop.js";
import { setFetchOptions, baseURL } from "./leaderboard.js";
// window.open(location.href, '_parent');

let letterDropArea = document.getElementById("letter-drop-area");
let letterGrabArea = document.getElementById("letter-grab-area");
export let totalScore = 0;
export let completedFlag = false;
//to check if a question is already evaluated
let valuatedFlag = new Array(6).fill(0);
export function displayQues(currQues, ans, time, qstn, score, allQues, themeAfterDrop) {
    let navigItems = document.querySelectorAll(".navig-item");
    let ansBox = document.querySelectorAll(".drop-letter");
    let next = document.getElementById("next");
    let ansString = "";
    let hint = document.getElementById("hint");
    //clear nav items border
    navigItems.forEach((i) => {
        i.style.border = "none";
    });
    //gathers answer string together
    ansBox.forEach((i) => {
        ansString += i.innerText.trim();
    });

    if (currQues === navigItems.length - 1) {
        next.innerText = "🏁";
    }
    if (ansString === ans) {
        //only if current question is already not validated
        if (valuatedFlag[currQues - 1] === 0) {
            navigItems[currQues - 1].style.backgroundColor = "green";
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
        navigItems[currQues].style.border = "2px solid white";
    }
    return [ans, score];
}

//to evaluate the current question
export function checkFunction(ans, currQues, score) {
    let ansBox = document.querySelectorAll(".drop-letter");
    let navigItems = document.querySelectorAll(".navig-item");
    let ansString = "";
    //gathers answer string together
    ansBox.forEach((i) => {
        ansString += i.innerText.trim();
    });
    if (ansString === ans) {
        if (valuatedFlag[currQues] === 0) {
            navigItems[currQues].style.backgroundColor = "green";
            score += 10;
            totalScore += 10;
            valuatedFlag[currQues] = 1;
        }
    } else if (ansString !== ans && currQues <= navigItems.length) {
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
    let navigItems = document.querySelectorAll(".navig-item");
    navigItems.forEach((i) => {
        i.style.backgroundColor = "rgba(128, 128, 128, 0.685)";
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
    document.getElementById("game-body").style.filter = "blur(8px)";
    valuatedFlag = new Array(6).fill(0);
    document.getElementsByClassName("lb-tag")[0].click();
    finalAction();
}

export function finalAction() {
    console.log('final-action');
    const restart = document.getElementsByClassName('restart')[0];
    restart.addEventListener('click', (e) => {
        location.reload();
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