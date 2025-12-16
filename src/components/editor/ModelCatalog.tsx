import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/stores/editorStore';
import { useFurnitureModels, FurnitureModel } from '@/hooks/useFurnitureModels';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sofa, 
  Armchair, 
  Lamp, 
  Table, 
  BedDouble, 
  CookingPot,
  Tv,
  BookOpen,
  Monitor,
  Box,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'sofa': Sofa,
  'armchair': Armchair,
  'lamp': Lamp,
  'table': Table,
  'bed-double': BedDouble,
  'cooking-pot': CookingPot,
  'tv': Tv,
  'book-open': BookOpen,
  'monitor': Monitor,
};

function getIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Box;
  return iconMap[iconName] || Box;
}

export function ModelCatalog() {
  const { addFurniture } = useEditorStore();
  const { data: models, isLoading } = useFurnitureModels();

  const handleDragStart = (e: React.DragEvent, model: FurnitureModel) => {
    e.dataTransfer.setData('model', JSON.stringify(model));
  };

  const handleAddModel = (model: FurnitureModel) => {
    const scale = model.default_scale as [number, number, number];
    // Fix double slashes in model URLs
    const sanitizedUrl = model.model_url?.replace(/([^:]\/)\/+/g, '$1') || null;
    addFurniture({
      name: model.name,
      category: model.category_name,
      position: [Math.random() * 4 - 2, scale[1] / 2, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale,
      modelType: model.model_type as 'box' | 'cylinder' | 'sphere',
      color: model.default_color,
      modelUrl: sanitizedUrl,
    });
  };

  // Group models by category
  const categories = models
    ? [...new Set(models.map((m) => m.category_name))]
    : [];

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold font-heading">Model Library</h2>
        <p className="text-sm text-muted-foreground">Drag or click to add</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-3" />
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map((j) => (
                      <Skeleton key={j} className="h-20 rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            categories.map((category) => {
              const categoryModels = models?.filter((m) => m.category_name === category) || [];
              const CategoryIcon = getIcon(categoryModels[0]?.category_icon);
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryModels.map((model) => {
                      const Icon = getIcon(model.category_icon);
                      return (
                        <div
                          key={model.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, model)}
                          onClick={() => handleAddModel(model)}
                          className="p-3 rounded-lg glass hover:bg-secondary/80 cursor-pointer transition-all group relative"
                        >
                          {model.is_premium && (
                            <span className="absolute top-1 right-1 text-[10px] bg-primary/20 text-primary px-1.5 rounded-full">
                              PRO
                            </span>
                          )}
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors"
                            style={{ backgroundColor: model.default_color + '30' }}
                          >
                            <Icon 
                              className="w-4 h-4 transition-colors" 
                              style={{ color: model.default_color }}
                            />
                          </div>
                          <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                            {model.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
