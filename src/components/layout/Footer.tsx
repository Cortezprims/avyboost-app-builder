import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { 
  InstagramIcon, 
  TelegramIcon, 
  TwitterIcon, 
  WhatsAppIcon 
} from "@/components/icons/SocialIcons";

const footerLinks = {
  services: [
    { label: "TikTok", href: "/services/tiktok" },
    { label: "Instagram", href: "/services/instagram" },
    { label: "Facebook", href: "/services/facebook" },
    { label: "YouTube", href: "/services/youtube" },
    { label: "Twitter", href: "/services/twitter" },
  ],
  support: [
    { label: "FAQ", href: "/support" },
    { label: "Contact", href: "/support" },
    { label: "Assistance", href: "/support" },
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Remboursements", href: "/refunds" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">AvyBoost</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              La plateforme n°1 pour booster votre présence sur les réseaux sociaux.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-colors"
              >
                <InstagramIcon size={16} />
              </a>
              <a 
                href="https://wa.me/620462308" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <WhatsAppIcon size={16} />
              </a>
              <a 
                href="https://t.me/avyboost" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-[#26A5E4] hover:text-white transition-colors"
              >
                <TelegramIcon size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <TwitterIcon size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, idx) => (
                <li key={link.href + idx}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 AvyBoost. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Paiement sécurisé</span>
            <div className="flex gap-1">
              <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-xs font-bold">💳</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
