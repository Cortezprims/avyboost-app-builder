import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyFirebaseRequest, unauthorizedResponse, htmlEncode } from "../_shared/firebase-auth.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-firebase-token",
};

type Validated = {
  customerEmail: string;
  serviceName: string;
  quantity: number;
  amount: number;
  exoBoosterBalance: string;
  targetUrl: string;
};

function validate(input: unknown): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid payload" };
  const i = input as Record<string, unknown>;
  const customerEmail = typeof i.customerEmail === "string" ? i.customerEmail.slice(0, 254) : "";
  const serviceName = typeof i.serviceName === "string" ? i.serviceName.slice(0, 200) : "";
  const exoBoosterBalance = typeof i.exoBoosterBalance === "string" ? i.exoBoosterBalance.slice(0, 50) : "";
  const targetUrl = typeof i.targetUrl === "string" ? i.targetUrl.slice(0, 500) : "";
  const quantity = typeof i.quantity === "number" ? i.quantity : Number(i.quantity);
  const amount = typeof i.amount === "number" ? i.amount : Number(i.amount);
  if (!serviceName) return { ok: false, error: "Invalid serviceName" };
  if (!Number.isFinite(quantity) || quantity < 0 || quantity > 1_000_000_000) {
    return { ok: false, error: "Invalid quantity" };
  }
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000) {
    return { ok: false, error: "Invalid amount" };
  }
  return { ok: true, data: { customerEmail, serviceName, quantity, amount, exoBoosterBalance, targetUrl } };
}

const handler = async (req: Request): Promise<Response> => {
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
    const { customerEmail, serviceName, quantity, amount, exoBoosterBalance, targetUrl } = v.data;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Alert service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("Sending low balance alert from uid:", user.uid);

    const html = `<!DOCTYPE html><html><head><style>
      body{font-family:Arial,sans-serif;line-height:1.6;color:#333}
      .container{max-width:600px;margin:0 auto;padding:20px}
      .header{background:linear-gradient(135deg,#ff6b9d,#c44569);color:#fff;padding:20px;border-radius:10px 10px 0 0;text-align:center}
      .content{background:#f9f9f9;padding:20px;border-radius:0 0 10px 10px}
      .alert-box{background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:15px;margin:15px 0}
      .order-details{background:#fff;border-radius:8px;padding:15px;margin:15px 0}
      .detail-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}
      .balance{font-size:24px;color:#dc3545;font-weight:bold}
      .action-button{display:inline-block;background:#ff6b9d;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;margin-top:15px}
    </style></head><body><div class="container">
      <div class="header"><h1>⚠️ Alerte Solde Insuffisant</h1></div>
      <div class="content">
        <div class="alert-box"><strong>Attention!</strong> Un client a passé une commande mais votre solde ExoBooster est insuffisant pour la traiter.</div>
        <div class="order-details">
          <h3>📦 Détails de la commande</h3>
          <div class="detail-row"><span>Client:</span><span><strong>${htmlEncode(customerEmail)}</strong></span></div>
          <div class="detail-row"><span>Service:</span><span><strong>${htmlEncode(serviceName)}</strong></span></div>
          <div class="detail-row"><span>Quantité:</span><span><strong>${htmlEncode(quantity.toLocaleString())}</strong></span></div>
          <div class="detail-row"><span>Montant:</span><span><strong>${htmlEncode(amount.toLocaleString())} XAF</strong></span></div>
          <div class="detail-row"><span>URL cible:</span><span><strong>${htmlEncode(targetUrl)}</strong></span></div>
        </div>
        <div style="text-align:center;margin:20px 0">
          <p>Solde ExoBooster actuel:</p>
          <p class="balance">$${htmlEncode(exoBoosterBalance)} USD</p>
        </div>
        <div style="text-align:center"><a href="https://exosupplier.com" class="action-button">Recharger maintenant sur ExoSupplier</a></div>
        <div style="text-align:center;color:#666;font-size:12px;margin-top:20px">
          <p>Cet email a été envoyé automatiquement par AVYboost</p>
        </div>
      </div></div></body></html>`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AVYboost Alerts <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: "⚠️ ALERTE: Solde ExoBooster insuffisant - Commande en attente",
        html,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Resend send failed (server-only):", await emailResponse.text());
      return new Response(
        JSON.stringify({ error: "Unable to send alert" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending alert email (server-only):", error);
    return new Response(
      JSON.stringify({ error: "Unable to send alert" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);