import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { households } from './households.js';

export function createVillage(container, onSelect, onResources = () => {}) {
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
  scene.add(new THREE.HemisphereLight(0xfff7dd, 0x748776, 2.8));
  const sun = new THREE.DirectionalLight(0xfff6df, 3.2);
  sun.position.set(-12, 25, 12); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22 });
  sun.shadow.normalBias = 0.05; scene.add(sun);
  const material = color => new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
  const green = material('#55735a'), roof = material('#234638'), cream = material('#e7d7b5'), wood = material('#a47c50');
  const soil = material('#775c40'), pathMat = material('#d6c39d'), solar = material('#203348');
  function mesh(geometry, mat, parent, x, y, z) {
    const m = new THREE.Mesh(geometry, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function box(parent, mat, x, y, z, w, h, d) { return mesh(new THREE.BoxGeometry(w, h, d), mat, parent, x, y, z); }
  mesh(new THREE.CylinderGeometry(15.5, 15.7, 0.7, 64), material('#bcc49c'), scene, 0, -0.4, 0);
  mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: '#e2e0cf' }), scene, 0, -0.82, 0).rotation.x = -Math.PI / 2;
  // Footpaths join the central pavilion and the five front doors.
  function path(x, z, endX, endZ) {
    const length = Math.hypot(endX - x, endZ - z);
    const p = box(scene, pathMat, (x + endX) / 2, 0.02, (z + endZ) / 2, 1, 0.08, length);
    p.rotation.y = Math.atan2(endX - x, endZ - z);
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
    box(group, cream, 0, 1.35, 0, 3.1, 2, 2.4);
    box(group, wood, 0, 0.85, 1.22, 0.7, 1.25, 0.08);
    for (const wx of [-1, 1]) box(group, solar, wx, 1.6, 1.22, 0.55, 0.6, 0.07);
    // Two sloping roof faces meeting at the ridge.
    for (const side of [-1, 1]) {
      const r = box(group, roof, 0, 2.6, side * 0.72, 3.8, 0.16, 1.85);
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
    box(group, pathMat, 0, 0.12, 1.8, 1.2, 0.2, 0.7);
    label(`บ้าน ${h.id}`, group, 0, 3.7, 0);
    const ring = mesh(new THREE.RingGeometry(2.4, 2.58, 48), new THREE.MeshBasicMaterial({ color: '#B8934C', side: THREE.DoubleSide }), scene, x, 0.09, z);
    ring.rotation.x = -Math.PI / 2; ring.visible = false; rings.set(h.id, ring);
    group.traverse(child => { if (child.isMesh) { child.userData.houseId = h.id; pickable.push(child); } });
    path(x, z + 2, 0, 1);
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
  const pond = mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.06, 32), material('#789d9b'), scene, -1.5, 0.05, 9); pond.scale.z = 0.65;
  const pondEdge = mesh(new THREE.TorusGeometry(2.55, 0.16, 6, 40), material('#c6b99a'), scene, -1.5, 0.08, 9); pondEdge.rotation.x = Math.PI / 2; pondEdge.scale.y = 0.65;
  for (const [x, z, scale] of [[-11, 1, 1.2], [-10, -7, 1], [10, -7, 1.3], [11, 3, 1], [3, 11, 1.1], [-9, 8, 1.2], [3, -11, 1]]) {
    mesh(new THREE.CylinderGeometry(0.15, 0.23, 1.8 * scale, 6), wood, scene, x, 0.9 * scale, z);
    mesh(new THREE.IcosahedronGeometry(1.1 * scale, 1), green, scene, x, 2.2 * scale, z);
    mesh(new THREE.IcosahedronGeometry(0.85 * scale, 0), material('#789066'), scene, x + 0.45, 2.6 * scale, z);
  }
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
    renderer.setSize(width, height); camera.aspect = width / height; camera.fov = width < 760 ? 65 : 38; camera.updateProjectionMatrix();
  }); observer.observe(container);
  renderer.setAnimationLoop(() => {
    controls.update();
    // Clamp the panning target while preserving the camera offset.
    const clamped = controls.target.clone(); clamped.x = THREE.MathUtils.clamp(clamped.x, -5, 5); clamped.z = THREE.MathUtils.clamp(clamped.z, -5, 5); clamped.y = 0;
    camera.position.add(clamped.clone().sub(controls.target)); controls.target.copy(clamped);
    renderer.render(scene, camera);
  });
  return { reset, select: id => rings.forEach((ring, key) => { ring.visible = key === id; }), setSharing: visible => { network.visible = visible; } };
}
