// Home story world: one particle field the camera flies through. Scroll moves the camera down a z-track and
// morphs the particles through six formations: noise → listen (clusters) → shape (constellation) →
// ship (case-study screens) → measure (a network with data flowing) → build (closing words).
// The cursor pushes particles away; screens lift on hover and open their case study on click.
import * as THREE from 'three';
import { reduce, touch, esc } from './site.js';
import { projects } from './projects.js';

const story = document.getElementById('story');
const canvas = document.getElementById('world');
const tip = document.querySelector('.world-tip');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch { document.documentElement.classList.add('no-gl'); throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
const BG = new THREE.Color('#140907');
renderer.setClearColor(BG);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(BG, 14, 46);
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight || 1.6, 0.1, 200);   // || guards a hidden 0×0 view
const narrow = innerWidth < 760;

// ---------- formations ----------
const N = touch ? 9000 : 24000, GAP = 40, D = narrow ? 19 : 16;   // particles, z-gap between chapters, viewing distance
const zc = i => -i * GAP;
const R = Math.random, rr = (a, b) => a + (b - a) * R(), g = () => (R() + R() + R() - 1.5) / 1.5;
const visW = z => 2 * Math.tan(THREE.MathUtils.degToRad(25)) * z * camera.aspect;   // visible width at distance z
const W = Math.min(26, visW(D) * 0.9);                                              // formation width that fits the view
const F = [0, 1, 2, 3, 4, 5].map(() => new Float32Array(N * 3));
const flow = new Float32Array(N * 3), rnd = new Float32Array(N * 4);
const put = (f, i, x, y, z) => { F[f][i * 3] = x; F[f][i * 3 + 1] = y; F[f][i * 3 + 2] = z; };

// 0 · noise: a wide storm around the start
for (let i = 0; i < N; i++) put(0, i, rr(-1, 1) * W * 0.95, rr(-13, 13), zc(0) + rr(-26, 8));

// formations stay clear of their chapter's text: beside it on desktop (side −1 left, +1 right),
// in bands above and below it on phones
const clear = side => narrow ? [rr(-0.45, 0.45) * W, (R() < 0.5 ? 1 : -1) * rr(5, 7.5)] : [side * rr(0.14, 0.44) * W, rr(-6, 6)];

// 1 · listen: tight clusters (people, teams) to the right of the text, plus dust
const clusters = Array.from({ length: 26 }, () => [...clear(1), zc(1) + rr(-5, 5), rr(0.35, 1.1)]);
for (let i = 0; i < N; i++) {
  if (R() < 0.08) { const [x, y] = clear(1); put(1, i, x, y, zc(1) + rr(-8, 8)); continue; }
  const [x, y, z, s] = clusters[(R() * R() * clusters.length) | 0];
  put(1, i, x + g() * s, y + g() * s, z + g() * s);
}

// 2 · shape: a constellation to the left of the text — nodes joined to their nearest neighbours
const nodes = Array.from({ length: 34 }, () => [...clear(-1), zc(2) + rr(-3, 3)]);
const edges = [];
nodes.forEach((a, i) => nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])]).sort((p, q) => p[1] - q[1])
  .slice(1, 3 + (i % 2)).forEach(([j]) => i < j && edges.push([a, nodes[j]])));
for (let i = 0; i < N; i++) {
  if (R() < 0.35) { const [x, y, z] = nodes[(R() * nodes.length) | 0]; put(2, i, x + g() * 0.3, y + g() * 0.3, z + g() * 0.3); continue; }
  const [a, b] = edges[(R() * edges.length) | 0], t = R();
  put(2, i, a[0] + (b[0] - a[0]) * t + g() * 0.06, a[1] + (b[1] - a[1]) * t + g() * 0.06, a[2] + (b[2] - a[2]) * t + g() * 0.06);
}

// 3 · ship: a corridor of floating screens, alternating sides, angled toward the camera path
const work = projects.filter(p => p.cover).slice(0, 8);
const SW = narrow ? 3.4 : 5.4, SH = SW * 10 / 16;
const screens = work.map((p, j) => {
  const side = j % 2 ? 1 : -1, o = new THREE.Object3D();
  o.position.set(side * (narrow ? 2.1 : rr(4.4, 5.2)), rr(-1.2, 1.4), zc(3) + 6 - j * 4.6);
  o.rotation.y = -side * (narrow ? 0.35 : 0.55);
  o.updateMatrix();
  return { p, o };
});
const v3 = new THREE.Vector3();
for (let i = 0; i < N; i++) {
  const { o } = screens[i % screens.length];
  let u = R() - 0.5, v = R() - 0.5;
  if (R() < 0.55) R() < 0.5 ? (u = Math.sign(u) * 0.5) : (v = Math.sign(v) * 0.5);   // most on the frame, the rest as pixels
  v3.set(u * SW, v * SH, g() * 0.05).applyMatrix4(o.matrix);
  put(3, i, v3.x, v3.y, v3.z);
}

