// Home hero, after igloo.inc: an igloo of rough snow blocks lit from inside.
// Intro: line sketch → aerial fly-over with a network overlay → close shot with blocks popped out.
// Mouse: camera parallax, blocks near the cursor lift. Scroll: blocks settle into place, then the
// camera dives through the entrance into a white-out. Numbered blocks link to featured case studies.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { reduce, touch, esc, scramble } from './site.js';
import { projects } from './projects.js';

const hero = document.querySelector('.hero--home');
const canvas = document.getElementById('gl');
const hud = document.getElementById('hud');
const flash = document.querySelector('.hero__flash');
const FOG = new THREE.Color('#d9dce1');

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch { hero.classList.add('no-gl'); throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = !touch;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = FOG;
scene.fog = new THREE.FogExp2(FOG, 0.019);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.3;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
scene.add(new THREE.HemisphereLight(0xeef1f6, 0x5d646f, 0.7));
const sun = new THREE.DirectionalLight(0xffffff, 3.2);
sun.position.set(-7, 10, 4);
sun.castShadow = renderer.shadowMap.enabled;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 40 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
scene.add(sun);

// ---------- procedural roughness: bumps and dirt on snow and blocks, no textures needed ----------
const NOISE = `
float h3(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vn3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ return vn3(p)*0.5+vn3(p*2.07)*0.3+vn3(p*4.3)*0.2; }
`;
function rough(mat, scale, bump, dirt) {
  mat.onBeforeCompile = sh => {
    sh.vertexShader = 'varying vec3 vWPos;\n' + sh.vertexShader.replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
      vec4 wp_ = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
      wp_ = instanceMatrix * wp_;
      #endif
      vWPos = (modelMatrix * wp_).xyz;`);
    sh.fragmentShader = 'varying vec3 vWPos;\n' + NOISE + sh.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      { vec3 P = vWPos * ${scale.toFixed(2)}; float e = 0.07; float n0 = fbm3(P);
        vec3 g = vec3(fbm3(P+vec3(e,0,0))-n0, fbm3(P+vec3(0,e,0))-n0, fbm3(P+vec3(0,0,e))-n0) / e;
        normal = normalize(normal - ${bump.toFixed(3)} * (mat3(viewMatrix) * g));
        diffuseColor.rgb *= mix(${(1 - dirt).toFixed(2)}, 1.05, n0); }`);
  };
  return mat;
}

