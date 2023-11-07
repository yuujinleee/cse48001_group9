import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

let scene, camera, renderer, controls;

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
    const model = gltf.scene;
    scene.add( model );
  }, undefined, function ( error ) {
    console.error( error );
  } );



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
    // console.log(camera.position)
    render();
}

function render() {
    renderer.render(scene, camera);
    // updateAnnotationOpacity();
    // updateScreenPosition();
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