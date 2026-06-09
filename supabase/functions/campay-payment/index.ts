import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyFirebaseRequest, unauthorizedResponse } from "../_shared/firebase-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-firebase-token",
};

const CAMPAY_API_URL = "https://campay.net/api";
const CAMPAY_PERMANENT_TOKEN = Deno.env.get("CAMPAY_PERMANENT_TOKEN");

const MAX_AMOUNT = 1_000_000; // XAF safety cap
const MIN_AMOUNT = 500;

type Validated =
  | { action: "collect"; phone: string; amount: number; description?: string; external_reference?: string }
  | { action: "status"; reference: string }
  | { action: "balance" };

function safeStr(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const cleaned = v.replace(/[\r\n\t]/g, " ").slice(0, max).trim();
  return cleaned || undefined;
}

function validate(input: unknown): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid payload" };
  const i = input as Record<string, unknown>;
  if (i.action === "collect") {
    const phoneRaw = typeof i.phone === "string" ? i.phone : "";
    const phone = phoneRaw.replace(/\s+/g, "").replace(/^0/, "");
    if (!/^[0-9]{8,15}$/.test(phone)) return { ok: false, error: "Invalid phone" };
    const amount = typeof i.amount === "number" ? i.amount : Number(i.amount);
    if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return { ok: false, error: "Invalid amount" };
    }
    return {
      ok: true,
      data: {
        action: "collect",
        phone,
        amount,
        description: safeStr(i.description, 200),
        external_reference: safeStr(i.external_reference, 100),
      },
    };
  }
  if (i.action === "status") {
    if (typeof i.reference !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(i.reference)) {
      return { ok: false, error: "Invalid reference" };
    }
    return { ok: true, data: { action: "status", reference: i.reference } };
  }
  if (i.action === "balance") return { ok: true, data: { action: "balance" } };
  return { ok: false, error: "Invalid action" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const user = await verifyFirebaseRequest(req);
    if (!user) return unauthorizedResponse(corsHeaders);

    const raw = await req.json().catch(() => null);
    const v = validate(raw);
    if (!v.ok) {
      return new Response(
        JSON.stringify({ error: v.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const requestData = v.data;
    console.log("Campay request uid:", user.uid, "action:", requestData.action);

    if (!CAMPAY_PERMANENT_TOKEN) {
      console.error("CAMPAY_PERMANENT_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Payment service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const headers = {
      "Authorization": `Token ${CAMPAY_PERMANENT_TOKEN}`,
      "Content-Type": "application/json",
    };

    let response: Response;
    if (requestData.action === "collect") {
      let formattedPhone = requestData.phone;
      if (!formattedPhone.startsWith("237")) formattedPhone = "237" + formattedPhone;
      response = await fetch(`${CAMPAY_API_URL}/collect/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: requestData.amount.toString(),
          currency: "XAF",
          from: formattedPhone,
          description: requestData.description || "Recharge portefeuille AVYboost",
          external_reference: requestData.external_reference || `avyboost_${Date.now()}`,
        }),
      });
    } else if (requestData.action === "status") {
      response = await fetch(`${CAMPAY_API_URL}/transaction/${requestData.reference}/`, {
        method: "GET",
        headers,
      });
      const statusText = await response.text();
      let statusData;
      try {
        statusData = JSON.parse(statusText);
      } catch {
        console.error("Campay status non-JSON (server-only)");
        return new Response(
          JSON.stringify({ error: "Payment service error" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ success: true, data: statusData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      response = await fetch(`${CAMPAY_API_URL}/balance/`, { method: "GET", headers });
    }

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Campay non-JSON response (server-only)");
      return new Response(
        JSON.stringify({ error: "Payment service error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (data.error || data.message) {
      console.error("Campay API error (server-only):", data);
      return new Response(
        JSON.stringify({ error: "Payment request was rejected. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in campay-payment function (server-only):", error);
    return new Response(
      JSON.stringify({ error: "Unable to process payment. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});