// ---------- terrain: a snow mound under the igloo, rough drifts, ridged mountains far behind ----------
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const vnoise = (x, y) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y, o = 5) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { s += vnoise(x * f, y * f) * a; f *= 2.03; a *= 0.5; } return s; };
const ridged = (x, y) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < 5; i++) { s += (1 - Math.abs(vnoise(x * f, y * f) * 2 - 1)) ** 2 * a; f *= 2.1; a *= 0.5; } return s; };
const SEG = touch ? 140 : 260;
const ground = new THREE.PlaneGeometry(160, 160, SEG, SEG);
ground.rotateX(-Math.PI / 2);
const gp = ground.attributes.position;
for (let i = 0; i < gp.count; i++) {
  const x = gp.getX(i), z = gp.getZ(i), r = Math.hypot(x, z + 2);
  const near = THREE.MathUtils.smoothstep(Math.hypot(x, z), 2.9, 7);
  let y = 0.35 * Math.exp(-(x * x + z * z) / 26) - 0.35;                        // mound
  y += (fbm(x * 0.28, z * 0.28) - 0.5) * 1.4 * near + (fbm(x * 1.6, z * 1.6, 3) - 0.5) * 0.12;
  y += Math.max(0, r - 22) ** 1.35 * 0.32 * (0.35 + ridged(x * 0.045, z * 0.045));  // mountains
  gp.setY(i, y);
}
ground.computeVertexNormals();
const groundMesh = new THREE.Mesh(ground, rough(new THREE.MeshStandardMaterial({ color: 0xa3a8b0, roughness: 0.95 }), 3.2, 0.55, 0.28));
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// ---------- igloo blocks: dome rings + an entrance tunnel ----------
const igloo = new THREE.Group();
scene.add(igloo);
const R = 2.3, DEPTH = 0.5, RINGS = 6, PHI_MAX = Math.PI * 0.42, DOOR = Math.PI / 2, TR = 0.95;
const blocks = [];
const add = (pos, n, t, w, h, ring, theta) => {
  const u = new THREE.Vector3().crossVectors(n, t);
  blocks.push({
    pos, n, ring, theta, w, h, rnd: Math.random(),
    q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(t, u, n)),
    dir: n.clone().multiplyScalar(1.3).add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5)).normalize(),
    dist: 3 + Math.random() * 6, axis: new THREE.Vector3().randomDirection(), spin: (Math.random() - 0.5) * 6,
    tilt: new THREE.Vector3().randomDirection(), pop: 0, push: 0
  });
};
for (let i = 0; i < RINGS; i++) {
  const phi = (i + 0.5) * (PHI_MAX / RINGS), r = R * Math.cos(phi), y = R * Math.sin(phi);
  const count = Math.max(6, Math.round((2 * Math.PI * r) / 1.15));
  for (let k = 0; k < count; k++) {
    const theta = ((k + (i % 2) * 0.5) / count) * Math.PI * 2;
    const dt = Math.abs(Math.atan2(Math.sin(theta - DOOR), Math.cos(theta - DOOR)));
    if (y < TR * 1.05 && dt < 0.42) continue;                                   // doorway
    add(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)),
      new THREE.Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), Math.cos(phi) * Math.sin(theta)),
      new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta)),
      ((2 * Math.PI * r) / count) * 0.9, R * (PHI_MAX / RINGS) * 0.88, i, theta);
  }
}
const TUN = 3, ARCH = 7;
for (let j = 0; j < TUN; j++) {
  const z = R * 0.82 + 0.55 * j;
  for (let k = 0; k < ARCH; k++) {
    const a = ((k + 0.5) / ARCH) * Math.PI;
    add(new THREE.Vector3(Math.cos(a) * TR, Math.sin(a) * TR, z), new THREE.Vector3(Math.cos(a), Math.sin(a), 0),
      new THREE.Vector3(-Math.sin(a), Math.cos(a), 0), ((Math.PI * TR) / ARCH) * 0.88, 0.5, -1, DOOR);
  }
}
const geo = new RoundedBoxGeometry(1, 1, 1, 3, 0.1);
const mat = rough(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), 5.5, 0.5, 0.35);
const mesh = new THREE.InstancedMesh(geo, mat, blocks.length);
mesh.castShadow = mesh.receiveShadow = renderer.shadowMap.enabled;
const lit = new THREE.Color(0xffffff);
blocks.forEach((b, i) => { b.color = new THREE.Color(0x949aa3).offsetHSL(0, 0, (b.rnd - 0.5) * 0.08); mesh.setColorAt(i, b.color); });
igloo.add(mesh);

// light inside, leaking through the seams; bloom turns the gaps into glowing lines
const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, side: THREE.BackSide });
igloo.add(new THREE.Mesh(new THREE.SphereGeometry(R - DEPTH * 0.6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), glowMat));
const tunnelGlow = new THREE.Mesh(new THREE.CylinderGeometry(TR - 0.3, TR - 0.3, 0.55 * TUN, 24, 1, true, -Math.PI / 2, Math.PI), glowMat);
tunnelGlow.rotation.x = Math.PI / 2; tunnelGlow.position.z = R * 0.82 + 0.55; igloo.add(tunnelGlow);
const cap = new THREE.Mesh(new THREE.CylinderGeometry(R * Math.cos(PHI_MAX) + 0.12, R * Math.cos(PHI_MAX) + 0.3, DEPTH, 20), mat);
cap.position.y = R * Math.sin(PHI_MAX) + 0.05; cap.castShadow = true; igloo.add(cap);
const inner = new THREE.PointLight(0xffffff, 10, 9, 1.6); inner.position.set(0, 0.5, R * 0.9 + 0.6); igloo.add(inner);

