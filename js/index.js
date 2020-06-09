const END_POINT = "http://localhost:8080";
// const END_POINT = "https://trello-clone-ppm.herokuapp.com";

var lists = [];
var addListPopup;

const loader = `
<div class="lds-ellipsis trello-fadein"><div></div><div></div><div></div><div></div></div>
`;

const logo = `
<h4 class="text-light my-0" id="logo">Trello</h4>
`;

const addListBtn = `
  <button class="btn btn-lg add-list m-1 text-left mr-3" id="add-list-btn" onclick="addNewList()">
    <i class="fa fa-plus"></i>&nbsp;&nbsp;&nbsp;Add another list
  </button>
  <div style="width: 0.5rem">&nbsp;</div>
`;

const getLabel = (label) => {
  return `<span class="trello-label d-inline-block mr-1" style="background-color: ${label.color}"></span>`;
};

const getMember = (mem) => {
  const names = mem.name.split(" "); // split the names, eg. "Nial James Horan" would be ["Nial", "James", "Horan"]
  let initials = names[0][0]; // first initial
  if(names.length > 1) {
    // if name have multiple words, take the initial of the last word
    initials += names[names.length -1][0];
  } else if(names[0].length > 1) {
    // if name have only one word like "Sai", take the 2nd letter of the first word if there's any
    initials += names[0][1];
  }
  return `<div class="avatar" onclick="avatarClicked(event)">${initials}</div>`;
};

const getCard = (card, list) => {
  const lblStr = card.labels.map(lbl => getLabel(lbl)).join("");
  const memStr = card.members.map(mem => getMember(mem)).join("");
  const cardPaddingTop = lblStr ? "0":"10px"; // add padding-top 10px if there's no label
  return `
  <div class="trello-card d-block mb-2" style="padding-top: ${cardPaddingTop}" data-toggle="modal" data-target="#cardModal" onclick="cardClicked(event)" list-id="${list.id}" card-id="${card.id}">
    ${lblStr}
    <h6 class="trello-title">${card.title}</h6>
    <div class="d-flex flex-wrap justify-content-between align-items-end">
      <div class="d-flex flex-nowrap align-items-center">
      ${card.description ? '<small class="d-inline-block m-1 mr-2 text-secondary"><i class="fa fa-bars"></i></small>':''}
      ${card.checklists.length ? '<small class="d-inline-block m-1 mr-2 text-secondary"><i class="fa fa-check-square-o"></i></small>':''}
      </div>
      <div class="d-flex flex-wrap justify-content-end flex-grow-1 align-items-center">
        ${memStr}
      </div>
    </div>
    
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
  addListPopup = document.getElementById("add-list-popup");
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

const getListAndCardIds = (target) => {
  if(target.getAttribute("card-id")) {
    return [target.getAttribute("list-id"), target.getAttribute("card-id")];
  } else {
    return getListAndCardIds(target.parentElement);
  }
}

function cardClicked(e) {
  const [listId, cardId] = getListAndCardIds(e.target);

  const list = lists.find(l => l.id == listId);
  const card = list.cards.find(c => c.id == cardId);

  document.getElementById("cardTitle").innerHTML = card.title;
  document.getElementById("inListTitle").innerHTML = list.title;
  document.getElementById("cardDesc").innerHTML = card.description;

  const chkliStr = card.checklists.map(li => getChkliItem(li)).join("");
  document.getElementById("chkli-wrapper").innerHTML = chkliStr || '<p style="opacity: 0.7">No Checklist</p>';
}

function avatarClicked(event) {
  event.stopPropagation();
}

function addNewList() {
  if(addListPopup) {
    const addNewListBtn = document.getElementById("add-list-btn");
    const rect = addNewListBtn.getBoundingClientRect();
    console.log(rect);

    addListPopup.style.top = rect.top + "px";
    addListPopup.style.left = rect.left + "px";
    addListPopup.style.width = rect.width + "px";
    toggelAddListPopup(true);
  }
}

function wrapperScrolled() {
  if(addListPopup.style.display === "block") {
    const rect = document.getElementById("add-list-btn").getBoundingClientRect();
    addListPopup.style.top = rect.top + "px";
    addListPopup.style.left = rect.left + "px";
  }
}

function toggelAddListPopup(isOpen) {
  if(addListPopup) {
    addListPopup.style.display = isOpen ? "block":"none";
    if(isOpen) {
      document.getElementById("list-title-input").focus();
    }
  }
}

function inputEntered(event) {
  if(event.keyCode == 13){
    saveNewList();
  }
}

function saveNewList() {
  const listTitleInput = document.getElementById("list-title-input");
  const listTitle = listTitleInput.value;
  if(listTitle) {
    setLoading(true);
    fetch(END_POINT + "/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: listTitle,
        position: lists.length + 1
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setLoading(false);
      listTitleInput.value = "";
      toggelAddListPopup(false);
      // fetchData();
      const doc = new DOMParser().parseFromString(getList(data), "text/html");
      const newlyAddedList = doc.body.children[0];
      document.getElementById("add-list-btn").before(newlyAddedList);
      lists.push(data);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    })
  }
}