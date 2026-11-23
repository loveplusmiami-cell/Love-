// Cloudflare Pages Function: POST /api/signup
// Saves Love Club, VIP list, newsletter and Miami Moves RSVPs to Neon.
// DATABASE_URL is set as an encrypted secret in Cloudflare Pages settings (never in GitHub).
import { neon } from '@neondatabase/serverless';

const TYPES = new Set(['club', 'vip', 'newsletter', 'rsvp']);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Something went wrong. Try again.' }, 400);
  }
  const { type, email, name, event } = body || {};
  if (!TYPES.has(type)) return json({ error: 'Unknown signup type' }, 400);
  if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Enter a valid email' }, 400);
  if (type === 'rsvp' && !event) return json({ error: 'Missing event' }, 400);
  try {
    const sql = neon(env.DATABASE_URL);
    if (type === 'rsvp') {
      const [{ count }] = await sql`select count(*)::int as count from signups where type = 'rsvp' and event = ${event}`;
      if (count >= 12) return json({ error: 'This class is full. Try another day!' }, 409);
    }
    await sql`insert into signups (type, email, name, event)
      values (${type}, ${email.trim().toLowerCase()}, ${name ? String(name).slice(0, 80) : null}, ${event || null})
      on conflict do nothing`;
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Something went wrong. Try again.' }, 500);
  }
}

// Any method other than POST
export const onRequest = () => json({ error: 'Method not allowed' }, 405);
