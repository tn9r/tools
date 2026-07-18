import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  // Support both Cloudflare Pages Environment Variables and local .env
  const cfEnv = (locals as any).runtime?.env;
  const validKey = cfEnv?.API_KEY || import.meta.env.API_KEY;

  if (validKey) {
    const authHeader = request.headers.get("Authorization");
    const requestKey = authHeader?.replace("Bearer ", "") || request.headers.get("X-API-Key");

    if (requestKey !== validKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ message: "pong" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
