/* Love Plus Miami · Shop with Onyx
 * Floating Love Club sign-up funnel + shopping chat, powered by Onyx (Onixus).
 * Sign-ups go to Love Plus Miami's own list (/api/signup) and to her Onixus
 * account (Onyx leads). Chat replies come from her Onyx shop assistant.
 * The key below is the public (anon) Supabase key, safe to ship in a page. */
(function () {
  if (window.__lpmOnyx) return;
  window.__lpmOnyx = true;

  var ONYX_URL = 'https://rjwbfkuzgusaoizcmmgf.supabase.co/functions/v1/onyx-sales-chat';
  var ONYX_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqd2Jma3V6Z3VzYW9pemNtbWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODc1MzIsImV4cCI6MjEwMjQ2MzUzMn0.TWTs73ppJgdnHfuJ4GQAGyACL1grqjsgNKmAWoR8tqQ';
  var RECIPIENT = 'loveplusmiami';
  var SIZES = ['XL', '1X', '2X', '3X', '4X'];
  var STYLES = ['Leggings', 'Sets', 'Sports bras', 'Shorts', 'Tops'];

  var css = [
    '.lpo-bubble{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:8px;padding:12px 18px;border:0;border-radius:999px;background:#F2789F;color:#fff;font:600 15px/1 Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(23,18,25,.25);cursor:pointer}',
    '.lpo-bubble:hover{background:#e9658f}',
    '.lpo-panel{position:fixed;right:18px;bottom:80px;z-index:2147483001;width:360px;max-width:calc(100vw - 24px);max-height:min(620px,calc(100vh - 110px));display:none;flex-direction:column;background:#FBF7F1;color:#171219;border-radius:20px;box-shadow:0 24px 60px rgba(23,18,25,.3);overflow:hidden;font:15px/1.45 Inter,system-ui,sans-serif}',
    '.lpo-panel.open{display:flex}',
    '.lpo-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#171219;color:#fff}',
    '.lpo-head b{font-size:16px}.lpo-x{background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:4px 6px}',
    '.lpo-tabs{display:flex;gap:6px;padding:10px 12px 0}',
    '.lpo-tab{flex:1;padding:9px;border:1px solid #e6dcd2;border-radius:999px;background:#fff;color:#4A3F46;font-weight:600;cursor:pointer}',
    '.lpo-tab[aria-selected=true]{background:#F2789F;border-color:#F2789F;color:#fff}',
    '.lpo-body{padding:14px 16px;overflow:auto;flex:1}',
    '.lpo-step{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9A8E95;margin:0 0 6px}',
    '.lpo-h{font-size:20px;font-weight:800;margin:0 0 6px}.lpo-p{margin:0 0 12px;color:#4A3F46}',
    '.lpo-in{width:100%;box-sizing:border-box;padding:11px 12px;margin:0 0 10px;border:1px solid #e6dcd2;border-radius:12px;background:#fff;font:inherit;color:#171219}',
    '.lpo-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}',
    '.lpo-chip{padding:8px 13px;border:1px solid #e6dcd2;border-radius:999px;background:#fff;color:#171219;font:inherit;font-size:14px;cursor:pointer}',
    '.lpo-chip[aria-pressed=true]{background:#2BB3B1;border-color:#2BB3B1;color:#fff}',
    '.lpo-go{width:100%;padding:12px;border:0;border-radius:12px;background:#FF6F59;color:#fff;font:inherit;font-weight:700;cursor:pointer}',
    '.lpo-go[disabled]{opacity:.6;cursor:wait}',
    '.lpo-err{color:#c0392b;font-size:13px;margin:0 0 8px;min-height:1em}',
    '.lpo-msgs{display:flex;flex-direction:column;gap:8px}',
    '.lpo-m{max-width:85%;padding:9px 12px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}',
    '.lpo-m.me{align-self:flex-end;background:#F2789F;color:#fff}.lpo-m.bot{align-self:flex-start;background:#fff;border:1px solid #eee}',
    '.lpo-chat{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #eee;background:#fff}',
    '.lpo-chat .lpo-in{margin:0}.lpo-send{padding:0 14px;border:0;border-radius:12px;background:#171219;color:#fff;font-weight:700;cursor:pointer}',
    '.lpo-foot{padding:8px 12px;text-align:center;font-size:12px;color:#9A8E95;background:#FBF7F1}',
    '.lpo-foot a{color:#9A8E95}',
    '@media(max-width:480px){.lpo-panel{right:8px;left:8px;bottom:76px;width:auto;max-width:none}.lpo-bubble{right:12px;bottom:12px}}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function store(key, val) {
    try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; }
  }
  function onyx(payload) {
    payload.recipient_key = RECIPIENT;
    return fetch(ONYX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: ONYX_KEY, Authorization: 'Bearer ' + ONYX_KEY },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'error'); return j; }); });
  }

  var state = { step: 1, name: '', email: '', sizes: [], styles: [] };
  var bubble = el('button', { class: 'lpo-bubble', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', text: '💗 Shop with Onyx' });
  var panel = el('div', { class: 'lpo-panel', role: 'dialog', 'aria-label': 'Love Plus Miami: Love Club and shopping help' });
  var body = el('div', { class: 'lpo-body' });
  var chatBar = el('div', { class: 'lpo-chat' });
  var tabClub = el('button', { class: 'lpo-tab', type: 'button', role: 'tab', 'aria-selected': 'true', text: 'Join the Love Club' });
  var tabChat = el('button', { class: 'lpo-tab', type: 'button', role: 'tab', 'aria-selected': 'false', text: 'Ask Onyx' });

  panel.appendChild(el('div', { class: 'lpo-head' }, [
    el('b', { text: 'Love Plus Miami' }),
    el('button', { class: 'lpo-x', type: 'button', 'aria-label': 'Close', text: '×', onclick: function () { toggle(false); } })
  ]));
  panel.appendChild(el('div', { class: 'lpo-tabs', role: 'tablist' }, [tabClub, tabChat]));
  panel.appendChild(body);
  panel.appendChild(chatBar);
  panel.appendChild(el('div', { class: 'lpo-foot' }, [
    document.createTextNode('Powered by '),
    el('a', { href: 'https://onixus.xyz', target: '_blank', rel: 'noopener', text: 'Onyx' })
  ]));
  document.body.appendChild(panel);
  document.body.appendChild(bubble);

  function toggle(open) {
    panel.classList.toggle('open', open);
    bubble.setAttribute('aria-expanded', String(open));
    if (open) render();
  }
  bubble.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
  tabClub.addEventListener('click', function () { mode = 'club'; render(); });
  tabChat.addEventListener('click', function () { mode = 'chat'; render(); });

  var mode = 'club';
  var busy = false;
  var msgs = [{ me: false, text: "Hey love! Shopping for activewear in XL-4X, or want to join the Love Club? Tell me what you're looking for." }];

  function chips(list, picked) {
    return el('div', { class: 'lpo-chips' }, list.map(function (v) {
      return el('button', {
        class: 'lpo-chip', type: 'button', 'aria-pressed': String(picked.indexOf(v) > -1), text: v,
        onclick: function (e) {
          var i = picked.indexOf(v);
          if (i > -1) picked.splice(i, 1); else picked.push(v);
          e.currentTarget.setAttribute('aria-pressed', String(i === -1));
        }
      });
    }));
  }

  function renderClub() {
    var err = el('p', { class: 'lpo-err', role: 'alert' });
    if (state.step === 1) {
      var n = el('input', { class: 'lpo-in', placeholder: 'First name', autocomplete: 'given-name', 'aria-label': 'First name' });
      var m = el('input', { class: 'lpo-in', type: 'email', placeholder: 'Email', autocomplete: 'email', 'aria-label': 'Email' });
      n.value = state.name; m.value = state.email;
      body.append(
        el('p', { class: 'lpo-step', text: 'Step 1 of 3' }),
        el('h3', { class: 'lpo-h', text: 'Join the Love Club' }),
        el('p', { class: 'lpo-p', text: 'First dibs on drops in your size, Miami Moves classes, and member-only love.' }),
        n, m, err,
        el('button', { class: 'lpo-go', type: 'button', text: 'Next: my sizes', onclick: function () {
          var email = m.value.trim();
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Enter a valid email'; m.focus(); return; }
          state.name = n.value.trim(); state.email = email; state.step = 2; render();
        } })
      );
    } else if (state.step === 2) {
      var go = el('button', { class: 'lpo-go', type: 'button', text: 'Join the Love Club' });
      go.addEventListener('click', function () {
        go.disabled = true; go.textContent = 'Joining…'; err.textContent = '';
        var details = 'Sizes: ' + (state.sizes.join(', ') || 'not set') + '; Styles: ' + (state.styles.join(', ') || 'not set');
        var club = fetch('/api/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'club', email: state.email, name: state.name })
        }).then(function (r) { if (!r.ok) throw new Error('club'); });
        var lead = onyx({ action: 'signup', email: state.email, name: state.name, interest: 'Love Club', details: details, page: location.href });
        Promise.allSettled([club, lead]).then(function (res) {
          if (res[0].status === 'rejected' && res[1].status === 'rejected') {
            go.disabled = false; go.textContent = 'Join the Love Club'; err.textContent = 'Something went wrong. Try again.';
            return;
          }
          state.step = 3; render();
        });
      });
      body.append(
        el('p', { class: 'lpo-step', text: 'Step 2 of 3' }),
        el('h3', { class: 'lpo-h', text: 'Your sizes & style' }),
        el('p', { class: 'lpo-p', text: 'Pick all that fit. We use this to show you what comes in your size.' }),
        chips(SIZES, state.sizes),
        chips(STYLES, state.styles),
        err, go
      );
    } else {
      body.append(
        el('p', { class: 'lpo-step', text: 'Step 3 of 3' }),
        el('h3', { class: 'lpo-h', text: "You're in the Love Club" + (state.name ? ', ' + state.name : '') + ' 💗' }),
        el('p', { class: 'lpo-p', text: 'Watch your inbox for your size picks and your first-order perk. Ready to shop now?' }),
        el('button', { class: 'lpo-go', type: 'button', text: 'Shop the Curve Shop', onclick: function () {
          toggle(false);
          var t = document.getElementById('shop');
          if (t) t.scrollIntoView({ behavior: 'smooth' });
        } })
      );
    }
  }

  function renderChat() {
    var list = el('div', { class: 'lpo-msgs', 'aria-live': 'polite' });
    msgs.forEach(function (m) { list.appendChild(el('div', { class: 'lpo-m ' + (m.me ? 'me' : 'bot'), text: m.text })); });
    body.appendChild(list);
    var input = el('input', { class: 'lpo-in', placeholder: 'Ask about sizes, sets, classes…', 'aria-label': 'Message Onyx', maxlength: '1500' });
    var send = el('button', { class: 'lpo-send', type: 'button', text: 'Send' });
    function go() {
      var text = input.value.trim();
      if (!text || busy) return;
      busy = true;
      msgs.push({ me: true, text: text });
      msgs.push({ me: false, text: '…' });
      render();
      onyx({ message: text, session_token: store('lpo_session') || undefined })
        .then(function (j) { if (j.session_token) store('lpo_session', j.session_token); msgs[msgs.length - 1].text = j.reply || 'Thanks! The team will follow up.'; })
        .catch(function () { msgs[msgs.length - 1].text = "Sorry, I couldn't answer that just now. Please try again."; })
        .then(function () { busy = false; render(); });
    }
    send.addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    chatBar.append(input, send);
    body.scrollTop = body.scrollHeight;
    setTimeout(function () { input.focus(); }, 0);
  }

  function render() {
    body.textContent = '';
    chatBar.textContent = '';
    tabClub.setAttribute('aria-selected', String(mode === 'club'));
    tabChat.setAttribute('aria-selected', String(mode === 'chat'));
    chatBar.style.display = mode === 'chat' ? 'flex' : 'none';
    if (mode === 'club') renderClub(); else renderChat();
  }
})();