// which blocks pop out in the hero shot; four of them carry the case-study markers
const featured = projects.filter(p => p.featured).slice(0, 4);
const spots = [[3, DOOR + 0.25], [4, DOOR + 0.8], [2, DOOR + 1.05], [1, DOOR + 1.55]];  // faces the camera
const tags = featured.map((p, k) => {
  let best = 0, bd = 1e9;
  blocks.forEach((b, i) => { if (b.ring !== spots[k][0]) return; const d = Math.abs(Math.atan2(Math.sin(b.theta - spots[k][1]), Math.cos(b.theta - spots[k][1]))); if (d < bd) { bd = d; best = i; } });
  return { i: best, p };
});
blocks.forEach(b => { if (b.ring >= 1 && b.rnd < 0.28) b.pop = 0.2 + Math.random() * 0.5; });
tags.forEach(t => blocks[t.i].pop = 0.55);

// ---------- intro overlays: line sketch of every block, and a loose network of lines ----------
const edge = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)).attributes.position.array;
const sketch = new Float32Array(blocks.length * edge.length), m = new THREE.Matrix4(), vv = new THREE.Vector3();
blocks.forEach((b, i) => {
  m.compose(b.pos, b.q, new THREE.Vector3(b.w, b.h, DEPTH));
  for (let k = 0; k < edge.length; k += 3) { vv.set(edge[k], edge[k + 1], edge[k + 2]).applyMatrix4(m); sketch.set([vv.x, vv.y, vv.z], i * edge.length + k); }
});
const sketchGeo = new THREE.BufferGeometry(); sketchGeo.setAttribute('position', new THREE.BufferAttribute(sketch, 3));
const sketchMat = new THREE.LineBasicMaterial({ color: 0x2b3038, transparent: true, opacity: 0, depthWrite: false });
igloo.add(new THREE.LineSegments(sketchGeo, sketchMat));
const NET = 70, np = [];
for (let i = 0; i < NET; i++) np.push(new THREE.Vector3((Math.random() - 0.5) * 26, Math.random() * 7 - 0.5, (Math.random() - 0.5) * 22));
const netPos = [];
np.forEach(a => np.map(b => [b, a.distanceTo(b)]).sort((x, y) => x[1] - y[1]).slice(1, 3).forEach(([b]) => netPos.push(a.x, a.y, a.z, b.x, b.y, b.z)));
const netGeo = new THREE.BufferGeometry(); netGeo.setAttribute('position', new THREE.Float32BufferAttribute(netPos, 3));
const netMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
scene.add(new THREE.LineSegments(netGeo, netMat));

// ---------- snow ----------
const SNOW = touch ? 600 : 1800;
const sp = new Float32Array(SNOW * 3), ss = new Float32Array(SNOW);
for (let i = 0; i < SNOW; i++) { sp.set([(Math.random() - 0.5) * 30, Math.random() * 12, (Math.random() - 0.5) * 24], i * 3); ss[i] = Math.random(); }
const snowGeo = new THREE.BufferGeometry();
snowGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
snowGeo.setAttribute('aSeed', new THREE.BufferAttribute(ss, 1));
const snowMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } }, transparent: true, depthWrite: false,
  vertexShader: `uniform float uTime,uPx; attribute float aSeed; varying float vA;
    void main(){ vec3 p=position; p.y=mod(p.y-uTime*(0.2+aSeed*0.3),12.0)-1.0; p.x+=sin(uTime*0.5+aSeed*40.0)*0.3;
      vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(1.2+aSeed*2.2)*uPx*(9.0/-mv.z); vA=0.3+0.5*aSeed; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard; gl_FragColor=vec4(1.0,1.0,1.0,(1.0-d*2.0)*vA); }`
});
scene.add(new THREE.Points(snowGeo, snowMat));

