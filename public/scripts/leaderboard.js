class HighScores {
    constructor(name, score, rank) {
        this.name = name;
        this.score = score;
        this.rank = rank;
    }
    getHTML() {
        return `
        <div class="entry">
            <div class="rank">${this.rank}</div>
            <div class="name">${this.name}</div>
            <div class="score">${this.score}</div>
        </div>`
    }
}

// let lbIcon = document.getElementsByClassName('lb-icon')[0];
let lb = document.getElementById('leaderboard');
let lbTag = document.getElementsByClassName('lb-tag')[0];
// let gameBody = document.getElementById('game-body');
export const baseURL = 'https://word-scramble.glitch.me/';

export const setFetchOptions = (content) => {
    return {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: content
    };
}

const viewLeaderboard = () => {
    // lb.style.display = "block";
    lbTag.style.display = "block";
}

const hideLeaderboard = () => {
    // lb.style.display = "none";
    lbTag.style.display = "none";
}

const populateLeaderboard = async(theme) => {
    lb.innerHTML = `<div id="lb-title">LEADER BOARD</div>`;
    const options = setFetchOptions(`{"theme": "${theme}" }`);
    let data = await fetch(`${baseURL}leaderboard`, options);
    data = await data.json();
    data.forEach((el, index) => {
        lb.innerHTML += (new HighScores(el.name, el.score, index + 1)).getHTML();
    });
};

export { populateLeaderboard, viewLeaderboard, hideLeaderboard };