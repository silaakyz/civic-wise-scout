import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Label } from "../components/ui/label.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../components/ui/card.js";
import { useToast } from "../hooks/use-toast.js";
import { Loader2, Building2, ShieldCheck } from "lucide-react";
/* =========================
   VALIDATION
========================= */
const tcKimlikSchema = z
    .string()
    .length(11, "TC Kimlik numarası 11 haneli olmalıdır")
    .regex(/^\d+$/, "TC Kimlik numarası sadece rakamlardan oluşmalıdır");
const passwordSchema = z.string().min(6, "Şifre en az 6 karakter olmalıdır");
const Auth = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loginTc, setLoginTc] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    /* =========================
       LOGIN (MySQL BACKEND)
    ========================= */
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            tcKimlikSchema.parse(loginTc);
            passwordSchema.parse(loginPassword);
        }
        catch (error) {
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
        }
        catch (err) {
            toast({
                title: "Giriş Başarısız",
                description: err.message || "TC veya şifre hatalı",
                variant: "destructive",
            });
        }
        finally {
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
        }
        catch (err) {
            toast({
                title: "Hata",
                description: "Demo kullanıcı oluşturulamadı.",
                variant: "destructive",
            });
        }
        finally {
            setIsCreating(false);
        }
    };
    /* =========================
       UI
    ========================= */
    return (_jsxs(_Fragment, { children: [_jsx(Helmet, { children: _jsx("title", { children: "Giri\u015F - LuxCivic KDS" }) }), _jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4", children: _jsx(Building2, { className: "h-8 w-8 text-primary" }) }), _jsx("h1", { className: "text-2xl font-bold", children: "LuxCivic" }), _jsx("p", { className: "text-muted-foreground", children: "Kentsel Karar Destek Sistemi" })] }), _jsxs(Card, { className: "shadow-xl", children: [_jsxs(CardHeader, { className: "text-center pb-2", children: [_jsxs("div", { className: "inline-flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }), "B\u00FCt\u00E7e Y\u00F6netim M\u00FCd\u00FCr\u00FC Giri\u015Fi"] }), _jsx(CardTitle, { children: "Ho\u015F Geldiniz" }), _jsx(CardDescription, { children: "Devam etmek i\u00E7in giri\u015F yap\u0131n" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "TC Kimlik Numaras\u0131" }), _jsx(Input, { value: loginTc, onChange: (e) => setLoginTc(e.target.value.replace(/\D/g, "").slice(0, 11)), maxLength: 11, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "\u015Eifre" }), _jsx(Input, { type: "password", value: loginPassword, onChange: (e) => setLoginPassword(e.target.value), required: true })] }), _jsx(Button, { className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Giri\u015F yap\u0131l\u0131yor..."] })) : ("Giriş Yap") }), _jsxs("div", { className: "relative my-4", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t" }) }), _jsx("div", { className: "relative flex justify-center text-xs", children: _jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "veya" }) })] }), _jsx(Button, { type: "button", variant: "outline", className: "w-full", onClick: createTestUser, disabled: isCreating, children: isCreating ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Olu\u015Fturuluyor..."] })) : ("Demo Hesabı Oluştur") })] }) })] }), _jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "Bu sistem sadece yetkili belediye personeli i\u00E7indir." })] }) })] }));
};
export default Auth;
