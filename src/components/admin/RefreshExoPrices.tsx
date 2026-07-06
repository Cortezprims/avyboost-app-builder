import { useEffect, useState } from "react";
import { RefreshCw, Coins, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { readCachedExoPrices, refreshExoPricesFromBackend } from "@/lib/exoPriceCache";

export function RefreshExoPrices() {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const cached = readCachedExoPrices();
    if (!cached) return;
    setLastSync(new Date(cached.updatedAt));
    setCount(cached.count);
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await refreshExoPricesFromBackend();
      setLastSync(new Date(result.updatedAt));
      setCount(result.count);

      toast({
        title: "Tarifs actualisés",
        description: `${result.count} services synchronisés depuis ExoBooster.`,
      });
    } catch (e: any) {
      toast({
        title: "Échec de l'actualisation",
        description: e?.message || "Impossible de récupérer les tarifs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold">Tarifs ExoBooster en direct</h3>
            <p className="text-xs text-muted-foreground">
              Récupère les tarifs actuels et les applique automatiquement dans l'app (marge +25% incluse).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            {count > 0 ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {count} services en cache</>
            ) : (
              <>Aucune synchronisation encore effectuée</>
            )}
          </div>
          {lastSync && (
            <span>Dernière MAJ : {lastSync.toLocaleString("fr-FR")}</span>
          )}
        </div>

        <Button onClick={refresh} disabled={loading} className="w-full gradient-primary glow">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Actualisation…" : "Forcer l'actualisation des tarifs"}
        </Button>
      </CardContent>
    </Card>
  );
}