ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved_guide BOOLEAN DEFAULT false;

UPDATE public.profiles SET is_approved_guide = true WHERE role = 'admin';

CREATE INDEX IF NOT EXISTS idx_profiles_pending_guides
  ON public.profiles(role) WHERE role = 'guide' AND is_approved_guide = false;
