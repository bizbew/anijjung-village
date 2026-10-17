import { waterReserveDays } from './households.js';
export const SURVEY_KEY = 'anijjung-water-assessment-v1';
export const topics = {
  usage: { label: 'วัดการใช้น้ำ', query: 'ประปา' },
  storage: { label: 'เก็บน้ำสำรอง', query: '' },
  quality: { label: 'คุณภาพน้ำ', query: 'คุณภาพน้ำ' },
  source: { label: 'หาแหล่งน้ำ', query: 'แหล่งน้ำ' },
  unsure: { label: 'ยังไม่แน่ใจ', query: '' },
};
export const blankAnswers = () => ({ residents: null, provinceId: '', districtId: '', waterLitres: null, dailyWaterLitres: null, interests: ['unsure'] });
export function validAnswers(a) {
  return a && [a.waterLitres,a.dailyWaterLitres].every(n=>n===null || Number.isFinite(n)&&n>=0&&n<=10000000) && (a.residents===null || Number.isInteger(a.residents)&&a.residents>=1&&a.residents<=100) && typeof a.provinceId==='string' && typeof a.districtId==='string' && Array.isArray(a.interests) && a.interests.length>0 && a.interests.every(t=>Object.hasOwn(topics,t));
}
export function assessmentSummary(a) {
  const days = waterReserveDays(a);
  const missing = [];
  if (a.waterLitres===null) missing.push('ปริมาณน้ำที่เก็บอยู่จริง');
  if (a.dailyWaterLitres===null || a.dailyWaterLitres===0) missing.push('การใช้น้ำรวมต่อวันที่มากกว่า 0');
  return { days, missing };
}
export function nextSteps(a) {
  const steps=[];
  const add=(id,title,body)=>{if(!steps.some(s=>s.id===id))steps.push({id,title,body});};
  if(a.dailyWaterLitres===null || a.dailyWaterLitres===0) add('usage','เริ่มจากวัดการใช้น้ำจริง','คุณยังไม่มีข้อมูลการใช้ต่อวันที่คำนวณได้ จดมิเตอร์เวลาเดิม 3–7 วัน แล้วหารจำนวนวัน รวมการใช้ของทุกคนในบ้าน');
  if(a.waterLitres===null) add('storage','ตรวจปริมาณน้ำที่เหลือจริง','คุณยังไม่ระบุปริมาณน้ำ ตรวจขนาดถังและระดับน้ำในแต่ละภาชนะ ไม่ใช้ความจุเต็มถังแทนน้ำที่มีอยู่');
  for(const topic of a.interests){
    if(topic==='usage')add('usage','วัดและติดตามการใช้น้ำ','คุณสนใจวัดการใช้ จดมิเตอร์เวลาเดิม 3–7 วันเพื่อทบทวนการใช้รวมของครัวเรือน');
    if(topic==='storage')add('storage','สำรวจพื้นที่และภาชนะเก็บน้ำ','คุณสนใจน้ำสำรอง ตรวจพื้นที่ ภาชนะ ความสะอาด และข้อจำกัดการติดตั้ง ก่อนปรึกษาผู้ให้บริการ ไม่กำหนดขนาดถังจากข้อมูลนี้เพียงอย่างเดียว');
    if(topic==='quality')add('quality','สอบถามช่องทางตรวจคุณภาพน้ำ','คุณสนใจคุณภาพน้ำ ติดต่อหน่วยงานที่รับตรวจเพื่อสอบถามตัวอย่างและเงื่อนไขบริการ ปริมาณน้ำสำรองไม่บอกว่าน้ำดื่มได้');
    if(topic==='source')add('source','ตรวจแหล่งน้ำและขอบเขตบริการ','คุณต้องการหาแหล่งน้ำ สอบถามประปาหรือหน่วยงานน้ำในพื้นที่ว่ารับผิดชอบที่ตั้งของคุณหรือไม่และมีเงื่อนไขใด');
  }
  if(steps.length===0)add('usage','ติดตามค่าที่ประเมินไว้','คุณมีข้อมูลพอประมาณวันสำรองแล้ว ลองวัดซ้ำในวันที่มีการใช้ต่างกัน และเลือกเรื่องที่อยากพัฒนาต่อ ไม่ถือว่าตัวเลขนี้ยืนยันความพร้อม');
  return steps.slice(0,3);
}
export function readAssessment(storage){
  try{storage ??= localStorage;const saved=JSON.parse(storage.getItem(SURVEY_KEY));return validAnswers(saved?.answers)&&typeof saved.feedback?.clarity==='string'&&typeof saved.feedback?.obstacle==='string'?saved:null;}catch{return null;}
}
export function saveAssessment(answers,feedback,storage=localStorage){
  if(!validAnswers(answers))throw Error('Invalid assessment');
  const saved={version:1,answers,feedback, savedAt:new Date().toISOString()};storage.setItem(SURVEY_KEY,JSON.stringify(saved));return saved;
}
