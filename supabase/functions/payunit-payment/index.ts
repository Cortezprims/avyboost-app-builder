import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyFirebaseRequest, unauthorizedResponse } from "../_shared/firebase-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-firebase-token",
};

const PAYUNIT_BASE_URL = "https://gateway.payunit.net";
const PAYUNIT_API_KEY = Deno.env.get("PAYUNIT_API_KEY");
const PAYUNIT_API_USER = Deno.env.get("PAYUNIT_API_USER");
const PAYUNIT_API_PASSWORD = Deno.env.get("PAYUNIT_API_PASSWORD");
const PAYUNIT_MODE = Deno.env.get("PAYUNIT_MODE") || "live";

const MAX_AMOUNT = 1_000_000;
const MIN_AMOUNT = 500;

type Validated =
  | {
      action: "initialize";
      amount: number;
      return_url: string;
      transaction_id: string;
      payment_country?: string;
      description?: string;
    }
  | { action: "status"; transaction_id: string };

function safeStr(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const cleaned = v.replace(/[\r\n\t]/g, " ").slice(0, max).trim();
  return cleaned || undefined;
}

function isHttpsUrl(v: unknown): v is string {
  if (typeof v !== "string") return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(input: unknown): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid payload" };
  const i = input as Record<string, unknown>;

  if (i.action === "initialize") {
    const amount = typeof i.amount === "number" ? i.amount : Number(i.amount);
    if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return { ok: false, error: "Invalid amount" };
    }
    if (!isHttpsUrl(i.return_url)) return { ok: false, error: "Invalid return_url" };
    const transaction_id = safeStr(i.transaction_id, 100);
    if (!transaction_id || !/^[A-Za-z0-9_-]{1,100}$/.test(transaction_id)) {
      return { ok: false, error: "Invalid transaction_id" };
    }
    const payment_country = safeStr(i.payment_country, 4);
    return {
      ok: true,
      data: {
        action: "initialize",
        amount,
        return_url: i.return_url as string,
        transaction_id,
        payment_country,
        description: safeStr(i.description, 200),
      },
    };
  }

  if (i.action === "status") {
    const transaction_id = safeStr(i.transaction_id, 100);
    if (!transaction_id || !/^[A-Za-z0-9_-]{1,100}$/.test(transaction_id)) {
      return { ok: false, error: "Invalid transaction_id" };
    }
    return { ok: true, data: { action: "status", transaction_id } };
  }

  return { ok: false, error: "Invalid action" };
}

function authHeaders() {
  const basic = btoa(`${PAYUNIT_API_USER}:${PAYUNIT_API_PASSWORD}`);
  return {
    "Content-Type": "application/json",
    "Authorization": `Basic ${basic}`,
    "x-api-key": PAYUNIT_API_KEY ?? "",
    "mode": PAYUNIT_MODE,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const user = await verifyFirebaseRequest(req);
    if (!user) return unauthorizedResponse(corsHeaders);

    if (!PAYUNIT_API_KEY || !PAYUNIT_API_USER || !PAYUNIT_API_PASSWORD) {
      console.error("PayUnit credentials missing");
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
    console.log("PayUnit request uid:", user.uid, "action:", data.action);

    let upstream: Response;
    if (data.action === "initialize") {
      upstream = await fetch(`${PAYUNIT_BASE_URL}/api/gateway/initialize`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          total_amount: data.amount,
          currency: "XAF",
          transaction_id: data.transaction_id,
          return_url: data.return_url,
          payment_country: data.payment_country || "CM",
          purchaseRef: data.transaction_id,
          name: (data.description || "Recharge AVYboost").slice(0, 120),
          description: data.description || "Recharge portefeuille AVYboost",
        }),
      });
    } else {
      upstream = await fetch(
        `${PAYUNIT_BASE_URL}/api/gateway/paymentstatus/${encodeURIComponent(data.transaction_id)}`,
        { method: "GET", headers: authHeaders() },
      );
    }

    const text = await upstream.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("PayUnit non-JSON response (server-only)", upstream.status);
      return new Response(
        JSON.stringify({ error: "Payment service error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!upstream.ok || (json?.status && String(json.status).toUpperCase() === "ERROR")) {
      console.error("PayUnit API error (server-only):", upstream.status, json);
      return new Response(
        JSON.stringify({ error: "Payment request was rejected. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: json }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in payunit-payment function (server-only):", error);
    return new Response(
      JSON.stringify({ error: "Unable to process payment. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});