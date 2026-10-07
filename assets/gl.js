// Home hero: a procedural igloo built from blocks — each labelled block is a case study.
// Mouse: the camera drifts and nearby blocks lift away from the cursor. Scroll: the igloo
// breaks apart. Load: the blocks assemble.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { reduce, touch, esc } from './site.js';
import { projects } from './projects.js';

const hero = document.querySelector('.hero--home');
const canvas = document.getElementById('gl');
const hud = document.getElementById('hud');
const FOG = new THREE.Color('#dfe2e6');

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch { hero.classList.add('no-gl'); throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = !touch;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = FOG;
scene.fog = new THREE.FogExp2(FOG, 0.042);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
const LOOK = new THREE.Vector3(0, 1.05, 0);

scene.add(new THREE.HemisphereLight(0xf1f4f8, 0x7d838c, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(-6, 9, 5);
sun.castShadow = renderer.shadowMap.enabled;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
sun.shadow.bias = -0.0005;
sun.shadow.camera.updateProjectionMatrix();
scene.add(sun);

// ---------- terrain ----------
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const vnoise = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y) => vnoise(x, y) * 0.55 + vnoise(x * 2.1, y * 2.1) * 0.28 + vnoise(x * 4.3, y * 4.3) * 0.17;
const ground = new THREE.PlaneGeometry(60, 60, touch ? 90 : 160, touch ? 90 : 160);
ground.rotateX(-Math.PI / 2);
const gp = ground.attributes.position;
for (let i = 0; i < gp.count; i++) {
  const x = gp.getX(i), z = gp.getZ(i), r = Math.hypot(x, z);
  const flat = THREE.MathUtils.smoothstep(r, 2.6, 6);           // keep the ground flat under the igloo
  gp.setY(i, (fbm(x * 0.35, z * 0.35) - 0.45) * 1.6 * flat + Math.max(0, r - 14) * 0.25 + fbm(x * 3, z * 3) * 0.06);
}
ground.computeVertexNormals();
const groundMesh = new THREE.Mesh(ground, new THREE.MeshStandardMaterial({ color: 0xaeb3ba, roughness: 1 }));
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// ---------- igloo ----------
const igloo = new THREE.Group();
scene.add(igloo);
const R = 2.25, DEPTH = 0.42, RINGS = touch ? 6 : 8, PHI_MAX = Math.PI * 0.43, DOOR = Math.PI / 2;
const blocks = [];
for (let i = 0; i < RINGS; i++) {
  const phi = (i + 0.5) * (PHI_MAX / RINGS), r = R * Math.cos(phi), y = R * Math.sin(phi);
  const h = R * (PHI_MAX / RINGS) * 0.9;
  const count = Math.max(5, Math.round((2 * Math.PI * r) / 0.95));
  const w = ((2 * Math.PI * r) / count) * 0.9;
  for (let k = 0; k < count; k++) {
    const theta = ((k + (i % 2) * 0.5) / count) * Math.PI * 2;
    let dt = Math.abs(((theta - DOOR + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (i < 3 && dt < 0.32) continue;                                // doorway
    const n = new THREE.Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), Math.cos(phi) * Math.sin(theta));
    const t = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta));
    const u = new THREE.Vector3().crossVectors(n, t);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(t, u, n));
    const rnd = Math.random();
    blocks.push({
      pos: new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)), n, q, w, h, rnd, ring: i, theta,
      dir: n.clone().multiplyScalar(1.2).add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.5)).normalize(),
      dist: 2.5 + Math.random() * 4, axis: new THREE.Vector3().randomDirection(), spin: (Math.random() - 0.5) * 5,
      push: 0, target: 0
    });
  }
}
// one geometry, scaled per instance (blocks in a ring share a size)
const geo = new RoundedBoxGeometry(1, 1, 1, 3, 0.09);
const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0 });
const mesh = new THREE.InstancedMesh(geo, mat, blocks.length);
mesh.castShadow = mesh.receiveShadow = renderer.shadowMap.enabled;
const base = new THREE.Color(0xb9bdc4), lit = new THREE.Color(0xffffff);
blocks.forEach((b, i) => { b.color = base.clone().offsetHSL(0, 0, (b.rnd - 0.5) * 0.06); mesh.setColorAt(i, b.color); });
igloo.add(mesh);

