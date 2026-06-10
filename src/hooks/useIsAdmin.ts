import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

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
    const unsub = onSnapshot(
      doc(db, "admins", user.uid),
      (snap) => {
        setIsAdmin(snap.exists());
        setLoading(false);
      },
      () => {
        setIsAdmin(false);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [user]);

  return { isAdmin, loading };
}