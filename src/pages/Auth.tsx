import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Loader2, Building2, ShieldCheck } from "lucide-react";

/* =========================
   VALIDATION
========================= */
const tcKimlikSchema = z
  .string()
  .length(11, "TC Kimlik numarası 11 haneli olmalıdır")
  .regex(/^\d+$/, "TC Kimlik numarası sadece rakamlardan oluşmalıdır");

const passwordSchema = z.string().min(6, "Şifre en az 6 karakter olmalıdır");

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginTc, setLoginTc] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  /* =========================
     LOGIN (MySQL BACKEND)
  ========================= */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
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

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tc: loginTc,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Giriş başarısız");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Giriş Başarılı",
        description: "Hoş geldiniz!",
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Giriş Başarısız",
        description: err.message || "TC veya şifre hatalı",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     DEMO USER (MySQL BACKEND)
  ========================= */
  const createTestUser = async () => {
    setIsCreating(true);

    try {
      const res = await fetch("http://localhost:4000/api/demo-user", {
        method: "POST",
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error();
      }

      toast({
        title: "Başarılı",
        description: "Demo kullanıcı oluşturuldu.",
      });

      setLoginTc("12345678901");
      setLoginPassword("123456");
    } catch (err) {
      toast({
        title: "Hata",
        description: "Demo kullanıcı oluşturulamadı.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <Helmet>
        <title>Giriş - LuxCivic KDS</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">LuxCivic</h1>
            <p className="text-muted-foreground">
              Kentsel Karar Destek Sistemi
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Bütçe Yönetim Müdürü Girişi
              </div>
              <CardTitle>Hoş Geldiniz</CardTitle>
              <CardDescription>Devam etmek için giriş yapın</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>TC Kimlik Numarası</Label>
                  <Input
                    value={loginTc}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLoginTc(
                        e.target.value.replace(/\D/g, "").slice(0, 11)
                      )
                    }
                    maxLength={11}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Şifre</Label>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLoginPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <Button className="w-full" disabled={isLoading}>
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
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
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
