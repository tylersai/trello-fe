window.onload = () => {
  console.log("DOM is ready!");
  limitWrapperHeight();
};

function limitWrapperHeight() {
  const body = document.documentElement.clientHeight;
  const nav1 = document.getElementById("first-nav").clientHeight;
  const nav2 = document.getElementById("second-nav").clientHeight;
  const wrapper = document.getElementById("wrapper");
  wrapper.style.maxHeight = (body - nav1 - nav2) + "px";
}