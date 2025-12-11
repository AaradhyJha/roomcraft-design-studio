-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Room',
  thumbnail_url TEXT,
  room_width NUMERIC DEFAULT 10,
  room_depth NUMERIC DEFAULT 10,
  furniture JSONB DEFAULT '[]'::jsonb,
  walls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create model categories table
CREATE TABLE public.model_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create furniture models table
CREATE TABLE public.furniture_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.model_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  model_url TEXT,
  thumbnail_url TEXT,
  default_scale JSONB DEFAULT '[1, 1, 1]'::jsonb,
  default_color TEXT DEFAULT '#4a90a4',
  model_type TEXT DEFAULT 'box',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.furniture_models ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Model categories are public read
CREATE POLICY "Anyone can view model categories"
  ON public.model_categories FOR SELECT
  USING (true);

-- Furniture models are public read
CREATE POLICY "Anyone can view furniture models"
  ON public.furniture_models FOR SELECT
  USING (true);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for 3D models
INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true);

-- Storage policies for models bucket
CREATE POLICY "Anyone can view models"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'models');

CREATE POLICY "Authenticated users can upload models"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'models' AND auth.role() = 'authenticated');

-- Insert default model categories
INSERT INTO public.model_categories (name, icon) VALUES
  ('Living Room', 'sofa'),
  ('Bedroom', 'bed-double'),
  ('Kitchen', 'cooking-pot'),
  ('Office', 'monitor'),
  ('Decor', 'lamp');

-- Insert default furniture models
INSERT INTO public.furniture_models (category_id, name, model_type, default_scale, default_color) VALUES
  ((SELECT id FROM model_categories WHERE name = 'Living Room'), 'Sofa', 'box', '[2, 0.8, 1]', '#4a90a4'),
  ((SELECT id FROM model_categories WHERE name = 'Living Room'), 'Armchair', 'box', '[1, 0.8, 1]', '#6b8e7f'),
  ((SELECT id FROM model_categories WHERE name = 'Living Room'), 'Coffee Table', 'box', '[1.2, 0.4, 0.6]', '#8b7355'),
  ((SELECT id FROM model_categories WHERE name = 'Living Room'), 'Floor Lamp', 'cylinder', '[0.3, 1.5, 0.3]', '#d4af37'),
  ((SELECT id FROM model_categories WHERE name = 'Living Room'), 'TV Stand', 'box', '[1.8, 0.5, 0.4]', '#2c3e50'),
  ((SELECT id FROM model_categories WHERE name = 'Bedroom'), 'Double Bed', 'box', '[2, 0.6, 2.2]', '#7d8c8d'),
  ((SELECT id FROM model_categories WHERE name = 'Bedroom'), 'Nightstand', 'box', '[0.5, 0.5, 0.4]', '#5d4e37'),
  ((SELECT id FROM model_categories WHERE name = 'Office'), 'Desk', 'box', '[1.4, 0.75, 0.7]', '#34495e'),
  ((SELECT id FROM model_categories WHERE name = 'Office'), 'Bookshelf', 'box', '[1, 2, 0.3]', '#6c5b4a'),
  ((SELECT id FROM model_categories WHERE name = 'Kitchen'), 'Dining Table', 'box', '[1.8, 0.75, 1]', '#5c4033'),
  ((SELECT id FROM model_categories WHERE name = 'Kitchen'), 'Kitchen Island', 'box', '[1.5, 0.9, 0.8]', '#2f4f4f'),
  ((SELECT id FROM model_categories WHERE name = 'Decor'), 'Plant Pot', 'cylinder', '[0.4, 0.8, 0.4]', '#228b22');