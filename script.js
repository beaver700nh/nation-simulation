const WIDTH = 23;
const HEIGHT = 19;

function spawnFromTemplate(template, container) {
  const clone = template.content.cloneNode(true);
  const elem = clone.children[0];
  container.appendChild(elem);
  return elem;
}

function main() {
  const cellTemplate = document.getElementById("--cell");
  const cellContainer = document.getElementsByClassName("cell-container")[0];

  for (let j = 0; j < HEIGHT; ++j) {
    for (let i = 0; i < WIDTH; ++i) {
      let cell = spawnFromTemplate(cellTemplate, cellContainer);

      cell.addEventListener("click", onCellClick);

      if (j % 2 !== 0) {
        cell.classList.add("odd-row");
      }
      if (j % 2 !== 0 && i + 1 === WIDTH) {
        cell.classList.add("leftover");
      }
    }
  }

  cellContainer.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr)`;
}

function onCellClick(event) {
  const cell = event.target;
  cell.classList.toggle("selected");
}

document.addEventListener("DOMContentLoaded", main);
