import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, DollarSign, AlertTriangle } from "lucide-react";
import { useExoBooster } from "@/hooks/useExoBooster";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

interface ExoBoosterBalanceProps {
  userEmail?: string;
}

export function ExoBoosterBalance({ userEmail }: ExoBoosterBalanceProps) {
  const { getBalance, isLoading, error } = useExoBooster();
  const [balance, setBalance] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("USD");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const isAdmin = userEmail === ADMIN_EMAIL;

  const fetchBalance = async () => {
    const result = await getBalance();
    if (result) {
      setBalance(result.balance);
      setCurrency(result.currency);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchBalance();
    }
  }, [isAdmin]);

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  const balanceNum = parseFloat(balance || "0");
  const isLowBalance = balanceNum < 10;
  const isCriticalBalance = balanceNum < 5;

  return (
    <Card className={`border-2 ${isCriticalBalance ? 'border-destructive' : isLowBalance ? 'border-yellow-500' : 'border-green-500'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Solde ExoBooster (Admin)</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchBalance}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${isCriticalBalance ? 'text-destructive' : isLowBalance ? 'text-yellow-500' : 'text-green-500'}`}>
                {balance !== null ? parseFloat(balance).toFixed(2) : "--"}
              </span>
              <span className="text-muted-foreground">{currency}</span>
              {isCriticalBalance && (
                <Badge variant="destructive" className="ml-2">Critique!</Badge>
              )}
              {isLowBalance && !isCriticalBalance && (
                <Badge variant="secondary" className="ml-2 bg-yellow-500/20 text-yellow-600">Faible</Badge>
              )}
            </div>
            
            {lastRefresh && (
              <p className="text-xs text-muted-foreground mt-2">
                Dernière mise à jour: {lastRefresh.toLocaleTimeString('fr-FR')}
              </p>
            )}

            {isLowBalance && (
              <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Rechargez votre compte ExoBooster sur exosupplier.com
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