// warm-white light inside the igloo, leaking through the seams (bloom picks it up)
const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(1.4), toneMapped: false, side: THREE.BackSide });
const glow = new THREE.Mesh(new THREE.SphereGeometry(R - DEPTH * 0.55, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), glowMat);
igloo.add(glow);
const cap = new THREE.Mesh(new THREE.CylinderGeometry(R * Math.cos(PHI_MAX) + 0.1, R * Math.cos(PHI_MAX) + 0.25, DEPTH, 24), mat);
cap.position.y = R * Math.sin(PHI_MAX) + 0.05; cap.castShadow = true;
igloo.add(cap);
const inner = new THREE.PointLight(0xfff6ea, 6, 6); inner.position.set(0, 0.6, 0.6); igloo.add(inner);

// ---------- snow ----------
const SNOW = touch ? 500 : 1400;
const sp = new Float32Array(SNOW * 3), ss = new Float32Array(SNOW);
for (let i = 0; i < SNOW; i++) { sp.set([(Math.random() - 0.5) * 22, Math.random() * 10, (Math.random() - 0.5) * 16], i * 3); ss[i] = Math.random(); }
const snowGeo = new THREE.BufferGeometry();
snowGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
snowGeo.setAttribute('aSeed', new THREE.BufferAttribute(ss, 1));
const snowMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } }, transparent: true, depthWrite: false,
  vertexShader: `uniform float uTime,uPx; attribute float aSeed; varying float vA;
    void main(){ vec3 p=position; p.y=mod(p.y-uTime*(0.25+aSeed*0.35),10.0)-1.0; p.x+=sin(uTime*0.6+aSeed*40.0)*0.25;
      vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(1.5+aSeed*2.5)*uPx*(8.0/-mv.z); vA=0.35+0.5*aSeed; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard; gl_FragColor=vec4(1.0,1.0,1.0,(1.0-d*2.0)*vA); }`
});
scene.add(new THREE.Points(snowGeo, snowMat));

// ---------- post ----------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.35, 0.5, 0.92);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------- labelled blocks (featured case studies) ----------
const featured = projects.filter(p => p.featured).slice(0, 4);
const spots = [[2, DOOR - 0.75], [4, DOOR - 0.25], [3, DOOR + 0.45], [5, DOOR + 0.95]];
const tags = featured.map((p, k) => {
  const [ring, th] = spots[k];
  let best = 0, bd = 1e9;
  blocks.forEach((b, i) => { if (b.ring !== Math.min(ring, RINGS - 1)) return; const d = Math.abs(Math.atan2(Math.sin(b.theta - th), Math.cos(b.theta - th))); if (d < bd) { bd = d; best = i; } });
  return { i: best, p };
});
hud.innerHTML = `<svg class="hud__lines"><polyline/></svg>` + tags.map((t, k) =>
  `<a class="hud__pt mono" href="case.html#${t.p.slug}" data-k="${k}"><i>${String(k + 1).padStart(2, '0')}</i><span>${esc(t.p.title)}</span></a>`).join('');
const pts = [...hud.querySelectorAll('.hud__pt')], line = hud.querySelector('polyline');
let hoverTag = -1;
pts.forEach((el, k) => { el.addEventListener('mouseenter', () => hoverTag = k); el.addEventListener('mouseleave', () => hoverTag = -1); });

// ---------- layout ----------
let W = 1, H = 1, wide = true;
function resize() {
  W = hero.clientWidth; H = hero.clientHeight; wide = W / H > 1.15;
  renderer.setSize(W, H, false); composer.setSize(W, H);
  bloom.resolution.set(W / 2, H / 2);
  camera.aspect = W / H;
  // push the igloo into the right half on wide screens, leaving the left for the copy
  if (wide) camera.setViewOffset(W, H, -W * 0.29, H * 0.06, W, H); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(hero); resize();

// ---------- state ----------
const state = { intro: reduce ? 0 : 1, scroll: 0 };
addEventListener('page:enter', () => gsap.to(state, { intro: 0, duration: reduce ? 0 : 3.2, delay: 0.5, ease: 'power3.out' }));
ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => state.scroll = s.progress });
let boost = 0;
addEventListener('project:hover', e => boost = e.detail == null ? 0 : 1);

