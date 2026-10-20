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
// Original, lightweight female cutout poses; all generated locally (no third-party assets).
const poseCache=new Map();
function poseTexture(hex,pose){
 const key=hex+':'+pose;if(poseCache.has(key))return poseCache.get(key);
 const cv=document.createElement('canvas');cv.width=192;cv.height=384;
 const ctx=cv.getContext('2d');ctx.fillStyle='#'+hex.toString(16).padStart(6,'0');
 function limb(x,y,x2,y2,width){ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=width;ctx.strokeStyle=ctx.fillStyle;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}
 function chain(points,w){for(let i=1;i<points.length;i++)limb(...points[i-1],...points[i],w)}
 // Feet, arms and ponytail are redrawn per pose rather than moving a static image.
 const running=pose==='runA'||pose==='runB',a=pose==='runA'?1:-1;
 let legs=[[[83,205],[75,272],[66,330]],[[109,205],[122,274],[128,331]]];
 let arms=[[[78,111],[57,157],[53,196]],[[115,112],[137,158],[142,192]]];
 if(running){
  legs=a>0?[[[83,205],[57,262],[45,307]],[[109,205],[139,257],[161,291]]]:[[[83,205],[59,261],[84,309]],[[109,205],[135,262],[111,327]]];
  arms=a>0?[[[78,112],[57,144],[84,165]],[[115,112],[139,146],[118,172]]]:[[[78,112],[58,148],[76,178]],[[115,112],[139,142],[162,133]]];
 }else if(pose==='pass'){legs=[[[84,207],[65,256],[58,315]],[[109,207],[137,257],[149,315]]];arms=[[[77,125],[84,184],[103,208]],[[116,125],[114,182],[103,208]]]}
 else if(pose==='set'){arms=[[[78,111],[61,75],[73,42]],[[114,111],[132,72],[120,42]]]}
 else if(pose==='draw'){arms=[[[78,111],[61,133],[66,172]],[[115,111],[137,75],[157,45]]];legs=[[[83,207],[70,268],[72,325]],[[109,207],[124,272],[126,327]]]}
 else if(pose==='hit'){arms=[[[78,112],[58,149],[65,182]],[[114,111],[136,66],[147,12]]];legs=[[[83,208],[65,254],[71,300]],[[109,208],[130,242],[142,289]]]}
 else if(pose==='land'){legs=[[[82,207],[65,270],[66,323]],[[109,207],[134,267],[140,325]]];arms=[[[78,112],[55,155],[59,180]],[[115,112],[143,149],[145,183]]]}
 for(const path of legs)chain(path,25);
 ctx.beginPath();ctx.moveTo(77,87);ctx.lineTo(115,87);ctx.lineTo(127,188);ctx.lineTo(111,218);ctx.lineTo(80,218);ctx.lineTo(64,186);ctx.closePath();ctx.fill();
 for(const path of arms)chain(path,22);
 ctx.beginPath();ctx.arc(96,53,25,0,Math.PI*2);ctx.fill();
 // Ponytail as a distinct silhouette shape.
 ctx.beginPath();ctx.moveTo(115,43);ctx.quadraticCurveTo(147,36,146,73);ctx.quadraticCurveTo(148,97,133,107);ctx.quadraticCurveTo(137,77,117,68);ctx.closePath();ctx.fill();
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;poseCache.set(key,t);return t;
}
function capsulePerson(material){
 const g=new THREE.Group();const hex=material.color.getHex();
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(.92,1.92),new THREE.MeshBasicMaterial({map:poseTexture(hex,'ready'),transparent:true,side:THREE.DoubleSide,depthWrite:false,alphaTest:.15}));
 mesh.position.y=.97;mesh.userData.cutout=true;g.add(mesh);g.userData.pose='ready';g.userData.poseHex=hex;return g;
}
function setPose(g,pose){
 if(g.userData.pose===pose)return;g.userData.pose=pose;
 const cut=g.children.find(c=>c.userData.cutout);
 if(cut)cut.material.map=poseTexture(g.userData.poseHex,pose);
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
// Simple synchronized volleyball play: serve -> pass -> set -> attack -> landing.
// Each ball contact shares the same keyframe and exact floor position as its player.
const KEY=[0,.28,.49,.72,1];
function contactPoints(){
 const side=seam==='left'?-1:1;
 return [
  new THREE.Vector3(side*2.7,2.3,-8.2),
  new THREE.Vector3(side*2.4,1.05,5.8),
  new THREE.Vector3(0,2.1,2.5),
  new THREE.Vector3(-3,2.9,.9),
  new THREE.Vector3(2,.5,-7)
 ];
}
function phaseAt(t){let i=KEY.length-2;for(let j=0;j<KEY.length-1;j++){if(t<=KEY[j+1]){i=j;break;}}return {index:i,u:THREE.MathUtils.clamp((t-KEY[i])/(KEY[i+1]-KEY[i]),0,1)}}
function trajectory(t){
 const p=contactPoints(),q=phaseAt(t),a=p[q.index],b=p[q.index+1],u=q.u;
 const peaks=[Math.max(3.7,Number($('arc').value)*.7),3.6,3.8,Math.max(3.8,Number($('arc').value)*.75)];
 const lift=4*u*(1-u)*Math.max(0,peaks[q.index]-Math.max(a.y,b.y));
 return new THREE.Vector3(THREE.MathUtils.lerp(a.x,b.x,u),THREE.MathUtils.lerp(a.y,b.y,u)+lift,THREE.MathUtils.lerp(a.z,b.z,u));
}
function makeTrail(){
 if(traj){scene.remove(traj);traj.geometry.dispose();traj.material.dispose();}
 const pts=[];for(let i=0;i<=200;i++)pts.push(trajectory(i/200));
 traj=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0x60b8ff,dashSize:.21,gapSize:.12,transparent:true,opacity:.9}));
 traj.computeLineDistances();scene.add(traj);
}
function smooth(a,b,t){const u=THREE.MathUtils.clamp((t-a)/(b-a),0,1);return u*u*(3-2*u)}
function atContact(t,arrival,departure){return smooth(Math.max(0,arrival-.16),arrival,t)*(1-smooth(departure,Math.min(1,departure+.16),t))}
function draw(t){
 progress=THREE.MathUtils.clamp(t,0,1);
 ball.position.copy(trajectory(progress));$('timeline').value=Math.round(progress*1000);
 const phase=phaseAt(progress);
 $('status').textContent=['1/4 · Opponent serve → Orcas receiver','2/4 · Orcas pass → setter','3/4 · Setter → outside hitter','4/4 · Outside attack crosses the net'][phase.index];
 const receiver=seam==='left'?3:5,side=seam==='left'?-1:1;
 playerMeshes.forEach((g,i)=>{
  const h=g.userData.home||{x:g.position.x,z:g.position.z};
  let x=h.x,z=h.z,y=0;
  if(i===receiver){const k=atContact(progress,.28,.34);x=THREE.MathUtils.lerp(h.x,side*2.4,k);z=THREE.MathUtils.lerp(h.z,5.8,k);}
  else if(i===1){const k=atContact(progress,.49,.55);x=THREE.MathUtils.lerp(h.x,0,k);z=THREE.MathUtils.lerp(h.z,2.5,k);}
  else if(i===0){const k=atContact(progress,.72,.79);x=THREE.MathUtils.lerp(h.x,-3,k);z=THREE.MathUtils.lerp(h.z,.9,k);y=.62*k*smooth(.60,.70,progress);}
  else if(i===4){z-=.65*smooth(.58,.73,progress)*(1-smooth(.89,1,progress));}
  g.position.set(THREE.MathUtils.clamp(x,-4.1,4.1),Math.max(0,y),THREE.MathUtils.clamp(z,.5,8.6));
  const travel=Math.hypot(x-h.x,z-h.z);
  let pose='ready';
  if(i===receiver&&progress>.24&&progress<.35)pose='pass';
  else if(i===1&&progress>.43&&progress<.55)pose='set';
  else if(i===0&&progress>.59&&progress<.80)pose=progress<.67?'draw':progress<.75?'hit':'land';
  else if(travel>.18)pose=Math.floor(progress*95)%2?'runA':'runB';
  setPose(g,pose);
 });
 opponents.forEach((g,i)=>{
  if(mode==='receive'){if(i===0){setPose(g,progress<.10?'draw':progress<.18?'hit':'ready');g.position.set(side*2.7,0,-8.2);g.position.y=.12*Math.sin(Math.PI*smooth(0,.11,progress))*(1-smooth(.13,.2,progress));}return;}
  const bx=[-2.6,0,2.6][i%3],bz=i<3?-2:-6;
  const k=smooth(.7,.9,progress);g.position.set(bx+([-.2,.2,.3,-.4,.2,.4][i])*k,0,bz+(i>2?.6*k:0));
 });
}
function updateUI(){document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('status').textContent=mode==='receive'?'Serve trajectory and passing lanes':mode==='offense'?'Set and attack trajectory':'Attack defense and coverage';}
function configure(){mode=$('mode').value;rotation=Number($('rotation').value);system=$('system').value;serve=$('serve').value;seam=$('seam').value;playing=false;last=0;$('play').textContent='▶';setPositions();updateUI()}
function setMode(m){mode=m;$('mode').value=m;playing=false;last=0;setPositions();updateUI();$('play').textContent='▶'}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
for(const id of ['system','rotation','serve','seam'])$(id).addEventListener('change',configure);
$('arc').addEventListener('input',()=>{makeTrail();draw(progress)});
$('reset').addEventListener('click',()=>{playing=false;last=0;progress=0;setPositions();$('play').textContent='▶'});
$('play').addEventListener('click',()=>{if(progress>=1)draw(0);playing=!playing;last=0;$('play').textContent=playing?'Ⅱ':'▶'});
$('restart').addEventListener('click',()=>{playing=false;last=0;draw(0);$('play').textContent='▶'});
$('timeline').addEventListener('input',e=>{playing=false;last=0;$('play').textContent='▶';draw(Number(e.target.value)/1000)});
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
function animate(now){requestAnimationFrame(animate);if(playing){if(last)draw(progress+(now-last)/(10500/Number($('speed').value)));if(progress>=1){playing=false;last=0;$('play').textContent='▶'}}last=now;orbit.update();for(const o of [...playerMeshes,...opponents]){const cut=o.children.find(x=>x.userData.cutout);if(cut)cut.quaternion.copy(camera.quaternion)}renderer.render(scene,camera)}requestAnimationFrame(animate);
try{const u=new URL(location.href);if(['receive','offense','defense'].includes(u.searchParams.get('mode')))mode=u.searchParams.get('mode');if(u.searchParams.has('rotation'))rotation=Math.max(0,Math.min(5,Number(u.searchParams.get('rotation'))));}catch(e){}
$('mode').value=mode;$('rotation').value=rotation;setPositions();updateUI();
