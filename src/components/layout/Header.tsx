import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import logoImg from "@/assets/logo.png";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/how-it-works", label: "Comment ça marche" },
  { href: "/support", label: "Support" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="AVYboost" className="w-10 h-10 rounded-xl object-cover" />
            <span className="font-display font-bold text-xl">
              <span className="gradient-text">Avy</span>
              <span className="text-foreground">Boost</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link to="/auth?mode=signup" className="hidden sm:block">
              <Button size="sm" className="gradient-primary glow">
                Commencer
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <img src={logoImg} alt="AVYboost" className="w-10 h-10 rounded-xl object-cover" />
                    <span className="font-display font-bold text-xl">AvyBoost</span>
                  </Link>

                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={`text-base font-medium transition-colors hover:text-primary ${
                          location.pathname === link.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setOpen(false)}>
                      <Button className="w-full gradient-primary">
                        Commencer gratuitement
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
