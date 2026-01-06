import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const { user, profile, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getInitials = () => {
    if (profile?.displayName) {
      return profile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

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
            
            {!loading && user ? (
              // Logged in state
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.photoURL || user?.photoURL || undefined} alt="Avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.displayName && (
                        <p className="font-medium">{profile.displayName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Logged out state
              <>
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
              </>
            )}

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
                    {!loading && user ? (
                      <>
                        <div className="flex items-center gap-3 pb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile?.photoURL || user?.photoURL || undefined} alt="Avatar" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile?.displayName || 'Utilisateur'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Link to="/dashboard" onClick={() => setOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Tableau de bord
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => {
                            handleLogout();
                            setOpen(false);
                          }}
                        >
                          Déconnexion
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
