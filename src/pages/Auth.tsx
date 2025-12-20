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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, ShieldCheck } from "lucide-react";

// Validation schemas
const tcKimlikSchema = z.string()
  .length(11, "TC Kimlik numarası 11 haneli olmalıdır")
  .regex(/^\d+$/, "TC Kimlik numarası sadece rakamlardan oluşmalıdır");

const passwordSchema = z.string()
  .min(6, "Şifre en az 6 karakter olmalıdır");

const adSoyadSchema = z.string()
  .min(3, "Ad Soyad en az 3 karakter olmalıdır")
  .max(100, "Ad Soyad en fazla 100 karakter olabilir");

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form
  const [loginTc, setLoginTc] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form
  const [registerTc, setRegisterTc] = useState("");
  const [registerAdSoyad, setRegisterAdSoyad] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      tcKimlikSchema.parse(registerTc);
      adSoyadSchema.parse(registerAdSoyad);
      passwordSchema.parse(registerPassword);
      
      if (registerPassword !== registerPasswordConfirm) {
        toast({
          title: "Hata",
          description: "Şifreler eşleşmiyor.",
          variant: "destructive",
        });
        return;
      }
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
    const email = `${registerTc}@belediye.gov.tr`;
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: registerPassword,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          tc_kimlik: registerTc,
          ad_soyad: registerAdSoyad,
        }
      }
    });
    
    if (error) {
      setIsLoading(false);
      
      if (error.message.includes("already registered")) {
        toast({
          title: "Kayıt Başarısız",
          description: "Bu TC Kimlik numarası ile daha önce kayıt yapılmış.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Kayıt Başarısız",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user.id,
          tc_kimlik: registerTc,
          ad_soyad: registerAdSoyad,
        });
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }
    
    setIsLoading(false);
    
    toast({
      title: "Kayıt Başarılı",
      description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
    });
    
    setActiveTab("login");
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
                Devam etmek için giriş yapın veya kayıt olun
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                  <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
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
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-tc">TC Kimlik Numarası</Label>
                      <Input
                        id="register-tc"
                        type="text"
                        placeholder="11 haneli TC Kimlik No"
                        value={registerTc}
                        onChange={(e) => setRegisterTc(e.target.value.replace(/\D/g, "").slice(0, 11))}
                        maxLength={11}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Ad Soyad</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Adınız ve soyadınız"
                        value={registerAdSoyad}
                        onChange={(e) => setRegisterAdSoyad(e.target.value)}
                        maxLength={100}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Şifre</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="En az 6 karakter"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password-confirm">Şifre Tekrar</Label>
                      <Input
                        id="register-password-confirm"
                        type="password"
                        placeholder="Şifrenizi tekrar girin"
                        value={registerPasswordConfirm}
                        onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Kayıt yapılıyor...
                        </>
                      ) : (
                        "Kayıt Ol"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
