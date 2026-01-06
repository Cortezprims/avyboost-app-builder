import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXOBOOSTER_API_URL = "https://exosupplier.com/api/v2";
const EXOBOOSTER_API_KEY = Deno.env.get('EXOBOOSTER_API_KEY');

interface ExoBoosterService {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching ExoBooster services/prices...");

    if (!EXOBOOSTER_API_KEY) {
      console.error("EXOBOOSTER_API_KEY not configured");
      throw new Error("API key not configured");
    }

    const params = new URLSearchParams({
      key: EXOBOOSTER_API_KEY,
      action: 'services',
    });

    console.log("Calling ExoBooster API for services...");

    const response = await fetch(EXOBOOSTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const responseText = await response.text();
    console.log("ExoBooster response length:", responseText.length);

    let services: ExoBoosterService[];
    try {
      services = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse ExoBooster response:", responseText.substring(0, 500));
      throw new Error("Invalid response from ExoBooster API");
    }

    // Check for API errors
    if ((services as any).error) {
      console.error("ExoBooster API error:", (services as any).error);
      throw new Error((services as any).error);
    }

    // Transform to a map by service ID for easy lookup
    const pricesMap: Record<string, { rate: number; min: number; max: number; name: string; category: string }> = {};
    
    if (Array.isArray(services)) {
      for (const service of services) {
        pricesMap[service.service] = {
          rate: parseFloat(service.rate),
          min: parseInt(service.min),
          max: parseInt(service.max),
          name: service.name,
          category: service.category,
        };
      }
    }

    console.log(`Successfully fetched ${Object.keys(pricesMap).length} services`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: pricesMap,
        count: Object.keys(pricesMap).length,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("ExoBooster prices function error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
