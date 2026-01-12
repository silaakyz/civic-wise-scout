import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster } from "./components/ui/toaster.js";
import { Toaster as Sonner } from "./components/ui/sonner.js";
import { TooltipProvider } from "./components/ui/tooltip.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index.js";
import Auth from "./pages/Auth.js";
import NotFound from "./pages/NotFound.js";
const queryClient = new QueryClient();
/* =========================
   PROTECTED ROUTE
========================= */
const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("user");
    if (!user) {
        return _jsx(Navigate, { to: "/auth", replace: true });
    }
    return children;
};
const AppRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(Auth, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Index, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }));
};
const App = () => {
    return (_jsx(HelmetProvider, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsxs(TooltipProvider, { children: [_jsx(Toaster, {}), _jsx(Sonner, {}), _jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) })] }) }) }));
};
export default App;
