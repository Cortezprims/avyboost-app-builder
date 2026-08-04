import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyFirebaseRequest, unauthorizedResponse } from "../_shared/firebase-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-firebase-token",
};

const KORAPAY_BASE_URL = "https://api.korapay.com/merchant/api/v1";
const KORAPAY_SECRET_KEY = Deno.env.get("KORAPAY_SECRET_KEY");

const MAX_AMOUNT = 1_000_000;
const MIN_AMOUNT = 500;
const CURRENCY = "XAF";

function safeStr(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const cleaned = v.replace(/[\r\n\t]/g, " ").slice(0, max).trim();
  return cleaned || undefined;
}

function isHttpUrl(v: unknown): v is string {
  if (typeof v !== "string") return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

type Validated =
  | {
      action: "initialize";
      amount: number;
      reference: string;
      redirect_url: string;
      description?: string;
      customer_name?: string;
    }
  | { action: "status"; reference: string };

function validate(input: unknown): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid payload" };
  const i = input as Record<string, unknown>;
  const reference = safeStr(i.reference ?? i.transaction_id, 100);
  if (!reference || !/^[A-Za-z0-9_-]{1,100}$/.test(reference)) {
    return { ok: false, error: "Invalid reference" };
  }

  if (i.action === "initialize") {
    const amount = typeof i.amount === "number" ? i.amount : Number(i.amount);
    if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return { ok: false, error: "Invalid amount" };
    }
    if (!isHttpUrl(i.redirect_url ?? i.return_url)) return { ok: false, error: "Invalid redirect_url" };
    return {
      ok: true,
      data: {
        action: "initialize",
        amount,
        reference,
        redirect_url: (i.redirect_url ?? i.return_url) as string,
        description: safeStr(i.description, 200),
        customer_name: safeStr(i.customer_name, 100),
      },
    };
  }

  if (i.action === "status") return { ok: true, data: { action: "status", reference } };

  return { ok: false, error: "Invalid action" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const user = await verifyFirebaseRequest(req);
    if (!user) return unauthorizedResponse(corsHeaders);

    if (!KORAPAY_SECRET_KEY) {
      console.error("Korapay secret key missing");
      return new Response(
        JSON.stringify({ error: "Payment service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const raw = await req.json().catch(() => null);
    const v = validate(raw);
    if (!v.ok) {
      return new Response(
        JSON.stringify({ error: v.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const data = v.data;
    console.log("Korapay request uid:", user.uid, "action:", data.action);

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KORAPAY_SECRET_KEY}`,
    };

    let upstream: Response;
    if (data.action === "initialize") {
      upstream = await fetch(`${KORAPAY_BASE_URL}/charges/initialize`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: data.amount,
          currency: CURRENCY,
          reference: data.reference,
          redirect_url: data.redirect_url,
          narration: data.description || "Recharge portefeuille AVYboost",
          notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/korapay-payment`,
          customer: {
            name: data.customer_name || "Client AVYboost",
            email: user.email || `${user.uid}@avyboost.app`,
          },
          merchant_bears_cost: false,
          metadata: { uid: user.uid },
        }),
      });
    } else {
      upstream = await fetch(
        `${KORAPAY_BASE_URL}/charges/${encodeURIComponent(data.reference)}`,
        { method: "GET", headers },
      );
    }

    const text = await upstream.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("Korapay non-JSON response (server-only)", upstream.status);
      return new Response(
        JSON.stringify({ error: "Payment service error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!upstream.ok || json?.status === false) {
      console.error("Korapay API error (server-only):", upstream.status, json);
      return new Response(
        JSON.stringify({ error: json?.message || "Payment request was rejected. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: json?.data ?? json }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in korapay-payment function (server-only):", error);
    return new Response(
      JSON.stringify({ error: "Unable to process payment. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