const mouse = new THREE.Vector2(), smooth = new THREE.Vector2();
let hasPointer = false;
hero.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); hasPointer = true;
});
hero.addEventListener('pointerleave', () => hasPointer = false);

let visible = true, lastNear = -2;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(hero);

const ray = new THREE.Raycaster(), sphere = new THREE.Sphere(new THREE.Vector3(), R + 0.15), hit = new THREE.Vector3();
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qs = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();
const tc = new THREE.Color(), clock = new THREE.Clock(), L = (a, b, t) => a + (b - a) * t, ease = x => 1 - Math.pow(1 - x, 3);

gsap.ticker.add(() => {
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), k = 1 - Math.pow(0.002, dt), t = clock.elapsedTime;
  snowMat.uniforms.uTime.value = t;
  smooth.lerp(mouse, k * 0.6);

  // camera: slow orbit following the cursor, dolly in as the page scrolls
  const yaw = smooth.x * 0.22 + (reduce ? 0 : Math.sin(t * 0.08) * 0.05), pitch = smooth.y * 0.08;
  const dist = (wide ? 14.5 : 14) - state.scroll * 3.5;
  camera.position.set(Math.sin(yaw) * dist, 1.9 + pitch * 4 + state.scroll * 0.8, Math.cos(yaw) * dist);
  camera.lookAt(LOOK);

  // pointer -> nearest point on the dome, in igloo space
  let hitOk = false;
  if (hasPointer && !touch) { ray.setFromCamera(mouse, camera); hitOk = !!ray.ray.intersectSphere(sphere, hit); }
  const E = Math.max(state.intro, state.scroll * 1.15);
  let near = -1, nd = 0.7;
  blocks.forEach((b, i) => {
    const d = hitOk ? b.pos.distanceTo(hit) : 9;
    if (d < nd) { nd = d; near = i; }
    const tag = tags.findIndex(x => x.i === i);
    b.target = Math.max(hitOk ? THREE.MathUtils.smoothstep(1.4 - d, 0, 1.4) * 0.38 : 0, tag >= 0 && tag === hoverTag ? 0.55 : 0);
    b.push = L(b.push, b.target, k * 0.5);
    const e = ease(THREE.MathUtils.clamp(E * 1.35 - b.rnd * 0.35, 0, 1));
    v.copy(b.pos).addScaledVector(b.n, b.push).addScaledVector(b.dir, b.dist * e);
    v.y += Math.sin(t * 1.3 + b.rnd * 9) * 0.03 * e;
    qs.setFromAxisAngle(b.axis, b.spin * e + b.push * 0.4);
    q.copy(b.q).multiply(qs);
    m4.compose(v, q, sc.set(b.w, b.h, DEPTH));
    mesh.setMatrixAt(i, m4);
  });
  if (near !== lastNear) { blocks.forEach((b, i) => mesh.setColorAt(i, tc.copy(b.color).lerp(lit, i === near ? 0.5 : 0))); mesh.instanceColor.needsUpdate = true; lastNear = near; }
  mesh.instanceMatrix.needsUpdate = true;
  cap.position.y = R * Math.sin(PHI_MAX) + 0.05 + E * 4; cap.rotation.z = E * 1.2;
  glowMat.color.setScalar(1.4 + E * 2.5 + boost * 0.8 + Math.sin(t * 2) * 0.08);
  inner.intensity = 4 + E * 16;

  composer.render();

  // HUD: project the labelled blocks, connect them with a line (fade out as the igloo breaks)
  const xy = [];
  tags.forEach((tg, k) => {
    mesh.getMatrixAt(tg.i, m4); v.setFromMatrixPosition(m4).project(camera);
    const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
    pts[k].style.transform = `translate(${x}px,${y}px)`; xy.push(`${x},${y}`);
  });
  line.setAttribute('points', xy.join(' '));
  hud.style.opacity = Math.max(0, 1 - E * 3);
});
