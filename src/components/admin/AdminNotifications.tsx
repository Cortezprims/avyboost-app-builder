import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

export function AdminNotifications({ userEmail }: { userEmail?: string }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (userEmail !== ADMIN_EMAIL) return null;

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Veuillez remplir le titre et le message");
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        title: title.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });
      toast.success("Notification envoyée à tous les utilisateurs !");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-2 border-yellow-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="w-5 h-5 text-yellow-500" />
          Envoyer une Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Titre de la notification"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Message de la notification..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSend} disabled={sending} className="w-full gradient-primary">
          {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Envoyer à tous les utilisateurs
        </Button>
      </CardContent>
    </Card>
  );
}
