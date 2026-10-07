// Home hero: a 360° turntable of me built from four photos (front, three-quarter, profile, back; the side views
// mirrored for the other side). Each view is a mesh pushed out by its own volume map, so it turns in real 3D;
// the nearest view is shown, with a quick cross-fade when it changes. The bust turns toward the cursor, spins in on load, and can be dragged
// a full 360°. Rim light follows the turn; a glowing scan edge reveals it on load.
import * as THREE from 'three';
import { reduce, touch } from './site.js';

const stage = document.querySelector('.stage');
const canvas = document.getElementById('gl');
const bubble = document.querySelector('.stage__bubble');

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
catch { stage.classList.add('no-gl'); throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 50);
camera.position.set(0, 0, 5.2);

const loader = new THREE.TextureLoader();
const [views, vdepth] = await Promise.all(['assets/me/views.webp', 'assets/me/vdepth.png'].map(u => loader.loadAsync(u)));
views.colorSpace = THREE.SRGBColorSpace;
views.generateMipmaps = false; views.minFilter = THREE.LinearFilter;   // atlas: no bleeding between views

// keyframes: [angle°, atlas view (0 front, 1 three-quarter, 2 profile, 3 back), mirrored]
const KEYS = [[0, 0, 0], [45, 1, 0], [90, 2, 1], [180, 3, 0], [270, 2, 0], [315, 1, 1]];
const shared = { uViews: { value: views }, uDepth: { value: vdepth }, uIntro: { value: reduce ? 1 : 0 }, uTime: { value: 0 },
  uPitch: { value: 0 }, uLight: { value: 0 } };
const vertexShader = /* glsl */`
  uniform sampler2D uDepth; uniform float uRot, uPitch, uTime, uView, uMirror;
  varying vec2 vUv; varying float vZ;
  mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
  mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
  void main(){
    vUv = vec2(uMirror > .5 ? 1. - uv.x : uv.x, uv.y);
    vec4 d4 = texture2D(uDepth, vUv);
    float z = dot(d4, vec4(equal(vec4(uView), vec4(0., 1., 2., 3.))));
    vZ = z;
    vec3 p = rotY(uRot) * vec3(position.xy, z);
    p = rotX(uPitch) * (p - vec3(0., -.9, 0.)) + vec3(0., -.9, 0.);
    p.y += sin(uTime * 1.4) * .006 * (1. - uv.y);                              // breathing
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }`;
const fragmentShader = /* glsl */`
  uniform sampler2D uViews; uniform float uView, uW, uIntro, uLight, uMirror;
  varying vec2 vUv; varying float vZ;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
  void main(){
    vec2 cell = vec2(mod(uView, 2.), floor(uView / 2.));
    vec4 c = texture2D(uViews, vec2((cell.x + vUv.x) / 2., (1. - cell.y + vUv.y) / 2.));
    if (c.a < .01) discard;
    // rim light on the silhouette edge facing the turn
    float side = (vUv.x - .5) * (uMirror > .5 ? -1. : 1.);
    c.rgb += vec3(1., .78, .3) * (1. - smoothstep(0., .1, vZ)) * smoothstep(0., .25, side * uLight) * smoothstep(.12, .4, vUv.y) * .8;
    // scan-in from the bottom with a glowing, noisy edge
    float edge = uIntro * 1.3 - .15 + (hash(floor(vUv * 90.)) - .5) * .06 - vUv.y;
    if (edge < 0.) discard;
    c.rgb += vec3(1., .8, .34) * (1. - smoothstep(0., .04, edge)) * (1. - uIntro * .5) * 1.5;
    float a = c.a * uW * smoothstep(.06, .2, vUv.y);
    gl_FragColor = vec4(linearToOutputTexel(vec4(c.rgb, 1.)).rgb * a, a);      // premultiplied, added below
  }`;
const geo = new THREE.PlaneGeometry(2, 2, touch ? 160 : 240, touch ? 160 : 240);
const meshes = [0, 1].map(() => new THREE.Mesh(geo, new THREE.ShaderMaterial({
  uniforms: { ...shared, uView: { value: 0 }, uMirror: { value: 0 }, uRot: { value: 0 }, uW: { value: 1 } },
  vertexShader, fragmentShader, transparent: true, depthTest: false, depthWrite: false,
  blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor   // weights sum to 1: a true cross-fade
})));
const pivot = new THREE.Group(); meshes.forEach(m => pivot.add(m)); scene.add(pivot);

// Show the nearest view (with hysteresis); when it changes, cross-fade over ~0.25s. A view at rest is never
// blended with another, so there's no ghosting; the meshes keep rotating through the fade.
let cur = 0, prev = 0, fade = 1, lastD = 0;
function setAngle(deg, dt) {
  const d = ((deg % 360) + 360) % 360;
  const dist = i => Math.abs(((d - KEYS[i][0]) % 360 + 540) % 360 - 180);
  let near = 0; for (let i = 1; i < 6; i++) if (dist(i) < dist(near)) near = i;
  if (near !== cur && dist(near) < dist(cur) - 4) { prev = cur; cur = near; fade = 0; }
  const speed = Math.abs(((d - lastD) % 360 + 540) % 360 - 180) / Math.max(dt, 1e-3); lastD = d;
  fade = Math.min(1, fade + dt * (4 + speed / 40));                     // fast spins switch faster
  const w = fade * fade * (3 - 2 * fade);
  const off = i => ((d - KEYS[i][0]) % 360 + 540) % 360 - 180;
  const wp = (1 - w) * (1 - THREE.MathUtils.smoothstep(Math.abs(off(prev)), 50, 75));   // a view turned too far would smear
  [[prev, wp], [cur, 1 - wp]].forEach(([i, wt], k) => {
    const [, v, m] = KEYS[i], u = meshes[k].material.uniforms;
    u.uView.value = v; u.uMirror.value = m; u.uW.value = wt; u.uRot.value = THREE.MathUtils.degToRad(off(i));
    meshes[k].visible = wt > 0.001;
  });
  return d;
}

