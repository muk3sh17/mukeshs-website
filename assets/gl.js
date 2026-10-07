// Home hero: my photo, cut out, with a smiling face that follows the cursor.
// 35 head poses (7 yaw × 5 pitch, made with LivePortrait from one photo) sit in an atlas; the shader blends the
// four nearest poses inside the head square and draws the static body around it. The bust is displaced by a
// depth map so it leans in 3D, gets a rim light from the cursor side, and dissolves in on load.
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
const [body, heads, depth] = await Promise.all(['assets/me/body.webp', 'assets/me/heads.webp', 'assets/me/depth.png'].map(u => loader.loadAsync(u)));
for (const t of [body, heads]) t.colorSpace = THREE.SRGBColorSpace;
heads.generateMipmaps = false; heads.minFilter = THREE.LinearFilter;   // no bleeding between atlas cells

const COLS = 7, ROWS = 5, SRC = 800, HEAD = [206, 78, 614, 486];       // head square in source pixels (x0, y0, x1, y1)
const f = v => v.toFixed(4);
const uniforms = {
  uBody: { value: body }, uHeads: { value: heads }, uDepth: { value: depth },
  uPose: { value: new THREE.Vector2((COLS - 1) / 2, (ROWS - 1) / 2) }, uLean: { value: new THREE.Vector2() },
  uTime: { value: 0 }, uIntro: { value: reduce ? 1 : 0 }
};
const mat = new THREE.ShaderMaterial({
  uniforms, transparent: true,
  vertexShader: /* glsl */`
    uniform sampler2D uDepth; uniform vec2 uLean; uniform float uTime;
    varying vec2 vUv;
    mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
    mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
    void main(){
      vUv = uv;
      float d = texture2D(uDepth, uv).r;
      vec3 p = vec3(position.xy, (d - 0.4) * 0.45);
      p = rotY(uLean.x) * rotX(uLean.y) * (p - vec3(0., -0.6, 0.)) + vec3(0., -0.6, 0.);   // lean from the chest
      p.y += sin(uTime * 1.4) * 0.006 * (1.0 - uv.y);                                    // breathing
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }`,
  fragmentShader: /* glsl */`
    uniform sampler2D uBody, uHeads; uniform vec2 uPose, uLean; uniform float uIntro, uTime;
    varying vec2 vUv;
    const vec2 H0 = vec2(${f(HEAD[0] / SRC)}, ${f(1 - HEAD[3] / SRC)}), H1 = vec2(${f(HEAD[2] / SRC)}, ${f(1 - HEAD[1] / SRC)});
    vec4 cell(vec2 h, float i, float j){
      return texture2D(uHeads, vec2((i + h.x) / ${COLS}., 1. - (j + h.y) / ${ROWS}.));
    }
    vec4 photo(vec2 uv){
      if (any(lessThan(uv, H0)) || any(greaterThan(uv, H1))) return texture2D(uBody, uv);
      vec2 h = (uv - H0) / (H1 - H0); h = clamp(vec2(h.x, 1. - h.y), .002, .998);
      vec2 a = floor(uPose), b = min(a + 1., vec2(${COLS - 1}., ${ROWS - 1}.)), t = smoothstep(.3, .7, uPose - a);   // short cross-fade: no ghosting
      return mix(mix(cell(h, a.x, a.y), cell(h, b.x, a.y), t.x), mix(cell(h, a.x, b.y), cell(h, b.x, b.y), t.x), t.y);
    }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
    void main(){
      vec4 c = photo(vUv);
      if (c.a < 0.02) discard;
      // warm grade + rim light on the edge facing the cursor
      c.rgb = pow(c.rgb, vec3(1.04)) * vec3(1.05, 1.0, 0.95);
      vec2 dir = normalize(vec2(uLean.x, -uLean.y) + vec2(0.0001, 0.0002));
      float rim = c.a * (1.0 - texture2D(uBody, vUv + dir * 0.004).a) * smoothstep(0.15, 0.4, vUv.y);
      c.rgb += vec3(1.0, 0.8, 0.34) * rim * (0.2 + length(uLean) * 2.0);
      // dissolve in from the bottom with a glowing, noisy edge
      float edge = uIntro * 1.3 - 0.15 + (hash(floor(vUv * 90.)) - 0.5) * 0.08 - vUv.y;
      if (edge < 0.0) discard;
      c.rgb += vec3(1.0, 0.8, 0.34) * (1.0 - smoothstep(0.0, 0.05, edge)) * (1.0 - uIntro * 0.6);
      gl_FragColor = vec4(c.rgb, c.a * smoothstep(0.0, 0.14, vUv.y));
      #include <colorspace_fragment>
    }`
});
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, touch ? 160 : 256, touch ? 160 : 256), mat);
scene.add(mesh);

