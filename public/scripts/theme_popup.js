let userNameForm = document.getElementById("username-popup");
let userNameInput = document.getElementById("username");
let themePopup = document.getElementById("theme-popup");
let themes = themePopup.getElementsByTagName("p");
let themePopupCloseBtn = document.getElementById("theme-submit-btn");
let menu = document.getElementById("sidenav");
let menuOpenBtn = document.getElementById("sidenav-open-btn");
let gameBody = document.getElementById("game-body");
let selectedTheme;
let userName;

//Get user name
userNameForm.onsubmit = (e) => {
  e.preventDefault();
  getUserName();
};

function getUserName() {
  let user = document.getElementsByClassName("user")[0];
  userNameInput.value = userNameInput.value.trim();
  userName = userNameInput.value;
  user.innerHTML = `Hi, ${userName}`;
  if (!userName || userName == "") return alert("Enter username to play");
  userNameForm.style.display = "none";
  themePopup.style.display = "flex";
  themePopupEvents();
}

menuOpenBtn.addEventListener("click", (e) => {
  if (menuOpenBtn.dataset.clicked === "clicked") {
    gameBody.style.filter = "blur(0px)";
    menu.style.marginLeft = "-265px";
    menuOpenBtn.style.marginLeft = "0px";
    menuOpenBtn.removeAttribute("data-clicked");
  } else {
    gameBody.style.filter = "blur(8px)";
    menu.style.marginLeft = "0px";
    menuOpenBtn.style.marginLeft = "250px";
    menu.style.setProperty("animation", "view-menu 0.5s linear 0s 1 forwards");
    menuOpenBtn.setAttribute("data-clicked", "clicked");
  }
});

menuOpenBtn.onmouseenter = () => {
  if (menuOpenBtn.dataset.clicked === "clicked") return;
  menuOpenBtn.style.marginLeft = "15px";
  menu.style.marginLeft = "-235px";
};

menuOpenBtn.onmouseleave = () => {
  if (menuOpenBtn.dataset.clicked === "clicked") return;
  menuOpenBtn.style.marginLeft = "0px";
  menu.style.marginLeft = "-265px";
};

//Defining onclick functions for each theme popup option
function themePopupEvents() {
  for (let i = 0; i < themes.length; i++) {
    themes[i].onclick = () => {
      for (let i = 0; i < themes.length; i++) themes[i].style.color = "#311307";
      themes[i].style.color = "red";
      selectedTheme = { theme: themes[i].id };
      themePopupCloseBtn.click();
    };
  }
}

//Function to get scramble qstns from server
export function getQstns(theme) {
  return fetch("https://word-scramble.glitch.me/theme-data", {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: `{"theme":"${theme}"}`,
  });
}

//returns theme selected
export function themeSelection() {
  themePopup.style.display = "none";
  menuOpenBtn.style.display = "block";
  document.getElementById("game-body").style.filter = "blur(0px)";
  return selectedTheme.theme;
}
