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
 // A lightweight cutout, camera-facing silhouette rather than a complex rig.
 const g=new THREE.Group(),cv=document.createElement('canvas');
 cv.width=192;cv.height=384;
 const ctx=cv.getContext('2d');ctx.fillStyle='#'+material.color.getHexString();
 ctx.beginPath();ctx.arc(96,46,26,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.moveTo(75,83);ctx.lineTo(117,83);ctx.lineTo(132,212);ctx.lineTo(105,219);ctx.lineTo(96,178);ctx.lineTo(87,219);ctx.lineTo(60,212);ctx.closePath();ctx.fill();
 ctx.lineCap='round';ctx.lineWidth=25;
 for(const v of [[74,103,42,190],[118,103,150,190],[79,207,64,326],[110,207,126,326]]){ctx.beginPath();ctx.moveTo(v[0],v[1]);ctx.lineTo(v[2],v[3]);ctx.stroke()}
 const tx=new THREE.CanvasTexture(cv);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(.92,1.92),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:THREE.DoubleSide,depthWrite:false,alphaTest:.15}));
 m.position.y=.97;m.userData.cutout=true;g.add(m);return g;
}
function labelSprite(label){const c=document.createElement('canvas');c.width=160;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#d9edff';ctx.textAlign='center';ctx.font='bold 30px Arial';ctx.fillText(label,80,42);const tex=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));s.scale.set(1.2,.48,1);s.position.y=2.14;return s}
for(let i=0;i<6;i++){const g=capsulePerson(blue);g.add(labelSprite('P'+(i+1)));scene.add(g);playerMeshes.push(g);g.traverse(o=>{if(o.isMesh){o.userData.player=i;hitMeshes.push(o)}})}
const opponents=[];for(let i=0;i<6;i++){let g=capsulePerson(red);g.scale.setScalar(.9);scene.add(g);opponents.push(g)}
const ball=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),orange);scene.add(ball);
let traj=null, mode='receive',rotation=0,system='5-1',serve='float',seam='left',progress=0,playing=false,last=0,chosen=-1;
const coords=[[ -2.8,6.5 ],[0,6.5],[2.8,6.5],[-2.8,2.5],[0,2.5],[2.8,2.5]];
const starts={receive:[[-2.9,2.1],[0,2.7],[2.9,2.1],[-2.5,6.1],[0,6.6],[2.5,6.1]],offense:[[-2.8,1.5],[0,1.5],[2.8,1.5],[-2.8,5.8],[0,5.8],[2.8,5.8]],defense:[[-2.7,1.6],[0,1.5],[2.7,1.6],[-3.3,6.7],[0,7.5],[3.3,6.7]]};
let current=starts.receive.map(a=>a.slice());
function opponentsSet(){for(let i=0;i<6;i++){const x=[-2.6,0,2.6][i%3],z=i<3?-2:-6;opponents[i].visible=mode!=='receive'||i===0;opponents[i].position.set(mode==='receive'&&i===0?(seam==='left'?-2.7:2.7):x,0,mode==='receive'&&i===0?-8.2:z)}}
function setPositions(){current=starts[mode].map(a=>a.slice());const order=[0,1,2,3,4,5];for(let i=0;i<rotation;i++)order.unshift(order.pop());playerMeshes.forEach((g,i)=>{let v=current[order[i]];g.position.set(v[0],0,v[1]);g.userData.home={x:v[0],z:v[1]}});opponentsSet();makeTrail();draw(0)}
// Complete deterministic rally: serve -> pass -> set -> attack -> dig -> set -> return.
// All positions come from the playback time, so seeking is identical to playing.
const phaseNames=['SERVE','PASS','SET','ATTACK','DIG','TRANSITION','RETURN'];
function rallyPoints(){
 const side=seam==='left'?-1:1;
 const first=new THREE.Vector3(side*2.4,1,5.8);
 const setter=new THREE.Vector3(0,2.0,2.5);
 const hitter=new THREE.Vector3(-3,2.7,1.0);
 const digger=new THREE.Vector3(2.5,.9,-6.2);
 const oppSetter=new THREE.Vector3(0,2.1,-2.9);
 return [
 new THREE.Vector3(side*2.7,2.5,-8.2),
 first,setter,hitter,
 new THREE.Vector3(side*2.3,2.9,-5.7),
 digger,oppSetter,
 new THREE.Vector3(2.3,2.7,-1.3),
 new THREE.Vector3(-1.8,.7,6.8)
 ];
}
const durations=[.14,.13,.13,.15,.13,.13,.09,.10];
function phaseAt(t){
 let total=0;
 for(let i=0;i<durations.length;i++){
  const next=total+durations[i];
  if(t<=next||i===durations.length-1)return {index:i,u:THREE.MathUtils.clamp((t-total)/durations[i],0,1)};
  total=next;
 }
 return {index:0,u:0};
}
function trajectory(t){
 const pts=rallyPoints(),ph=phaseAt(t),i=ph.index,u=ph.u;
 const start=pts[i],end=pts[i+1];
 const h=Number($('arc').value);
 const peak=[h*.7,3.1,3.9,h*.8,3.8,3.1,3.6,4.1][i];
 const x=start.x+(end.x-start.x)*u,z=start.z+(end.z-start.z)*u;
 const y=start.y+(end.y-start.y)*u+4*u*(1-u)*Math.max(0,peak-Math.max(start.y,end.y));
 return new THREE.Vector3(x,y,z);
}
function makeTrail(){
 if(traj){scene.remove(traj);traj.geometry.dispose();traj.material.dispose();}
 const pts=[];for(let i=0;i<=240;i++)pts.push(trajectory(i/240));
 traj=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0x60b8ff,dashSize:.21,gapSize:.12,transparent:true,opacity:.9}));
 traj.computeLineDistances();scene.add(traj);
}
function smooth(a,b,t){const u=THREE.MathUtils.clamp((t-a)/(b-a),0,1);return u*u*(3-2*u)}
function draw(t){
 progress=THREE.MathUtils.clamp(t,0,1);
 ball.position.copy(trajectory(progress));
 $('timeline').value=Math.round(progress*1000);
 const ph=phaseAt(progress);
 const labels=['Serve','Pass','Set','Attack','Defensive dig','Transition set','Opponent attack','Rally complete'];
 $('status').textContent='RALLY '+(ph.index+1)+'/8 · '+labels[ph.index];
 const side=seam==='left'?-1:1;
 playerMeshes.forEach((g,i)=>{
  const h=g.userData.home||{x:g.position.x,z:g.position.z};
  const move=(a,b)=>smooth(a,b,progress);
  let x=h.x,z=h.z,y=0;
  // Make each contact visually understandable: receiver -> setter -> hitter.
  const receiver=seam==='left'?3:5;
  if(i===receiver){const k=move(.015,.12)*(1-move(.19,.28));x+=( (seam==='left'?-2.4:2.4)-h.x)*k;z+=(5.8-h.z)*k;}
  if(i===1){const k=move(.11,.23)*(1-move(.34,.46));x+=(0-h.x)*k;z+=(2.5-h.z)*k;}
  if(i===0){const k=move(.25,.38)*(1-move(.55,.67));x+=(-3-h.x)*k;z+=(1-h.z)*k;y=.7*Math.sin(Math.PI*move(.35,.48))*k;}
  // Back-row coverage follows the outgoing attack.
  if(i===4){const k=move(.41,.55)*(1-move(.79,.95));z+=(-.9)*k;}
  g.position.set(THREE.MathUtils.clamp(x,-4.1,4.1),Math.max(0,y),THREE.MathUtils.clamp(z,.5,8.6));
 });
 opponents.forEach((g,i)=>{
  if(mode==='receive')return;
  const bx=[-2.6,0,2.6][i%3],bz=i<3?-2:-6;
  const shift=smooth(.45,.61,progress)*(1-smooth(.82,.96,progress));
  g.position.x=bx+([-.3,.4,.25,-.6,.25,.65][i])*shift;
  g.position.z=bz+([-.2,-.3,.2,.7,-.8,.5][i])*shift;
  g.position.y=(i===0?Math.max(0,Math.sin(Math.PI*smooth(.78,.93,progress)))*.6:0);
 });
}
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
canvas.addEventListener('pointermove',e=>{if(!dragging)return;pick(e);if(ray.ray.intersectPlane(plane,hit)){playerMeshes[chosen].position.set(THREE.MathUtils.clamp(hit.x,-4.1,4.1),0,THREE.MathUtils.clamp(hit.z,.6,8.5));playerMeshes[chosen].userData.home={x:playerMeshes[chosen].position.x,z:playerMeshes[chosen].position.z}}});
function endDrag(){dragging=false;orbit.enabled=true;canvas.style.cursor='grab'}canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(canvas);resize();
function animate(now){requestAnimationFrame(animate);if(playing){if(last)draw(progress+(now-last)/(12500/Number($('speed').value)));if(progress>=1){playing=false;$('play').textContent='▶'}}last=now;orbit.update();for(const o of [...playerMeshes,...opponents]){const cut=o.children.find(x=>x.userData.cutout);if(cut)cut.quaternion.copy(camera.quaternion)}renderer.render(scene,camera)}requestAnimationFrame(animate);
try{const u=new URL(location.href);if(['receive','offense','defense'].includes(u.searchParams.get('mode')))mode=u.searchParams.get('mode');if(u.searchParams.has('rotation'))rotation=Math.max(0,Math.min(5,Number(u.searchParams.get('rotation'))));}catch(e){}
$('mode').value=mode;$('rotation').value=rotation;setPositions();updateUI();
