import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXOBOOSTER_API_URL = "https://exosupplier.com/api/v2";
const EXOBOOSTER_API_KEY = Deno.env.get('EXOBOOSTER_API_KEY');

interface ExoBoosterRequest {
  action: 'services' | 'add' | 'status' | 'balance';
  service?: string;
  link?: string;
  quantity?: number;
  orderId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ExoBoosterRequest = await req.json();
    console.log("ExoBooster request:", requestData);

    if (!EXOBOOSTER_API_KEY) {
      console.error("EXOBOOSTER_API_KEY not configured");
      throw new Error("API key not configured");
    }

    let params: Record<string, string> = {
      key: EXOBOOSTER_API_KEY,
      action: requestData.action,
    };

    // Add action-specific parameters
    switch (requestData.action) {
      case 'add':
        if (!requestData.service || !requestData.link || !requestData.quantity) {
          throw new Error("Missing required parameters: service, link, quantity");
        }
        params.service = requestData.service;
        params.link = requestData.link;
        params.quantity = requestData.quantity.toString();
        break;
      
      case 'status':
        if (!requestData.orderId) {
          throw new Error("Missing required parameter: orderId");
        }
        params.order = requestData.orderId;
        break;
      
      case 'services':
      case 'balance':
        // No additional parameters needed
        break;
      
      default:
        throw new Error(`Invalid action: ${requestData.action}`);
    }

    console.log("Calling ExoBooster API with params:", { ...params, key: '[REDACTED]' });

    // Make request to ExoBooster API
    const formData = new URLSearchParams(params);
    const response = await fetch(EXOBOOSTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log("ExoBooster raw response:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // If response is not JSON, wrap it
      result = { raw: responseText };
    }

    // Check for API errors
    if (result.error) {
      console.error("ExoBooster API error:", result.error);
      return new Response(
        JSON.stringify({ error: result.error }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("ExoBooster success response:", result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("ExoBooster function error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
