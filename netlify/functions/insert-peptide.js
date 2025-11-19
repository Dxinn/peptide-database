import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SERVICE_ROLE = context.env.SUPABASE_SERVICE_ROLE_KEY;

  // Debug log to Netlify
  console.log("ENV CHECK:", {
    SUPABASE_URL,
    SERVICE_ROLE_EXISTS: !!SERVICE_ROLE
  });

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE env variables" }),
      { status: 500 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  let data;
  try {
    data = await req.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400 }
    );
  }

  console.log("Insert data:", data);

  const { error } = await supabase.from("peptides").insert(data);

  console.log("DB Error:", error);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
