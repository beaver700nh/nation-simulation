document.addEventListener("DOMContentLoaded", main);

function main() {
  const cellTemplate = document.getElementById("--cell");
  const cellContainer = document.getElementsByClassName("cell-container")[0];

  for (let j = 0; j < 19; ++j) {
    for (let i = 0; i < 23; ++i) {
      let cell = spawnFromTemplate(cellTemplate, cellContainer);
      console.log(cell);

      // if (j % 2 !== 0) {
      //   cell.style.backgroundColor = "red";
      // }
    }
  }

  cellContainer.style.gridTemplateColumns = `repeat(23, 1fr)`;
}

function spawnFromTemplate(template, container) {
  const clone = template.content.cloneNode(true);
  const node = document.importNode(clone, true);
  container.appendChild(node);
  return node;
}
