import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const $=id=>document.getElementById(id), canvas=$('scene'), status=$('status');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x08090e);renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x08090e);
const camera=new THREE.PerspectiveCamera(42,1,.1,160);
camera.position.set(0,13,24);
const orbit=new OrbitControls(camera,canvas);orbit.target.set(0,0,0);orbit.enableDamping=true;orbit.maxPolarAngle=Math.PI/2.07;orbit.minDistance=13;orbit.maxDistance=42;orbit.enablePan=false;orbit.update();
scene.add(new THREE.HemisphereLight(0xd7e8ff,0x172b54,2.1));
const light=new THREE.DirectionalLight(0xffffff,1.8);light.position.set(-8,16,8);scene.add(light);
function mat(hex,opacity=1){return new THREE.MeshStandardMaterial({color:hex,roughness:.75,transparent:opacity<1,opacity,side:THREE.DoubleSide})}
const blue=mat(0x499df4),red=mat(0xf47778),orange=mat(0xf7c65f),courtMat=mat(0x06132c,.92),edge=0x356ca7;
function line(points,color=0x356ca7,width=1){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.Line(g,new THREE.LineBasicMaterial({color}));scene.add(m);return m}
const floor=new THREE.Mesh(new THREE.PlaneGeometry(9,18),courtMat);floor.rotation.x=-Math.PI/2;floor.position.y=-.025;scene.add(floor);
for(const z of [-9,0,9])line([[-4.5,.013,z],[4.5,.013,z]],edge);
for(const x of [-4.5,4.5])line([[x,.013,-9],[x,.013,9]],edge);
for(const z of [-6,6])line([[-4.5,.014,z],[4.5,.014,z]],edge);
const grid=new THREE.GridHelper(52,26,0x15233b,0x15233b);grid.position.y=-.07;scene.add(grid);
function bar(x,y,z,sx,sy,sz,material){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);scene.add(m);return m}
bar(-4.7,1.25,0,.065,2.5,.065,mat(0xd9e3f5));bar(4.7,1.25,0,.065,2.5,.065,mat(0xd9e3f5));
for(let i=0;i<13;i++){line([[-4.5,.42+i*.135,0],[4.5,.42+i*.135,0]],0x6b7b8d)}
for(let i=0;i<=30;i++)line([[-4.5+i*.3,.4,0],[-4.5+i*.3,2.04,0]],0x41516b);
const playerMeshes=[],hitMeshes=[];
function capsulePerson(material){
const g=new THREE.Group();
const head=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),material);head.position.y=1.69;g.add(head);
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.65,4,8),material);torso.position.y=1.08;g.add(torso);
function limb(x,y,angle,len,rad){const o=new THREE.Mesh(new THREE.CapsuleGeometry(rad,len,3,6),material);o.position.set(x,y,0);o.rotation.z=angle;g.add(o)}
limb(-.25,1.07,-.32,.5,.065);limb(.25,1.07,.32,.5,.065);
limb(-.15,.4,-.10,.61,.09);limb(.15,.4,.10,.61,.09);
return g;
}
function labelSprite(label){const c=document.createElement('canvas');c.width=160;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#d9edff';ctx.textAlign='center';ctx.font='bold 30px Arial';ctx.fillText(label,80,42);const tex=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));s.scale.set(1.2,.48,1);s.position.y=2.14;return s}
for(let i=0;i<6;i++){const g=capsulePerson(blue);g.add(labelSprite('P'+(i+1)));scene.add(g);playerMeshes.push(g);g.traverse(o=>{if(o.isMesh){o.userData.player=i;hitMeshes.push(o)}})}
const opponents=[];for(let i=0;i<6;i++){let g=capsulePerson(red);g.scale.setScalar(.9);scene.add(g);opponents.push(g)}
const ball=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),orange);scene.add(ball);
let traj=null, mode='receive',rotation=0,system='5-1',serve='float',seam='left',progress=0,playing=false,last=0,chosen=-1;
const coords=[[ -2.8,6.5 ],[0,6.5],[2.8,6.5],[-2.8,2.5],[0,2.5],[2.8,2.5]];
const starts={receive:[[-2.9,2.1],[0,2.7],[2.9,2.1],[-2.5,6.1],[0,6.6],[2.5,6.1]],offense:[[-2.8,1.5],[0,1.5],[2.8,1.5],[-2.8,5.8],[0,5.8],[2.8,5.8]],defense:[[-2.7,1.6],[0,1.5],[2.7,1.6],[-3.3,6.7],[0,7.5],[3.3,6.7]]};
let current=starts.receive.map(a=>a.slice());
function opponentsSet(){for(let i=0;i<6;i++){const x=[-2.6,0,2.6][i%3],z=i<3?-2:-6;opponents[i].position.set(x,0,z)}}
function setPositions(){current=starts[mode].map(a=>a.slice());const order=[0,1,2,3,4,5];for(let i=0;i<rotation;i++)order.unshift(order.pop());playerMeshes.forEach((g,i)=>{let v=current[order[i]];g.position.set(v[0],0,v[1]);g.userData.home={x:v[0],z:v[1]}});opponentsSet();makeTrail();draw(0)}
function trajectory(t){const from=mode==='receive'?new THREE.Vector3(seam==='left'?-2.8:2.8,2.8,-8):mode==='defense'?new THREE.Vector3(-2.8,2.9,-2.2):new THREE.Vector3(0,2.1,3.3);
const to=mode==='receive'?new THREE.Vector3(seam==='left'?-2.5:2.5,1,5.6):mode==='defense'?new THREE.Vector3(seam==='left'?-2.3:2.3,.8,7):new THREE.Vector3(2.2,2.8,-5.2);
const height=Number($('arc').value);
const curve=new THREE.QuadraticBezierCurve3(from,new THREE.Vector3((from.x+to.x)/2,height,(from.z+to.z)/2),to);
return curve.getPoint(t)}
function makeTrail(){if(traj){scene.remove(traj);traj.geometry.dispose();traj.material.dispose()}const points=[];for(let i=0;i<=80;i++)points.push(trajectory(i/80));const g=new THREE.BufferGeometry().setFromPoints(points);traj=new THREE.Line(g,new THREE.LineDashedMaterial({color:mode==='receive'?0xff8380:0x60b8ff,dashSize:.22,gapSize:.11}));traj.computeLineDistances();scene.add(traj)}
function draw(t){progress=Math.max(0,Math.min(1,t));ball.position.copy(trajectory(progress));$('timeline').value=Math.round(progress*1000)}
function updateUI(){document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('modeName').textContent={receive:'SERVE RECEIVE',offense:'OFFENSE',defense:'DEFENSE'}[mode];$('status').textContent=mode==='receive'?'Serve trajectory and passing lanes':mode==='offense'?'Set and attack trajectory':'Attack defense and coverage';}
function configure(){mode=$('mode').value;rotation=Number($('rotation').value);system=$('system').value;serve=$('serve').value;seam=$('seam').value;makeTrail();setPositions();updateUI()}
function setMode(m){mode=m;$('mode').value=m;playing=false;setPositions();updateUI();$('play').textContent='▶'}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
for(const id of ['system','rotation','serve','seam'])$(id).addEventListener('change',configure);
$('arc').addEventListener('input',()=>{makeTrail();draw(progress)});
$('reset').addEventListener('click',()=>{playing=false;progress=0;setPositions();$('play').textContent='▶'});
$('play').addEventListener('click',()=>{if(progress>=1)draw(0);playing=!playing;$('play').textContent=playing?'Ⅱ':'▶'});
$('restart').addEventListener('click',()=>{playing=false;draw(0);$('play').textContent='▶'});
$('timeline').addEventListener('input',e=>{playing=false;$('play').textContent='▶';draw(Number(e.target.value)/1000)});
$('speed').addEventListener('input',e=>$('speedVal').textContent=Number(e.target.value).toFixed(1)+'x');
$('toggleEditor').addEventListener('click',()=>{const e=$('editor');e.hidden=!e.hidden;$('toggleEditor').setAttribute('aria-expanded',String(!e.hidden))});
$('cam').addEventListener('click',()=>{camera.position.set(0,24,.01);orbit.target.set(0,0,0);orbit.update()});
$('orbit').addEventListener('click',()=>{camera.position.set(0,13,24);orbit.target.set(0,0,0);orbit.update()});
$('save').addEventListener('click',()=>{localStorage.setItem('orcas-visualizer-save',JSON.stringify({mode,rotation,system,serve,seam,arc:$('arc').value,positions:playerMeshes.map(p=>({x:p.position.x,z:p.position.z}))}));$('save').textContent='SAVED ✓'});
$('load').addEventListener('click',()=>{try{const d=JSON.parse(localStorage.getItem('orcas-visualizer-save'));if(!d)throw Error();mode=d.mode;$('mode').value=mode;$('rotation').value=d.rotation;$('system').value=d.system;$('serve').value=d.serve;$('seam').value=d.seam;$('arc').value=d.arc;setPositions();d.positions.forEach((p,i)=>playerMeshes[i].position.set(p.x,0,p.z));updateUI()}catch(e){$('status').textContent='No saved play found in this browser'}});
$('share').addEventListener('click',async()=>{const q=new URL(location.href);q.searchParams.set('mode',mode);q.searchParams.set('rotation',String(rotation));try{await navigator.clipboard.writeText(q.href);$('share').textContent='COPIED ✓'}catch(e){$('status').textContent='Copy the page URL to share this play'}});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
let dragging=false;
function pick(e){const rect=canvas.getBoundingClientRect();pointer.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);ray.setFromCamera(pointer,camera)}
canvas.addEventListener('pointerdown',e=>{pick(e);const hits=ray.intersectObjects(hitMeshes);if(hits.length){chosen=hits[0].object.userData.player;dragging=true;orbit.enabled=false;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'}});
canvas.addEventListener('pointermove',e=>{if(!dragging)return;pick(e);if(ray.ray.intersectPlane(plane,hit)){playerMeshes[chosen].position.set(THREE.MathUtils.clamp(hit.x,-4.1,4.1),0,THREE.MathUtils.clamp(hit.z,.6,8.5))}});
function endDrag(){dragging=false;orbit.enabled=true;canvas.style.cursor='grab'}canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(canvas);resize();
function animate(now){requestAnimationFrame(animate);if(playing){if(last)draw(progress+(now-last)/(4200/Number($('speed').value)));if(progress>=1){playing=false;$('play').textContent='▶'}}last=now;orbit.update();renderer.render(scene,camera)}requestAnimationFrame(animate);
try{const u=new URL(location.href);if(['receive','offense','defense'].includes(u.searchParams.get('mode')))mode=u.searchParams.get('mode');if(u.searchParams.has('rotation'))rotation=Math.max(0,Math.min(5,Number(u.searchParams.get('rotation'))));}catch(e){}
$('mode').value=mode;$('rotation').value=rotation;setPositions();updateUI();
