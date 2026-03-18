import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X } from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: Timestamp;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('avyboost_read_notifs');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const notifs: Notification[] = [];
      snap.forEach(doc => notifs.push({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifs);
    });
    return () => unsub();
  }, []);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
    localStorage.setItem('avyboost_read_notifs', JSON.stringify([...allIds]));
  };

  const formatDate = (ts: Timestamp) => {
    if (!ts?.toDate) return "";
    const d = ts.toDate();
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "À l'instant";
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] z-50 bg-background border rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  Aucune notification
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 ${!readIds.has(n.id) ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        </div>
                        {!readIds.has(n.id) && (
                          <Badge className="bg-primary text-[10px] shrink-0">Nouveau</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
