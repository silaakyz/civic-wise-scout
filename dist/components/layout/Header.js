import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Building2, LayoutDashboard, MapPin, BarChart3, Settings, Menu, X, LineChart, LogOut, User, } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../ui/dropdown-menu.js";
const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Veri Analizi", icon: LineChart },
    { id: "map", label: "Harita Analizi", icon: MapPin },
    { id: "scenarios", label: "Senaryo Analizi", icon: BarChart3 },
    { id: "allocation", label: "Kaynak Dağıtımı", icon: Settings },
];
export const Header = ({ activeTab, onTabChange }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // 🔐 Local auth (Supabase YOK)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/auth";
    };
    return (_jsx("header", { className: "gradient-primary sticky top-0 z-50 shadow-elegant", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center", children: _jsx(Building2, { className: "w-6 h-6 text-primary-foreground" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-xl font-bold text-primary-foreground tracking-wide", children: "LUXCIVIC" }), _jsx("span", { className: "text-xs text-primary-foreground/70 hidden sm:block", children: "Karar Destek Sistemi" })] })] }), _jsx("nav", { className: "hidden md:flex items-center gap-1", children: navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (_jsxs("button", { onClick: () => onTabChange(item.id), className: `
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-300 relative
                    ${isActive
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"}
                  `, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: item.label }), isActive && (_jsx("span", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-foreground rounded-full" }))] }, item.id));
                            }) }), _jsx("div", { className: "hidden md:flex items-center gap-2", children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", className: "text-primary-foreground hover:bg-primary-foreground/20 gap-2", children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { className: "max-w-[120px] truncate", children: user?.tc || "Demo Kullanıcı" })] }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [_jsx(DropdownMenuLabel, { children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { children: user?.tc || "Demo Kullanıcı" }), _jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "Demo Yetkisi" })] }) }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: handleLogout, className: "text-destructive cursor-pointer", children: [_jsx(LogOut, { className: "w-4 h-4 mr-2" }), "\u00C7\u0131k\u0131\u015F Yap"] })] })] }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden text-primary-foreground hover:bg-primary-foreground/20", onClick: () => setMobileMenuOpen(!mobileMenuOpen), children: mobileMenuOpen ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) })] }), mobileMenuOpen && (_jsxs("nav", { className: "md:hidden pb-4 animate-fade-in", children: [navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (_jsxs("button", { onClick: () => {
                                    onTabChange(item.id);
                                    setMobileMenuOpen(false);
                                }, className: `
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"}
                  `, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { children: item.label })] }, item.id));
                        }), _jsxs("div", { className: "mt-4 pt-4 border-t border-primary-foreground/20", children: [_jsxs("div", { className: "px-4 py-2 text-sm text-primary-foreground/70", children: [_jsx("div", { className: "font-medium text-primary-foreground", children: user?.tc || "Demo Kullanıcı" }), _jsx("div", { className: "text-xs", children: "Demo Yetkisi" })] }), _jsxs("button", { onClick: () => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }, className: "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all duration-200", children: [_jsx(LogOut, { className: "w-5 h-5" }), _jsx("span", { children: "\u00C7\u0131k\u0131\u015F Yap" })] })] })] }))] }) }));
};
