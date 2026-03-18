import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Loader2, Search, ArrowDownLeft, ArrowUpRight, AlertCircle, DollarSign } from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Transaction } from "@/lib/firestore";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

export function AdminTransactionsPanel({ userEmail }: { userEmail?: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    setLoading(true);
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const txs: Transaction[] = [];
      snap.forEach((doc) => txs.push({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [isAdmin]);

  if (!isAdmin) return null;

  const formatDate = (ts: Timestamp) => {
    if (!ts?.toDate) return "N/A";
    return ts.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const filtered = transactions.filter(tx => {
    const matchSearch = (tx.method || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.service || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.userId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "all" || tx.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalCredits = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <Card className="border-2 border-green-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="w-5 h-5 text-green-500" />
          Toutes les Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">{transactions.length}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10">
            <p className="text-lg font-bold text-green-500">+{totalCredits.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Crédits</p>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10">
            <p className="text-lg font-bold text-red-500">-{totalDebits.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Débits</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-md border bg-background text-sm">
            <option value="all">Tous</option>
            <option value="credit">Crédits</option>
            <option value="debit">Débits</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune transaction trouvée</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Détail</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-green-500" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{tx.userId?.slice(0, 8)}...</TableCell>
                    <TableCell className="text-sm">{tx.type === 'credit' ? tx.method : tx.service}</TableCell>
                    <TableCell className={`text-right font-medium ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} XAF
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {tx.status === 'completed' ? 'OK' : tx.status === 'pending' ? 'Attente' : tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{formatDate(tx.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
