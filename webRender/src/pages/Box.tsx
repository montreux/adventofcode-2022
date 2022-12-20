import { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null);
  const [clicked, click] = useState(false);

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color={0x00ff00} />
    </mesh>
  );
}
