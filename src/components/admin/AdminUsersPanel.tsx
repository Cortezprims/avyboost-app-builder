import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Loader2, Search, Users, AlertCircle, Crown } from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  balance: number;
  loyaltyLevel: string;
  loyaltyPoints: number;
  referralCode: string;
  createdAt: Timestamp;
}

export function AdminUsersPanel({ userEmail }: { userEmail?: string }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    setLoading(true);

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: UserData[] = [];
      snap.forEach((doc) => list.push({ uid: doc.id, ...doc.data() } as UserData));
      setUsers(list);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    });

    return () => unsub();
  }, [isAdmin]);

  if (!isAdmin) return null;

  const formatDate = (ts: Timestamp) => {
    if (!ts?.toDate) return "N/A";
    return ts.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const filtered = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (u.email || '').toLowerCase().includes(term) ||
      (u.displayName || '').toLowerCase().includes(term) ||
      (u.uid || '').toLowerCase().includes(term) ||
      (u.referralCode || '').toLowerCase().includes(term);
  });

  const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0);

  const loyaltyColors: Record<string, string> = {
    bronze: "bg-orange-500/10 text-orange-600",
    silver: "bg-gray-400/10 text-gray-500",
    gold: "bg-yellow-500/10 text-yellow-600",
    platinum: "bg-purple-500/10 text-purple-600",
  };

  return (
    <Card className="border-2 border-indigo-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="w-5 h-5 text-indigo-500" />
          Utilisateurs de la plateforme
          <Badge variant="secondary" className="ml-auto text-xs">{users.length} utilisateurs</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">{users.length}</p>
            <p className="text-[10px] text-muted-foreground">Inscrits</p>
          </div>
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <p className="text-lg font-bold text-indigo-500">{totalBalance.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Solde total (XAF)</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10">
            <p className="text-lg font-bold text-green-500">
              {users.filter(u => (u.balance || 0) > 0).length}
            </p>
            <p className="text-[10px] text-muted-foreground">Avec solde</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead className="text-right">Solde</TableHead>
                  <TableHead className="text-center">Niveau</TableHead>
                  <TableHead className="text-right">Inscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1">
                          {user.email === ADMIN_EMAIL && <Crown className="w-3 h-3 text-yellow-500" />}
                          {user.displayName || 'Sans nom'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">Code: {user.referralCode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {(user.balance || 0).toLocaleString()} XAF
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${loyaltyColors[user.loyaltyLevel] || loyaltyColors.bronze}`}>
                        {user.loyaltyLevel || 'bronze'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
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
