export function populateGrabArea(letterGrabArea, qstn) {
  letterGrabArea.innerHTML = "";
  for (let i = 0; i < qstn.length; i++) {
    letterGrabArea.innerHTML += `<div class="grab-letter" id="q${i}" draggable="true" ondragstart="onDragStart(event);">${qstn[i]}</div>`;
  }
}

export function populateDropArea(letterDropArea, ans, qstn) {
  letterDropArea.innerHTML = "";
  for (let i = 0; i < qstn.length; i++) {
    letterDropArea.innerHTML += `<div class="drop-letter" id="ans${i}" ondragover="onDragOver(event);" ondrop="onDrop(event, this);"></div>`;
  }
  if (ans == "") return;
  let droppedBoxes = ans
    .split("/")
    .slice(0, -1)
    .map((e) => parseInt(e.split(":")[1]));

  let droppedLetters = ans
    .split("/")
    .slice(0, -1)
    .map((e) => e.split(":")[0]);

  droppedBoxes.forEach((e, i) => {
    letterDropArea.getElementsByClassName("drop-letter")[
      e
    ].innerHTML = `<div class="grab-letter" id="da${i}" draggable="true" ondragstart="onDragStart(event);">${droppedLetters[i]}</div>`;
  });
}

window.onDragStart = (event) => {
  event.dataTransfer.setData("text/plain", event.target.id);
};

window.onDragOver = (event) => {
  event.preventDefault();
};

window.onDrop = (event, parentContainer) => {
  const id = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(id);
  const letterGrabArea = document.getElementById("letter-grab-area");
  if (!parentContainer.firstElementChild)
    parentContainer.appendChild(draggableElement);
  else {
    letterGrabArea.appendChild(parentContainer.firstElementChild);
    parentContainer.appendChild(draggableElement);
  }

  event.dataTransfer.clearData();
};

window.onDropInContainer = (event, parentContainer) => {
  const id = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(id);

  parentContainer.appendChild(draggableElement);

  event.dataTransfer.clearData();
};
