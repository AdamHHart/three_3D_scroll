import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "/shader/fragment.glsl";
import vertex from "/shader/vertex.glsl";
// import * as dat from "dat.gui";
import gsap from "gsap";
let whatIsThis = null;

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    whatIsThis = this;

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
    this.materials = [];
    this.meshes = [];
    this.groups = [];
    this.handleImages();
  }

  handleImages() {
    let images = [...document.querySelectorAll("img")];
    console.log("images = ", images);

    images.forEach((im, i) => {
      let mat = this.material.clone();
      this.materials.push(mat);
      let group = new THREE.Group();
      // mat.wireframe = true;
      mat.uniforms.texture1.value = new THREE.Texture(im);
      mat.uniforms.texture1.value.needsUpdate = true;

      let geo = new THREE.PlaneBufferGeometry(1.5, 1, 20, 20);
      let mesh = new THREE.Mesh(geo, mat);

      group.add(mesh);
      this.groups.push(group);

      this.scene.add(group);
      this.meshes.push(mesh);

      mesh.position.y = i * 1.2;
      mesh.position.x = 0.6;
      // mesh.position.z = 0.1;

      group.rotation.y = -0.4;
      group.rotation.x = -0.2;
      group.rotation.z = -0.2;
    });
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        distanceFromCenter: { type: "f", value: 0 },
        texture1: { type: "t", value: null },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    // this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    // this.plane = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    if (this.materials) {
      this.materials.forEach((m) => {
        m.uniforms.time.value = this.time;
      });
    }

    let speed = 0;
    let position = 0;
    let elems = [...document.querySelectorAll(".n")];

    window.addEventListener("wheel", (e) => {
      speed += e.deltaY * 0.0003;
    });

    let images = Array(5).fill({ dist: 0 });

    function colorChangeOnScroll() {
      position += speed;
      speed *= 0.8;

      images.forEach((o, i) => {
        o.dist = Math.min(Math.abs(position - i), 1);
        o.dist = 1 - o.dist ** 2;

        // console.log("o.dist = = ", o.dist);
        // for (let j = 0; j < images.length; j++) {
        if (o.dist > 0.9) {
          // console.log("i ======= ", i);
          if (i === 2) {
            console.log("i = ", i);
            // console.log("in loop elems[i] =  ", elems[i]);
            // console.log("in the loop");
            // whatIsThis.renderer.needsUpdate;
            whatIsThis.renderer.setClearColor(0x00ff00, 1);
          }
          // else if (i === 4) {
          //   // whatIsThis.renderer.needsUpdate;
          //   whatIsThis.renderer.setClearColor(0x000000, 1);
          //   // setClearColor(0x000000, 1);
          // }
          // else if (i === 1) {
          //   //   console.log("i = ", i);
          //   //   // console.log("in the loop");
          //   //   // console.log("i = ", i);
          //   whatIsThis.render.needsUpdate;
          //   whatIsThis.renderer.setClearColor(0x0000ff, 1);
          // } else if (i === 3) {
          //   console.log("i = ", i);
          //   // console.log("in the loop");
          //   // console.log("i = ", i);
          //   whatIsThis.render.needsUpdate;
          //   whatIsThis.renderer.setClearColor(0xff0000, 1);
          // }
          // }
          // console.log("in loop i =  ", i);
        }
        // }
      });
      window.requestAnimationFrame(colorChangeOnScroll);
    }

    setInterval(colorChangeOnScroll(), 500);

    // this.renderer.setClearColor(0xff0000, 1);

    // console.log(images);
    // if (images[1].style) {
    //   // console.log("images = ", images);
    //   this.renderer.setClearColor(0x0000ff, 1);
    // }

    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));

    this.renderer.render(this.scene, this.camera);
  }
}

// new Sketch({
//   dom: document.getElementById("container"),
// });
