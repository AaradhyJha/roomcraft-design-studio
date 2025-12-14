import { create } from 'zustand';

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  modelType: 'box' | 'cylinder' | 'sphere';
  color: string;
  modelUrl?: string | null;
}

export interface Wall {
  id: string;
  start: [number, number];
  end: [number, number];
  height: number;
  thickness: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  furniture: FurnitureItem[];
  walls: Wall[];
  roomWidth: number;
  roomDepth: number;
}

type EditorTool = 'select' | 'move' | 'rotate' | 'scale' | 'wall';
type SelectedType = 'furniture' | 'wall' | null;

interface EditorState {
  currentProject: Project | null;
  selectedItemId: string | null;
  selectedType: SelectedType;
  selectedWallId: string | null;
  isGridVisible: boolean;
  cameraPosition: [number, number, number];
  activeTool: EditorTool;
  isDrawingWall: boolean;
  wallStartPoint: [number, number] | null;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  selectItem: (id: string | null) => void;
  selectWall: (id: string | null) => void;
  toggleGrid: () => void;
  setActiveTool: (tool: EditorTool) => void;
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  addWall: (wall: Omit<Wall, 'id'>) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  removeWall: (id: string) => void;
  updateRoomSize: (width: number, depth: number) => void;
  setDrawingWall: (isDrawing: boolean) => void;
  setWallStartPoint: (point: [number, number] | null) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  currentProject: null,
  selectedItemId: null,
  selectedType: null,
  selectedWallId: null,
  isGridVisible: true,
  cameraPosition: [10, 10, 10],
  activeTool: 'select',
  isDrawingWall: false,
  wallStartPoint: null,

  setCurrentProject: (project) => set({ currentProject: project }),
  
  selectItem: (id) => set({ selectedItemId: id, selectedType: id ? 'furniture' : null, selectedWallId: null }),
  
  selectWall: (id) => set({ selectedWallId: id, selectedType: id ? 'wall' : null, selectedItemId: null }),
  
  toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),
  
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  setDrawingWall: (isDrawing) => set({ isDrawingWall: isDrawing }),
  
  setWallStartPoint: (point) => set({ wallStartPoint: point }),
  
  addFurniture: (item) => {
    const id = crypto.randomUUID();
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            furniture: [...state.currentProject.furniture, { ...item, id }],
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  updateFurniture: (id, updates) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            furniture: state.currentProject.furniture.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  removeFurniture: (id) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            furniture: state.currentProject.furniture.filter((item) => item.id !== id),
            updatedAt: new Date(),
          }
        : null,
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
  },
  
  addWall: (wall) => {
    const id = crypto.randomUUID();
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            walls: [...state.currentProject.walls, { ...wall, id }],
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  updateWall: (id, updates) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            walls: state.currentProject.walls.map((wall) =>
              wall.id === id ? { ...wall, ...updates } : wall
            ),
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  removeWall: (id) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            walls: state.currentProject.walls.filter((wall) => wall.id !== id),
            updatedAt: new Date(),
          }
        : null,
      selectedWallId: state.selectedWallId === id ? null : state.selectedWallId,
    }));
  },
  
  updateRoomSize: (width, depth) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            roomWidth: width,
            roomDepth: depth,
            updatedAt: new Date(),
          }
        : null,
    }));
  },
}));
