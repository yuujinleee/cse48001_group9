import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import TWEEN from "@tweenjs/tween.js";

// import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";

type PositionMouse = {
  x: number;
  y: number;
  z: number;
};
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  model: THREE.Group<THREE.Object3DEventMap>;

// let helper: THREE.LineSegments;

const positionMouse = [] as PositionMouse[]; // Array holding the 3d positions of annotations
// const annotation = document.querySelector(".annotation");

let raycaster: THREE.Raycaster,
  intersection: THREE.Intersection | null,
  sphere: THREE.Mesh;
const pointer = new THREE.Vector2();
const threshold = 0.01;

let hitpos: { x: number; y: number; z: number };
let hitnormal: { x: number; y: number; z: number } | undefined;
let annotationCounter = 0;

const camInitialPos = new THREE.Vector3(0, 2, 5);

init();
animate();

function init() {
  //-------------- Code for 3D rendering --------------//
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color();

  new THREE.TextureLoader().load("src/assets/bg_grid.png", function (texture) {
    scene.background = texture; // scene background(grid)
  });

  new RGBELoader().load("src/assets/winter_lake_01_1k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // use hdr as scene light source
  });

  // Camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.copy(camInitialPos);
  camera.lookAt(scene.position);
  camera.updateMatrix();

  // Lights
  const amblight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(amblight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(1, 0, 1).normalize();
  scene.add(dirLight);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.autoClear = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.6;
  controls.enableZoom = true;
  controls.maxDistance = 6; // for Perspective camera, may need to adjust val after testing on diff models
  controls.minDistance = 3;

  // Raycaster
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = threshold;
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })
  );
  scene.add(sphere);

  //-------------- Geometries --------------//
  // Load 3d model
  new GLTFLoader().load(
    "src/assets/13_Can.gltf",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);
      // console.log("model:", model);
      // helper = new VertexNormalsHelper(model.children[0], 200, 0xff0000);
      // scene.add(helper);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("dblclick", addAnnotation);
  document.addEventListener("keydown", lookatScene);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event: PointerEvent) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
}

function lookatAnnotation(annon: HTMLDivElement) {
  // Adjust camera view to create zoom effect on annotation
  // Tween Animation - Camera(Controls) Target
  const pos = annon.dataset.position?.split(" ");
  if (pos) {
    new TWEEN.Tween(controls.target)
      .to(
        {
          x: Number(pos[0]),
          y: Number(pos[1]),
          z: Number(pos[2]),
        },
        1000
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    // Tween Animation - Camera position
    const oldPos = camera.position.clone();
    const newPos = new THREE.Vector3(
      Number(pos[0]) * 2,
      Number(pos[1]) * 2,
      Number(pos[2]) * 2
    );
    new TWEEN.Tween(oldPos)
      .to(newPos, 1000)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(function () {
        camera.position.copy(oldPos);
      })
      .onComplete(function () {
        camera.position.copy(oldPos);
      })
      .start();
  }
}

function lookatScene() {
  // Resets camera and controls as initial view
  // Tween Animation - Camera(Controls) Target
  new TWEEN.Tween(controls.target)
    .to(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      1000
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start();

  // Tween Animation - Camera position
  const oldPos = camera.position.clone();

  new TWEEN.Tween(oldPos)
    .to(camInitialPos, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(function () {
      camera.position.copy(oldPos);
    })
    .onComplete(function () {
      camera.position.copy(oldPos);
    })
    .start();
}

function addAnnotation() {
  if (intersection !== null) {
    const annon = document.createElement("div");
    annon.slot = `annotation-${++annotationCounter}`;
    annon.classList.add("annotation");
    annon.id = `annotation-${annotationCounter}`;
    annon.addEventListener("click", () => lookatAnnotation(annon));

    annon.dataset.position =
      hitpos.x.toString() +
      " " +
      hitpos.y.toString() +
      " " +
      hitpos.z.toString();

    positionMouse.push({ ...hitpos });

    if (hitnormal) {
      annon.dataset.normal =
        hitnormal.x.toString() +
        " " +
        hitnormal.y.toString() +
        " " +
        hitnormal.z.toString();
    }

    // <div slot="annotation-1" class="annotation" id="annotation-1" data-position="0 0 0" data-normal="0 0 0"
    //  data-contentvisible="hidden" style="top: 439px; left: 776.977px; opacity: 1;">
    //    <div class="number"></div>
    //    <div annon_content></div>
    // </div>

    const div1 = document.createElement("div");
    div1.style.setProperty("display", "grid", "");
    div1.classList.add("annon_content");

    const div2 = document.createElement("div");

    const status = document.createElement("div");
    status.appendChild(document.createTextNode("Not Solved"));
    status.style.setProperty("float", "left", "");
    div2.appendChild(status);

    const btn_edit = document.createElement("button");
    btn_edit.appendChild(document.createTextNode("EDIT"));
    btn_edit.style.setProperty("float", "right", "");
    div2.appendChild(btn_edit);

    const btn_delete = document.createElement("button");
    btn_delete.appendChild(document.createTextNode("DEL"));
    btn_delete.style.setProperty("float", "right", "");
    div2.appendChild(btn_delete);

    div1.appendChild(div2);

    const username = document.createElement("div");
    username.appendChild(document.createTextNode("Yujin Lee"));
    username.style.setProperty("font-weight", "bold", "");
    div1.appendChild(username);

    const number = document.createElement("div");
    number.appendChild(document.createTextNode(annotationCounter.toString()));
    number.classList.add("number");

    div1.appendChild(document.createTextNode("Hello Im new annotation"));

    annon.appendChild(number);
    annon.appendChild(div1);
    document.body.appendChild(annon);
  }
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();

  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);

  updateAnnotationPosOpacity();

  // Raycast intersection (object mouse hit)
  raycaster.setFromCamera(pointer, camera);
  if (model) {
    const intersections = raycaster.intersectObject(model);
    intersection = intersections.length > 0 ? intersections[0] : null;
    if (intersection !== null) {
      sphere.position.copy(intersection.point);
      hitpos = intersection.point;
      hitnormal = intersection.normal?.normalize();
    }
  }
}

function updateAnnotationPosOpacity() {
  // Adjust the position of annotation(3D) into 2D place
  positionMouse.map((element: PositionMouse, index: number) => {
    const vector = new THREE.Vector3(element.x, element.y, element.z); // Position of Annotation
    const annon = document.querySelector(`#annotation-${index + 1}`);

    vector.project(camera);

    // boolean to decide the opacity of annon
    const isBehind =
      camera.position.distanceTo(vector) >
      camera.position.distanceTo(model?.position);

    const rect = renderer.domElement.getBoundingClientRect();
    vector.x =
      Math.round(((vector.x + 1) * (rect.right - rect.left)) / 2) + rect.left;
    vector.y = Math.round(
      ((1 - vector.y) * (rect.bottom - rect.top)) / 2 + rect.top
    );

    if (annon) {
      annon.style.top = `${vector.y}px`;
      annon.style.left = `${vector.x}px`;
      annon.style.opacity = isBehind ? 0.25 : 1;
    }
  });
  // });
}

//-------------- Code for Database connection --------------//
import {
  storageListBuckets,
  storageListBucketFiles,
} from "./database/storageFunctions.tsx";
import { element } from "three/examples/jsm/nodes/Nodes.js";
import { Tween } from "three/examples/jsm/libs/tween.module.js";

// Bucket name
const bucketName = "testBucket";

storageListBuckets();

storageListBucketFiles(bucketName);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
