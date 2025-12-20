-- Profil tablosu oluştur
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tc_kimlik VARCHAR(11) NOT NULL UNIQUE,
  ad_soyad TEXT NOT NULL,
  unvan TEXT DEFAULT 'Bütçe Yönetim Müdürü',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi profilini görebilir
CREATE POLICY "Kullanıcılar kendi profilini görebilir"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Kullanıcı kendi profilini güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profilini güncelleyebilir"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();