import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { households as sampleHouseholds } from './households.js';
import { addLandscape } from './landscape.js';

export function createVillage(container, onSelect, onResources = () => {}, households = sampleHouseholds) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e2e0cf');
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 150);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor('#e2e0cf');
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'หมู่บ้านจำลอง ลากเพื่อหมุน เลือกบ้านจากฉากหรือปุ่มหมายเลขบ้าน');
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 20; controls.maxDistance = 60;
  controls.maxPolarAngle = Math.PI / 2.45;
  controls.minPolarAngle = Math.PI / 9;
  controls.panSpeed = 0.6;
  controls.target.set(0, 0, 0);
  const home = new THREE.Vector3(29, 29, 34);
  function reset() { camera.position.copy(home); controls.target.set(0, 0, 0); controls.update(); }
  reset();
  scene.add(new THREE.HemisphereLight(0xfff7e5, 0x7e9388, 2.1));
  const sun = new THREE.DirectionalLight(0xffebcd, 2.2);
  sun.position.set(-10, 22, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.radius = 4;
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22 });
  sun.shadow.normalBias = 0.05; scene.add(sun);
  const materials = new Map();
  const material = color => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
    return materials.get(color);
  };
  const green = material('#55735a'), roof = material('#234638'), cream = material('#e7d7b5'), wood = material('#a47c50');
  const soil = material('#775c40'), pathMat = material('#d6c39d'), solar = material('#203348');
  function mesh(geometry, mat, parent, x, y, z) {
    const m = new THREE.Mesh(geometry, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function box(parent, mat, x, y, z, w, h, d) { return mesh(new THREE.BoxGeometry(w, h, d), mat, parent, x, y, z); }
  mesh(new THREE.CylinderGeometry(15.5, 15.7, 0.7, 64), material('#a6b387'), scene, 0, -0.4, 0);
  mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: '#e2e0cf' }), scene, 0, -0.82, 0).rotation.x = -Math.PI / 2;
  // Footpaths join the central pavilion and the five front doors.
  function path(x, z, endX, endZ) {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x,.025,z), new THREE.Vector3(x * .65 + .6,.025,endZ + (z-endZ)*.35), new THREE.Vector3(endX,.025,endZ));
    const points = curve.getPoints(22);
    for (let i=0;i<points.length-1;i++) {
      const a=points[i], b=points[i+1], mid=a.clone().add(b).multiplyScalar(.5);
      const p=box(scene,pathMat,mid.x,.025,mid.z,.85,.07,a.distanceTo(b)+.06);
      p.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);
    }
  }
  const pickable = [], rings = new Map();
  function label(text, parent, x, y, z) {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8f5e9'; ctx.beginPath(); ctx.roundRect(10, 10, 492, 140, 35); ctx.fill();
    ctx.fillStyle = '#234638'; ctx.font = 'bold 60px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 256, 80);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), depthTest: false }));
    sprite.position.set(x, y, z); sprite.scale.set(2.5, 0.78, 1); parent.add(sprite);
  }
  for (const h of households) {
    const [x, z] = h.position;
    const group = new THREE.Group(); group.position.set(x, 0, z); scene.add(group);
    box(group, wood, 0, 0.22, 0, 3.6, 0.4, 2.8);
    const index = (Number(h.id) - 1) % 5;
    const walls = material(['#e7d7b5','#c4c1a2','#d7b899','#dce0c3','#c5d0bf'][index]);
    const houseRoof = material(['#234638','#405949','#715447','#3d5660','#4e6046'][index]);
    box(group, walls, 0, 1.35, 0, 3.1, 2, 2.4);
    // Raised porch, steps, timber rails and window frames.
    box(group, wood, 0, .38, 1.85, 3.4, .2, 1.15);
    for (const px of [-1.45, 1.45]) {
      box(group,wood,px,.75,2.3,.09,.75,.09);
      box(group,wood,px,.93,1.85,.08,.08,1);
    }
    for (const px of [-1.05,1.05]) box(group,wood,px,.93,2.3,.8,.08,.08);
    for (let step=0;step<3;step++) box(group,pathMat,0,.08+step*.1,2.95-step*.23,1.05,.16,.28);
    for (const wx of [-1,1]) {
      box(group,wood,wx,1.6,1.25,.7,.75,.07);
      box(group,material('#78928d'),wx,1.6,1.3,.5,.55,.035);
      box(group,cream,wx,1.6,1.33,.035,.55,.025);
    }
    box(group,wood,1.48,.72,1.8,.55,.13,.65);
    mesh(new THREE.CylinderGeometry(.17,.12,.3,8),material('#b78161'),group,-1.1,.63,2);
    mesh(new THREE.IcosahedronGeometry(.25,0),green,group,-1.1,.92,2);
    for(let plank=0;plank<5;plank++) box(group,wood,-1.565,.7+plank*.29,0,.035,.025,2.25);
    box(group, wood, 0, 0.85, 1.22, 0.7, 1.25, 0.08);

    // Two sloping roof faces meeting at the ridge.
    for (const side of [-1, 1]) {
      const r = box(group, houseRoof, 0, 2.6, side * 0.72, 3.8, 0.16, 1.85);
      r.rotation.x = side * 0.48;
    }
    for (const sx of [-0.8, 0.25]) {
      const panel = box(group, solar, sx, 2.67, 0.8, 0.85, 0.06, 1.08); panel.rotation.x = 0.48;
      for (let i = 0; i < 3; i++) {
        const line = box(group, material('#6c8f9d'), sx - 0.28 + i * 0.28, 2.72, 0.8, 0.018, 0.018, 1.05); line.rotation.x = 0.48;
      }
    }
    mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.35, 12), material('#819997'), group, 2.25, 0.68, 0);
    mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.1, 12), solar, group, 2.25, 1.38, 0);

    label(`บ้าน ${h.id}`, group, 0, 3.7, 0);
    const ring = mesh(new THREE.RingGeometry(2.4, 2.58, 48), new THREE.MeshBasicMaterial({ color: '#B8934C', side: THREE.DoubleSide }), scene, x, 0.09, z);
    ring.castShadow = false; ring.rotation.x = -Math.PI / 2; ring.visible = false; rings.set(h.id, ring);
    group.traverse(child => { if (child.isMesh) { child.userData.houseId = h.id; pickable.push(child); } });
    path(x, z + 3, 0, 1);
    for (let bed = 0; bed < 2; bed++) {
      box(group, wood, -1.2 + bed * 1.3, 0.15, -2.6, 1, 0.25, 1.4);
      box(group, soil, -1.2 + bed * 1.3, 0.28, -2.6, 0.85, 0.05, 1.25);
      for (let row = 0; row < 3; row++) mesh(new THREE.IcosahedronGeometry(0.2, 0), green, group, -1.2 + bed * 1.3, 0.43, -3 + row * 0.4);
    }
  }
  // Shared open pavilion.
  box(scene, wood, 0, 0.15, 1, 3.6, 0.28, 3.2);
  for (const x of [-1.35, 1.35]) for (const z of [-0.15, 2.15]) box(scene, wood, x, 1.2, z, 0.17, 2.2, 0.17);
  const pavilionRoof = mesh(new THREE.ConeGeometry(2.8, 1.3, 4), roof, scene, 0, 2.8, 1); pavilionRoof.rotation.y = Math.PI / 4;
  box(scene, wood, 0, 0.65, 1, 1.4, 0.15, 0.85);
  label('ศาลา · แหล่งเรียนรู้', scene, 0, 4, 1);
  pavilionRoof.userData.resources = true; pickable.push(pavilionRoof);
  const pond = mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.06, 32), new THREE.MeshStandardMaterial({color:'#719d98',roughness:.28,metalness:.12}), scene, -1.5, 0.05, 9); pond.scale.z = 0.65;
  const pondEdge = mesh(new THREE.TorusGeometry(2.55, 0.16, 6, 40), material('#c6b99a'), scene, -1.5, 0.08, 9); pondEdge.rotation.x = Math.PI / 2; pondEdge.scale.y = 0.65;
  addLandscape(scene, { mesh, box, material, wood, green, soil });
  const network = new THREE.Group(); network.visible = false; scene.add(network);
  const participants = households.filter(h => h.sharing);
  for (let i = 0; i < participants.length; i++) for (let j = i + 1; j < participants.length; j++) {
    const a = participants[i].position, b = participants[j].position;
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(a[0], 0.35, a[1]), new THREE.Vector3((a[0] + b[0]) / 2, 2.6, (a[1] + b[1]) / 2), new THREE.Vector3(b[0], 0.35, b[1]));
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineDashedMaterial({ color: '#B8934C', dashSize: 0.3, gapSize: 0.18, transparent: true, opacity: 0.85 }));
    line.computeLineDistances(); network.add(line);
  }
  const raycaster = new THREE.Raycaster();
  const pointers = new Set(); let down = null, moved = false;
  renderer.domElement.addEventListener('pointerdown', event => {
    pointers.add(event.pointerId);
    if (pointers.size > 1) moved = true;
    else { down = { x: event.clientX, y: event.clientY }; moved = false; }
  });
  renderer.domElement.addEventListener('pointermove', event => {
    if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6) moved = true;
  });
  renderer.domElement.addEventListener('pointerup', event => {
    pointers.delete(event.pointerId);
    if (event.button === 0 && down && !moved && pointers.size === 0) {
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
      const hit = raycaster.intersectObjects(pickable)[0]; if (hit?.object.userData.resources) onResources();
      else if (hit) onSelect(hit.object.userData.houseId);
    }
    if (pointers.size === 0) down = null;
  });
  renderer.domElement.addEventListener('pointercancel', event => { pointers.delete(event.pointerId); down = null; moved = true; });
  window.addEventListener('pointerup', event => { pointers.delete(event.pointerId); if (!pointers.size) down = null; });
  const observer = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height); camera.aspect = width / height; camera.fov = width < 760 ? 65 : 38; camera.updateProjectionMatrix();
  }); observer.observe(container);
  // Buildings and planting are static: calculate their shadows once.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.setAnimationLoop(() => {
    if (!container.offsetWidth) return;
    controls.update();
    // Clamp the panning target while preserving the camera offset.
    const clamped = controls.target.clone(); clamped.x = THREE.MathUtils.clamp(clamped.x, -5, 5); clamped.z = THREE.MathUtils.clamp(clamped.z, -5, 5); clamped.y = 0;
    camera.position.add(clamped.clone().sub(controls.target)); controls.target.copy(clamped);
    renderer.render(scene, camera);
  });
  return { reset, select: id => rings.forEach((ring, key) => { ring.visible = key === id; }), setSharing: visible => { network.visible = visible; } };
}
