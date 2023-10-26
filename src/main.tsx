import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const color1 = new THREE.Color();
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.background = color1;
scene.add( light );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Cube model
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

// Load own model
const loader = new GLTFLoader();

loader.load( 'src/assets/13_Can.gltf', function ( gltf ) {

  const canModel = gltf.scene;
	scene.add( canModel );

  function animate() {
    requestAnimationFrame( animate );
    canModel.rotation.y += 0.01
    renderer.render( scene, camera );
  }
  animate();
 
}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render( scene, camera );
}
animate();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)