import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//-------------- Code for 3D rendering --------------//
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const color1 = new THREE.Color();
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.background = color1;
scene.add( light );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
new OrbitControls( camera, renderer.domElement );

// Load own model
export function LoadModel(modelPath: string) {

  
  const loader = new GLTFLoader();

  loader.load( modelPath, function ( gltf ) {

  const model = gltf.scene;
	scene.add( model );
  
}, undefined, function ( error ) {

	console.error( error );

} );
}

const modelPath = 'src/assets/13_Can.gltf'
LoadModel(modelPath);

// Reposition camera
camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();


//-------------- Code for Database connection --------------//
import { storageListBuckets, storageListBucketFiles, storageRetrieveBucket } from './database/storageFunctions.tsx'

// Bucket name
export const bucketName = 'modelBucket'

await storageListBuckets()
await storageRetrieveBucket(bucketName)
await storageListBucketFiles(bucketName)

import { uploadButton } from './components/uploadButton.tsx'
uploadButton

import { emptyBucketButton } from './components/emptyBucketButton.tsx'
emptyBucketButton

import { changeModelButton } from './components/changeModelButton.tsx'
changeModelButton

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)