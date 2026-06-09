import { jwtVerify, importX509 } from "https://deno.land/x/jose@v5.9.6/index.ts";

const FIREBASE_PROJECT_ID = "avyboost";
const CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

type KeyCache = { keys: Record<string, CryptoKey>; expires: number };
let certsCache: KeyCache = { keys: {}, expires: 0 };

async function getCerts(): Promise<Record<string, CryptoKey>> {
  if (Date.now() < certsCache.expires && Object.keys(certsCache.keys).length) {
    return certsCache.keys;
  }
  const res = await fetch(CERT_URL);
  if (!res.ok) throw new Error("cert_fetch_failed");
  const certs: Record<string, string> = await res.json();
  const keys: Record<string, CryptoKey> = {};
  for (const [kid, pem] of Object.entries(certs)) {
    keys[kid] = await importX509(pem, "RS256");
  }
  certsCache = { keys, expires: Date.now() + 60 * 60 * 1000 };
  return keys;
}

export interface FirebaseUser {
  uid: string;
  email?: string;
}

/**
 * Verify a Firebase ID token sent by the client in `x-firebase-token` header.
 * Returns the authenticated user, or null when invalid/missing.
 */
export async function verifyFirebaseRequest(
  req: Request,
): Promise<FirebaseUser | null> {
  try {
    const token = req.headers.get("x-firebase-token");
    if (!token) return null;
    const headerB64 = token.split(".")[0];
    if (!headerB64) return null;
    const header = JSON.parse(
      atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")),
    );
    const keys = await getCerts();
    const key = keys[header.kid];
    if (!key) return null;
    const { payload } = await jwtVerify(token, key, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    if (!payload.sub) return null;
    return { uid: payload.sub as string, email: payload.email as string | undefined };
  } catch (_e) {
    return null;
  }
}

export function unauthorizedResponse(corsHeaders: Record<string, string>) {
  return new Response(
    JSON.stringify({ error: "Unauthorized" }),
    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

export function htmlEncode(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}