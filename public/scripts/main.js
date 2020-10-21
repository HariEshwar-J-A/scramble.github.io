import { populateDropArea, populateGrabArea } from "./drag_drop.js";
import { startTimer, stopTimer, time } from "./timer.js";
import {
  setThemeQuestion,
  displayQues,
  showQuestion,
  resetNavig,
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
let currQues = 0;
//navigation buttons
let navigItems = document.querySelectorAll(".navig-item");
navigItems.forEach((i, index) => {
  i.addEventListener("click", () => {
    qstn = allQues[index].ques.toUpperCase();
    ans = allQues[index].ans.toUpperCase();
    document.getElementById("hint").title = allQues[index].hint;
    currQues = index;
    showQuestion(qstn);
  });
});

//when next is clicked
next.onclick = () => {
  currQues++;
  [ans, score] = displayQues(currQues, ans, time, qstn, score, allQues);
};
reset.onclick = () => {
  populateGrabArea(letterGrabArea, qstn);
  populateDropArea(letterDropArea, qstn);
};

lbTag.addEventListener("click", (e) => {
  if (lbTag.id === "clicked") {
    // lb.style.display = "none";
    lb.style.marginRight = "-400px";
    lbTag.style.marginRight = "0px";
    lbTag.removeAttribute("id");
    // gameBody.style.animationDirection = "reverse";
    gameBody.style.width = "80vw";
  } else {
    lb.style.setProperty("display", "block");
    lb.style.marginRight = "0px";
    lbTag.style.marginRight = "380px";
    populateLeaderboard(theme);
    gameBody.style.width = "60vw";
    // gameBody.style.animationDirection = "normal";
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
  setThemeQuestion(theme);
  viewLeaderboard();
  resetNavig();
  currQues = 0;
  qstn = allQues[0].ques.toUpperCase();
  ans = allQues[0].ans.toUpperCase();
  populateDropArea(letterDropArea, qstn);
  populateGrabArea(letterGrabArea, qstn);
  //To display the first hint
  document.getElementById("hint").title = allQues[0].hint;
  score = 0;
  //function call to invoke timer
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
