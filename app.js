import Sketch from "./module";
import gsap from "gsap";
import { BufferGeometryLoader } from "three";
import * as THREE from "three";
import { _renderComplexString } from "gsap/gsap-core";

let sketch = new Sketch({
  dom: document.getElementById("container"),
});

let attractMode = false;
let attractTo = 0;
let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById("block");
let wrap = document.getElementById("wrap");
let headlines = document.getElementById("headline");
let elems = [...document.querySelectorAll(".n")];

// let background = new THREE.background();
// background.color = "#ffffff";

window.addEventListener("wheel", (e) => {
  // console.log("e = ", e);
  speed += e.deltaY * 0.0003;
});

let objs = Array(5).fill({ dist: 0 });
console.log("objs = ", objs);

function raf() {
  // console.log("speed = ", speed);
  position += speed;
  speed *= 0.8;

  objs.forEach((o, i) => {
    o.dist = Math.min(Math.abs(position - i), 1);
    o.dist = 1 - o.dist ** 2;
    elems[i].style.transform = `scale(${1 + 0.3 * o.dist})`;

    let scale = 1 + 0.2 * o.dist;
    sketch.meshes[i].position.y = i * 1.2 - position * 1.2;
    sketch.meshes[i].scale.set(scale, scale, scale);

    sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;

    if (o.dist > 0.9) {
      // Background color change on image scroll
      if (i == 0) {
        sketch.renderer.setClearColor(0xffffff, 1);
      }
      if (i == 1) {
        sketch.renderer.setClearColor(0xff0000, 1);
      }
      if (i == 2) {
        sketch.renderer.setClearColor(0x00ff00, 1);
      }
      if (i == 3) {
        sketch.renderer.setClearColor(0x0000ff, 1);
      }
      if (i == 4) {
        sketch.renderer.setClearColor(0x000000, 1);
      }

      // Text Headlines Visible
      elems[i].style.color = "#ff0000";
      elems[i].style.transition = "0.5s";
      elems[i].style.opacity = 1;
    } else {
      // Text Headlines Hidden
      elems[i].style.color = "#000000";
      elems[i].style.opacity = 0;
      // sketch.renderer.setClearColor(0xffffff, 0.5);
    }
  });

  rounded = Math.round(position);

  let diff = rounded - position;

  if (attractMode) {
    position += -(position - attractTo) * 0.02;
  } else {
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.025;

    wrap.style.transform = `translate(0, ${-position * 100 + 50}px)`;
  }

  window.requestAnimationFrame(raf);
}

raf();

let navs = [...document.querySelectorAll("li")];
let nav = document.querySelector(".nav");

let rots = sketch.groups.map((e) => e.rotation);

nav.addEventListener("mouseenter", () => {
  attractMode = true;
  gsap.to(rots, {
    duration: 0.3,
    x: -0.5,
    y: 0,
    z: 0,
  });
});

nav.addEventListener("mouseleave", () => {
  attractMode = false;
  gsap.to(rots, {
    duration: 0.3,
    x: -0.2,
    y: -0.4,
    z: -0.2,
  });
  // group.rotation.y = -0.4;
  // group.rotation.x = -0.2;
  // group.rotation.z = -0.2;
});

navs.forEach((el) => {
  el.addEventListener("mouseover", (e) => {
    attractTo = Number(e.target.getAttribute("data-nav"));
    console.log(attractTo);
  });
});
