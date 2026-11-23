// Cloudflare Pages build step for Love Plus Miami.
// Copies index.html into public/ with small display fixes applied,
// and copies the assets/ folder (app logos) into public/assets/.
// Every fix must match exactly the expected number of times, or the build stops
// (so a site update can never silently skip a fix).
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';

const Q = '\\"';        // backslash + quote, as stored in the page template
const END = '<\\u002F'; // "</" as stored in the page template

const TITLE = 'Love Plus Miami | Activewear for Curves, Sizes XL-4X';
const DESC = 'Activewear made for curves, color, and Miami sunshine. Sizes XL-4X. Shop the Curve Shop, join the Love Club, and move with us in Miami.';

// Social profiles (all @loveplusmiami) and their footer icons, drawn in the footer's gray.
const ICON = '#9A8E95';
const SOCIALS = [
  ['instagram', 'Instagram', 'https://www.instagram.com/loveplusmiami',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${ICON}" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.6" cy="6.4" r="1.3" fill="${ICON}" stroke="none"/></svg>`],
  ['tiktok', 'TikTok', 'https://www.tiktok.com/@loveplusmiami',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${ICON}"><path d="M16.6 2h-3.4v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.1a6.4 6.4 0 1 0 5.4 6.3V8.6a8 8 0 0 0 4.6 1.5V6.7a4.7 4.7 0 0 1-4.6-4.7z"/></svg>`],
  ['facebook', 'Facebook', 'https://www.facebook.com/loveplusmiami',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${ICON}"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>`],
  ['youtube', 'YouTube', 'https://www.youtube.com/@loveplusmiami',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${ICON}"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>`],
];

const FIXES = [
  {
    name: 'Affiliate disclosure pills: hug the text, centered',
    from: 'display:flex;gap:8px;font-size:10px;font-weight:700;letter-spacing:.12em',
    to: 'display:flex;gap:8px;font-size:10px;font-weight:700;letter-spacing:.12em;align-items:center;align-self:center;line-height:1.2',
    times: 2,
  },
  {
    name: 'Shop all card: use a real product photo (missing assets/pl-img1.webp)',
    from: "All: 'assets/pl-img1.webp'",
    to: 'All: (all.find(p => p.img) || {}).img || PX(3621888)',
    times: 1,
  },
  {
    name: 'Gather AI card: use the Gather crowd-G logo',
    from: "{ name: 'Gather AI', initial: 'G'",
    to: "{ name: 'Gather AI', logo: 'assets/gather/gather-mark.svg', initial: 'G'",
    times: 1,
  },
  {
    name: 'Page title + search/share description (outer page, read by Google and link previews)',
    from: '<title>Bundled Page</title>',
    to: '<title>' + TITLE + '</title>\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '  <meta name="description" content="' + DESC + '">\n' +
      '  <meta property="og:type" content="website">\n' +
      '  <meta property="og:site_name" content="Love Plus Miami">\n' +
      '  <meta property="og:title" content="' + TITLE + '">\n' +
      '  <meta property="og:description" content="' + DESC + '">\n' +
      '  <meta property="og:url" content="https://loveplus.xyz/">\n' +
      '  <meta name="twitter:card" content="summary">\n' +
      '  <link rel="canonical" href="https://loveplus.xyz/">',
    times: 1,
  },
  {
    name: 'Page title inside the site itself (browser tab)',
    from: '<meta name=' + Q + 'viewport' + Q + ' content=' + Q + 'width=device-width, initial-scale=1' + Q + '>',
    to: '<meta name=' + Q + 'viewport' + Q + ' content=' + Q + 'width=device-width, initial-scale=1' + Q + '>' +
      '<title>' + TITLE + END + 'title>' +
      '<meta name=' + Q + 'description' + Q + ' content=' + Q + DESC + Q + '>',
    times: 1,
  },
  {
    // The page template is stored as escaped text: Q is an escaped quote, END starts a closing tag.
    name: 'Footer: social icons linking to @loveplusmiami',
    from: '<div style=' + Q + 'display:flex;gap:18px' + Q + '><span>Instagram' + END + 'span><span>TikTok' + END + 'span>',
    to: '<div style=' + Q + 'display:flex;gap:18px;flex-wrap:wrap;align-items:center' + Q + '>' +
      SOCIALS.map(([key, label, url]) => '<a href=' + Q + url + Q + ' target=' + Q + '_blank' + Q + ' rel=' + Q + 'noopener' + Q +
        ' aria-label=' + Q + 'Love Plus Miami on ' + label + Q + ' title=' + Q + label + Q +
        ' style=' + Q + 'display:inline-flex;line-height:0' + Q + ' style-hover=' + Q + 'opacity:.6' + Q + '>' +
        '<img src=' + Q + 'assets/social/' + key + '.svg' + Q + ' alt=' + Q + label + Q + ' width=' + Q + '20' + Q + ' height=' + Q + '20' + Q + '>' +
        END + 'a>').join(''),
    times: 1,
  },
  {
    name: 'Nav bar: always visible - menu links shown on every screen (swipe row on phones/tablets)',
    from: "navDisplay: S.w >= 1080 ? 'flex' : 'none',",
    to: "navDisplay: 'flex', " +
      "navLayout: S.w >= 1080 ? 'flex:1;min-width:0;justify-content:center' : 'order:3;flex:1 1 100%;min-width:0;justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:2px 0 4px', " +
      "headPad: S.w < 640 ? 'padding:10px 14px' : 'padding:14px 24px', " +
      "joinPad: S.w < 480 ? '0 14px' : '0 22px', " +
      "miamiShow: S.w < 420 ? 'none' : 'block',",
    times: 1,
  },
  {
    name: 'Nav bar: menu row layout',
    from: '<nav style=' + Q + 'display:{{ navDisplay }};flex:1;min-width:0;justify-content:center;gap:24px;',
    to: '<nav style=' + Q + 'display:flex;{{ navLayout }};gap:24px;',
    times: 1,
  },
  {
    name: 'Nav bar: header row wraps on small screens',
    from: 'padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px',
    to: '{{ headPad }};display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;row-gap:8px',
    times: 1,
  },
  {
    name: 'Nav bar: smaller Join button on phones',
    from: 'height:40px;padding:0 22px;border-radius:999px;background:#F2789F',
    to: 'height:40px;padding:{{ joinPad }};white-space:nowrap;border-radius:999px;background:#F2789F',
    times: 1,
  },
  {
    name: 'Nav bar: hide the small MIAMI word on very narrow phones',
    from: 'font-family:Fredoka,sans-serif;font-weight:700;font-size:15px;letter-spacing:.08em;white-space:nowrap;color:#F2789F',
    to: 'display:{{ miamiShow }};font-family:Fredoka,sans-serif;font-weight:700;font-size:15px;letter-spacing:.08em;white-space:nowrap;color:#F2789F',
    times: 1,
  },
];

let html = readFileSync('index.html', 'utf8');
for (const f of FIXES) {
  const found = html.split(f.from).length - 1;
  if (found !== f.times) {
    console.error(`Fix "${f.name}" expected ${f.times} match(es) but found ${found}. Stopping build.`);
    process.exit(1);
  }
  html = html.split(f.from).join(f.to);
  console.log(`Applied: ${f.name} (${found}x)`);
}

mkdirSync('public', { recursive: true });
writeFileSync('public/index.html', html);
if (existsSync('assets')) {
  cpSync('assets', 'public/assets', { recursive: true });
  console.log('Copied assets/ to public/assets/');
}

// App logos: each brand's logo lives in its own folder (assets/<brand>/),
// published under the exact name the page looks for.
const LOGOS = [
  ['assets/liveaskew', 'public/assets/liveaskew-mark.png'],
  ['assets/onixus', 'public/assets/onixus-mark.png'],
];
for (const [dir, target] of LOGOS) {
  const file = existsSync(dir) && readdirSync(dir).find(n => /\.png$/i.test(n));
  if (file) {
    cpSync(`${dir}/${file}`, target);
    console.log(`Logo published: ${dir}/${file} -> ${target}`);
  } else {
    console.log(`Logo not added yet: ${dir} (card shows an empty box until it is)`);
  }
}
// Footer social icons
mkdirSync('public/assets/social', { recursive: true });
for (const [key, , , svg] of SOCIALS) writeFileSync(`public/assets/social/${key}.svg`, svg);
console.log('Social icons written to public/assets/social/');

console.log('Build complete.');
