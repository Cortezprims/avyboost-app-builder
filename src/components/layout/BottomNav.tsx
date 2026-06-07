import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, ClipboardList, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/orders", label: "Commandes", icon: ClipboardList },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href === "/dashboard" && location.pathname === "/");

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 min-w-[60px]",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-2xl gradient-primary shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)] animate-scale-in" />
              )}
              <item.icon className={cn(
                "relative w-5 h-5 transition-transform duration-300",
                isActive && "scale-110 drop-shadow-[0_0_8px_hsl(var(--primary-foreground)/0.5)]"
              )} />
              <span className={cn(
                "relative text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
