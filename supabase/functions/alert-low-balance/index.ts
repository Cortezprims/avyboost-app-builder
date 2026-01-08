import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  customerEmail: string;
  serviceName: string;
  quantity: number;
  amount: number;
  exoBoosterBalance: string;
  targetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, serviceName, quantity, amount, exoBoosterBalance, targetUrl }: AlertRequest = await req.json();

    console.log("Sending low balance alert to admin:", {
      customerEmail,
      serviceName,
      quantity,
      amount,
      exoBoosterBalance,
    });

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
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
              .alert-box { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0; }
              .order-details { background: white; border-radius: 8px; padding: 15px; margin: 15px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .detail-label { color: #666; }
              .detail-value { font-weight: bold; }
              .balance { font-size: 24px; color: #dc3545; font-weight: bold; }
              .action-button { display: inline-block; background: #ff6b9d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Alerte Solde Insuffisant</h1>
              </div>
              <div class="content">
                <div class="alert-box">
                  <strong>Attention!</strong> Un client a passé une commande mais votre solde ExoBooster est insuffisant pour la traiter.
                </div>
                
                <div class="order-details">
                  <h3>📦 Détails de la commande</h3>
                  <div class="detail-row">
                    <span class="detail-label">Client:</span>
                    <span class="detail-value">${customerEmail}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">${serviceName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Quantité:</span>
                    <span class="detail-value">${quantity.toLocaleString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Montant:</span>
                    <span class="detail-value">${amount.toLocaleString()} XAF</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">URL cible:</span>
                    <span class="detail-value">${targetUrl}</span>
                  </div>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                  <p>Solde ExoBooster actuel:</p>
                  <p class="balance">$${exoBoosterBalance} USD</p>
                </div>

                <div style="text-align: center;">
                  <a href="https://exosupplier.com" class="action-button">
                    Recharger maintenant sur ExoSupplier
                  </a>
                </div>

                <div class="footer">
                  <p>Cet email a été envoyé automatiquement par AVYboost</p>
                  <p>Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Douala' })}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Alert email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending alert email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
