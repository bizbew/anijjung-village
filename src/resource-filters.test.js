import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { filterResources, resourceProvinces } from './resource-filters.js';
const resources = JSON.parse(fs.readFileSync(new URL('./resources.json', import.meta.url)));
test('directory preserves original entries and covers 77 provinces for each imported category', () => {
  for (const prefix of ['food','water','energy']) for (let i=1;i<=10;i++) assert.ok(resources.some(r=>r.id===`${prefix}-${i}`));
  assert.equal(resources.length,393);
  assert.equal(new Set(resources.map(r=>r.id)).size,resources.length);
  for (const category of ['อาหาร','น้ำ']) assert.equal(resourceProvinces(resources.filter(r=>r.category===category)).length,77);
});
test('repeated agency rows are merged without losing provinces or source rows', () => {
  const office=resources.find(r=>r.agencyCode==='DGR-6');
  assert.equal(resources.filter(r=>r.agencyCode==='DGR-6').length,1);
  assert.ok(office.provinces.includes('กระบี่'));assert.equal(office.officeProvince,'ตรัง');
  assert.equal(office.sourceRows.length,8);
  assert.ok(filterResources(resources,{category:'น้ำ',province:'กระบี่'}).includes(office));
  assert.ok(!filterResources(resources,{category:'น้ำ',province:'เชียงใหม่'}).includes(office));
});
test('all spreadsheet data rows are represented, including the explicitly duplicated food center',()=>{
  for(const [sheet,count] of [['Food_Center',78],['Water_Center',419]]){
    const rows=new Set(resources.filter(r=>r.sourceSheet===sheet).flatMap(r=>r.sourceRows));
    assert.equal(rows.size,count);
    for(let row=2;row<=count+1;row++)assert.ok(rows.has(row));
  }
});
test('workbook research is not claimed as verification and missing links stay absent',()=>{
  for(const r of resources.filter(r=>r.sourceSheet))assert.equal(r.verifiedAt,null);
  const food=resources.find(r=>r.id==='food-center-1');assert.equal(food.sourceUrl,null);
  assert.equal(resources.find(r=>r.agencyCode==='DGR-6').sourceResearchedAt,'2026-09-24');
  assert.ok(!JSON.stringify(resources).includes('features:'));
});
test('query, category and province compose; unclassified originals remain available in all provinces',()=>{
  const matches=filterResources(resources,{category:'อาหาร',province:'ตาก',query:'พบพระ'});assert.equal(matches.length,1);
  assert.ok(filterResources(resources,{category:'อาหาร'}).some(r=>r.id==='food-1'));
  assert.ok(!filterResources(resources,{category:'อาหาร',province:'ตาก'}).some(r=>r.id==='food-1'));
  assert.equal(filterResources(resources,{category:'พลังงาน',query:'ไม่พบแน่นอนXYZ'}).length,0);
});
