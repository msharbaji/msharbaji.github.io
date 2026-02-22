// Cloudflare Pages Function — handles contact form submissions
// To enable email sending, set RESEND_API_KEY in Cloudflare Pages env vars
// To enable Turnstile, set TURNSTILE_SECRET_KEY in Cloudflare Pages env vars

/** Minimal type for Cloudflare Pages Functions (avoids @cloudflare/workers-types dependency) */
type PagesFunction<Env = Record<string, unknown>> = (
  context: { request: Request; env: Env }
) => Response | Promise<Response>;

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CORS_ORIGIN?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": context.env.CORS_ORIGIN || "https://malsharbaji.com",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = (await context.request.json()) as ContactPayload;

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate message length
    if (body.message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify Turnstile token if configured
    if (context.env.TURNSTILE_SECRET_KEY && body.turnstileToken) {
      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: context.env.TURNSTILE_SECRET_KEY,
            response: body.turnstileToken,
          }),
        }
      );
      const turnstileData = (await turnstileRes.json()) as { success: boolean };
      if (!turnstileData.success) {
        return new Response(
          JSON.stringify({ error: "Captcha verification failed" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Send email via Resend if configured
    if (context.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: context.env.CONTACT_FROM_EMAIL || "contact@malsharbaji.com",
          to: context.env.CONTACT_TO_EMAIL || "msharbaji93@gmail.com",
          subject: `Contact form: ${body.name}`,
          text: `From: ${body.name} (${body.email})\n\n${body.message}`,
        }),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};
