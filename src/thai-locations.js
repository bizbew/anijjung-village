import locations from './data/thai-locations.json' with { type: 'json' };
export const provinces = [...locations].sort((a,b)=>a.name.localeCompare(b.name,'th'));
export function districtsFor(provinceId) {
  return [...(locations.find(p=>p.id===provinceId)?.districts || [])].sort((a,b)=>a.name.localeCompare(b.name,'th'));
}
export function resolveLocation(provinceId, districtId) {
  const province=locations.find(p=>p.id===provinceId);
  const district=province?.districts.find(d=>d.id===districtId);
  if (!province || !district) return null;
  return { provinceId, districtId, province:province.name, district:district.name, area:`${district.name} / ${province.name}` };
}
