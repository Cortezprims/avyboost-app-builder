import { TrendingUp, Users, ShoppingCart, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Clients satisfaits",
    color: "text-primary",
  },
  {
    icon: ShoppingCart,
    value: "2M+",
    label: "Commandes livrées",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Taux de satisfaction",
    color: "text-primary",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Support disponible",
    color: "text-accent",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="font-display text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
