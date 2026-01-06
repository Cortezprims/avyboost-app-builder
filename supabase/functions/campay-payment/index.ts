import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CAMPAY_API_URL = "https://campay.net/api";
const CAMPAY_PERMANENT_TOKEN = Deno.env.get('CAMPAY_PERMANENT_TOKEN');

interface CollectRequest {
  action: 'collect' | 'status' | 'balance';
  phone?: string;
  amount?: number;
  description?: string;
  external_reference?: string;
  reference?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: CollectRequest = await req.json();
    const { action } = requestData;

    console.log('Campay request:', action, requestData);

    if (!CAMPAY_PERMANENT_TOKEN) {
      console.error('CAMPAY_PERMANENT_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const headers = {
      'Authorization': `Token ${CAMPAY_PERMANENT_TOKEN}`,
      'Content-Type': 'application/json',
    };

    let response;

    switch (action) {
      case 'collect': {
        const { phone, amount, description, external_reference } = requestData;
        
        if (!phone || !amount) {
          return new Response(
            JSON.stringify({ error: 'Phone and amount are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate phone number format (must start with 237)
        let formattedPhone = phone.replace(/\s+/g, '').replace(/^0/, '');
        if (!formattedPhone.startsWith('237')) {
          formattedPhone = '237' + formattedPhone;
        }

        console.log('Initiating collect payment:', { phone: formattedPhone, amount });

        response = await fetch(`${CAMPAY_API_URL}/collect/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            amount: amount.toString(),
            currency: 'XAF',
            from: formattedPhone,
            description: description || 'Recharge portefeuille AVYboost',
            external_reference: external_reference || `avyboost_${Date.now()}`,
          }),
        });
        break;
      }

      case 'status': {
        const { reference } = requestData;
        
        if (!reference) {
          return new Response(
            JSON.stringify({ error: 'Reference is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Checking transaction status:', { reference });

        // Campay status endpoint
        response = await fetch(`${CAMPAY_API_URL}/transaction/${reference}/`, {
          method: 'GET',
          headers,
        });
        
        const statusText = await response.text();
        console.log('Campay status raw response:', statusText);
        
        let statusData;
        try {
          statusData = JSON.parse(statusText);
        } catch {
          console.error('Failed to parse status response:', statusText);
          return new Response(
            JSON.stringify({ error: 'Invalid status response from payment service' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('Campay status parsed:', JSON.stringify(statusData));
        
        // Return the status data directly
        return new Response(
          JSON.stringify({ success: true, data: statusData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'balance': {
        console.log('Getting application balance');

        response = await fetch(`${CAMPAY_API_URL}/balance/`, {
          method: 'GET',
          headers,
        });
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const responseText = await response.text();
    console.log('Campay response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Campay response:', responseText);
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for Campay API errors
    if (data.error || data.message) {
      console.error('Campay API error:', data);
      return new Response(
        JSON.stringify({ error: data.message || data.error || 'Payment failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in campay-payment function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
