// Home-page WebGL scene. Temporary visual — to be redesigned once content & layout are final.
// Sections opt in with data-blob="x,y,scale,distortion,hue" (x/y as fraction of half-viewport).
import * as THREE from 'three';
import { reduce, touch, velocity } from './site.js';

const noise = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+2.0*C.xxx;vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.z = 6;

const uniforms = { uTime: { value: 0 }, uDistort: { value: 0.3 }, uHue: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uReveal: { value: 0 } };
const blob = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.15, touch ? 40 : 80),
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: noise + `
      uniform float uTime,uDistort,uReveal; uniform vec2 uMouse;
      varying vec3 vPos; varying float vNoise;
      void main(){
        vec3 p=position;
        float n=snoise(p*1.1+vec3(uMouse*0.8,uTime*0.22));
        n+=0.35*snoise(p*2.6-vec3(0.0,uTime*0.15,uMouse.x));
        float d=n*uDistort;
        p+=normal*d; p*=uReveal;
        vNoise=d;
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        vPos=mv.xyz;
        gl_Position=projectionMatrix*mv;
      }`,
    fragmentShader: `
      uniform float uHue; varying vec3 vPos; varying float vNoise;
      vec3 pal(float t){return 0.5+0.5*cos(6.28318*(t+vec3(0.0,0.1,0.2)));}
      void main(){
        vec3 n=normalize(cross(dFdx(vPos),dFdy(vPos)));
        vec3 v=normalize(-vPos);
        if(dot(n,v)<0.0) n=-n;
        float fres=pow(1.0-max(dot(n,v),0.0),2.2);
        vec3 L=normalize(vec3(-0.6,0.8,0.7));
        float diff=max(dot(n,L),0.0);
        float spec=pow(max(dot(reflect(-L,n),v),0.0),40.0);
        vec3 irid=pal(uHue+vNoise*1.4+fres*0.5+n.y*0.15);
        vec3 col=mix(vec3(0.015,0.015,0.02),irid*0.85,diff*0.5+fres);
        col+=irid*fres*0.5+spec*0.7;
        gl_FragColor=vec4(col,1.0);
      }`
  })
);
scene.add(blob);

const COUNT = touch ? 600 : 1600;
const pos = new Float32Array(COUNT * 3), seed = new Float32Array(COUNT);
for (let i = 0; i < COUNT; i++) {
  const r = 2.5 + Math.random() * 8, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
  pos.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p) - 3], i * 3);
  seed[i] = Math.random();
}
const pgeo = new THREE.BufferGeometry();
pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
pgeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
const dust = new THREE.Points(pgeo, new THREE.ShaderMaterial({
  uniforms: { uTime: uniforms.uTime, uPx: { value: renderer.getPixelRatio() } },
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `uniform float uTime,uPx; attribute float aSeed; varying float vA;
    void main(){ vec3 p=position; p.y+=sin(uTime*0.3+aSeed*30.0)*0.3; p.x+=cos(uTime*0.2+aSeed*20.0)*0.2;
      vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=(1.0+aSeed*2.5)*uPx*(6.0/-mv.z); vA=0.25+0.5*aSeed;
      gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard;
      gl_FragColor=vec4(vec3(0.93,0.91,0.88),(1.0-d*2.0)*vA); }`
}));
scene.add(dust);

let halfW = 1, halfH = 1;
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  halfW = halfH * camera.aspect;
}
resize(); addEventListener('resize', resize);

const state = { x: 0, y: 0, s: 1, d: 0.3, h: 0 }, target = { ...state };
let hoverHue = null;
addEventListener('project:hover', e => hoverHue = e.detail);
// page:enter fires after the shared chrome (incl. contact section) is in the DOM
addEventListener('page:enter', () => {
  document.querySelectorAll('[data-blob]').forEach(sec => {
    const [x, y, s, d, h] = sec.dataset.blob.split(',').map(Number);
    ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: self => self.isActive && Object.assign(target, { x, y, s, d, h }) });
  });
  gsap.to(uniforms.uReveal, { value: 1, duration: 2.2, delay: 0.8, ease: 'elastic.out(1, 0.6)' });
});

const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight * 2 - 1); });

const clock = new THREE.Clock(), L = (a, b, t) => a + (b - a) * t;
gsap.ticker.add(() => {
  const dt = Math.min(clock.getDelta(), 0.05), k = 1 - Math.pow(0.001, dt);
  if (!reduce) uniforms.uTime.value += dt;
  const narrow = innerWidth < 760;
  state.x = L(state.x, narrow ? target.x * 0.35 : target.x, k * 0.6);
  state.y = L(state.y, target.y, k * 0.6);
  state.s = L(state.s, narrow ? target.s * 0.5 : target.s, k * 0.6);
  state.d = L(state.d, (hoverHue != null ? 0.55 : target.d) + Math.min(Math.abs(velocity) * 0.015, 0.4), k * 0.8);
  state.h = L(state.h, hoverHue ?? target.h, k * 0.5);
  mouse.sx = L(mouse.sx, mouse.x, k); mouse.sy = L(mouse.sy, mouse.y, k);

  blob.position.set(state.x * halfW, state.y * halfH, 0);
  blob.scale.setScalar(state.s);
  blob.rotation.y += dt * 0.15 + velocity * 0.002;
  blob.rotation.x = L(blob.rotation.x, -mouse.sy * 0.3, k);
  uniforms.uDistort.value = state.d; uniforms.uHue.value = state.h;
  uniforms.uMouse.value.set(mouse.sx, mouse.sy);
  dust.rotation.y = uniforms.uTime.value * 0.02 + mouse.sx * 0.1;
  dust.rotation.x = mouse.sy * 0.05;
  camera.position.x = mouse.sx * 0.25; camera.position.y = mouse.sy * 0.15; camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
});
