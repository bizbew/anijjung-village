import test from 'node:test';
import assert from 'node:assert/strict';
import { getGroups, getGroupHouseholds } from './groups.js';
const empty={members:[],offers:[],requests:[]};
test('overview contains 1000 fictional households in bounded distinct groups',()=>{const groups=getGroups(empty);assert.equal(groups.reduce((n,g)=>n+g.count,0),1000);const houses=groups.flatMap(g=>getGroupHouseholds(g.id,empty));assert.equal(new Set(houses.map(h=>h.id)).size,1000);assert.ok(groups.every(g=>g.count<=30));});
test('selected group has independent household data and non-overlapping positions',()=>{const a=getGroupHouseholds('demo-1',empty),b=getGroupHouseholds('demo-2',empty);assert.equal(a.length,30);assert.notEqual(a[0].id,b[0].id);assert.equal(new Set(a.map(h=>h.position.join(','))).size,30);assert.deepEqual(getGroupHouseholds('missing',empty),[]);});
test('existing and joined households stay in local village',()=>{const data={...empty,members:[{id:'06',name:'ทดสอบ',sharing:true}]};assert.equal(getGroupHouseholds('local',data).length,6);assert.equal(getGroups(data)[0].count,6);assert.equal(getGroupHouseholds('local',data)[5].name,'ทดสอบ');});
