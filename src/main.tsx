import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
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
let sprite: THREE.Sprite, spriteBehindObject: boolean;

const positionMouse = [] as PositionMouse[];

const annotation = document.querySelector(".annotation");

let raycaster: THREE.Raycaster,
  intersection: THREE.Intersection,
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

  // Raycaster
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = threshold;
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(sphere);

  //-------------- Geometries --------------//
  // Load 3d model
  new GLTFLoader().load(
    "src/assets/13_Can.gltf",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  // Annotation - Sprite
  const numberTexture = new THREE.CanvasTexture(
    document.querySelector("#number")
  );

  const spriteMaterial = new THREE.SpriteMaterial({
    map: numberTexture,
    alphaTest: 0.5,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(0, 0, 0);
  sprite.scale.set(60, 60, 1);
  scene.add(sprite);

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

function addAnnotation(event: MouseEvent) {
  if (intersection !== null) {
    const newAnnotation = document.createElement("div");
    newAnnotation.slot = `annotation-${annotationCounter++}`;
    newAnnotation.classList.add("annotation");
    newAnnotation.id = `annotation-${annotationCounter}`;
    positionMouse.push({ ...hitpos });
    console.log(positionMouse);
    // if (normal != null) {
    //   newAnnotation.dataset.normal = normal.toString();
    // }
    document.body.appendChild(newAnnotation);
    // console.log("mouse = ", x, ", ", y, positionAndNormal);

    const element = document.createElement("p");
    element.classList.add("annotation");
    element.appendChild(document.createTextNode("Hello Im new annotation"));
    document
      .getElementById(`annotation-${annotationCounter}`)
      .appendChild(element);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);

  // Annotation opacity and position
  updateAnnotationOpacity();
  updateAnnotationPosition();

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

function updateAnnotationOpacity() {
  if (model) {
    const meshDistance = camera.position.distanceTo(model?.position);
    const spriteDistance = camera.position.distanceTo(sprite.position);
    spriteBehindObject = spriteDistance > meshDistance;
    sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
    sprite.material.opacity = 0;
  }
}

function updateAnnotationPosition() {
  // const arr: number[] = [0.1, 0.2, 0.3, 0.4, 0.5];
  // arr.map((el: number) => {
  const canvas = renderer.domElement;

  positionMouse.map((element: PositionMouse, index: number) => {
    const vector = new THREE.Vector3(element.x, element.y, element.z); // Position of Annotation
    const annon = document.querySelector(`#annotation-${index + 1}`);
    // Adjust the position of annotation(3D) into 2D place
    vector.project(camera);
    vector.x = Math.round(
      (0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio)
    );
    vector.y = Math.round(
      (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio)
    );

    if (annon) {
      annon.style.top = `${vector.y}px`;
      annon.style.left = `${vector.x}px`;
      annon.style.opacity = spriteBehindObject ? 0.25 : 1;
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
