// const END_POINT = "http://localhost:8080";
const END_POINT = "https://trello-clone-ppm.herokuapp.com";

var lists = [];

const loader = `
<div class="lds-ellipsis trello-fadein"><div></div><div></div><div></div><div></div></div>
`;

const logo = `
<h4 class="text-light my-0" id="logo">Trello</h4>
`;

const addListBtn = `
  <button class="btn btn-lg add-list m-1 text-left mr-3">
    <i class="fa fa-plus"></i>&nbsp;&nbsp;&nbsp;Add another list
  </button>
  <div style="width: 0.5rem">&nbsp;</div>
`;

const getLabel = (label) => {
  return `<span class="trello-label d-inline-block mr-1" style="background-color: ${label.color}"></span>`;
}

const getCard = (card, list) => {
  const lblStr = card.labels.map(lbl => getLabel(lbl)).join("");
  const cardPaddingTop = lblStr ? "0":"10px"; // add padding-top 10px if there's no label
  return `
  <div class="trello-card d-block mb-2" style="padding-top: ${cardPaddingTop}" data-toggle="modal" data-target="#cardModal" onclick="cardClicked(event)" list-id="${list.id}" card-id="${card.id}">
    ${lblStr}
    <h6 class="trello-title">${card.title}</h6>
  </div>
  `;
};

const getList = (list) => {
  const cardsStr = list.cards.map(c => getCard(c, list)).join("");
  return `
  <div class="trello-list rounded m-1 px-2 py-1 pb-2 trello-fadein">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h6 class="pl-2">${list.title}</h6>
      <button class="btn btn-sm stretch-x"><i class="fa fa-ellipsis-h"></i></button>
    </div>
    ${cardsStr}
    <div class="d-flex justify-content-between align-items-center">
      <button class="btn btn-sm text-left" id="add-new-card">
        <i class="fa fa-plus"></i>&nbsp;&nbsp;Add another card
      </button>
      <button class="btn btn-sm"><i class="fa fa-window-maximize"></i></button>
    </div>
  </div>
  `;
};

const getChkliItem = (chk) => {
  return `
  <div class="chkli d-flex align-items-center">
    <p><i class="fa fa-check-circle"></i></p>
    <p class="flex-grow-1 pl-2">${chk.item}</p>
  </div>
  `;
}

const setLoading = (isLoading) => {
  document.getElementById("centerhold").innerHTML = isLoading ? loader:logo;
};

window.onload = () => {
  console.log("DOM is ready!");
  limitWrapperHeight();
  fetchData();
};

function limitWrapperHeight() {
  const body = document.documentElement.clientHeight;
  const nav1 = document.getElementById("first-nav").clientHeight;
  const nav2 = document.getElementById("second-nav").clientHeight;
  const wrapper = document.getElementById("wrapper");
  wrapper.style.maxHeight = (body - nav1 - nav2) + "px";
  wrapper.style.minHeight = (body - nav1 - nav2) + "px";
}

function fetchData() {
  setLoading(true);
  fetch(END_POINT + "/list")
    .then(res => res.json())
    .then(data => {
      setLoading(false);
      console.log(data);
      lists = data;
      const listStr = data.map(l => getList(l)).join("") + addListBtn;
      document.getElementById("wrapper").innerHTML = listStr;
    })
    .catch(err => {
      setLoading(false);
      console.log(err);
    });
}

function cardClicked(e) {
  let target = e.target;
  if(!(target.nodeName == "div" || target.nodeName == "DIV")) {
    target = target.parentElement;
  }
  const listId = target.getAttribute("list-id");
  const cardId = target.getAttribute("card-id");

  const list = lists.find(l => l.id == listId);
  const card = list.cards.find(c => c.id == cardId);

  document.getElementById("cardTitle").innerHTML = card.title;
  document.getElementById("inListTitle").innerHTML = list.title;
  document.getElementById("cardDesc").innerHTML = card.description;

  const chkliStr = card.checklists.map(li => getChkliItem(li)).join("");
  document.getElementById("chkli-wrapper").innerHTML = chkliStr || '<p style="opacity: 0.7">No Checklist</p>';
}