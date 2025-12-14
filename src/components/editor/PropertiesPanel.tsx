import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/stores/editorStore';
import { Trash2, RotateCcw, Move, Scaling, Box } from 'lucide-react';

export function PropertiesPanel() {
  const { 
    currentProject, 
    selectedItemId, 
    selectedWallId,
    selectedType,
    updateFurniture, 
    removeFurniture,
    updateWall,
    removeWall
  } = useEditorStore();

  const selectedItem = currentProject?.furniture.find((f) => f.id === selectedItemId);
  const selectedWall = currentProject?.walls.find((w) => w.id === selectedWallId);

  if (selectedType === 'wall' && selectedWall) {
    return (
      <div className="w-72 border-l border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            <h2 className="font-semibold font-heading">Wall Properties</h2>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-auto">
          {/* Wall Height */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Scaling className="w-4 h-4" />
              Height
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                value={selectedWall.height.toFixed(1)}
                onChange={(e) => updateWall(selectedWall.id, { height: parseFloat(e.target.value) || 2.5 })}
                className="h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">m</span>
            </div>
            <Slider
              value={[selectedWall.height]}
              onValueChange={([v]) => updateWall(selectedWall.id, { height: v })}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>

          {/* Wall Thickness */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Box className="w-4 h-4" />
              Thickness
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                step="0.05"
                min="0.1"
                max="1"
                value={selectedWall.thickness.toFixed(2)}
                onChange={(e) => updateWall(selectedWall.id, { thickness: parseFloat(e.target.value) || 0.15 })}
                className="h-8 text-sm"
              />
              <span className="text-xs text-muted-foreground">m</span>
            </div>
            <Slider
              value={[selectedWall.thickness]}
              onValueChange={([v]) => updateWall(selectedWall.id, { thickness: v })}
              min={0.1}
              max={0.5}
              step={0.05}
            />
          </div>

          {/* Wall Length (Read Only) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Length</Label>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                readOnly
                value={Math.sqrt(
                  Math.pow(selectedWall.end[0] - selectedWall.start[0], 2) + 
                  Math.pow(selectedWall.end[1] - selectedWall.start[1], 2)
                ).toFixed(2)}
                className="h-8 text-sm bg-muted/50"
              />
              <span className="text-xs text-muted-foreground">m</span>
            </div>
          </div>

          {/* Wall Position */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Start Point</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Label className="w-4 text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={selectedWall.start[0].toFixed(1)}
                  onChange={(e) => updateWall(selectedWall.id, { 
                    start: [parseFloat(e.target.value) || 0, selectedWall.start[1]] 
                  })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-4 text-xs text-muted-foreground">Z</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={selectedWall.start[1].toFixed(1)}
                  onChange={(e) => updateWall(selectedWall.id, { 
                    start: [selectedWall.start[0], parseFloat(e.target.value) || 0] 
                  })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">End Point</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Label className="w-4 text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={selectedWall.end[0].toFixed(1)}
                  onChange={(e) => updateWall(selectedWall.id, { 
                    end: [parseFloat(e.target.value) || 0, selectedWall.end[1]] 
                  })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-4 text-xs text-muted-foreground">Z</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={selectedWall.end[1].toFixed(1)}
                  onChange={(e) => updateWall(selectedWall.id, { 
                    end: [selectedWall.end[0], parseFloat(e.target.value) || 0] 
                  })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => removeWall(selectedWall.id)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Wall
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="w-72 border-l border-border bg-card/50 p-4">
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Select an item or wall to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePositionChange = (axis: number, value: number) => {
    const newPosition = [...selectedItem.position] as [number, number, number];
    newPosition[axis] = value;
    updateFurniture(selectedItem.id, { position: newPosition });
  };

  const handleRotationChange = (axis: number, value: number) => {
    const newRotation = [...selectedItem.rotation] as [number, number, number];
    newRotation[axis] = (value * Math.PI) / 180;
    updateFurniture(selectedItem.id, { rotation: newRotation });
  };

  const handleScaleChange = (axis: number, value: number) => {
    const newScale = [...selectedItem.scale] as [number, number, number];
    newScale[axis] = value;
    updateFurniture(selectedItem.id, { scale: newScale });
  };

  return (
    <div className="w-72 border-l border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold font-heading">{selectedItem.name}</h2>
        <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Position */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Move className="w-4 h-4" />
            Position
          </div>
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="flex items-center gap-3">
              <Label className="w-6 text-xs text-muted-foreground">{axis}</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedItem.position[index].toFixed(1)}
                onChange={(e) => handlePositionChange(index, parseFloat(e.target.value) || 0)}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <RotateCcw className="w-4 h-4" />
            Rotation (degrees)
          </div>
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">{axis}</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round((selectedItem.rotation[index] * 180) / Math.PI)}°
                </span>
              </div>
              <Slider
                value={[(selectedItem.rotation[index] * 180) / Math.PI]}
                onValueChange={([v]) => handleRotationChange(index, v)}
                min={-180}
                max={180}
                step={1}
              />
            </div>
          ))}
        </div>

        {/* Scale */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Scaling className="w-4 h-4" />
            Scale
          </div>
          {['W', 'H', 'D'].map((axis, index) => (
            <div key={axis} className="flex items-center gap-3">
              <Label className="w-6 text-xs text-muted-foreground">{axis}</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedItem.scale[index].toFixed(1)}
                onChange={(e) => handleScaleChange(index, parseFloat(e.target.value) || 0.1)}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Color */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={selectedItem.color}
              onChange={(e) => updateFurniture(selectedItem.id, { color: e.target.value })}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer"
            />
            <Input
              value={selectedItem.color}
              onChange={(e) => updateFurniture(selectedItem.id, { color: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => removeFurniture(selectedItem.id)}
        >
          <Trash2 className="w-4 h-4" />
          Delete Item
        </Button>
      </div>
    </div>
  );
}