// 4 · measure: a layered network; edge particles stream from layer to layer
const layers = narrow ? [3, 5, 6, 5, 3] : [5, 8, 10, 8, 4];
const net = layers.map((n, l) => Array.from({ length: n }, (_, k) =>
  [(l / (layers.length - 1) - 0.5) * W * (narrow ? 0.9 : 0.5) + (narrow ? 0 : W * 0.22), (k - (n - 1) / 2) * (narrow ? 1.9 : 1.2), zc(4) + Math.sin(k + l) * 1.5]));
const links = net.slice(1).flatMap((layer, l) => layer.flatMap(b => net[l].map(a => [a, b])));
for (let i = 0; i < N; i++) {
  if (R() < 0.3) { const layer = net[(R() * net.length) | 0], [x, y, z] = layer[(R() * layer.length) | 0]; put(4, i, x + g() * 0.25, y + g() * 0.25, z + g() * 0.25); continue; }
  const [a, b] = links[(R() * links.length) | 0];
  put(4, i, a[0], a[1], a[2]);
  flow[i * 3] = b[0] - a[0]; flow[i * 3 + 1] = b[1] - a[1]; flow[i * 3 + 2] = b[2] - a[2];
}

// 5 · build: the closing words, sampled from text drawn on a 2D canvas
await Promise.race([document.fonts.load('600 200px "Clash Display"'), new Promise(r => setTimeout(r, 1500))]);
{
  const c = document.createElement('canvas'), x = c.getContext('2d', { willReadFrequently: true });
  c.width = 1000; c.height = 560;
  x.fillStyle = '#fff'; x.font = '600 250px "Clash Display", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('LET’S', 500, 150); x.fillText('BUILD', 500, 410);
  const px = x.getImageData(0, 0, 1000, 560).data, pts = [];
  for (let y = 0; y < 560; y += 3) for (let k = 0; k < 1000; k += 3) if (px[(y * 1000 + k) * 4 + 3] > 128) pts.push([k, y]);
  const s = W * (narrow ? 0.98 : 0.72) / 1000;
  for (let i = 0; i < N; i++) {
    const [k, y] = pts[(R() * pts.length) | 0];
    put(5, i, (k - 500) * s + g() * 0.04, (280 - y) * s + (narrow ? 4.6 : 1.3) + g() * 0.04, zc(5) + g() * 0.3);
  }
}
for (let i = 0; i < N; i++) rnd.set([R(), R(), R(), R()], i * 4);

// ---------- particles ----------
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(F[0], 3));
F.slice(1).forEach((f, k) => geo.setAttribute('p' + (k + 1), new THREE.BufferAttribute(f, 3)));
geo.setAttribute('aFlow', new THREE.BufferAttribute(flow, 3));
geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));
const U = { uPhase: { value: 0 }, uTime: { value: 0 }, uSize: { value: 1 }, uIntro: { value: reduce ? 1 : 0 },
  uRayO: { value: new THREE.Vector3() }, uRayD: { value: new THREE.Vector3() }, uMouseOn: { value: 0 }, uCalm: { value: reduce ? 0 : 1 } };