// ---------- post: bloom, then grain + vignette + chromatic aberration ----------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.35, 0.93);
composer.addPass(bloom);
composer.addPass(new OutputPass());
const film = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uCA: { value: 0.004 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime,uCA; varying vec2 vUv;
    void main(){ vec2 d=vUv-0.5; float r=dot(d,d);
      vec3 c=vec3(texture2D(tDiffuse,vUv-d*uCA*(1.0+r*8.0)).r, texture2D(tDiffuse,vUv).g, texture2D(tDiffuse,vUv+d*uCA*(1.0+r*8.0)).b);
      float g=fract(sin(dot(vUv*vec2(1734.0,892.0)+fract(uTime)*100.0,vec2(12.9898,78.233)))*43758.5453);
      c+=(g-0.5)*0.05; c*=1.0-r*0.22; gl_FragColor=vec4(c,1.0); }`
});
composer.addPass(film);

// ---------- HUD ----------
hud.innerHTML = `<svg class="hud__lines"><polyline/></svg>` + tags.map((t, k) =>
  `<a class="hud__pt mono" href="case.html#${t.p.slug}"><i>${String(k + 1).padStart(2, '0')}</i><span>${esc(t.p.title)}</span></a>`).join('');
const pts = [...hud.querySelectorAll('.hud__pt')], hudLine = hud.querySelector('polyline');
let hoverTag = -1;
pts.forEach((el, k) => {
  el.addEventListener('mouseenter', () => { hoverTag = k; scramble(el.querySelector('span'), 0.5); });
  el.addEventListener('mouseleave', () => hoverTag = -1);
});

// ---------- layout ----------
let W = 1, H = 1, wide = true;
function resize() {
  W = hero.clientWidth; H = hero.clientHeight; wide = W / H > 1.15;
  renderer.setSize(W, H, false); composer.setSize(W, H); bloom.resolution.set(W / 2, H / 2);
  camera.aspect = W / H;
  if (wide) camera.setViewOffset(W, H, -W * 0.28, H * 0.05, W, H); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(hero); resize();

// ---------- timeline ----------
const S = { fly: reduce ? 0 : 1, cam: reduce ? 1 : 0, sketch: 0, net: 0, hud: reduce ? 1 : 0, scroll: 0 };
addEventListener('page:enter', () => {
  if (reduce) return;
  gsap.timeline({ delay: 0.3 })
    .to(S, { sketch: 1, duration: 1.4, ease: 'power2.inOut' })
    .to(S, { net: 1, duration: 1.2, ease: 'power2.out' }, 0.2)
    .to(S, { cam: 1, duration: 3.4, ease: 'power3.inOut' }, 0.6)
    .to(S, { fly: 0, duration: 2.6, ease: 'power3.out' }, 1.1)
    .to(S, { sketch: 0, net: 0, duration: 1.2 }, 2.3)
    .to(S, { hud: 1, duration: 0.8 }, 3.6);
});
ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => S.scroll = s.progress });
let boost = 0;
addEventListener('project:hover', e => boost = e.detail == null ? 0 : 1);

const mouse = new THREE.Vector2(), smooth = new THREE.Vector2();
let hasPointer = false;
hero.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); hasPointer = true;
});
hero.addEventListener('pointerleave', () => hasPointer = false);
let visible = true;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(hero);

const ray = new THREE.Raycaster(), sphere = new THREE.Sphere(new THREE.Vector3(), R + 0.2), hit = new THREE.Vector3();
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qs = new THREE.Quaternion(), qt = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), tc = new THREE.Color();
const AERIAL = new THREE.Vector3(-9, 17, 14), LOOK0 = new THREE.Vector3(0, 0, 0), LOOK1 = new THREE.Vector3(0.3, 1.0, 0.4), LOOK2 = new THREE.Vector3(0, 0.6, 0), DOORPT = new THREE.Vector3(0, 0.55, R * 0.82 + 2.2);
const camPos = new THREE.Vector3(), look = new THREE.Vector3(), heroPos = new THREE.Vector3();
const clock = new THREE.Clock(), L = (a, b, t) => a + (b - a) * t, ease = x => 1 - Math.pow(1 - x, 3), sstep = THREE.MathUtils.smoothstep;
let lastNear = -2;

gsap.ticker.add(() => {
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), 0.05), k = 1 - Math.pow(0.002, dt), t = clock.elapsedTime;
  snowMat.uniforms.uTime.value = t; film.uniforms.uTime.value = t;
  smooth.lerp(mouse, k * 0.5);

  const settle = sstep(S.scroll, 0, 0.35), dive = sstep(S.scroll, 0.3, 1);
  // camera: aerial → hero (intro), cursor parallax, then dive into the entrance (scroll)
  const yaw = -0.62 + smooth.x * 0.16 + (reduce ? 0 : Math.sin(t * 0.07) * 0.04), dist = 14.5;
  heroPos.set(Math.sin(yaw) * dist, 4.2 + smooth.y * 0.5, Math.cos(yaw) * dist);
  camPos.lerpVectors(AERIAL, heroPos, ease(S.cam)).lerp(DOORPT, ease(dive));
  look.lerpVectors(LOOK0, LOOK1, ease(S.cam)).lerp(LOOK2, dive);
  camera.position.copy(camPos); camera.lookAt(look);

  let hitOk = false;
  if (hasPointer && !touch && S.cam > 0.9) { ray.setFromCamera(mouse, camera); hitOk = !!ray.ray.intersectSphere(sphere, hit); }
  let near = -1, nd = 0.75;
  blocks.forEach((b, i) => {
    const d = hitOk ? b.pos.distanceTo(hit) : 9;
    if (d < nd && b.ring >= 0) { nd = d; near = i; }
    const tag = tags.findIndex(x => x.i === i);
    const target = Math.max(hitOk && b.ring >= 0 ? sstep(1.3 - d, 0, 1.3) * 0.35 : 0, tag >= 0 && tag === hoverTag ? 0.35 : 0);
    b.push = L(b.push, target, k * 0.5);
    const pop = b.pop * (1 - settle), e = ease(THREE.MathUtils.clamp(S.fly * 1.35 - b.rnd * 0.35, 0, 1));
    v.copy(b.pos).addScaledVector(b.n, pop + b.push).addScaledVector(b.dir, b.dist * e);
    v.y += Math.sin(t * 0.9 + b.rnd * 9) * 0.035 * (pop > 0 ? 1 : 0) * (1 - settle);
    qs.setFromAxisAngle(b.axis, b.spin * e);
    qt.setFromAxisAngle(b.tilt, pop * 0.55 + b.push * 0.3);
    q.copy(b.q).multiply(qt).multiply(qs);
    m4.compose(v, q, sc.set(b.w, b.h, DEPTH));
    mesh.setMatrixAt(i, m4);
  });
  if (near !== lastNear) { blocks.forEach((b, i) => mesh.setColorAt(i, tc.copy(b.color).lerp(lit, i === near ? 0.45 : 0))); mesh.instanceColor.needsUpdate = true; lastNear = near; }
  mesh.instanceMatrix.needsUpdate = true;
  cap.position.y = R * Math.sin(PHI_MAX) + 0.05 + S.fly * 6;

  const g = 1.7 + boost * 0.6 + dive * 6 + Math.sin(t * 1.7) * 0.06;
  glowMat.color.setRGB(g, g, g * 1.03);
  inner.intensity = 5 + dive * 40;
  bloom.strength = 0.45 + dive * 1.2;
  film.uniforms.uCA.value = 0.004 + dive * 0.05;
  sketchMat.opacity = S.sketch * 0.7;
  sketchGeo.setDrawRange(0, Math.floor(S.sketch * sketch.length / 3));
  netMat.opacity = S.net * 0.55 * (1 - S.cam * 0.6);
  flash.style.opacity = sstep(dive, 0.55, 1);

  composer.render();

  const xy = [];
  tags.forEach((tg, k) => {
    mesh.getMatrixAt(tg.i, m4); v.setFromMatrixPosition(m4).project(camera);
    const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
    pts[k].style.transform = `translate(${x}px,${y}px)`; xy.push(`${x},${y}`);
  });
  hudLine.setAttribute('points', xy.join(' '));
  hud.style.opacity = S.hud * (1 - sstep(S.scroll, 0.05, 0.25));
});
