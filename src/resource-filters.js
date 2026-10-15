export function filterResources(resources, { category, province = '', query = '' }) {
  const term = query.trim().toLocaleLowerCase('th');
  return resources.filter(r => r.category === category && (!province || r.provinces?.includes(province)) &&
    [r.name, r.area, r.summary, r.address, r.officeProvince, r.network, ...(r.provinces || []), ...(r.coverageNotes || []), ...(r.additionalSummaries || [])].filter(Boolean).join(' ').toLocaleLowerCase('th').includes(term));
}
export function resourceProvinces(resources) {
  return [...new Set(resources.flatMap(r => r.provinces || []))].sort((a,b)=>a.localeCompare(b,'th'));
}
