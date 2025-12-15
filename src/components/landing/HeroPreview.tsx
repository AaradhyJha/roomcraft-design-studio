import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Grid, TransformControls } from "@react-three/drei";
import { useRef, Suspense, useState, useCallback } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://algdhvoyrlnrxpqjzqkt.supabase.co/storage/v1/object/public/models//tiny_isometric_room.glb";

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

/* ---------------- Demo Walls ---------------- */

function DemoWalls() {
  const wallHeight = 1.5;
  const wallThickness = 0.1;
  const roomSize = 3;

  return (
    <group>
      {/* Front wall */}
      <mesh position={[0, wallHeight / 2, -roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, wallHeight / 2, roomSize / 2]} castShadow receiveShadow>
        <boxGeometry args={[roomSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, roomSize]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
      {/* Right wall */}
      <mesh position={[roomSize / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, roomSize]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
    </group>
  );
}

/* ---------------- Toolbar Overlay ---------------- */

function ToolbarOverlay({
  activeTool,
  onToolChange,
}: {
  activeTool: string;
  onToolChange: (tool: "select" | "move" | "rotate" | "scale") => void;
}) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1 glass rounded-lg p-1 z-10">
      {[
        { id: "select", label: "V", icon: "⊙" },
        { id: "move", label: "G", icon: "⇲" },
        { id: "rotate", label: "R", icon: "↻" },
        { id: "scale", label: "S", icon: "⤡" },
      ].map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id as any)}
          className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
            activeTool === tool.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          title={`${tool.id} (${tool.label})`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Hero Preview ---------------- */

export function HeroPreview() {
  const [activeTool, setActiveTool] = useState<"select" | "move" | "rotate" | "scale">("select");
  const [isSelected, setIsSelected] = useState(false);
  const [modelState, setModelState] = useState({
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [0.08, 0.08, 0.08] as [number, number, number],
  });

  const handleTransformEnd = useCallback(
    (pos: [number, number, number], rot: [number, number, number], scl: [number, number, number]) => {
      setModelState({ position: pos, rotation: rot, scale: scl });
    },
    []
  );

  const handleFloorClick = () => {
    setIsSelected(false);
  };

  return (
    <div className="relative w-full h-full">
      <ToolbarOverlay activeTool={activeTool} onToolChange={setActiveTool} />
      
      <Canvas shadows camera={{ position: [5, 4, 5], fov: 45 }}>
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

        {/* Environment */}
        <Environment preset="city" />

        {/* Grid */}
        <EditorGrid />

        {/* Floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
          onClick={handleFloorClick}
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Demo Walls */}
        <DemoWalls />

        {/* Room Model */}
        <Suspense fallback={<FallbackBox />}>
          <RoomModel
            isSelected={isSelected}
            onSelect={() => setIsSelected(true)}
            position={modelState.position}
            rotation={modelState.rotation}
            scale={modelState.scale}
            onTransformEnd={handleTransformEnd}
            activeTool={activeTool}
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
        <span className="font-medium">Click model to select</span> • Drag to orbit
      </div>

      {isSelected && (
        <div className="absolute bottom-3 right-3 glass rounded-lg px-3 py-2 text-xs text-primary">
          ✓ Model selected - Use tools to transform
        </div>
      )}
    </div>
  );
}

/* ---------------- Preload ---------------- */

useGLTF.preload(MODEL_URL);
