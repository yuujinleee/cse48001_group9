import "./App.css";
import AnnotationPopup from "./components/AnnotationPopup";
// import AnnotationPanel from "./components/AnnotationPanel";
import Scene from "./components/Scene";

import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import { Fragment, Suspense, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import styled from "styled-components";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import ReactDOM from "react-dom";

function App() {
  type Position3D = {
    x: number;
    y: number;
    z: number;
  };

  // const positionMouse = [] as Position3D[]; // Array holding the 3d positions of annotations

  let sphere: THREE.Mesh;

  // let annotationCounter = 0;
  // let clickedAnnon: HTMLDivElement, clickedAnnonContent: HTMLDivElement;

  const [annonCount, setAnnonCount] = useState(1);
  // let annonCount = 0;
  // init();
  // animate();

  // function init() {
  //   // Raycaster
  //   let raycaster = new THREE.Raycaster();
  //   raycaster.params.Points.threshold = 0.01;
  //   sphere = new THREE.Mesh(
  //     new THREE.SphereGeometry(0.03, 16, 16),
  //     new THREE.MeshBasicMaterial({
  //       color: 0xff0000,
  //     })
  //   );
  //   scene.add(sphere);

  // window.addEventListener("resize", onWindowResize, false);
  // document.addEventListener("pointermove", onPointerMove);
  // document.addEventListener("dblclick", addAnnotation);
  // // document.addEventListener("keydown", lookatScene);
  // document.addEventListener("click", function handleClickOutsideAnnon(event) {
  //   // Clicked sth other than lastly clicked annotation
  //   if (clickedAnnon && !clickedAnnon.contains(event.target)) {
  //     clickedAnnonContent.style.display = "none";
  //   }
  //   // Call lookatScene() function to reset view as initial when clicked sth other than annotation
  //   const c1 = event.target?.parentNode.getAttribute("class");
  //   const c2 = event.target?.parentNode.parentNode.getAttribute("class");

  //   if (
  //     !(
  //       c1 == "annon_content" ||
  //       c1 == "annotation" ||
  //       c2 == "annon_content" ||
  //       c2 == "annotation"
  //     )
  //   ) {
  //     lookatScene();
  //   }
  // });
  // }

  // function toggleAnnotationVisibility(
  //   annon: HTMLDivElement,
  //   annon_content: HTMLDivElement
  // ) {
  //   // If exists, set last clicked annotation 'not visible'
  //   if (clickedAnnon) {
  //     clickedAnnonContent.style.display = "none";
  //   }

  //   clickedAnnon = annon;
  //   clickedAnnonContent = annon_content;
  //   annon_content.style.display = "grid";
  // }

  // function lookatAnnotation(annon: HTMLDivElement) {
  //   // Adjust camera view to create zoom effect on annotation
  //   // Tween Animation - Camera(Controls) Target
  //   const pos = annon.dataset.position?.split(" ");
  //   if (pos) {
  //     new TWEEN.Tween(controls.target)
  //       .to(
  //         {
  //           x: Number(pos[0]),
  //           y: Number(pos[1]),
  //           z: Number(pos[2]),
  //         },
  //         1000
  //       )
  //       .easing(TWEEN.Easing.Cubic.Out)
  //       .start();

  //     // Tween Animation - Camera position
  //     const oldPos = camera.position.clone();
  //     const newPos = new THREE.Vector3(
  //       Number(pos[0]) * 2,
  //       Number(pos[1]) * 2,
  //       Number(pos[2]) * 2
  //     );
  //     new TWEEN.Tween(oldPos)
  //       .to(newPos, 1000)
  //       .easing(TWEEN.Easing.Cubic.Out)
  //       .onUpdate(function () {
  //         camera.position.copy(oldPos);
  //       })
  //       .onComplete(function () {
  //         camera.position.copy(oldPos);
  //       })
  //       .start();
  //   }
  // }

  // function lookatScene() {
  //   // Resets camera and controls as initial view
  //   // Tween Animation - Camera(Controls) Target
  //   new TWEEN.Tween(controls.target)
  //     .to(
  //       {
  //         x: 0,
  //         y: 0,
  //         z: 0,
  //       },
  //       1000
  //     )
  //     .easing(TWEEN.Easing.Cubic.Out)
  //     .start();

  //   // Tween Animation - Camera position
  //   const oldPos = camera.position.clone();

  //   new TWEEN.Tween(oldPos)
  //     .to(camInitialPos, 1000)
  //     .easing(TWEEN.Easing.Cubic.Out)
  //     .onUpdate(function () {
  //       camera.position.copy(oldPos);
  //     })
  //     .onComplete(function () {
  //       camera.position.copy(oldPos);
  //     })
  //     .start();
  // }

  const [hovered, setHovered] = useState(false);

  type Annotation = {
    id: number;
    username: string;
    content: string;
    created?: string;
    status: "Not Solved" | "In Progress" | "Solved";
    position: { x: number; y: number; z: number };
    normal?: {
      x: number | undefined;
      y: number | undefined;
      z: number | undefined;
    };
  };

  const [annotationList, setAnnotationList] = useState<Annotation[]>([]);

  function addAnnotation(e: PointerEvent) {
    const intersection = e.intersections.length > 0 ? e.intersections[0] : null;
    if (intersection) {
      // console.log("DBL CLICKED !", annonCount);
      const newAnnon: Annotation = {
        id: annonCount,
        username: "John Doe",
        content: "Sample Text",
        created: "Timestamp",
        status: "Not Solved",
        position: {
          x: intersection.point.x,
          y: intersection.point.y,
          z: intersection.point.z,
        },
        normal: {
          x: intersection.normal?.normalize().x,
          y: intersection.normal?.normalize().y,
          z: intersection.normal?.normalize().z,
        },
      };
      setAnnotationList([...annotationList, newAnnon]);
      setAnnonCount(annonCount + 1);
    }
  }

  // let SpherePos = new THREE.Vector3(0, 0, 0);
  const [spherePos, setSpherePos] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  );

  function moveSphereCursor(e: PointerEvent) {
    const intersection = e.intersections.length > 0 ? e.intersections[0] : null;
    if (intersection) {
      // SpherePos = intersection.point;
      // console.log(SpherePos);
      setSpherePos(intersection.point);
    }
  }

  // function animate() {
  //   requestAnimationFrame(animate);
  //   TWEEN.update();
  //   controls.update();
  //   render();
  // }

  // function render() {
  //   renderer.render(scene, camera);
  // updateAnnotationPosOpacity();
  //   // Raycast intersection (object mouse hit)
  //   raycaster.setFromCamera(pointer, camera);
  //   if (model) {
  //     const intersections = raycaster.intersectObject(model);
  //     intersection = intersections.length > 0 ? intersections[0] : null;
  //     if (intersection !== null) {
  //       sphere.position.copy(intersection.point);
  //       hitpos = intersection.point;
  //       hitnormal = intersection.normal?.normalize();
  //     }
  //   }
  // }

  function Annotations() {
    return annotationList.map((annon, index) => (
      <Fragment key={index}>
        <div
          className="annotation"
          id={`annotation-${annon.id}`}
          // slot={`annotation-${annotationCounter}`
          data-position={
            annon.position.x.toString() +
            " " +
            annon.position.y.toString() +
            " " +
            annon.position.z.toString()
          }
          data-normal={
            annon.normal?.x?.toString() +
            " " +
            annon.normal?.y?.toString() +
            " " +
            annon.normal?.z?.toString()
          }
          data-contentvisible="hidden">
          <div className="number">{annon.id}</div>
          <div
            className="annon_content"
            // style={{ display: "none" }}
          >
            <div style={{ display: "flex" }}>
              <div style={{ float: "left" }}>{annon.status}</div>
              <button style={{ float: "right" }}>Delete</button>
              <button style={{ float: "right" }}>Edit</button>
            </div>
            <div style={{ fontWeight: "600", textAlign: "left" }}>
              {annon.username}
            </div>
            {annon.content}
          </div>
        </div>
      </Fragment>
    ));
  }

  const camInitialPos = new THREE.Vector3(0, 2, 5);

  const UpdateAnnotationPos = () => {
    const { camera } = useThree();

    useFrame(() => {
      annotationList.map((annon, index) => {
        const vector = new THREE.Vector3(
          annon.position.x,
          annon.position.y,
          annon.position.z
        );
        const targetdiv = document.querySelector(`#annotation-${index + 1}`);

        vector.project(camera);

        const isBehind =
          camera.position.distanceTo(vector) >
          camera.position.distanceTo(scene.position);

        // // const rect = renderer.domElement.getBoundingClientRect();
        // const rect = canvasRef.current.getBoundingClientRect();
        const element = ReactDOM.findDOMNode(canvasRef.current);
        const rect = element?.getBoundingClientRect();

        vector.x =
          Math.round(((vector.x + 1) * (rect.right - rect.left)) / 2) +
          rect.left;
        vector.y = Math.round(
          ((1 - vector.y) * (rect.bottom - rect.top)) / 2 + rect.top
        );

        if (targetdiv) {
          targetdiv.style.top = `${vector.y}px`;
          targetdiv.style.left = `${vector.x}px`;
          targetdiv.style.opacity = isBehind ? 0.25 : 1;
        }
      });
    });

    return <></>;
  };

  function AnnotationPanel() {
    return annotationList.map((annon, index) => (
      <Fragment key={index}>
        <div id={`annotationpanel-${annon.id}`}>
          <div className="number">{annon.id}</div>
          <div className="annon_content">
            <div style={{ display: "flex" }}>
              <div style={{ float: "left" }}>{annon.status}</div>
              <button style={{ float: "right" }}>Delete</button>
              <button style={{ float: "right" }}>Edit</button>
            </div>
            <div style={{ fontWeight: "600", textAlign: "left" }}>
              {annon.username}
            </div>
            {annon.content}
          </div>
        </div>
      </Fragment>
    ));
  }

  const canvasRef = useRef(null!);
  const { scene } = useGLTF("src/assets/13_Can.gltf");

  return (
    <>
      {/* <AnnotationPopup /> */}
      <div id="r">
        <div>Annotation Panel</div>
        <AnnotationPanel />
      </div>
      <div className="hello">
        <Annotations />
      </div>
      <Wrapper className="App">
        <Canvas className="canvas" ref={canvasRef}>
          <Suspense fallback={null}>
            <Scene />
            <PerspectiveCamera
              makeDefault
              position={camInitialPos}
              fov={45}
              aspect={window.innerWidth / window.innerHeight}
              near={1}
              far={10000}
            />
            <primitive
              object={scene}
              onDoubleClick={(e) => addAnnotation(e)}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onPointerMove={(e) => moveSphereCursor(e)}
            />
            <mesh visible position={spherePos}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color="red" transparent />
            </mesh>
            <UpdateAnnotationPos />
          </Suspense>
        </Canvas>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  position: relative;
  background: #0e1217;

  canvas {
    height: 100vh;
  }
  hero {
    position: absolute;
  }
`;

export default App;
