# Love Plus Miami — go live

This folder is the live site:
- `index.html` — the whole website (shop, pages, cart). Products and checkout come from Shopify.
- `api/signup.js` — saves Love Club, VIP list, newsletter and Miami Moves RSVPs to Neon.
- `schema.sql` — the database table.

## 1. Neon (database)
1. In Neon, open your project → **SQL Editor**.
2. Paste everything from `schema.sql` and click **Run**.
3. Go to **Dashboard → Connection string** and copy it (starts with `postgresql://`).

## 2. GitHub
1. Create a new repository, e.g. `love-plus-miami`.
2. Upload everything in this folder (keep the `api` folder).

## 3. Vercel (hosting)
1. **Add New → Project** → import the GitHub repo. Framework preset: **Other**. Leave build settings empty.
2. Before deploying, open **Environment Variables** and add:
   - `DATABASE_URL` = your Neon connection string
3. Click **Deploy**.
4. **Settings → Domains** → add your domain and follow the DNS steps.

## 4. Shopify
- Products must be published to the sales channel your Storefront token belongs to (Headless or your custom app).
- Under **Settings → Checkout**, set your store policies and shipping rates to match the site's Shipping and Returns pages.

## 5. Test
- Join Love Club, join the VIP list, sign up for the newsletter and RSVP to a class.
- In Neon run `select * from signups;` — you should see all four rows.
- Place a test order through the cart, then refund it in Shopify.

## Viewing signups
In the Neon SQL editor: `select * from love_club_members;`, `vip_waitlist`, `newsletter_list`, `event_rsvps`.
