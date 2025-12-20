import { Building2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="gradient-primary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-primary-foreground">LUXCIVIC</span>
              <p className="text-xs text-primary-foreground/70">
                Çok Kriterli Karar Destek Sistemi
              </p>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/70">
            © 2025 LuxCivic. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};
