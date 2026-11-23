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
    name: 'Footer: clickable social links (@loveplusmiami)',
    from: '<div style=' + Q + 'display:flex;gap:18px' + Q + '><span>Instagram' + END + 'span><span>TikTok' + END + 'span>',
    to: '<div style=' + Q + 'display:flex;gap:18px;flex-wrap:wrap' + Q + '>' +
      [
        ['Instagram', 'https://www.instagram.com/loveplusmiami'],
        ['TikTok', 'https://www.tiktok.com/@loveplusmiami'],
        ['Facebook', 'https://www.facebook.com/loveplusmiami'],
        ['YouTube', 'https://www.youtube.com/@loveplusmiami'],
      ].map(([label, url]) => '<a href=' + Q + url + Q + ' target=' + Q + '_blank' + Q + ' rel=' + Q + 'noopener' + Q +
        ' style=' + Q + 'color:inherit;text-decoration:none' + Q + '>' + label + END + 'a>').join(''),
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
console.log('Build complete.');