const points = new THREE.Points(geo, new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false,
  blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,   // additive, premultiplied
  vertexShader: /* glsl */`
    attribute vec3 p1, p2, p3, p4, p5, aFlow; attribute vec4 aRnd;
    uniform float uPhase, uTime, uSize, uIntro, uCalm, uMouseOn; uniform vec3 uRayO, uRayD;
    varying float vA; varying vec3 vCol;
    vec3 P(float i){
      if (i < .5) return position; if (i < 1.5) return p1; if (i < 2.5) return p2; if (i < 3.5) return p3;
      if (i < 4.5) return p4 + aFlow * fract(aRnd.z + uTime * .12);
      return p5;
    }
    void main(){
      float i0 = min(floor(uPhase), 4.), f = uPhase - i0;
      float s = smoothstep(aRnd.y * .4, aRnd.y * .4 + .6, f);                     // staggered morph
      vec3 pos = mix(P(i0), P(i0 + 1.), s);
      float fly = sin(s * 3.14159) * 3.2 + (uPhase < .5 ? .5 : .1);                 // turbulence mid-flight, drift at rest
      pos += vec3(sin(pos.y * .25 + uTime * .7 + aRnd.x * 6.28), cos(pos.x * .2 + uTime * .6 + aRnd.w * 6.28), sin(pos.x * .15 + pos.y * .2 + uTime * .5)) * fly * uCalm;
      float e = smoothstep(aRnd.y * .5, aRnd.y * .5 + .5, uIntro);                // intro: burst out from the centre
      pos = mix(vec3(0., 0., 6.) + (pos - vec3(0., 0., 6.)) * .03, pos, e);
      // cursor pushes particles away from its ray, so it works at every depth with the same on-screen radius
      vec3 d = pos - uRayO; float t = max(dot(d, uRayD), .1); vec3 perp = d - uRayD * t;
      float ang = length(perp) / t;
      pos += normalize(perp + 1e-4) * t * .045 * exp(-ang * ang / .008) * uMouseOn;
      vec4 mv = modelViewMatrix * vec4(pos, 1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = min(uSize * mix(.45, 1.6, aRnd.x * aRnd.x) / -mv.z, 48.);
      vA = smoothstep(46., 8., -mv.z) * smoothstep(.3, 3., -mv.z) * (.35 + .65 * aRnd.w) * e;
      // noise starts cold (grey-blue static) and warms to gold as it turns into product
      vec3 cold = aRnd.w < .62 ? vec3(.62, .67, .8) : aRnd.w < .86 ? vec3(.4, .47, .68) : vec3(.86, .88, .95);
      vec3 warm = aRnd.w < .62 ? vec3(1., .9, .76) : aRnd.w < .86 ? vec3(1., .76, .3) : vec3(.95, .42, .25);
      vCol = mix(cold, warm, smoothstep(.15 + aRnd.y * .5, .65 + aRnd.y * .5, uPhase));
    }`,
  fragmentShader: /* glsl */`
    varying float vA; varying vec3 vCol;
    void main(){
      float a = smoothstep(.5, .05, length(gl_PointCoord - .5)) * vA;
      if (a < .004) discard;
      gl_FragColor = vec4(vCol * a, a);
    }`
}));
points.frustumCulled = false;
scene.add(points);

// constellation + network lines fade in while their formation holds
const lines = (pairs, color) => {
  const l = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pairs.flat().map(p => new THREE.Vector3(...p))),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(l); return l;
};
const constellation = lines(edges, '#ffcd57'), network = lines(links, '#b3401f');

// screens: real case-study covers, rounded, revealed by a scan line once the particles have drawn their frames
const tex = new THREE.TextureLoader();
const screenMat = p => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  uniforms: { uMap: { value: tex.load(p.cover, t => { t.colorSpace = THREE.SRGBColorSpace; }) }, uShow: { value: 0 }, uHover: { value: 0 }, uAspect: { value: SW / SH } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
  fragmentShader: /* glsl */`
    uniform sampler2D uMap; uniform float uShow, uHover, uAspect; varying vec2 vUv;
    void main(){
      vec2 q = abs(vUv - .5) * vec2(uAspect, 1.), b = vec2(.5 * uAspect, .5) - .05;
      float sd = length(max(q - b, 0.)) - .05;                                       // rounded rectangle
      float reveal = smoothstep(vUv.y - .02, vUv.y + .02, uShow * 1.1 - .05);
      vec4 c = texture2D(uMap, vec2(vUv.x, 1. - (1. - vUv.y) * .7));                 // top of the screen
      c.rgb *= .78 + uHover * .22;
      c.rgb += vec3(1., .8, .34) * smoothstep(.012, 0., abs(sd + .008)) * (.25 + uHover);   // glowing edge
      c.rgb += vec3(1., .8, .34) * smoothstep(.03, 0., abs(vUv.y - uShow * 1.1 + .05)) * (1. - uShow);   // scan line
      gl_FragColor = vec4(c.rgb, smoothstep(.004, -.004, sd) * reveal);
      #include <colorspace_fragment>
    }`
});
const planes = screens.map(({ p, o }) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), screenMat(p));
  m.position.copy(o.position); m.rotation.copy(o.rotation); m.renderOrder = 1; m.userData = p;
  scene.add(m); return m;
});

