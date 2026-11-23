import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const TYPES = new Set(['club', 'vip', 'newsletter', 'rsvp']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { type, email, name, event } = req.body || {};
  if (!TYPES.has(type)) return res.status(400).json({ error: 'Unknown signup type' });
  if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email' });
  if (type === 'rsvp' && !event) return res.status(400).json({ error: 'Missing event' });
  try {
    if (type === 'rsvp') {
      const [{ count }] = await sql`select count(*)::int as count from signups where type = 'rsvp' and event = ${event}`;
      if (count >= 12) return res.status(409).json({ error: 'This class is full. Try another day!' });
    }
    await sql`insert into signups (type, email, name, event)
      values (${type}, ${email.trim().toLowerCase()}, ${name ? String(name).slice(0, 80) : null}, ${event || null})
      on conflict do nothing`;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
}
