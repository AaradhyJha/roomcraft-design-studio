import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  Grid,
  TransformControls,
} from "@react-three/drei";
import { useRef, Suspense, useState, useCallback } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://algdhvoyrlnrxpqjzqkt.supabase.co/storage/v1/object/public/models/tiny_isometric_room.glb";

/* ---------------- Interactive Room Model ---------------- */

interface RoomModelProps {
  isSelected: boolean;
  onSelect: () => void;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  onTransformEnd: (
    pos: [number, number, number],
    rot: [number, number, number],
    scl: [number, number, number]
  ) => void;
  activeTool: "select" | "move" | "rotate" | "scale";
}

function RoomModel({
  isSelected,
  onSelect,
  position,
  rotation,
  scale,
  onTransformEnd,
  activeTool,
}: RoomModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const getTransformMode = () => {
    if (activeTool === "move") return "translate";
    if (activeTool === "rotate") return "rotate";
    if (activeTool === "scale") return "scale";
    return "translate";
  };

  const handleTransformEnd = () => {
    if (groupRef.current) {
      const pos = groupRef.current.position;
      const rot = groupRef.current.rotation;
      const scl = groupRef.current.scale;
      onTransformEnd(
        [pos.x, pos.y, pos.z],
        [rot.x, rot.y, rot.z],
        [scl.x, scl.y, scl.z]
      );
    }
  };

  return (
    <>
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <primitive object={scene.clone()} />
      </group>

      {isSelected && activeTool !== "select" && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={getTransformMode()}
          onMouseUp={handleTransformEnd}
        />
      )}
    </>
  );
}

/* ---------------- Grid ---------------- */

function EditorGrid() {
  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.5}
      sectionSize={2}
      sectionThickness={1}
      fadeDistance={15}
      fadeStrength={1}
      infiniteGrid
      cellColor="#333"
      sectionColor="#06b6d4"
    />
  );
}

/* ---------------- Fallback ---------------- */

function FallbackBox() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#06b6d4" />
    </mesh>
  );
}

/* ---------------- Toolbar Overlay ---------------- */

function ToolbarOverlay() {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
      {/* Left tools group */}
      <div className="flex gap-1 glass rounded-lg p-1">
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Select"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
        </button>
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Move"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
          </svg>
        </button>
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Rotate"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
        </button>
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Scale"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 21H3L21 3v18z" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border" />

      {/* Right tools group */}
      <div className="flex gap-1 glass rounded-lg p-1">
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Undo"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Redo"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
          </svg>
        </button>
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Fullscreen"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border" />

      {/* View tools */}
      <div className="flex gap-1 glass rounded-lg p-1">
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="Grid"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          className="w-9 h-9 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="View"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ---------------- Hero Preview ---------------- */

export function HeroPreview() {
  const [isSelected, setIsSelected] = useState(false);
  const [modelState, setModelState] = useState({
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [0.08, 0.08, 0.08] as [number, number, number],
  });

  const handleTransformEnd = useCallback(
    (
      pos: [number, number, number],
      rot: [number, number, number],
      scl: [number, number, number]
    ) => {
      setModelState({ position: pos, rotation: rot, scale: scl });
    },
    []
  );

  return (
    <div className="relative w-full h-full">
      <ToolbarOverlay />

      <Canvas shadows camera={{ position: [5, 4, 5], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

        {/* Environment */}
        <Environment preset="city" />

        {/* Grid */}
        <EditorGrid />

        {/* Room Model */}
        <Suspense fallback={<FallbackBox />}>
          <RoomModel
            isSelected={isSelected}
            onSelect={() => setIsSelected(true)}
            position={modelState.position}
            rotation={modelState.rotation}
            scale={modelState.scale}
            onTransformEnd={handleTransformEnd}
            activeTool="select"
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* Info Overlay */}
      <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium">Drag to orbit</span> • Scroll to zoom
      </div>
    </div>
  );
}

/* ---------------- Preload ---------------- */

useGLTF.preload(MODEL_URL);
