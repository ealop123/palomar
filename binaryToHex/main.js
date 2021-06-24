const $ = str => [...document.querySelectorAll(str)];

const main = function () {
  console.log("We have liftoff");
  equipBinaryInput();
  $("#binaryInput")[0].dispatchEvent(new Event("keyup"));
}

function equipBinaryInput() {
  const allowedCharCodes = [48, 49, 96, 97, 116, 8, 37, 39];
  let previousVal;

  $("#binaryInput")[0].addEventListener("keydown", e => {
    const keycode = e.keyCode;
    console.log(keycode);
    if (e.ctrlKey)
      return;
    if (!allowedCharCodes.includes(keycode)) {
      e.preventDefault();
    }
  });

  $("#binaryInput")[0].addEventListener("keyup", function () {
    const inputVal = this.value;
    if (inputVal == previousVal) {
      return;
    } else {
      previousVal = inputVal;
      updateBinaryCards(inputVal);
    }
  });
}

let colorList = [
  "#8864DE",
  "#8592DE",
  "#85D6DE",
  "#6BDB96",
  "#4CED7C",
];
class BinaryCard {
  constructor(binary, distanceFromEnd) {
    this.binary = binary;
    this.distanceFromEnd = distanceFromEnd;
    this.distanceFromGroupEnd = distanceFromEnd % 4;
    this.int = [1,2,4,8][this.distanceFromGroupEnd] * +binary;
    this.potentialInt = [1,2,4,8][this.distanceFromGroupEnd];
    this.group = ~~(distanceFromEnd / 4);
    this.color = colorList[this.group];
  }
  addCard(parent) {
    const card = document.createElement("div");
    card.classList.add("BinaryCard");
    card.dataset.group = this.group;
    card.dataset.int = this.int;
    card.style.backgroundColor = this.color;

    const intField = document.createElement("div");
    intField.innerText = this.potentialInt;
    card.appendChild(intField);

    const binaryField = document.createElement("div");
    binaryField.innerText = this.binary;
    binaryField.classList.add("binaryField");
    binaryField.addEventListener("click", function() {
      this.innerText = {"0": "1", "1": "0"}[this.innerText];
      $("#binaryInput")[0].value = $(".binaryField")
        .map(e => e.innerText).join("");
      $("#binaryInput")[0].dispatchEvent(new Event("keyup"));
      updateHexCards();
    });
    card.appendChild(binaryField);

    parent.appendChild(card);
  }
}


function updateBinaryCards(binaryString) {
  while ($("#cardField")[0].firstChild) {
    $("#cardField")[0].removeChild($("#cardField")[0].firstChild);
  }
  const strArr = [...binaryString];
  const binaryCardArr = [...strArr].reverse()
    .map((e, i) =>
      new BinaryCard(e, i)
    ).reverse();
  for (card of binaryCardArr) {
    card.addCard($("#cardField")[0]);
  }
  updateHexCards();
}

function updateHexCards() {
  while($("#hexByGroup")[0].firstChild) {
    $("#hexByGroup")[0].removeChild($("#hexByGroup")[0].firstChild);
  }
  for (group of [...new Set($("[data-group]").map(e => e.dataset.group))]) {
    const hexUnitContainer = document.createElement("div");
    hexUnitContainer.style.backgroundColor = colorList[group];
    hexUnitContainer.innerText = $(`[data-group = "${group}"]`)
      .reduce((a, b) => a + +b.dataset.int, 0);

    $("#hexByGroup")[0].appendChild(hexUnitContainer);
  }

  updateHexVal();
}

function updateHexVal() {
  const hexUnits = $("#hexByGroup > div").map(({innerText}) => +innerText)
    .map(unit => {
      if (unit < 10) {
        return unit;
      } else {
        return "ABCDEF".split("")[unit-10];
      }
    });
  $("#hexidecimalVal")[0].innerText = hexUnits.join("");

}

window.addEventListener("load", main);
