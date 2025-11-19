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

  // Debug to Netlify logs
  console.log("ENV CHECK:", { SUPABASE_URL: !!SUPABASE_URL, SERVICE_ROLE_EXISTS: !!SERVICE_ROLE });

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE env variables" }),
      { status: 500, headers: corsHeaders }
    );
  }

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

  console.log("Insert data:", data);

  // If you want to customize/validate data fields, do it here
  // Example basic validation:
  if (!data.peptide_name || !data.peptide_sequence) {
    return new Response(
      JSON.stringify({ error: "peptide_name and peptide_sequence are required" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { error, data: inserted } = await supabase.from("peptides").insert([data]).select();

  console.log("DB insert error:", error, "inserted:", inserted);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: corsHeaders }
    );
  }

  return new Response(JSON.stringify({ success: true, inserted: inserted }), {
    headers: corsHeaders
  });
};
