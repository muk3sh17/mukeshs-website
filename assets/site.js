// Shared chrome + motion for every page: nav, contact footer, cursor, smooth scroll,
// text reveals and page transitions.
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const touch = matchMedia('(pointer: coarse)').matches;

export const EMAIL = 'sankarasettymukesh@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/mukesh-sankarasetty/';
export const GITHUB = 'https://github.com/muk3sh17';
export const RESUME = 'assets/Mukesh_Sankarasetty_Resume.pdf';

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Escapes text and highlights unfinished content ("TODO…") so gaps are obvious.
export const txt = s => s == null ? '' : String(s).startsWith('TODO') ? `<span class="todo">${esc(s)}</span>` : esc(s);
export const pad = i => String(i + 1).padStart(2, '0');
export const row = (p, i) => `<li data-tags="${esc([p.type === 'work' ? 'Professional' : 'Independent', ...p.tags].join('|'))}">
  <a class="prow" href="case.html#${p.slug}" data-hue="${p.hue}" data-title="${esc(p.title)}" data-client="${esc(p.client)}"${p.cover ? ` data-cover="${esc(p.cover)}"` : ''}>
    <span class="prow__fill" aria-hidden="true"></span>
    <span class="prow__idx mono">${pad(i)}</span>
    <span class="prow__title">${esc(p.title)}<small>${txt(p.client)} — ${txt(p.role)}</small></span>
    <span class="prow__tags mono">${p.status ? `<span class="chip chip--live">${esc(p.status)}</span>` : ''}${p.tags.map(t => `<span class="chip">${txt(t)}</span>`).join('')}</span>
    <span class="prow__year mono">${txt(p.year)}</span>
    <span class="prow__arrow" aria-hidden="true">&rarr;</span>
  </a></li>`;
// Decode effect for mono UI text: characters cycle through glyphs before settling.
export function scramble(el, dur = 0.9) {
  if (!el || reduce) return;
  const final = el.dataset.text ??= el.textContent, glyphs = '!<>-_/[]{}=+*^?#01';
  const o = { p: 0 };
  gsap.to(o, { p: 1, duration: dur, ease: 'none', onUpdate: () => {
    el.textContent = [...final].map((c, i) => c === ' ' || i / final.length < o.p ? c : glyphs[(Math.random() * glyphs.length) | 0]).join('');
  }, onComplete: () => el.textContent = final });
}

// 3D tilt with a moving glare for [data-tilt] cards
function tilt() {
  if (touch || reduce) return;
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      gsap.to(el, { rotateY: (x - 0.5) * 14, rotateX: (0.5 - y) * 12, duration: 0.6, ease: 'power3.out' });
      el.style.setProperty('--gx', x * 100 + '%'); el.style.setProperty('--gy', y * 100 + '%'); el.style.setProperty('--ga', 1);
    });
    el.addEventListener('pointerleave', () => { gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1,0.5)' }); el.style.setProperty('--ga', 0); });
  });
}
const roll = (href, label, attrs = '') => `<a class="roll" href="${href}" ${attrs}><span data-t="${label}">${label}</span></a>`;

