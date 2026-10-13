import { networkHouseholds } from './network-store.js';
export const regions = ['เชียงใหม่', 'นครนายก', 'ชลบุรี', 'ขอนแก่น', 'นครราชสีมา', 'ตรัง'];
// Entirely fictional memberships and diagram locations; no real household coordinates.
export const demoGroups = Array.from({ length: 34 }, (_, i) => ({
  id: `demo-${i + 1}`, name: `กลุ่มจำลอง ${String(i + 1).padStart(2, '0')}`,
  area: regions[i % regions.length], count: i === 33 ? 5 : 30,
}));
export function getGroups(data) {
  return [{ id: 'local', name: 'หมู่บ้านเริ่มต้น / บ้านที่คุณเพิ่ม', area: 'ผังทดลองในเบราว์เซอร์นี้', count: networkHouseholds(data).length }, ...demoGroups];
}
export function layoutPosition(index) {
  const row = Math.floor(index / 6), col = index % 6;
  let x = (col - 2.5) * 7;
  if (row === 2 && (col === 2 || col === 3)) x = col === 2 ? -5.5 : 5.5;
  return [x, (row - 2) * 7];
}
export function getGroupHouseholds(id, data) {
  if (id === 'local') return networkHouseholds(data);
  const group = demoGroups.find(g => g.id === id);
  if (!group) return [];
  const index = demoGroups.indexOf(group);
  return Array.from({ length: group.count }, (_, i) => ({
    id: `D${String(index * 30 + i + 1).padStart(4, '0')}`, name: `บ้านจำลอง ${i + 1}`, area: group.area,
    residents: 2 + i % 4, waterLitres: 900 + (i % 6) * 300, dailyWaterLitres: i % 13 === 0 ? null : 180 + (i % 4) * 60,
    foodDays: 3 + i % 8, solarKwh: 5 + i % 5, electricityKwh: 4 + i % 8,
    sharing: i % 3 === 0, position: group.count <= 5 ? [[-7,-4],[0,-6],[7,-3],[-6,4],[6,5]][i] : layoutPosition(i), demo: true,
  }));
}
