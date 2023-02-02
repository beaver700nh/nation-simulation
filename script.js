const WIDTH = 23;
const HEIGHT = 19;

function main() {
  createCells(WIDTH, HEIGHT);
}

function createCells(width, height) {
  const cellTemplate = document.getElementById("--cell");
  const cellContainer = document.getElementsByClassName("cell-container")[0];

  const selectionTemplate = document.getElementById("--selection");
  const selectionContainer = document.getElementsByClassName("selection-list")[0];

  cellContainer.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

  for (let j = 0; j < height; ++j) {
    for (let i = 0; i < width; ++i) {
      createCell(cellTemplate, cellContainer, selectionTemplate, selectionContainer, i, j, width);
    }
  }
}

function createCell(ct, cc, st, sc, i, j, width) {
  let cell = spawnFromTemplate(ct, cc);

  cell.addEventListener("click", onCellClick);
  cell.dataset.index = j*width + i;

  if (j % 2 !== 0) {
    cell.classList.add("odd-row");
  }
  if (j % 2 !== 0 && i + 1 === width) {
    cell.classList.add("leftover");
  }

  let selection = spawnFromTemplate(st, sc);
  selection.dataset.row = j;
  selection.dataset.col = i;
}

function spawnFromTemplate(template, container) {
  const clone = template.content.cloneNode(true);
  const elem = clone.children[0];
  container.appendChild(elem);
  return elem;
}

function onCellClick(event) {
  let cell = event.target;
  cell.classList.toggle("selected");

  const index = cell.dataset.index;
  let selection = document.getElementsByClassName("selection-list")[0].children[index];
  selection.textContent = generateCellDescription(cell.dataset, selection.dataset);
  selection.classList.toggle("hidden");
}

function clearSelection() {
  let selected = document.querySelectorAll(".cell.selected");
  let selections = document.getElementsByClassName("selection-list")[0];

  for (let cell of selected) {
    cell.classList.remove("selected");

    const index = cell.dataset.index;
    selections.children[index].classList.add("hidden");
  }
}

function setCellTypes() {
  const request = document.getElementsByClassName("cell-type")[0].value;
  let selected = document.querySelectorAll(".cell.selected");

  for (let cell of selected) {
    cell.dataset.cellType = request;

    const index = cell.dataset.index;
    let selection = document.getElementsByClassName("selection-list")[0].children[index];
    selection.textContent = generateCellDescription(cell.dataset, selection.dataset);
  }
}

function generateCellDescription(cd, sd) {
  const coords = `${parseInt(sd.col, 10) + 1}.${parseInt(sd.row, 10) + 1}`;

  if (!cd.cellType) {
    return `${coords} - Empty Land Hex`;
  }

  const shortName = cd.cellType;
  const longName = document.querySelector(`.cell-type option[value="${shortName}"]`).textContent;

  return `${coords} - ${shortName} (${longName})`;
}

function fileLoad() {
  document.getElementById("file-uploader").click();
}

function onFileUploaded() {
  const input = event.target;

  if (input.files.length > 0) {
    input.files[0].text().then(parseFile);
  }
}

function parseFile(text) {
  const hexData = JSON.parse(text);

  const cellContainer = document.getElementsByClassName("cell-container")[0];

  cellContainer.innerHTML = "";
  createCells(hexData.width, hexData.height);

  for (const cellData of hexData.hexes) {
    cellContainer.children[cellData.index].dataset.cellType = cellData.cellType;
  }
}

function fileSave() {
  let hexData = {
    width: WIDTH,
    height: HEIGHT,
    hexes: [],
  };

  const cells = document.getElementsByClassName("cell-container")[0].children;

  for (const cell of cells) {
    if (cell.dataset.cellType) {
      hexData.hexes.push(cell.dataset);
    }
  }

  const json = JSON.stringify(hexData, null, 2);
  const name = prompt("Name of settlement?");

  if (name) {
    downloadString(json, `${name}.sim`);
  }
}

function downloadString(str, name) {
  const HEADER = "data:application/octet-stream;charset=utf-8,";
  let url = HEADER + encodeURIComponent(str);

  let link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.addEventListener("DOMContentLoaded", main);
