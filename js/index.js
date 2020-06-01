const END_POINT = "http://localhost:8080";
// const END_POINT = "https://trello-clone-ppm.herokuapp.com";

const addListBtn = `
  <button class="btn btn-lg add-list m-1 text-left mr-3">
    <i class="fa fa-plus"></i>&nbsp;&nbsp;&nbsp;Add another list
  </button>
  <div style="width: 0.5rem">&nbsp;</div>
`;

const getCard = (card) => {
  return `
  <div class="trello-card d-block mb-2">
    <span class="trello-label d-inline-block"></span>
    <h6 class="trello-title">${card.title}</h6>
  </div>
  `;
};

const getList = (list) => {
  const cardsStr = list.cards.map(c => getCard(c)).join("");
  return `
  <div class="trello-list rounded m-1 px-2 py-1 pb-2">
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
  fetch(END_POINT + "/list")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const listStr = data.map(l => getList(l)).join("") + addListBtn;
      document.getElementById("wrapper").innerHTML = listStr;
    })
    .catch(err => console.log(err));
}
