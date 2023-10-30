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

// Load own model
const loader = new GLTFLoader();

loader.load( 'src/assets/13_Can.gltf', function ( gltf ) {

  const canModel = gltf.scene;
	scene.add( canModel );
  new OrbitControls( camera, renderer.domElement );
 
}, undefined, function ( error ) {

	console.error( error );

} );

// Reposition camera
camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();


//-------------- Code for Database connection --------------//
import { createClient } from '@supabase/supabase-js'
import { Database } from './database/database.types.ts'

// URL and KEY
const SUPABASE_URL = 'https://sssfwtibjhdthffelfip.supabase.co'
const SUPABASE_ANON_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc2Z3dGliamhkdGhmZmVsZmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1OTIyOTUsImV4cCI6MjAxNDE2ODI5NX0.anAxyqjmgv6qIo-tiFSRvrOrona2OWCTpyNpwbDuu8M'

// Connect to database
const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)


// Fetch data
const { data } = await supabase
.from('countries')
.select('name')

console.log(data)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)