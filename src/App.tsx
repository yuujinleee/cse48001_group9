import "./App.css";
import AnnotationPopup from "./components/AnnotationPopup";
// import AnnotationPanel from "./components/AnnotationPanel";
import Scene from "./components/Scene";

import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import { Fragment, Suspense, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  PerspectiveCamera,
  OrbitControls,
  CameraControls,
} from "@react-three/drei";
import ReactDOM from "react-dom";
import styled from "styled-components";

import edit_svg from "./assets/edit.svg";
import delete_svg from "./assets/trash-can.svg";

function App() {
  const [annonCount, setAnnonCount] = useState(1);

  let clickedAnnon: HTMLDivElement, clickedAnnonContent: HTMLDivElement;

  // function init() {

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

  // function animate() {
  //   requestAnimationFrame(animate);
  //   TWEEN.update();
  //   controls.update();
  //   render();
  // }

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

  const spherePos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  function moveSphereCursor(e: PointerEvent) {
    const intersection = e.intersections.length > 0 ? e.intersections[0] : null;
    if (intersection) {
      spherePos.current = intersection.point;
    }
  }

  function Annotations() {
    const annonContentRef = useRef<HTMLDivElement | null>(null);

    const [clicked, setClicked] = useState(false);
    const [cssAnnonID, setCssAnnonID] = useState<number>();
    function toggleAnnotationVisibility(annotationID: number) {
      // If exists, set last clicked annotation 'not visible'
      setCssAnnonID(annotationID);

      setClicked(!clicked);
      // clickedAnnon = annon;
      // clickedAnnonContent = annonContentRef;
      // console.log(annonContentRef);
      // annonContentRef.style.display = "grid";
    }

    return annotationList.map((annon, index) => (
      <Fragment key={index}>
        <div
          className="annotation"
          id={`annotation-${annon.id}`}
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
          data-contentvisible="hidden"
          onClick={() => toggleAnnotationVisibility(annon.id)}>
          <div
            className="number"
            style={{
              background: annon.status == "Not Solved" ? "#ff0030" : "#ffa800",
            }}>
            {annon.id}
          </div>
          <div
            className="annon_content"
            style={{
              display: !clicked && cssAnnonID === annon.id ? "grid" : "none",
              textAlign: "left",
              background: annon.status == "Not Solved" ? "#ffd4df" : "#ffe9bd",
            }}
            ref={annonContentRef}>
            <div style={{ display: "block" }}>
              <div style={{ float: "left" }}>{annon.status}</div>
              <button className="annon_button" style={{ float: "right" }}>
                <img src={delete_svg} />
              </button>
              <button className="annon_button" style={{ float: "right" }}>
                <img src={edit_svg} />
              </button>
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

  const cameraControlRef = useRef<CameraControls | null>(null);
  // cameraControlRef.current?.setPosition(0, 2, 5);

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
        <div
          id={`annotationpanel-${annon.id}`}
          className="annonpanel_item"
          style={{
            background: annon.status == "Not Solved" ? "#ffd4df" : "#ffe9bd",
            color: "#000000",
          }}>
          <div style={{ display: "grid" }}>
            <div style={{ display: "block" }}>
              <div style={{ float: "left" }}>
                #{annon.id} · {annon.status}
              </div>
              <button className="annon_button" style={{ float: "right" }}>
                <img src={delete_svg} />
              </button>
              <button className="annon_button" style={{ float: "right" }}>
                <img src={edit_svg} />
              </button>
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
      <button className="btn_resetview">Reset view</button>
      <div id="r">
        <div>Annotation Panel</div>
        <AnnotationPanel />
      </div>
      <div className="hello">
        <Annotations />
      </div>
      <Wrapper className="App">
        <Canvas
          className="canvas"
          ref={canvasRef}
          camera={{ position: camInitialPos }}>
          <Suspense fallback={null}>
            {/* <CameraControls ref={cameraControlRef} /> */}
            <Scene />
            <OrbitControls
              makeDefault
              enableDamping={true}
              dampingFactor={0.6}
              enableZoom={true}
              maxDistance={6}
              minDistance={3}
              target={[0, 0, 0]}
            />
            {/* <PerspectiveCamera
              makeDefault
              // position={camInitialPos}
              fov={45}
              aspect={window.innerWidth / window.innerHeight}
              near={1}
              far={10000}
            /> */}
            <primitive
              object={scene}
              onDoubleClick={(e: PointerEvent) => addAnnotation(e)}
              onPointerMove={(e: PointerEvent) => moveSphereCursor(e)}
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
