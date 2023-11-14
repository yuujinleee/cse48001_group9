import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import TWEEN from "@tweenjs/tween.js";

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

const positionMouse = [] as PositionMouse[]; // Array holding the 3d positions of annotations
// const annotation = document.querySelector(".annotation");

let raycaster: THREE.Raycaster,
  intersection: THREE.Intersection | null,
  sphere: THREE.Mesh;
const pointer = new THREE.Vector2();
const threshold = 0.01;

let hitpos: { x: number; y: number; z: number };
let annotationCounter = 0;

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
  camera.position.y = 2;
  camera.position.z = 5;
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
  controls.dampingFactor = 0.2;
  controls.enableZoom = true;
  controls.maxDistance = 6; // for Perspective camera, may need to adjust val after testing on diff models
  controls.minDistance = 2.5;

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
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("dblclick", addAnnotation);
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
  // Example from model viewer (https://modelviewer.dev/examples/annotations/index.html#cameraViews)
  // const modelViewer2 = document.querySelector("#hotspot-camera-view-demo");
  // const annotationClicked = (annotation) => {
  //   let dataset = annotation.dataset;
  //   modelViewer2.cameraTarget = dataset.target;
  //   modelViewer2.cameraOrbit = dataset.orbit;
  //   modelViewer2.fieldOfView = "45deg";
  // };

  // modelViewer2.querySelectorAll("button").forEach((hotspot) => {
  //   hotspot.addEventListener("click", () => annotationClicked(hotspot));
  // });

  let pos = annon.dataset.position?.split(" ");
  if (pos) {
    new TWEEN.Tween(controls.target)
      .to(
        {
          x: Number(pos[0]),
          y: Number(pos[1]),
          z: Number(pos[2]),
        },
        500
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start();
    // controls.target.set(Number(pos[0]), Number(pos[1]), Number(pos[2]));
    // camera.lookAt(new THREE.Vector3(pos[0], pos[1], pos[2]));
  }
}

function addAnnotation() {
  if (intersection !== null) {
    const annon = document.createElement("div");
    annon.slot = `annotation-${++annotationCounter}`;
    annon.classList.add("annotation");
    annon.id = `annotation-${annotationCounter}`;
    annon.appendChild(document.createTextNode("Hello Im new annotation"));
    annon.addEventListener("click", () => lookatAnnotation(annon));

    annon.dataset.position =
      hitpos.x.toString() +
      " " +
      hitpos.y.toString() +
      " " +
      hitpos.z.toString();

    positionMouse.push({ ...hitpos });

    // console.log(hitpos);
    // console.log(positionMouse);
    // if (normal != null) {
    //   annon.dataset.normal = normal.toString();
    // }
    document.body.appendChild(annon);
    // console.log("mouse = ", x, ", ", y, positionAndNormal);

    // const element = document.createElement("p");
    // element.appendChild(document.createTextNode("Hello Im new annotation"));
    // element.classList.add("annotation");
    // document
    //   .getElementById(`annotation-${annotationCounter}`)
    //   .appendChild(element);

    const number = document.createElement("div");
    number.appendChild(document.createTextNode(annotationCounter.toString()));
    number.classList.add("number");
    document
      .getElementById(`annotation-${annotationCounter}`)
      .appendChild(number);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
  TWEEN.update();
  // Annotation opacity and position
  updateAnnotationPosOpacity();

  // Raycast intersection (object mouse hit)
  raycaster.setFromCamera(pointer, camera);
  if (model) {
    const intersections = raycaster.intersectObject(model);
    intersection = intersections.length > 0 ? intersections[0] : null;
    if (intersection !== null) {
      sphere.position.copy(intersection.point);
      hitpos = intersection.point;
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

// Bucket name
const bucketName = "testBucket";

storageListBuckets();

storageListBucketFiles(bucketName);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
