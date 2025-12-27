let loading = document.getElementById("loading");

function getRandomColor() {
  let R = Math.ceil(Math.random() * 255);
  let G = Math.ceil(Math.random() * 255);
  let B = Math.ceil(Math.random() * 255);

  document.body.style.backgroundColor = `RGB(${R}, ${G}, ${B})`;
  loading.innerHTML = `R:${R}, G:${G}, B:${B}`;
}

setInterval(() => {
  getRandomColor();
}, 2000);

// let button = document.getElementById("color");
//   color.innerHTML = `RGB(${R}, ${G}, ${B})`;
// button.addEventListener("click", () => {
//     getRandomColor();
// });