// ---------- layout: the bust fills the stage height, anchored to the bottom ----------
let W = 1, H = 1;
function resize() {
  W = stage.clientWidth; H = stage.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;   // visible height at z=0
  const narrow = W < 900, px = narrow ? Math.min(W * 1.05, 620) : H * 1.02;           // bust height in CSS px
  const s = (px / H) * vh / 2;
  pivot.scale.setScalar(s);
  pivot.position.set(narrow ? 0 : vh * camera.aspect * 0.07, narrow ? vh / 2 - (40 / H) * vh - s : -vh / 2 + s * 0.97, 0);
}
new ResizeObserver(resize).observe(stage); resize();

// ---------- input: turn toward the pointer, drag to spin, idle look-around ----------
const target = new THREE.Vector2(), look = new THREE.Vector2(), tmp = new THREE.Vector3();
const clock = new THREE.Clock();
let lastMove = -10, spin = reduce ? 0 : -360, vel = 0, drag = null, scroll = 0, intro = !reduce;
const toScreen = (x, y) => {
  tmp.set(x, y, 0).applyMatrix4(pivot.matrixWorld).project(camera);
  return [(tmp.x * 0.5 + 0.5) * W, (-tmp.y * 0.5 + 0.5) * H];
};
const lines = ['Hey, I’m Mukesh.', 'I ship AI products.', 'Day zero → production.', 'Drag me — I spin 360°.', 'Rules first, then AI.', 'Let’s build something.'];
let li = 0, facing = true;
addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect(), [fx, fy] = toScreen(0, 0.4), x = e.clientX - r.left - fx, y = e.clientY - r.top - fy;
  target.set(THREE.MathUtils.clamp(x / (innerWidth * 0.4), -1, 1), THREE.MathUtils.clamp(y / (innerHeight * 0.45), -1, 1));
  lastMove = clock.elapsedTime;
  if (drag !== null) { const dx = e.clientX - drag; drag = e.clientX; spin += dx * 0.45; vel = dx * 0.45; }
  const near = facing && drag === null && Math.hypot(x, y) < H * 0.14 && e.target.closest('.stage');
  if (near && !bubble.classList.contains('is-on')) bubble.textContent = lines[li++ % lines.length];
  bubble.classList.toggle('is-on', !!near);
});
stage.addEventListener('pointerdown', e => {
  if (e.target.closest('a, button')) return;
  drag = e.clientX; vel = 0; intro = false; stage.classList.add('is-dragging');
});
addEventListener('pointerup', () => { if (drag === null) return; drag = null; stage.classList.remove('is-dragging'); });

let visible = true;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(stage);
ScrollTrigger.create({ trigger: stage, start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => scroll = s.progress });
function enter() {
  gsap.to(shared.uIntro, { value: 1, duration: reduce ? 0 : 2.4, delay: 0.3, ease: 'power2.out' });
  const o = { v: spin };   // spin in: one full turn that lands facing you
  gsap.to(o, { v: 0, duration: reduce ? 0 : 2.8, delay: 0.3, ease: 'expo.out', onUpdate: () => { if (intro) spin = o.v; }, onComplete: () => intro = false });
}
if (document.documentElement.dataset.entered) enter(); else addEventListener('page:enter', enter, { once: true });

const wander = new THREE.Vector2();
gsap.ticker.add(() => {
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, k = 1 - Math.pow(0.002, dt);
  shared.uTime.value = t;
  const idle = (t - lastMove > 3 || touch) && !reduce;
  look.lerp(idle ? wander.set(Math.sin(t * 0.5) * 0.6, Math.sin(t * 0.33 + 1) * 0.4) : target, idle ? k * 0.3 : k);
  // after a drag: coast, then settle on the nearest full turn so I face the cursor again
  if (drag === null && !intro) {
    vel *= Math.pow(0.04, dt); spin += vel;
    if (Math.abs(vel) < 0.4) spin += (Math.round(spin / 360) * 360 - spin) * k * 0.4;
  }
  const deg = setAngle(spin + look.x * 55 + scroll * 70, dt);
  facing = deg < 30 || deg > 330;
  shared.uPitch.value = look.y * 0.08;
  shared.uLight.value = THREE.MathUtils.clamp(look.x * 1.5 + vel * 0.05, -1, 1);
  renderer.render(scene, camera);
  const [bx, by] = toScreen(-0.22, 0.6);
  bubble.style.left = bx + 'px'; bubble.style.top = by + 'px';
});
