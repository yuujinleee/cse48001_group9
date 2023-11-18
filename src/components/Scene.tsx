import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import {
  PerspectiveCamera,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { useEffect } from "react";

function Scene() {
  const { scene } = useThree();
  const bgTexture = useLoader(TextureLoader, "src/assets/bg_grid.png");
  // bgTexture.encoding = THREE.sRGBEncoding;
  scene.background = bgTexture;

  // camera = new THREE.PerspectiveCamera(
  //     45,
  //     window.innerWidth / window.innerHeight,
  //     1,
  //     10000
  //   );
  //   camera.lookAt(scene.position);
  //   camera.updateMatrix();

  // const camInitialPos = new THREE.Vector3(0, 2, 5);
  const camInitialPos = [0, 2, 5];

  const { setSize } = useThree();

  useEffect(() => {
    // Canvas
    const onResizeHandler = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setSize(width, height);
    };

    window.addEventListener("resize", onResizeHandler);

    return () => {
      window.removeEventListener("resize", onResizeHandler);
    };
  }, [setSize]);

  return (
    <>
      <Environment files="src/assets/winter_lake_01_1k.hdr" background />
      <PerspectiveCamera
        makeDefault
        position={camInitialPos}
        fov={45}
        aspect={window.innerWidth / window.innerHeight}
        near={1}
        far={10000}
      />
      <ambientLight color={0xffffff} intensity={0.3} />
      <directionalLight position={[1, 0, 1]} color={0xffffff} intensity={0.5} />
      <OrbitControls
        makeDefault
        enableDamping={true}
        dampingFactor={0.6}
        enableZoom={true}
        maxDistance={6}
        minDistance={3}
      />
    </>
  );
}

export default Scene;
