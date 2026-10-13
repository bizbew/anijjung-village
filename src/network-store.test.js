import test from 'node:test';
import assert from 'node:assert/strict';
import { loadNetwork, saveNetwork, networkHouseholds, validateRequest } from './network-store.js';
const storage = () => {let value=null;return {getItem:()=>value,setItem:(_,v)=>{value=v;}};};
const member={id:'06',name:'บ้านทดสอบ',area:'เชียงใหม่',contact:'private',residents:2,sharing:true,waterLitres:120,dailyWaterLitres:0,foodDays:null,solarKwh:null,electricityKwh:null};
test('joined household persists with interest and conceptual position',()=>{const s=storage();saveNetwork({members:[member],offers:[],requests:[]},s);const h=networkHouseholds(loadNetwork(s));assert.equal(h.length,6);assert.equal(h[5].sharing,true);assert.deepEqual(h[5].position,[-1,5]);assert.equal(h[5].foodDays,null);});
test('corrupt or malformed storage safely falls back',()=>{for(const value of ['{','null','{"members":[{}],"offers":[],"requests":[]}'])assert.deepEqual(loadNetwork({getItem:()=>value}),{members:[],offers:[],requests:[]});});
test('request quantity cannot exceed offer or be invalid',()=>{for(const q of [0,-1,11,NaN])assert.equal(validateRequest(q,{quantity:10}),false);assert.equal(validateRequest(2.5,{quantity:10}),true);});
test('storage write failures are surfaced',()=>{assert.throws(()=>saveNetwork({}, {setItem:()=>{throw Error('quota');}}));});
