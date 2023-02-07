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
    cell.innerHTML = generateCellDisplayName(request);

    const index = cell.dataset.index;
    let selection = document.getElementsByClassName("selection-list")[0].children[index];
    selection.textContent = generateCellDescription(cell.dataset, selection.dataset);
  }
}

function generateCellDisplayName(shortName) {
  if (shortName in createSet("", "Road", "Rivr", "Ocen", "OfLm")) {
    return "";
  }

  if (shortName.length < 4) {
    return shortName;
  }

  const words = (shortName.match(/[A-Z]/g) || []).length;

  if (shortName[2] === shortName[2].toUpperCase() || words === 1) {
    return `${shortName.substr(0, 2)}<br/>${shortName.substr(2)}`;
  }

  if (shortName[3] === shortName[3].toUpperCase()) {
    return `${shortName.substr(0, 3)}<br/>${shortName[3]}`;
  }

  if (shortName[1] === shortName[1].toUpperCase()) {
    return `${shortName[0]}<br/>${shortName.substr(1)}`;
  }
}

function generateCellDescription(cd, sd) {
  const coords = `${parseInt(sd.col, 10) + 1}.${parseInt(sd.row, 10) + 1}`;
  const nametag = generateCellDescriptionName(cd.cellType);

  return `${coords} - ${nametag}`;
}

function generateCellDescriptionName(shortName) {
  if (!shortName) {
    return "Empty Land Hex";
  }

  const longName = document.querySelector(`.cell-type option[value="${shortName}"]`).textContent;

  return `${shortName} (${longName})`;
}

function createSet(...items) {
  let theSet = {};

  for (const i of items) {
    theSet[i] = true;
  }

  return theSet;
}