function chrome() {
  const page = document.body.dataset.page;
  const cur = p => page === p ? 'aria-current="page"' : '';
  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip" href="#main">Skip to content</a>
    <div class="curtain" aria-hidden="true"><span class="mono">Mukesh Sankarasetty — AI Product Manager</span><div class="curtain__count"></div></div>
    <div class="grain" aria-hidden="true"></div>
    <div class="cursor" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"><span>View</span></div></div>
    <header class="nav">
      <ul class="nav__links mono">
        <li>${roll('about.html', 'About me', cur('about'))}</li>
        <li>${roll('work.html', 'Work', cur('work'))}</li>
        <li>${roll('#contact', 'Contact')}</li>
        <li><a class="nav__cta" href="${RESUME}" download>Resume <span aria-hidden="true">&darr;</span></a></li>
      </ul>
    </header>`);
  // the home page ends in its own contact chapter
  if (page !== 'home') document.querySelector('main').insertAdjacentHTML('beforeend', `
    <section id="contact" class="contact">
      <div>
        <span class="label">Contact</span>
        <h2 class="display" data-split>Let's build what <em>AI</em> makes possible.</h2>
        <div class="contact__links">
          <a class="btn" href="mailto:${EMAIL}" data-magnetic>${EMAIL} <i>&rarr;</i></a>
          <a class="btn" href="${LINKEDIN}" target="_blank" rel="noopener" data-magnetic>LinkedIn <i>&rarr;</i></a>
          <a class="btn" href="${GITHUB}" target="_blank" rel="noopener" data-magnetic>GitHub <i>&rarr;</i></a>
          <a class="btn" href="${RESUME}" target="_blank" rel="noopener" data-magnetic>Résumé (PDF) <i>&darr;</i></a>
        </div>
      </div>
      <footer class="footer mono">
        <ul><li>${roll('about.html', 'About me')}</li><li>${roll('work.html', 'Work')}</li><li>${roll(RESUME, 'Resume', 'download')}</li><li>${roll(LINKEDIN, 'LinkedIn', 'target="_blank" rel="noopener"')}</li></ul>
        <span>Bangalore, India</span>
        <span>&copy; ${new Date().getFullYear()} Mukesh Sankarasetty</span>
        <button class="totop" data-magnetic>Back to top &uarr;</button>
      </footer>
    </section>`);
}

function splitWords(el) {
  const frag = document.createDocumentFragment();
  [...el.childNodes].forEach(node => {
    const tag = node.nodeType === 3 ? 'span' : node.tagName.toLowerCase();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) return frag.append(' ');
      const w = document.createElement('span'), i = document.createElement(tag);
      w.className = 'w'; i.className = ('wi ' + (node.className || '')).trim(); i.textContent = part;
      w.append(i); frag.append(w);
    });
  });
  el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
  el.replaceChildren(frag);
  return el.querySelectorAll('.wi');
}
function splitChars(line) {
  // chars grouped per word so lines only wrap between words; highlighted words (<em>) keep their element
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType !== 3) return walk(c);
    const f = document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(w => {
      if (!w) return;
      if (/^\s+$/.test(w)) return f.append(' ');
      const wd = document.createElement('span');
      wd.className = 'wd'; wd.innerHTML = [...w].map(ch => `<span class="ch">${esc(ch)}</span>`).join('');
      f.append(wd);
    });
    c.replaceWith(f);
  });
  walk(line);
  return [...line.querySelectorAll('.ch')];
}

const heroTweens = [];
function reveals() {
  document.querySelectorAll('[data-split]').forEach(el => {
    const words = splitWords(el);
    if (reduce) return;
    const inHero = el.closest('[data-hero-zone]');
    const tw = gsap.from(words, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.018,
      scrollTrigger: inHero ? null : { trigger: el, start: 'top 88%' }, paused: !!inHero });
    if (inHero) heroTweens.push(tw);
  });
  document.querySelectorAll('[data-scrub]').forEach(el => {
    const words = splitWords(el);
    if (reduce) return;
    gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } });
  });
  document.querySelectorAll('[data-count]').forEach(el => {
    const o = { v: 0 }, end = +el.dataset.count, suffix = el.dataset.suffix || '';
    gsap.to(o, { v: end, duration: reduce ? 0 : 2, ease: 'expo.out',
      onUpdate: () => el.textContent = Math.round(o.v) + suffix, scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  if (reduce) return;
  gsap.utils.toArray('.prow').forEach(p => gsap.fromTo(p, { '--s': 0 }, { '--s': 1, duration: 1.4, ease: 'expo.inOut',
    scrollTrigger: { trigger: p, start: 'top 94%' } }));
  gsap.utils.toArray('[data-reveal]').forEach(el => gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 90%' } }));
}

function pointer() {
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  if (touch) return;
  const L = (a, b, t) => a + (b - a) * t;
  const cur = document.querySelector('.cursor');
  const dot = cur.querySelector('.cursor__dot'), ring = cur.querySelector('.cursor__ring');
  const r = { ...mouse };
  gsap.ticker.add(() => {
    r.x = L(r.x, mouse.x, 0.18); r.y = L(r.y, mouse.y, 0.18);
    dot.style.transform = `translate(${mouse.x}px,${mouse.y}px)`;
    ring.style.transform = `translate(${r.x}px,${r.y}px)`;
  });
  // event delegation: works for content rendered later too
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('a, button');
    if (el && !el.contains(e.relatedTarget)) cur.classList.add(el.hasAttribute('data-hue') ? 'is-view' : 'is-hover');
  });
  document.addEventListener('mouseout', e => {
    const el = e.target.closest('a, button');
    if (el && !el.contains(e.relatedTarget)) cur.classList.remove('is-view', 'is-hover');
  });
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const b = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - b.left - b.width / 2) * 0.3, y: (e.clientY - b.top - b.height / 2) * 0.4, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,0.4)' }));
  });
}

export let lenis = null;
export let velocity = 0;

gsap.registerPlugin(ScrollTrigger);

export function init() {
  chrome();
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.stop();
    lenis.on('scroll', e => { velocity = e.velocity; ScrollTrigger.update(); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = t => lenis ? lenis.scrollTo(t, { duration: 1.6 }) : document.querySelector(t)?.scrollIntoView();
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    if (href.startsWith('#')) { e.preventDefault(); return scrollTo(href); }
    if (a.origin !== location.origin || href.startsWith('mailto:') || href.endsWith('.pdf')) return;
    e.preventDefault(); leave(a.href);
  });
  document.querySelector('.totop').addEventListener('click', () => scrollTo(0));

  const heroChars = [...document.querySelectorAll('[data-hero] .line')].flatMap(splitChars);
  reveals();
  pointer();
  tilt();
  enter(heroChars);
}

// Page transitions: curtain lifts on enter, drops on leave.
function enter(heroChars) {
  const curtain = document.querySelector('.curtain'), count = curtain.querySelector('.curtain__count');
  const first = document.body.dataset.page === 'home' && !sessionStorage.getItem('seen');
  try { sessionStorage.setItem('seen', 1); } catch {}
  const tl = gsap.timeline({ onComplete: () => { document.body.classList.remove('loading'); lenis?.start(); ScrollTrigger.refresh(); } });
  if (first && !reduce) {
    const o = { v: 0 };
    tl.to(o, { v: 100, duration: 1.8, ease: 'power3.inOut', onUpdate: () => count.textContent = Math.round(o.v) });
  }
  tl.to(curtain, { clipPath: 'inset(0 0 100% 0)', duration: reduce ? 0 : 1.1, ease: 'expo.inOut' });
  if (!reduce) {
    tl.from(heroChars, { yPercent: 115, rotate: 6, duration: 1.4, ease: 'expo.out', stagger: 0.03 }, '-=0.5')
      .add(() => heroTweens.forEach(t => t.play()), '<0.3')
      .from('.nav', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out' }, '<');
  }
  document.querySelectorAll('[data-scramble]').forEach((el, i) => gsap.delayedCall(reduce ? 0 : 1.2 + i * 0.12, () => scramble(el)));
  // fires as the curtain starts to lift; late listeners check data-entered
  tl.call(() => { document.documentElement.dataset.entered = 1; dispatchEvent(new CustomEvent('page:enter')); }, null, first && !reduce ? 1.8 : 0);
}
function leave(href) {
  const curtain = document.querySelector('.curtain');
  curtain.querySelector('.curtain__count').textContent = '';
  if (reduce) return location.href = href;
  gsap.fromTo(curtain, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'expo.inOut', onComplete: () => location.href = href });
}
addEventListener('pageshow', e => { if (e.persisted) gsap.set('.curtain', { clipPath: 'inset(0 0 100% 0)' }); });