// ---------- scroll, pointer, camera ----------
// progress in chapters: 0 when chapter 0's centre is mid-screen, 1 for chapter 1, … (chapters differ in height)
let centers = [], p = 0, ps = 0, active = true, hovered = null;
const measure = () => centers = [...story.children].map(c => { const r = c.getBoundingClientRect(); return r.top + scrollY + r.height / 2; });
const progress = () => {
  const m = scrollY + innerHeight / 2, n = centers.length - 1;
  if (m <= centers[0]) return 0;
  for (let i = 0; i < n; i++) if (m < centers[i + 1]) return (i + (m - centers[i]) / (centers[i + 1] - centers[i])) / n;
  return 1;
};
measure(); ScrollTrigger.addEventListener('refresh', measure);
ScrollTrigger.create({ trigger: story, start: 'top bottom', end: 'bottom top',
  onToggle: s => { active = s.isActive; canvas.style.visibility = active ? '' : 'hidden'; } });
// phase holds on each formation while its chapter text is on screen, then morphs
const phaseOf = q => { const l = q * 5, i = Math.min(Math.floor(l), 5); return i + THREE.MathUtils.smoothstep(l - i, 0.3, 0.7); };

const mouse = new THREE.Vector2(), ms = new THREE.Vector2(), ray = new THREE.Raycaster();
let pointer = false;
addEventListener('pointermove', e => {
  mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); pointer = true;
  tip.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
});
document.documentElement.addEventListener('pointerleave', () => pointer = false);
addEventListener('click', e => {
  if (!hovered || !active || e.target.closest('a, button')) return;
  const a = Object.assign(document.createElement('a'), { href: 'case.html#' + hovered.userData.slug });
  document.body.append(a); a.click(); a.remove();   // goes through the site's curtain transition
});

function enter() { gsap.to(U.uIntro, { value: 1, duration: reduce ? 0 : 2.6, ease: 'power3.out' }); }
if (document.documentElement.dataset.entered) enter(); else addEventListener('page:enter', enter, { once: true });

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  if (!innerHeight) return;
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  U.uSize.value = innerHeight * renderer.getPixelRatio() * 0.09;
}
addEventListener('resize', resize); resize();

const clock = new THREE.Clock(), look = new THREE.Vector3(), cur = document.querySelector('.cursor');
gsap.ticker.add(() => {
  if (!active) return;
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, k = 1 - Math.pow(0.001, dt);
  p = progress(); ps += (p - ps) * k * 0.6;
  ms.lerp(mouse, k * 0.5);
  const ph = phaseOf(ps), sway = reduce ? 0 : 1;
  U.uPhase.value = ph; U.uTime.value = t;

  // camera: down the z-track with a slow weave; the mouse adds parallax
  // the weave is zero at each chapter's centre, so formations sit where the layout expects while text is read
  const wv = Math.sin(ps * Math.PI * 5) * sway;
  camera.position.set(wv * 2.4 + ms.x * 1.1, wv * 1.2 + ms.y * 0.7, D - ps * GAP * 5);
  look.set(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - D);
  camera.lookAt(look);
  camera.updateMatrixWorld();

  // the cursor's ray, for the particle push and screen hover
  ray.setFromCamera(ms, camera);
  U.uRayO.value.copy(ray.ray.origin); U.uRayD.value.copy(ray.ray.direction);
  U.uMouseOn.value += ((pointer && !touch ? 1 : 0) - U.uMouseOn.value) * k * 0.3;

  const w = i => THREE.MathUtils.clamp(1 - Math.abs(ph - i) * 2.5, 0, 1);
  constellation.material.opacity = w(2) * 0.35;
  network.material.opacity = w(4) * 0.22;
  const show = w(3);
  planes.forEach(m => { m.visible = show > 0; m.material.uniforms.uShow.value = show; });

  // hover a screen: lift it, glow, show its title
  const hit = show > 0.6 && pointer ? ray.intersectObjects(planes)[0]?.object : null;
  if (hit !== hovered) {
    hovered = hit; cur?.classList.toggle('is-view', !!hit);
    tip.classList.toggle('is-on', !!hit);
    if (hit) tip.innerHTML = `<b>${esc(hit.userData.title)}</b><span class="mono">${esc(hit.userData.year)} · Open case study</span>`;
  }
  planes.forEach(m => {
    const u = m.material.uniforms.uHover; u.value += ((m === hovered) - u.value) * k * 0.5;
    m.scale.setScalar(1 + u.value * 0.06);
  });
  renderer.render(scene, camera);
});
