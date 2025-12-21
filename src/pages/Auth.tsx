import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, ShieldCheck } from "lucide-react";

// Validation schemas
const tcKimlikSchema = z.string()
  .length(11, "TC Kimlik numarası 11 haneli olmalıdır")
  .regex(/^\d+$/, "TC Kimlik numarası sadece rakamlardan oluşmalıdır");

const passwordSchema = z.string()
  .min(6, "Şifre en az 6 karakter olmalıdır");

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [loginTc, setLoginTc] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const [isCreating, setIsCreating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      tcKimlikSchema.parse(loginTc);
      passwordSchema.parse(loginPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Hata",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    // Create email from TC kimlik
    const email = `${loginTc}@belediye.gov.tr`;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: loginPassword,
    });
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Giriş Başarısız",
        description: "TC Kimlik numarası veya şifre hatalı.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Giriş Başarılı",
      description: "Hoş geldiniz!",
    });
    
    navigate("/");
  };

  const createTestUser = async () => {
    setIsCreating(true);
    
    const tcKimlik = "12345678901";
    const password = "123456";
    const email = `${tcKimlik}@belediye.gov.tr`;
    const adSoyad = "Test Kullanıcı";

    try {
      // Try to sign up the test user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            tc_kimlik: tcKimlik,
            ad_soyad: adSoyad,
          },
        },
      });

      if (error) {
        // If user already exists, just inform them
        if (error.message.includes("already registered")) {
          toast({
            title: "Bilgi",
            description: "Test kullanıcısı zaten mevcut. Giriş yapabilirsiniz.",
          });
          setLoginTc(tcKimlik);
          setLoginPassword(password);
        } else {
          throw error;
        }
      } else if (data.user) {
        // Create profile for the user
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            tc_kimlik: tcKimlik,
            ad_soyad: adSoyad,
            unvan: "Bütçe Yönetim Müdürü",
          });

        if (profileError) {
          console.log("Profile might already exist:", profileError);
        }

        toast({
          title: "Başarılı",
          description: "Test kullanıcısı oluşturuldu. Şimdi giriş yapabilirsiniz.",
        });
        
        setLoginTc(tcKimlik);
        setLoginPassword(password);
      }
    } catch (error) {
      console.error("Error creating test user:", error);
      toast({
        title: "Hata",
        description: "Test kullanıcısı oluşturulamadı.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Giriş - LuxCivic Karar Destek Sistemi</title>
        <meta name="description" content="LuxCivic Karar Destek Sistemi giriş sayfası" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LuxCivic</h1>
            <p className="text-muted-foreground">Kentsel Karar Destek Sistemi</p>
          </div>
          
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Bütçe Yönetim Müdürü Girişi
              </div>
              <CardTitle className="text-xl">Hoş Geldiniz</CardTitle>
              <CardDescription>
                Devam etmek için giriş yapın
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-tc">TC Kimlik Numarası</Label>
                  <Input
                    id="login-tc"
                    type="text"
                    placeholder="11 haneli TC Kimlik No"
                    value={loginTc}
                    onChange={(e) => setLoginTc(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    maxLength={11}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Şifre</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    "Giriş Yap"
                  )}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">veya</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={createTestUser}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    "Demo Hesabı Oluştur"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground mt-6">
            Bu sistem sadece yetkili belediye personeli içindir.
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
