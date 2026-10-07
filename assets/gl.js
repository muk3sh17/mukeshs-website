// Home hero: a 3D cartoon of Mukesh whose head follows the cursor.
// The cut-out render is displaced by its depth map onto a dense mesh; vertices above the neck rotate
// around a neck pivot (yaw + pitch), the body follows a little. Idles into a look-around when the
// pointer rests, breathes, and leans on scroll.
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
const [color, depth] = await Promise.all(['assets/me/character.webp', 'assets/me/depth.png'].map(u => loader.loadAsync(u)));
color.colorSpace = THREE.SRGBColorSpace; color.anisotropy = 4;

const NECK = 0.47;           // uv.y of the neck (uv origin bottom-left)
const uniforms = {
  uColor: { value: color }, uDepth: { value: depth },
  uYaw: { value: 0 }, uPitch: { value: 0 }, uBody: { value: 0 }, uDepthScale: { value: 0.55 },
  uLight: { value: new THREE.Vector2() }, uTime: { value: 0 }, uIntro: { value: reduce ? 1 : 0 }
};
const mat = new THREE.ShaderMaterial({
  uniforms, transparent: true,
  vertexShader: /* glsl */`
    uniform sampler2D uDepth; uniform float uYaw, uPitch, uBody, uDepthScale, uTime, uIntro;
    varying vec2 vUv; varying float vHead;
    mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
    mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
    void main(){
      vUv = uv;
      float d = texture2D(uDepth, uv).r;
      vec3 p = vec3(position.xy, (d - 0.42) * uDepthScale);
      // head: everything above the neck turns around a pivot inside the skull
      float head = smoothstep(${(NECK - 0.05).toFixed(3)}, ${(NECK + 0.07).toFixed(3)}, uv.y) * smoothstep(0.2, 0.3, d); vHead = head;
      vec3 pivot = vec3(0.0, ${(2 * NECK - 1 + 0.04).toFixed(3)}, 0.12);
      vec3 hp = rotY(uYaw) * rotX(uPitch) * (p - pivot) + pivot;
      p = mix(p, hp, head);
      // body leans a little with the head, and breathes
      p = rotY(uBody) * p;
      p.y += sin(uTime * 1.4) * 0.006 * (1.0 - uv.y);
      p.y -= (1.0 - uIntro) * 0.35;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }`,
  fragmentShader: /* glsl */`
    uniform sampler2D uColor; uniform vec2 uLight; uniform float uIntro;
    varying vec2 vUv; varying float vHead;
    void main(){
      vec4 c = texture2D(uColor, vUv);
      if (c.a < 0.04) discard;
      // soft key light that slides with the gaze, strongest on the face
      float l = 1.0 + dot(uLight, (vUv - vec2(0.5, 0.62)) * 2.0) * 0.12 * (0.4 + vHead);
      float fade = smoothstep(0.0, 0.16, vUv.y);                       // soften the cut at the bottom
      gl_FragColor = vec4(c.rgb * l, c.a * uIntro * fade);
      #include <colorspace_fragment>
    }`
});
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, touch ? 160 : 256, touch ? 160 : 256), mat);
scene.add(mesh);

// ---------- layout: the character fills the stage height, anchored to the bottom ----------
let W = 1, H = 1, vh = 1;
function resize() {
  W = stage.clientWidth; H = stage.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;   // visible height at z=0
  const narrow = W < 900, px = narrow ? Math.min(W * 1.05, 620) : H * 0.94;      // character height in CSS px
  const s = (px / H) * vh / 2;                                                    // half-size of the 2×2 plane
  mesh.scale.setScalar(s);
  mesh.position.set(narrow ? 0 : vh * camera.aspect * 0.05, narrow ? vh / 2 - (40 / H) * vh - s : -vh / 2 + s, 0);
}
new ResizeObserver(resize).observe(stage); resize();

// ---------- input: follow the pointer anywhere on the page; idle look-around ----------
const target = new THREE.Vector2(), look = new THREE.Vector2(), face = new THREE.Vector3(), tmp = new THREE.Vector3();
const clock = new THREE.Clock();
let lastMove = -10, pointerIn = false;
const faceScreen = () => {
  tmp.set(0, 0.32, 0).applyMatrix4(mesh.matrixWorld).project(camera);
  const r = canvas.getBoundingClientRect();
  return [r.left + (tmp.x * 0.5 + 0.5) * r.width, r.top + (-tmp.y * 0.5 + 0.5) * r.height];
};
addEventListener('pointermove', e => {
  const [fx, fy] = faceScreen();
  target.set(THREE.MathUtils.clamp((e.clientX - fx) / (innerWidth * 0.4), -1, 1), THREE.MathUtils.clamp((e.clientY - fy) / (innerHeight * 0.5), -1, 1));
  lastMove = clock.elapsedTime; pointerIn = true;
  // hovering the face pops a speech bubble
  const near = Math.hypot(e.clientX - fx, e.clientY - fy) < H * 0.13 && e.target.closest('.stage');
  if (near && !bubble.classList.contains('is-on')) bubble.textContent = lines[li++ % lines.length];
  bubble.classList.toggle('is-on', !!near);
});
document.documentElement.addEventListener('pointerleave', () => pointerIn = false);
const lines = ['Hey, I’m Mukesh.', 'I ship AI products.', 'Day zero → production.', 'Ask me about Optima AI.', 'Rules first, then AI.', 'Let’s build something.'];
let li = 0;

let visible = true, scroll = 0;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(stage);
ScrollTrigger.create({ trigger: stage, start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => scroll = s.progress });
addEventListener('page:enter', () => gsap.to(uniforms.uIntro, { value: 1, duration: reduce ? 0 : 1.8, delay: 0.4, ease: 'expo.out' }));
if (document.body.classList.contains('loading') === false) uniforms.uIntro.value = 1;

const L = (a, b, t) => a + (b - a) * t, wander = new THREE.Vector2();
gsap.ticker.add(() => {
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, k = 1 - Math.pow(0.0005, dt);
  uniforms.uTime.value = t;
  const idle = !pointerIn || t - lastMove > 2.5 || touch;
  const goal = idle && !reduce ? wander.set(Math.sin(t * 0.45) * 0.7, Math.sin(t * 0.31 + 1) * 0.3) : target;
  look.x = L(look.x, goal.x, k * 0.1); look.y = L(look.y, goal.y, k * 0.1);
  uniforms.uYaw.value = look.x * 0.5;
  uniforms.uPitch.value = look.y * 0.22 + scroll * 0.2;
  uniforms.uBody.value = look.x * 0.06;
  uniforms.uLight.value.set(look.x, -look.y);
  renderer.render(scene, camera);
  face.set(-0.08, 0.66, 0.2).applyMatrix4(mesh.matrixWorld).project(camera);
  bubble.style.left = (face.x * 0.5 + 0.5) * W + 'px'; bubble.style.top = (-face.y * 0.5 + 0.5) * H + 'px';
});
