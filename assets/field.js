// Ambient particle field behind inner pages: the home page's warm particles, drifting slowly. Scrolling flies
// the camera forward through it (particles wrap around, so it never runs out); the cursor parts them.
import * as THREE from 'three';
import { reduce, touch } from './site.js';

const canvas = document.getElementById('field');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch { /* no WebGL: the page reads fine without it */ }

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor('#140907');
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  const N = touch ? 2500 : 6000, DEPTH = 70, R = Math.random;
  const pos = new Float32Array(N * 3), rnd = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) { pos.set([(R() - 0.5) * 60, (R() - 0.5) * 36, -R() * DEPTH], i * 3); rnd.set([R(), R(), R(), R()], i * 4); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));
  const U = { uTime: { value: 0 }, uCamZ: { value: 0 }, uSize: { value: 1 }, uRayO: { value: new THREE.Vector3() },
    uRayD: { value: new THREE.Vector3() }, uMouseOn: { value: 0 }, uCalm: { value: reduce ? 0 : 1 } };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    vertexShader: /* glsl */`
      attribute vec4 aRnd; uniform float uTime, uCamZ, uSize, uMouseOn, uCalm; uniform vec3 uRayO, uRayD;
      varying float vA; varying vec3 vCol;
      void main(){
        vec3 p = position;
        p.z = uCamZ - 4. - mod(uCamZ - p.z, ${DEPTH}.);                                // wrap ahead of the camera
        p += vec3(sin(uTime * .3 + aRnd.x * 6.28), cos(uTime * .25 + aRnd.y * 6.28), 0.) * .5 * uCalm;
        vec3 d = p - uRayO; float t = max(dot(d, uRayD), .1); vec3 perp = d - uRayD * t; float ang = length(perp) / t;
        p += normalize(perp + 1e-4) * t * .045 * exp(-ang * ang / .008) * uMouseOn;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = min(uSize * mix(.45, 1.5, aRnd.x * aRnd.x) / -mv.z, 32.);
        vA = smoothstep(${DEPTH - 6}., 20., -mv.z) * smoothstep(1., 6., -mv.z) * (.2 + .4 * aRnd.w);
        vCol = aRnd.w < .62 ? vec3(1., .9, .76) : aRnd.w < .86 ? vec3(1., .76, .3) : vec3(.95, .42, .25);
      }`,
    fragmentShader: /* glsl */`
      varying float vA; varying vec3 vCol;
      void main(){ float a = smoothstep(.5, .05, length(gl_PointCoord - .5)) * vA; if (a < .004) discard; gl_FragColor = vec4(vCol * a, a); }`
  }));
  points.frustumCulled = false;
  scene.add(points);

  const resize = () => {
    if (!innerHeight) return;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    U.uSize.value = innerHeight * renderer.getPixelRatio() * 0.09;
  };
  addEventListener('resize', resize); resize();

  const mouse = new THREE.Vector2(), ms = new THREE.Vector2(), ray = new THREE.Raycaster(), clock = new THREE.Clock();
  let pointer = false, z = 0;
  addEventListener('pointermove', e => { mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); pointer = true; });
  document.documentElement.addEventListener('pointerleave', () => pointer = false);
  gsap.ticker.add(() => {
    const dt = Math.min(clock.getDelta(), 0.05), k = 1 - Math.pow(0.001, dt);
    U.uTime.value = clock.elapsedTime;
    z += (-scrollY * 0.012 - z) * k * 0.6;                     // scroll flies forward
    ms.lerp(mouse, k * 0.5);
    camera.position.set(ms.x * 0.8, ms.y * 0.5, z); camera.lookAt(ms.x * 0.3, ms.y * 0.2, z - 10); camera.updateMatrixWorld();
    U.uCamZ.value = z;
    ray.setFromCamera(ms, camera); U.uRayO.value.copy(ray.ray.origin); U.uRayD.value.copy(ray.ray.direction);
    U.uMouseOn.value += ((pointer && !touch ? 1 : 0) - U.uMouseOn.value) * k * 0.3;
    renderer.render(scene, camera);
  });
}
