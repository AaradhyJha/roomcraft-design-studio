import { useEffect, Suspense, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEditorStore, Project, FurnitureItem, Wall } from '@/stores/editorStore';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ModelCatalog } from '@/components/editor/ModelCatalog';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, useGLTF, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

// Default project template
const createDefaultProject = (name: string): Project => ({
  id: crypto.randomUUID(),
  name,
  createdAt: new Date(),
  updatedAt: new Date(),
  furniture: [],
  walls: [],
  roomWidth: 10,
  roomDepth: 10,
});

function GLTFModel({ 
  url, 
  item, 
  isSelected, 
  onSelect 
}: { 
  url: string; 
  item: FurnitureItem; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  
  return (
    <primitive
      object={clonedScene}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(); }}
    />
  );
}

function FallbackShape({ 
  item, 
  isSelected, 
  onSelect 
}: { 
  item: FurnitureItem; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  return (
    <mesh
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      castShadow
    >
      {item.modelType === 'cylinder' ? (
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      ) : item.modelType === 'sphere' ? (
        <sphereGeometry args={[0.5, 32, 32]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial 
        color={item.color} 
        emissive={isSelected ? item.color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function TransformableFurniture({ 
  item, 
  isSelected, 
  onSelect,
  activeTool,
  onTransformEnd
}: { 
  item: FurnitureItem; 
  isSelected: boolean; 
  onSelect: () => void;
  activeTool: string;
  onTransformEnd: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const getTransformMode = () => {
    if (activeTool === 'move') return 'translate';
    if (activeTool === 'rotate') return 'rotate';
    if (activeTool === 'scale') return 'scale';
    return 'translate';
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
    <group ref={groupRef} position={item.position} rotation={item.rotation} scale={item.scale}>
      {isSelected && (activeTool === 'move' || activeTool === 'rotate' || activeTool === 'scale') && (
        <TransformControls 
          mode={getTransformMode()} 
          onMouseUp={handleTransformEnd}
        >
          <group>
            {item.modelUrl ? (
              <Suspense fallback={
                <mesh ref={meshRef} castShadow>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color={item.color} />
                </mesh>
              }>
                <GLTFModelInner url={item.modelUrl} />
              </Suspense>
            ) : (
              <mesh ref={meshRef} castShadow>
                {item.modelType === 'cylinder' ? (
                  <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
                ) : item.modelType === 'sphere' ? (
                  <sphereGeometry args={[0.5, 32, 32]} />
                ) : (
                  <boxGeometry args={[1, 1, 1]} />
                )}
                <meshStandardMaterial 
                  color={item.color} 
                  emissive={item.color}
                  emissiveIntensity={0.3}
                />
              </mesh>
            )}
          </group>
        </TransformControls>
      )}
      
      {(!isSelected || activeTool === 'select' || activeTool === 'wall') && (
        <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          {item.modelUrl ? (
            <Suspense fallback={
              <mesh ref={meshRef} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={item.color} />
              </mesh>
            }>
              <GLTFModelInner url={item.modelUrl} />
            </Suspense>
          ) : (
            <mesh ref={meshRef} castShadow>
              {item.modelType === 'cylinder' ? (
                <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
              ) : item.modelType === 'sphere' ? (
                <sphereGeometry args={[0.5, 32, 32]} />
              ) : (
                <boxGeometry args={[1, 1, 1]} />
              )}
              <meshStandardMaterial 
                color={item.color} 
                emissive={isSelected ? item.color : '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

function GLTFModelInner({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  return <primitive object={clonedScene} />;
}

function WallMesh({ 
  wall, 
  isSelected, 
  onSelect 
}: { 
  wall: Wall; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const length = Math.sqrt(
    Math.pow(wall.end[0] - wall.start[0], 2) + 
    Math.pow(wall.end[1] - wall.start[1], 2)
  );
  
  const centerX = (wall.start[0] + wall.end[0]) / 2;
  const centerZ = (wall.start[1] + wall.end[1]) / 2;
  
  const angle = Math.atan2(wall.end[1] - wall.start[1], wall.end[0] - wall.start[0]);

  return (
    <mesh
      position={[centerX, wall.height / 2, centerZ]}
      rotation={[0, -angle, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, wall.height, wall.thickness]} />
      <meshStandardMaterial 
        color={isSelected ? "#ff6b6b" : "#e0e0e0"} 
        emissive={isSelected ? "#ff6b6b" : "#000000"}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    </mesh>
  );
}

function WallPreview({ start, current }: { start: [number, number]; current: [number, number] }) {
  const length = Math.sqrt(
    Math.pow(current[0] - start[0], 2) + 
    Math.pow(current[1] - start[1], 2)
  );
  
  if (length < 0.1) return null;
  
  const centerX = (start[0] + current[0]) / 2;
  const centerZ = (start[1] + current[1]) / 2;
  const angle = Math.atan2(current[1] - start[1], current[0] - start[0]);

  return (
    <mesh
      position={[centerX, 1.25, centerZ]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, 2.5, 0.15]} />
      <meshStandardMaterial color="#06b6d4" transparent opacity={0.5} />
    </mesh>
  );
}

function Scene() {
  const { 
    currentProject, 
    selectedItemId, 
    selectedWallId,
    isGridVisible, 
    selectItem, 
    selectWall,
    activeTool,
    updateFurniture,
    addWall,
    isDrawingWall,
    wallStartPoint,
    setDrawingWall,
    setWallStartPoint
  } = useEditorStore();

  const [previewPoint, setPreviewPoint] = React.useState<[number, number] | null>(null);

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    if (activeTool === 'wall') {
      const point = e.point;
      const snappedPoint: [number, number] = [
        Math.round(point.x * 2) / 2,
        Math.round(point.z * 2) / 2
      ];
      
      if (!isDrawingWall) {
        setWallStartPoint(snappedPoint);
        setDrawingWall(true);
      } else if (wallStartPoint) {
        addWall({
          start: wallStartPoint,
          end: snappedPoint,
          height: 2.5,
          thickness: 0.15
        });
        setWallStartPoint(snappedPoint);
      }
    } else {
      selectItem(null);
      selectWall(null);
    }
  };

  const handleFloorMove = (e: ThreeEvent<MouseEvent>) => {
    if (activeTool === 'wall' && isDrawingWall) {
      const point = e.point;
      setPreviewPoint([
        Math.round(point.x * 2) / 2,
        Math.round(point.z * 2) / 2
      ]);
    }
  };

  const handleTransformEnd = (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => {
    updateFurniture(id, { position, rotation, scale });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
      <Environment preset="city" />
      
      {isGridVisible && (
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          sectionColor="#06b6d4"
          cellColor="#1e293b"
          fadeDistance={30}
        />
      )}

      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow 
        onClick={handleFloorClick}
        onPointerMove={handleFloorMove}
      >
        <planeGeometry args={[currentProject?.roomWidth || 10, currentProject?.roomDepth || 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Walls */}
      {currentProject?.walls.map((wall) => (
        <WallMesh
          key={wall.id}
          wall={wall}
          isSelected={selectedWallId === wall.id}
          onSelect={() => selectWall(wall.id)}
        />
      ))}

      {/* Wall Preview */}
      {isDrawingWall && wallStartPoint && previewPoint && (
        <WallPreview start={wallStartPoint} current={previewPoint} />
      )}

      {/* Furniture */}
      {currentProject?.furniture.map((item) => (
        <TransformableFurniture
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onSelect={() => selectItem(item.id)}
          activeTool={activeTool}
          onTransformEnd={(pos, rot, scl) => handleTransformEnd(item.id, pos, rot, scl)}
        />
      ))}

      <OrbitControls 
        makeDefault 
        minDistance={5} 
        maxDistance={30} 
        maxPolarAngle={Math.PI / 2.1}
        enabled={activeTool !== 'wall' || !isDrawingWall}
      />
    </>
  );
}

import React from 'react';

export default function Editor() {
  const { id } = useParams();
  const { setCurrentProject, currentProject, setDrawingWall, setWallStartPoint } = useEditorStore();

  useEffect(() => {
    if (id === 'new' || !currentProject) {
      setCurrentProject(createDefaultProject('Untitled Room'));
    }
  }, [id, setCurrentProject, currentProject]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawingWall(false);
        setWallStartPoint(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDrawingWall, setWallStartPoint]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorToolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <ModelCatalog />
        
        <div className="flex-1 relative bg-background">
          <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
            <Scene />
          </Canvas>
          
          <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-2 text-xs text-muted-foreground">
            <span className="font-medium">Controls:</span> Drag to rotate • Scroll to zoom • Right-click to pan • ESC to cancel wall
          </div>
        </div>
        
        <PropertiesPanel />
      </div>
    </div>
  );
}
