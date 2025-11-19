// netlify/functions/insert-peptide.js

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (req, context) => {
  // CORS 允许跨域
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SERVICE_ROLE = context.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  let data;
  try {
    data = await req.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON", detail: err.message }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { error } = await supabase.from("peptides").insert(data);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: corsHeaders }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: corsHeaders
  });
};
