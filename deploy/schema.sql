-- Run once in the Neon SQL editor
create table if not exists signups (
  id bigserial primary key,
  type text not null check (type in ('club', 'vip', 'newsletter', 'rsvp')),
  email text not null,
  name text,
  event text,
  created_at timestamptz not null default now()
);
create unique index if not exists signups_unique on signups (type, email, coalesce(event, ''));

-- Handy views
create or replace view love_club_members as select name, email, created_at from signups where type = 'club' order by created_at desc;
create or replace view newsletter_list as select email, created_at from signups where type in ('newsletter', 'club', 'vip') group by email, created_at order by created_at desc;
create or replace view vip_waitlist as select name, email, created_at from signups where type = 'vip' order by created_at desc;
create or replace view event_rsvps as select event, name, email, created_at from signups where type = 'rsvp' order by event, created_at;
