import test from 'node:test';
import assert from 'node:assert/strict';
import { provinces, districtsFor, resolveLocation } from './thai-locations.js';
import { loadNetwork, saveNetwork } from './network-store.js';
const memory = () => {let value;return {getItem:()=>value,setItem:(_,v)=>value=v};};
test('77 provinces and linked districts include Bangkok districts',()=>{
 assert.equal(provinces.length,77);
 assert.equal(new Set(provinces.map(p=>p.id)).size,77);
 assert.equal(districtsFor('1').length,50);
 assert.equal(resolveLocation('1','1001').district,'เขตพระนคร');
 assert.deepEqual(districtsFor('invalid'),[]);
});
test('district from another province cannot be saved as a valid location',()=>{
 const bangkok=resolveLocation('1','1001');assert.ok(bangkok);
 const other=provinces.find(p=>p.id!=='1');assert.equal(resolveLocation(other.id,'1001'),null);
 assert.equal(resolveLocation('1',''),null);
});
test('all source district IDs belong to one province',()=>{
 const ids=provinces.flatMap(p=>p.districts.map(d=>d.id));assert.equal(new Set(ids).size,ids.length);
 for (const p of provinces){assert.ok(p.districts.length);for(const d of p.districts)assert.equal(resolveLocation(p.id,d.id).province,p.name);}
});
test('structured location persists while legacy free-text households remain readable',()=>{
 const member={id:'06',name:'ทดสอบ',residents:2,contact:'private',sharing:false,waterLitres:null,dailyWaterLitres:null,foodDays:null,solarKwh:null,electricityKwh:null};
 const s=memory();saveNetwork({members:[{...member,...resolveLocation('1','1001')}],offers:[],requests:[]},s);assert.equal(loadNetwork(s).members[0].district,'เขตพระนคร');
 saveNetwork({members:[{...member,area:'ข้อมูลพื้นที่เดิม'}],offers:[],requests:[]},s);assert.equal(loadNetwork(s).members[0].area,'ข้อมูลพื้นที่เดิม');
});