// ---------- layout: the bust fills the stage height, anchored to the bottom ----------
let W = 1, H = 1;
function resize() {
  W = stage.clientWidth; H = stage.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;   // visible height at z=0
  const narrow = W < 900, px = narrow ? Math.min(W * 1.05, 620) : H * 0.96;          // bust height in CSS px
  const s = (px / H) * vh / 2;
  mesh.scale.setScalar(s);
  mesh.position.set(narrow ? 0 : vh * camera.aspect * 0.07, narrow ? vh / 2 - (40 / H) * vh - s : -vh / 2 + s, 0);
}
new ResizeObserver(resize).observe(stage); resize();

// ---------- input: the face follows the pointer anywhere on the page; idles into a look-around ----------
const target = new THREE.Vector2(), look = new THREE.Vector2(), tmp = new THREE.Vector3();
const clock = new THREE.Clock();
let lastMove = -10;
const toScreen = (x, y) => {
  tmp.set(x, y, 0).applyMatrix4(mesh.matrixWorld).project(camera);
  return [(tmp.x * 0.5 + 0.5) * W, (-tmp.y * 0.5 + 0.5) * H];
};
const lines = ['Hey, I’m Mukesh.', 'I ship AI products.', 'Day zero → production.', 'Ask me about Optima AI.', 'Rules first, then AI.', 'Let’s build something.'];
let li = 0;
addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect(), [fx, fy] = toScreen(0.03, 0.4), x = e.clientX - r.left - fx, y = e.clientY - r.top - fy;
  target.set(THREE.MathUtils.clamp(x / (innerWidth * 0.35), -1, 1), THREE.MathUtils.clamp(y / (innerHeight * 0.4), -1, 1));
  lastMove = clock.elapsedTime;
  // hovering the face pops a speech bubble
  const near = Math.hypot(x, y) < H * 0.14 && e.target.closest('.stage');
  if (near && !bubble.classList.contains('is-on')) bubble.textContent = lines[li++ % lines.length];
  bubble.classList.toggle('is-on', !!near);
});

let visible = true;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(stage);
addEventListener('page:enter', () => gsap.to(uniforms.uIntro, { value: 1, duration: reduce ? 0 : 2.2, delay: 0.5, ease: 'power2.out' }));

const wander = new THREE.Vector2();
gsap.ticker.add(() => {
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, k = 1 - Math.pow(0.002, dt);
  uniforms.uTime.value = t;
  const idle = (t - lastMove > 3 || touch) && !reduce;
  const goal = idle ? wander.set(Math.sin(t * 0.5) * 0.75, Math.sin(t * 0.33 + 1) * 0.5) : target;
  look.lerp(goal, idle ? k * 0.3 : k);
  uniforms.uPose.value.set((look.x * 0.5 + 0.5) * (COLS - 1), (look.y * 0.5 + 0.5) * (ROWS - 1));
  uniforms.uLean.value.set(look.x * 0.1, look.y * 0.05);
  renderer.render(scene, camera);
  const [bx, by] = toScreen(-0.22, 0.62);
  bubble.style.left = bx + 'px'; bubble.style.top = by + 'px';
});
