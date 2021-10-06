let speed = 0;
let position = 0;
let block = document.getElementById("block");

window.addEventListener("wheel", (e) => {
  console.log("e = ", e);
  speed += e.deltaY * 0.0002;
});

function raf() {
  console.log("speed = ", speed);
  position += speed;
  speed *= 0.8;
  block.style.transform = `translate(0, ${position * 100}px)`;
  window.requestAnimationFrame(raf);
}

raf();
