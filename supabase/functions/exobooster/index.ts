import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyFirebaseRequest, unauthorizedResponse } from "../_shared/firebase-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-firebase-token",
};

const ALLOWED_ACTIONS = new Set(["services", "add", "status", "balance"]);
const EXOBOOSTER_API_URL = "https://exosupplier.com/api/v2";
const EXOBOOSTER_API_KEY = Deno.env.get("EXOBOOSTER_API_KEY");

type Validated = {
  action: "services" | "add" | "status" | "balance";
  service?: string;
  link?: string;
  quantity?: number;
  orderId?: string;
};

function validate(
  input: unknown,
): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid payload" };
  const i = input as Record<string, unknown>;
  if (typeof i.action !== "string" || !ALLOWED_ACTIONS.has(i.action)) {
    return { ok: false, error: "Invalid action" };
  }
  const out: Validated = { action: i.action as Validated["action"] };
  if (i.action === "add") {
    if (typeof i.service !== "string" || i.service.length === 0 || i.service.length > 50) {
      return { ok: false, error: "Invalid service" };
    }
    if (typeof i.link !== "string" || i.link.length === 0 || i.link.length > 500) {
      return { ok: false, error: "Invalid link" };
    }
    try {
      new URL(i.link);
    } catch {
      return { ok: false, error: "Invalid link" };
    }
    if (
      typeof i.quantity !== "number" || !Number.isInteger(i.quantity) ||
      i.quantity < 1 || i.quantity > 1_000_000
    ) {
      return { ok: false, error: "Invalid quantity" };
    }
    out.service = i.service;
    out.link = i.link;
    out.quantity = i.quantity;
  } else if (i.action === "status") {
    if (typeof i.orderId !== "string" || i.orderId.length === 0 || i.orderId.length > 64) {
      return { ok: false, error: "Invalid orderId" };
    }
    out.orderId = i.orderId;
  }
  return { ok: true, data: out };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const user = await verifyFirebaseRequest(req);
    if (!user) return unauthorizedResponse(corsHeaders);

    const raw = await req.json().catch(() => null);
    const validated = validate(raw);
    if (!validated.ok) {
      return new Response(
        JSON.stringify({ error: validated.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const requestData = validated.data;
    console.log("ExoBooster request uid:", user.uid, "action:", requestData.action);

    if (!EXOBOOSTER_API_KEY) {
      console.error("EXOBOOSTER_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const params: Record<string, string> = {
      key: EXOBOOSTER_API_KEY,
      action: requestData.action,
    };
    if (requestData.action === "add") {
      params.service = requestData.service!;
      params.link = requestData.link!;
      params.quantity = String(requestData.quantity);
    } else if (requestData.action === "status") {
      params.order = requestData.orderId!;
    }

    const response = await fetch(EXOBOOSTER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    });

    const responseText = await response.text();
    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("ExoBooster non-JSON response");
      return new Response(
        JSON.stringify({ error: "Upstream service error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (result.error) {
      console.error("ExoBooster API error (server-only):", result.error);
      return new Response(
        JSON.stringify({ error: "Request rejected by provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("ExoBooster function error (server-only):", error);
    return new Response(
      JSON.stringify({ error: "Unable to process request. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});