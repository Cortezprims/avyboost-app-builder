import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

// UX-only fallback: these emails see the admin UI even before their
// `admins/{uid}` document is created. Real authorization is still enforced
// server-side by Firestore Security Rules — without the admins doc, admin
// data queries will simply return empty.
const ADMIN_EMAIL_FALLBACK = new Set<string>([
  "avydigitalbusiness@gmail.com",
]);

/**
 * Returns true when the signed-in user has an `admins/{uid}` document in
 * Firestore. This is purely a UX gate — real authorization is enforced by
 * Firestore Security Rules (see `firestore.rules`). Removing or bypassing
 * this check cannot grant access to admin data.
 */
export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const emailFallback = !!user.email && ADMIN_EMAIL_FALLBACK.has(user.email.toLowerCase());
    if (emailFallback) {
      setIsAdmin(true);
      setLoading(false);
    }
    const unsub = onSnapshot(
      doc(db, "admins", user.uid),
      (snap) => {
        setIsAdmin(snap.exists() || emailFallback);
        setLoading(false);
      },
      () => {
        setIsAdmin(emailFallback);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [user]);

  return { isAdmin, loading };
}