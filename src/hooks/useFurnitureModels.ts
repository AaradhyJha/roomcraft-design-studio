import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FurnitureModel {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  model_type: string;
  default_scale: number[];
  default_color: string;
  model_url: string | null;
  thumbnail_url: string | null;
  is_premium: boolean;
}

export function useFurnitureModels() {
  return useQuery({
    queryKey: ['furniture-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('furniture_models')
        .select(`
          id,
          name,
          model_type,
          default_scale,
          default_color,
          model_url,
          thumbnail_url,
          is_premium,
          category_id,
          model_categories!inner (
            name,
            icon
          )
        `);

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        category_id: item.category_id,
        category_name: (item.model_categories as any).name,
        category_icon: (item.model_categories as any).icon,
        model_type: item.model_type || 'box',
        default_scale: item.default_scale as number[],
        default_color: item.default_color || '#4a90a4',
        model_url: item.model_url,
        thumbnail_url: item.thumbnail_url,
        is_premium: item.is_premium || false,
      })) as FurnitureModel[];
    },
  });
}
