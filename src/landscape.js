import * as THREE from 'three';

// Deterministic planting: the conceptual village looks the same on every visit.
export function addLandscape(scene, { mesh, box, material, wood, green, soil }) {
  const foliage = ['#355745', '#496b4d', '#638257', '#809362'].map(material);
  const trunk = material('#796149');
  function tree(x, z, height, index) {
    mesh(new THREE.CylinderGeometry(.13, .23, height * .52, 6), trunk, scene, x, height * .26, z);
    if (index % 3 === 0) {
      for (let tier = 0; tier < 3; tier++) mesh(new THREE.ConeGeometry(height * (.31 - tier * .06), height * .52, 7), foliage[index % 4], scene, x, height * (.5 + tier * .17), z);
    } else {
      const canopy = mesh(new THREE.IcosahedronGeometry(height * .3, 1), foliage[index % 4], scene, x, height * .72, z);
      canopy.scale.y = 1.15;
      mesh(new THREE.IcosahedronGeometry(height * .22, 0), foliage[(index + 1) % 4], scene, x + .4, height * .89, z - .1);
    }
  }
  // Woodland wraps the back and sides; the foreground stays open for exploration.
  for (let i = 0; i < 27; i++) {
    const angle = 2.5 + i / 26 * 3.9;
    const radius = 13.6 + (i % 3) * .35;
    tree(Math.cos(angle) * radius, Math.sin(angle) * radius, 2.4 + (i * 7 % 9) * .19, i);
  }
  const shrubGeometry = new THREE.IcosahedronGeometry(.48, 0);
  for (let i = 0; i < 35; i++) {
    const angle = i * 2.39996;
    const radius = 11.8 + (i % 4) * .45;
    const shrub = mesh(shrubGeometry, foliage[i % 4], scene, Math.cos(angle) * radius, .35, Math.sin(angle) * radius);
    shrub.scale.set(1.2, .75, 1);
  }
  // A shared kitchen garden along the open foreground edge.
  for (let bed = 0; bed < 3; bed++) {
    const x = 5 + bed * 1.55, z = 9.6;
    box(scene, wood, x, .14, z, 1.25, .25, 2);
    box(scene, soil, x, .28, z, 1.12, .06, 1.86);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 2; col++) {
      const px = x - .28 + col * .55, pz = z - .66 + row * .44;
      if (bed === 1) {
        mesh(new THREE.CylinderGeometry(.025, .025, .8, 5), wood, scene, px, .68, pz);
        mesh(new THREE.IcosahedronGeometry(.22, 0), green, scene, px, .65, pz);
        mesh(new THREE.SphereGeometry(.075, 6, 4), material('#bd7552'), scene, px + .15, .7, pz);
      } else {
        const leaf = mesh(new THREE.IcosahedronGeometry(.24, 0), foliage[(row + bed) % 4], scene, px, .43, pz);
        leaf.scale.set(1, .65, 1.1);
      }
    }
  }
  // Reeds, pebbles and lily pads around the small pond.
  for (let i = 0; i < 15; i++) {
    const a = i / 15 * Math.PI * 2;
    const x = -1.5 + Math.cos(a) * 2.85, z = 9 + Math.sin(a) * 1.9;
    if (i % 3 === 0) {
      const rock = mesh(new THREE.DodecahedronGeometry(.24, 0), material('#aaa78e'), scene, x, .13, z); rock.scale.set(1.5, .7, 1);
    } else for (let blade = 0; blade < 3; blade++) {
      const reed = mesh(new THREE.ConeGeometry(.055, .55 + blade * .12, 4), foliage[i % 4], scene, x + blade * .1, .35, z);
      reed.rotation.z = (blade - 1) * .18;
    }
  }
  for (const [x,z] of [[-2.7,9],[-1,9.5],[-.4,8.8]]) {
    const pad = mesh(new THREE.CylinderGeometry(.25,.25,.025,12), material('#537961'), scene, x,.1,z); pad.scale.z=.8;
    mesh(new THREE.ConeGeometry(.085,.12,5), material('#e5c0ab'), scene,x,.17,z);
  }
  // Modest bench beside the pond, with a small lantern.
  box(scene,wood,-5,.62,8.7,1.9,.15,.5);
  for (const x of [-5.7,-4.3]) box(scene,wood,x,.3,8.7,.14,.6,.35);
  box(scene,wood,-5,.95,8.48,1.9,.45,.1);
  for (const [x,z] of [[-3,3.2],[3,2.7],[-4,7]]) {
    box(scene,wood,x,.48,z,.09,.9,.09);
    box(scene,material('#e9d7a2'),x,.98,z,.22,.23,.22);
    mesh(new THREE.ConeGeometry(.22,.14,4),material('#234638'),scene,x,1.16,z).rotation.y=Math.PI/4;
  }
}