function fileLoad() {
  const uploader = document.getElementById("file-uploader");
  uploader.value = "";
  uploader.click();
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

  const selectionContainer = document.getElementsByClassName("selection-list")[0];
  selectionContainer.innerHTML = "";

  createCells(hexData.width, hexData.height);

  for (const cellData of hexData.hexes) {
    let cell = cellContainer.children[cellData.index];
    cell.dataset.cellType = cellData.cellType;
    cell.innerHTML = generateCellDisplayName(cellData.cellType);
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

const BUILDING_INFO = {
  WtFm: {size: 3, pop:  50},
  PgFm: {size: 2, pop:  50},
  Orch: {size: 2, pop:  50},
  Fndy: {size: 1, pop: 150},
  GsMl: {size: 1, pop: 150},
  RmMl: {size: 1, pop: 150},
  SwMl: {size: 1, pop: 150},
  Ship: {size: 1, pop: 300},
  HpPl: {size: 2, pop:  50},
  ToPl: {size: 2, pop:  50},
  RcPl: {size: 2, pop:  50},
  CoPl: {size: 2, pop:  50},
  SlvP: {size: 1, pop:  75},
  FshP: {size: 1, pop:  75},
  WhoP: {size: 1, pop:  75},
  FurP: {size: 1, pop:  75},
  NvlP: {size: 1, pop:  75},
  Whrf: {size: 1, pop:  50},
  Pmtg: {size: 1, pop:   0},
  Qmtg: {size: 1, pop:   0},
  AngC: {size: 1, pop:   0},
  Tvrn: {size: 1, pop:  10},
  Grsn: {size: 2, pop:   0},
  News: {size: 1, pop:  10},
  Unvy: {size: 3, pop: 100},
  Shoe: {size: 1, pop:  50},
  Tany: {size: 1, pop:  40},
  Cmm:  {size: 1, pop:   0},
  SMkt: {size: 1, pop: 125},
  FMkt: {size: 1, pop: 125},
  WMkt: {size: 1, pop: 125},
  FurM: {size: 1, pop: 125},
  NMkt: {size: 1, pop: 125},
  Town: {size: 2, pop:  10},
  Inn:  {size: 2, pop:  10},
  Hspl: {size: 3, pop:  40},
  Lbry: {size: 3, pop:   0},
  Cths: {size: 3, pop:  20},
  ShFy: {size: 1, pop: 400},
  TxMl: {size: 1, pop: 400},
  Canl: {size: 1, pop:  10},
  FlMl: {size: 1, pop: 400},
  LmMl: {size: 1, pop: 400},
  RgMl: {size: 1, pop: 400},
  RmDs: {size: 1, pop: 400},
  Tnmt: {size: 3, pop:   0},
  CmDk: {size: 1, pop:  75},
  Hotl: {size: 3, pop:  20},
  SBnk: {size: 3, pop:  20},
  NBnk: {size: 3, pop:  30},
  Dept: {size: 3, pop:  30},
  Rlrd: {size: 1, pop:  10},
};

function countBuildings() {
  const counter = getBuildingCount();
  showBuildingCount(counter);
}

function getBuildingCount() {
  const cells = document.getElementsByClassName("cell-container")[0].children;
  let counter = {};

  for (const cell of cells) {
    const type = cell.dataset.cellType;

    if (!cell.dataset.cellType) {
      continue;
    }

    if (!BUILDING_INFO.hasOwnProperty(type)) {
      continue;
    }

    if (counter.hasOwnProperty(type)) {
      ++counter[type];
    }
    else {
      counter[type] = 1;
    }
  }

  for (const type in counter) {
    const size = BUILDING_INFO[type].size;

    if ((counter[type] % size) === 0) {
      counter[type] /= size;
    }
    else {
      counter[type] = null;
    }
  }

  return counter;
}

function showBuildingCount(counter) {
  const types = Object.keys(counter);

  if (types.length === 0) {
    showDialog("No buildings to count!");
    return;
  }

  const errors = types.filter((k) => counter[k] === null);

  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  const formatted = Object.entries(counter)
    .map(formatBuildingCount)
    .join("\n");
  const message = `Building counts:\n\n${formatted}`;

  showDialog(message);
}

function formatBuildingCount([k, v]) {
  const nametag = generateCellDescriptionName(k);
  return `${v} \xD7 ${nametag}`;
}

function showErrors(errors) {
  const list = errors.join(", ");
  const sizes = errors.map((t) => `${t}: ${BUILDING_INFO[t].size} hexes`).join("\n");

  const message =
`The following buildings have errors:

${list}

Please make sure all your buildings are of the appropriate size \
as shown on the Building Reference Sheet:

${sizes}`;

  showDialog(message);
}

function countPeople() {
  let counter = getBuildingCount();

  const types = Object.keys(counter);
  const errors = types.filter((k) => counter[k] === null);

  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  for (const type in counter) {
    const pop = BUILDING_INFO[type].pop;
    counter[type] *= pop;
  }

  counter = filterNonZero(counter);
  showPeopleCount(counter);
}

function filterNonZero(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) => v !== 0
    )
  );
}

function showPeopleCount(counter) {
  const total = Object.values(counter).reduce(
    (a, c) => a + c, 0
  );

  const formatted = Object.entries(counter)
    .map(formatPeopleCount)
    .join("\n");

  const message = (
    Object.keys(counter).length > 0 ?
`The settlement requires ${total} people in total.

Specifically:
${formatted}` :
`The settlement requires no people because there are no buildings that require people.`
  );

  showDialog(message);
}

function formatPeopleCount([k, v]) {
  const nametag = generateCellDescriptionName(k);
  return `${v} people - ${nametag}`;
}

function showDialog(message) {
  const element = document.getElementById("popup-dialog");
  element.classList.remove("hidden");

  const text = document.getElementsByClassName("popup-dialog-text")[0];
  text.innerHTML = message.replaceAll("\n", "<br/>");
}

function closeDialog(message) {
  const element = document.getElementById("popup-dialog");
  element.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", main);
