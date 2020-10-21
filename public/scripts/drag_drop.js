export function populateGrabArea(letterGrabArea, qstn) {
    letterGrabArea.innerHTML = "";
    for (let i = 0; i < qstn.length; i++) {
        letterGrabArea.innerHTML += `<div class="grab-letter" id="q${i}" draggable="true" ondragstart="onDragStart(event);">
        ${qstn[i]} </div>`;
    }
}

export function populateDropArea(letterDropArea, qstn) {
    letterDropArea.innerHTML = "";
    for (let i = 0; i < qstn.length; i++) {
        letterDropArea.innerHTML += `<div class="drop-letter" id="ans${i}" ondragover="onDragOver(event);" ondrop="onDrop(event, this);"></div>`;
    }
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
    const letterGrabArea = document.getElementById('letter-grab-area');
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