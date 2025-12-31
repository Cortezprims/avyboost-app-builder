import { UserPlus, Search, CreditCard, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Créez votre compte",
    description: "Inscription rapide en moins d'une minute. Aucune information sensible requise.",
    step: "01",
  },
  {
    icon: Search,
    title: "Choisissez votre service",
    description: "Sélectionnez la plateforme et le type d'engagement souhaité (likes, followers, vues...).",
    step: "02",
  },
  {
    icon: CreditCard,
    title: "Payez en toute sécurité",
    description: "Plusieurs moyens de paiement sécurisés disponibles. Transactions cryptées.",
    step: "03",
  },
  {
    icon: Rocket,
    title: "Recevez vos résultats",
    description: "Livraison progressive et naturelle dans les heures suivant votre commande.",
    step: "04",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Comment ça <span className="gradient-text">fonctionne</span> ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple en 4 étapes pour booster votre présence en ligne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card rounded-2xl p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
