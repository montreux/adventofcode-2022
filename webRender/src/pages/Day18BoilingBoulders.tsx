import { Canvas } from "@react-three/fiber";

// import "../styles/globals.css";
import { OrbitControls } from "@react-three/drei";
import { Boulder } from "./Boulder";

export default function Day18BoilingBoulders() {
  return (
    <div style={{ width: "95vw", height: "95vh", backgroundColor: "white" }}>
      <Canvas>
        <OrbitControls />
        <Boulder />
      </Canvas>
    </div>
  );
}
