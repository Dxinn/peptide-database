// netlify/functions/insert-peptide.js

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SERVICE_ROLE = context.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const data = await req.json();

  const { error } = await supabase.from("peptides").insert(data);

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }));
};
