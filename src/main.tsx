import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

let scene, camera, renderer, controls, model;
let sprite, spriteBehindObject;
const annotation = document.querySelector(".annotation");

init();
animate();

function init() {
  //-------------- Code for 3D rendering --------------//
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color();

  new THREE.TextureLoader().load('src/assets/bg_grid.png' , function(texture){
    scene.background = texture; // scene background(grid)
  });

  new RGBELoader().load("src/assets/winter_lake_01_1k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // use hdr as scene light source
  });  

  // Camera
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 2;
  camera.position.z = 5;

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
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.enableZoom = true;



  //-------------- Geometries --------------//
  // Load 3d model
  new GLTFLoader().load( 'src/assets/13_Can.gltf', function ( gltf ) {
    model = gltf.scene;
    scene.add( model );
  }, undefined, function ( error ) {
    console.error( error );
  } );

  // Sprite
    const numberTexture = new THREE.CanvasTexture(
        document.querySelector("#number")
    );

    const spriteMaterial = new THREE.SpriteMaterial({
        map: numberTexture,
        alphaTest: 0.5,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });

    sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(1, 1, 1);
    sprite.scale.set(60, 60, 1);

    scene.add(sprite);

    console.log(model)

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
    updateAnnotationOpacity();
    updateScreenPosition();
}

function updateAnnotationOpacity() {
    const meshDistance = camera.position.distanceTo(model.position);
    const spriteDistance = camera.position.distanceTo(sprite.position);
    spriteBehindObject = spriteDistance > meshDistance;
    sprite.material.opacity = spriteBehindObject ? 0.25 : 1;

    // Do you want a number that changes size according to its position?
    // Comment out the following line and the `::before` pseudo-element.
    sprite.material.opacity = 0;
}

function updateScreenPosition() {
    const vector = new THREE.Vector3(0.2,0.85,0.2);
    const canvas = renderer.domElement;

    vector.project(camera);

    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    if (annotation){
      annotation.style.top = `${vector.y}px`;
      annotation.style.left = `${vector.x}px`;
      annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
    }
}


//-------------- Code for Database connection --------------//
import { storageListBuckets, storageListBucketFiles } from './database/storageFunctions.tsx'

// Bucket name
const bucketName = 'testBucket'

storageListBuckets()

storageListBucketFiles(bucketName)


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)