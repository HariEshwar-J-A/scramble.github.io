import { populateDropArea, populateGrabArea } from "./drag_drop.js";
import { startTimer, stopTimer, time } from "./timer.js";
import {
    setThemeQuestion,
    displayQues,
    showQuestion,
    resetNavig,
    checkFunction
} from "./displayQues.js";

import { getQstns, themeSelection } from "./theme_popup.js";
import {
    populateLeaderboard,
    viewLeaderboard,
    hideLeaderboard,
} from "./leaderboard.js";

let menuThemes = document.getElementById("sidenav").getElementsByTagName("p");
let themePopupCloseBtn = document.getElementById("theme-submit-btn");
// let lbIcon = document.getElementsByClassName('lb-icon')[0];
let lb = document.getElementById("leaderboard");
let lbTag = document.getElementsByClassName("lb-tag")[0];
let gameBody = document.getElementById("game-body");
var theme;
var allQues;
let themeAfterDrop;
theme = "web-series";

let letterDropArea = document.getElementById("letter-drop-area");
let letterGrabArea = document.getElementById("letter-grab-area");
let navigationArea = document.getElementById("navigation");
let qstn;
let ans;
let score = 0;
hideLeaderboard();

function populateNavigation(navigationArea, noOfQues) {
    navigationArea.innerHTML = "";
    for (let i = 0; i < noOfQues; i++) {
        navigationArea.innerHTML += `<div class="navig-item" id="navig-${i + 1}" >${
      i + 1
    }</div>`;
    }
}
populateNavigation(navigationArea, 6);

//From here --------------------------------------------------------

let reset = document.getElementById("reset");
let next = document.getElementById("next");
let check = document.getElementById("check");
let currQues = 0;
//navigation buttons
let navigItems = document.querySelectorAll(".navig-item");
navigItems[0].style.border = "2px solid white";
navigItems.forEach((i, index) => {
    i.addEventListener("click", () => {
        qstn = allQues[index].ques.toUpperCase();
        ans = allQues[index].ans.toUpperCase();
        document.getElementById("hint").title = allQues[index].hint;
        qaAfterDrop(currQues);
        currQues = index;
        navigItems.forEach((i) => {
            i.style.border = "none";
        });
        i.style.border = "2px solid white";
        if (index === navigItems.length - 1) next.innerText = "🏁";
        else next.innerHTML = "&#10140";
        showQuestion(
            themeAfterDrop[currQues].ques,
            themeAfterDrop[currQues].ans,
            qstn
        );
    });
});

//when next is clicked
next.onclick = () => {
    qaAfterDrop(currQues);
    currQues++;
    if (currQues < allQues.length) {
        qstn = allQues[currQues].ques.toUpperCase();
    }
    [ans, score] = displayQues(
        currQues,
        ans,
        time,
        qstn,
        score,
        allQues,
        themeAfterDrop
    );
};
check.onclick = () => {
    score = checkFunction(ans, currQues, score);
}

reset.onclick = () => {
    populateGrabArea(letterGrabArea, qstn);
    populateDropArea(letterDropArea, "", qstn);
    qaAfterDrop(currQues);
};

lbTag.addEventListener("click", (e) => {
    if (lbTag.id === "clicked") {
        lb.style.marginRight = "-400px";
        lbTag.style.marginRight = "0px";
        lbTag.removeAttribute("id");
        gameBody.style.width = "80vw";
    } else {
        lb.style.setProperty("display", "block");
        lb.style.marginRight = "0px";
        lbTag.style.marginRight = "380px";
        populateLeaderboard(theme);
        gameBody.style.width = "60vw";
        lb.style.setProperty("animation", "view-board 0.5s linear 0s 1 forwards");
        lbTag.id = "clicked";
        lbTag.setAttribute("id", "clicked");
    }
});

themePopupCloseBtn.onclick = () => {
    theme = themeSelection();
    getData();
};

async function getData() {
    allQues = await (await getQstns(theme)).json();
    themeAfterDrop = allQues.map((e) => {
        return { ques: e.ques.toUpperCase(), ans: "" };
    });

    setThemeQuestion(theme);
    viewLeaderboard();
    resetNavig();
    currQues = 0;
    qstn = allQues[0].ques.toUpperCase();
    ans = allQues[0].ans.toUpperCase();
    populateDropArea(letterDropArea, themeAfterDrop[0].ans, qstn);
    populateGrabArea(letterGrabArea, qstn);
    document.getElementById("hint").title = allQues[0].hint;
    score = 0;
    stopTimer();
    startTimer();
}

//Defining onclick functions for menu options
for (let i = 0; i < menuThemes.length; i++) {
    menuThemes[i].onclick = () => {
        let selectedTheme = { theme: menuThemes[i].id.replace("menu-", "") };
        theme = selectedTheme.theme;
        document.getElementById("sidenav-open-btn").click();
        getData();
    };
}

function qaAfterDrop(index) {
    let qstnAfterDrop = "";
    let ansAfterDrop = "";

    for (let i = 0; i < letterGrabArea.getElementsByTagName("div").length; i++) {
        qstnAfterDrop += letterGrabArea
            .getElementsByTagName("div")[i].innerHTML.toString();
    }

    let dropLetters = document.getElementsByClassName("drop-letter");

    for (let i = 0; i < dropLetters.length; i++) {
        if (dropLetters[i].firstElementChild) {
            ansAfterDrop += `${dropLetters[
        i
      ].firstElementChild.innerHTML.toString()}:${i}/`;
        }
    }

    themeAfterDrop[index].ques = qstnAfterDrop;
    themeAfterDrop[index].ans = ansAfterDrop;
}