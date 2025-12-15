import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://algdhvoyrlnrxpqjzqkt.supabase.co/storage/v1/object/public/models//tiny_isometric_room.glb";

function RotatingModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]} position={[0, -0.5, 0]}>
      <primitive object={scene.clone()} />
    </group>
  );
}

function FallbackHouse() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main house body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <meshStandardMaterial color="#f8e8d0" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.9, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[1.6, 0.8, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.4, 0.76]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.05]} />
        <meshStandardMaterial color="#5d3a1a" />
      </mesh>

      {/* Windows */}
      <mesh position={[-0.55, 0.9, 0.76]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.05]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      <mesh position={[0.55, 0.9, 0.76]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.05]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.6, 2.1, -0.3]} castShadow>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Ground/Garden */}
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
}

export function HeroPreview() {
  return (
    <Canvas shadows camera={{ position: [4, 3, 4], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="sunset" />
      <Suspense fallback={<FallbackHouse />}>
        <RotatingModel />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}

// Preload the model
useGLTF.preload(MODEL_URL);
