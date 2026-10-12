import './style.css';
import { households, waterReserveDays } from './households.js';
import { createVillage } from './scene.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="explorer">
    <div id="scene" role="region" aria-label="ฉากหมู่บ้านจำลองสามมิติ"></div>
    <header class="intro"><div class="eyebrow"><span></span> ANIJJUNG / CONCEPT 01</div>
      <h1>Anijjung<br>Village Explorer</h1>
      <p class="subtitle">สำรวจหมู่บ้านจำลองเพื่อวางแผนอาหาร น้ำ และพลังงาน</p>
      <p class="concept">ต้นแบบแนวคิด • ข้อมูลทั้งหมดเป็นข้อมูลจำลอง</p>
    </header>
    <div class="toolbar"><label class="toggle"><input id="sharing" type="checkbox"><span class="switch"></span>แสดงเครือข่ายแบ่งปัน</label><button id="reset">↺ กลับมุมเริ่มต้น</button></div>
    <aside id="details" class="details" aria-label="รายละเอียดครัวเรือน" hidden></aside>
    <div class="village-key"><span class="key-icon">⌂</span><div><strong>พื้นที่เล็ก ๆ เพื่อสำรวจร่วมกัน</strong><p>เลือกบ้านเพื่อดูอาหาร น้ำ และพลังงาน</p><div class="house-list">${households.map(h => `<button data-house="${h.id}" aria-label="ดูรายละเอียดบ้าน ${h.id}">${h.id}</button>`).join('')}</div></div></div>
    <footer><span>ลากเพื่อหมุน • เลื่อน / จีบเพื่อซูม • คลิกขวาลาก / สองนิ้วเพื่อเลื่อน</span><span class="layout-note">ผังสมมติเชิงแนวคิด • ไม่ใช่ผังรับรองทางวิศวกรรม</span></footer>
    <p id="network-note" class="network-note" hidden>เส้นเชื่อมแสดงความสนใจแบ่งปันเท่านั้น<br>ไม่ใช่การส่งมอบจริงหรือทรัพยากรที่ยืนยันแล้ว</p>
    <div id="fallback" class="fallback" hidden>อุปกรณ์นี้ไม่สามารถแสดงฉาก 3D ได้ เลือกหมายเลขบ้านด้านล่างเพื่ออ่านข้อมูลครัวเรือน</div>
  </main>`;
let village;
const number = value => Number.isFinite(value) ? value.toLocaleString('th-TH', { maximumFractionDigits: 1 }) : 'ยังไม่มีข้อมูล';
function selectHouse(id) {
  const h = households.find(h => h.id === id);
  if (!h) return;
  village?.select(id);
  document.querySelectorAll('[data-house]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.house === id)));
  const days = waterReserveDays(h);
  const panel = document.querySelector('#details');
  panel.hidden = false;
  panel.innerHTML = `<div class="panel-head"><span class="eyebrow">HOUSEHOLD / ${h.id}</span><button id="close" aria-label="ปิดรายละเอียด">ปิดรายละเอียด ×</button></div>
    <h2>บ้าน ${h.id}</h2><p class="residents">ครัวเรือน ${h.id} <span>·</span> ผู้อยู่อาศัย ${h.residents} คน</p>
    <div class="reserve"><span>ระยะเวลาสำรองน้ำ</span><strong>${days === null ? 'ยังคำนวณไม่ได้' : `${number(days)} <small>วัน</small>`}</strong><small>ประมาณการจากข้อมูลจำลอง</small></div>
    <dl><div><dt>น้ำที่เก็บไว้</dt><dd>${number(h.waterLitres)} ลิตร</dd></div><div><dt>ใช้น้ำรวมทั้งครัวเรือน</dt><dd>${number(h.dailyWaterLitres)}${h.dailyWaterLitres === null ? '' : ' ลิตร/วัน'}</dd></div><div><dt>อาหารสำรอง</dt><dd>${h.foodDays} วัน</dd></div><div><dt>ผลิตไฟฟ้าจากโซลาร์ (ตัวอย่าง)</dt><dd>${number(h.solarKwh)} kWh/วัน</dd></div><div><dt>ใช้ไฟฟ้าทั้งครัวเรือน</dt><dd>${number(h.electricityKwh)} kWh/วัน</dd></div></dl>
    <div class="sharing-status ${h.sharing ? 'active' : ''}"><span>●</span> ${h.sharing ? 'สนใจแบ่งปัน' : 'ยังไม่เปิดแบ่งปัน'}</div>
    <p class="caution">น้ำสำรอง ÷ การใช้น้ำรวมต่อวัน เป็นเพียงประมาณการ ไม่ยืนยันว่าน้ำดื่มได้ ตัวเลขโซลาร์รายวันไม่ยืนยันว่าจะใช้ไฟฟ้าได้เมื่อไฟดับ</p>`;
  document.querySelector('#close').onclick = closeDetails;
}
function closeDetails() {
  document.querySelector('#details').hidden = true;
  village?.select(null);
  document.querySelectorAll('[data-house]').forEach(b => b.setAttribute('aria-pressed', 'false'));
}
try { village = createVillage(document.querySelector('#scene'), selectHouse); }
catch (error) { console.error(error); document.querySelector('#fallback').hidden = false; }
document.querySelector('#reset').onclick = () => village?.reset();
document.querySelector('#sharing').onchange = event => {
  village?.setSharing(event.target.checked);
  document.querySelector('#network-note').hidden = !event.target.checked;
};
document.querySelectorAll('[data-house]').forEach(button => button.onclick = () => selectHouse(button.dataset.house));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDetails(); });
