import { supabase } from "@/integrations/supabase/client";
import { auth } from "@/lib/firebase";

/**
 * Invokes a Supabase Edge Function and attaches the current user's
 * Firebase ID token via `x-firebase-token` so the function can verify
 * the caller's identity. Throws if the user is not authenticated.
 */
export async function invokeAuthedFn<T = unknown>(
  name: string,
  body: Record<string, unknown>,
) {
  const user = auth.currentUser;
  if (!user) {
    return { data: null as T | null, error: { message: "Not authenticated" } };
  }
  const idToken = await user.getIdToken();
  return supabase.functions.invoke<T>(name, {
    body,
    headers: { "x-firebase-token": idToken },
  });
}