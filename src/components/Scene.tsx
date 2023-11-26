import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";

function Scene() {
  const { scene } = useThree();
  const bgTexture = useLoader(TextureLoader, "src/assets/bg_grid.png");
  // bgTexture.encoding = THREE.sRGBEncoding;
  scene.background = bgTexture;

  //   camera.lookAt(scene.position);
  //   camera.updateMatrix();

  // setSize(window.innerWidth, window.innerHeight);
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
      <ambientLight color={0xffffff} intensity={0.3} />
      <directionalLight position={[1, 0, 1]} color={0xffffff} intensity={0.2} />
    </>
  );
}

export default Scene;
