import './style.css';
import { setupResources } from './resources-ui.js';
import { waterReserveDays } from './households.js';
import { loadNetwork, networkHouseholds } from './network-store.js';
import { setupNetworkPages, escape } from './network-pages.js';
import { createVillage } from './scene.js';
const households = networkHouseholds(loadNetwork());

const app = document.querySelector('#app');
app.innerHTML = `
  <nav class="site-nav" aria-label="เมนูหลัก"><a class="nav-brand" href="#">ANIJJUNG NETWORK</a><button id="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="เปิดเมนู">☰</button><div id="nav-links"><a href="#who-we-are">WHO WE ARE</a><a href="#join">JOIN A NETWORK</a><a href="#sharing">SHARING</a></div></nav>
  <main id="network-page" class="network-page" hidden></main>
  <main class="explorer">
    <div id="scene" role="region" aria-label="ฉากหมู่บ้านจำลองสามมิติ"></div>
    <header class="intro"><div class="eyebrow"><span></span> ANIJJUNG / CONCEPT 01</div>
      <h1>Anijjung<br>Village Explorer</h1>
      <p class="subtitle">สำรวจหมู่บ้านจำลองเพื่อวางแผนอาหาร น้ำ และพลังงาน</p>
      <p class="concept">ต้นแบบแนวคิด • หมู่บ้านจำลอง • บ้านเริ่มต้นใช้ข้อมูลจำลอง</p>
    </header>
    <div class="toolbar"><button id="open-resources" aria-controls="resources" aria-expanded="false">แหล่งช่วยเหลือและเรียนรู้</button><label class="toggle"><input id="sharing" type="checkbox"><span class="switch"></span>แสดงเครือข่ายแบ่งปัน</label><button id="reset">↺ กลับมุมเริ่มต้น</button></div>
    <aside id="resources" class="details resources" aria-labelledby="resources-title" hidden></aside>
    <aside id="details" class="details" aria-label="รายละเอียดครัวเรือน" hidden></aside>
    <div class="village-key"><span class="key-icon">⌂</span><div><strong>พื้นที่เล็ก ๆ เพื่อสำรวจร่วมกัน</strong><p>เลือกบ้านเพื่อดูอาหาร น้ำ และพลังงาน</p><div class="house-list">${households.map(h => `<button data-house="${h.id}" aria-label="ดูรายละเอียดบ้าน ${h.id}">${h.id}</button>`).join('')}</div></div></div>
    <footer><span>ลากเพื่อหมุน • เลื่อน / จีบเพื่อซูม • คลิกขวาลาก / สองนิ้วเพื่อเลื่อน</span><span class="layout-note">ผังสมมติเชิงแนวคิด • ไม่ใช่ผังรับรองทางวิศวกรรม</span></footer>
    <p id="network-note" class="network-note" hidden>เส้นเชื่อมแสดงความสนใจแบ่งปันเท่านั้น<br>ไม่ใช่การส่งมอบจริงหรือทรัพยากรที่ยืนยันแล้ว</p>
    <div id="fallback" class="fallback" hidden>อุปกรณ์นี้ไม่สามารถแสดงฉาก 3D ได้ เลือกหมายเลขบ้านด้านล่างเพื่ออ่านข้อมูลครัวเรือน</div>
  </main>`;
let village;
const resourcePanel = setupResources(closeDetails);
const number = value => Number.isFinite(value) ? value.toLocaleString('th-TH', { maximumFractionDigits: 1 }) : 'ยังไม่มีข้อมูล';
function selectHouse(id) {
  const h = households.find(h => h.id === id);
  if (!h) return;
  resourcePanel.close(false);
  village?.select(id);
  document.querySelectorAll('[data-house]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.house === id)));
  const days = waterReserveDays(h);
  const panel = document.querySelector('#details');
  panel.hidden = false;
  panel.innerHTML = `<div class="panel-head"><span class="eyebrow">HOUSEHOLD / ${h.id}</span><button id="close" aria-label="ปิดรายละเอียด">ปิดรายละเอียด ×</button></div>
    <h2>บ้าน ${h.id}</h2>${h.local ? `<p class="local-house">${escape(h.name)} · ${escape(h.area)}<br>ข้อมูลที่คุณกรอก · ตำแหน่งในผังสมมติ</p>` : ''}<p class="residents">ครัวเรือน ${h.id} <span>·</span> ผู้อยู่อาศัย ${h.residents} คน</p>
    <div class="reserve"><span>ระยะเวลาสำรองน้ำ</span><strong>${days === null ? 'ยังคำนวณไม่ได้' : `${number(days)} <small>วัน</small>`}</strong><small>${h.local ? 'ประมาณการจากข้อมูลที่คุณกรอก' : 'ประมาณการจากข้อมูลจำลอง'}</small></div>
    <dl><div><dt>น้ำที่เก็บไว้</dt><dd>${number(h.waterLitres)} ลิตร</dd></div><div><dt>ใช้น้ำรวมทั้งครัวเรือน</dt><dd>${number(h.dailyWaterLitres)}${h.dailyWaterLitres === null ? '' : ' ลิตร/วัน'}</dd></div><div><dt>อาหารสำรอง</dt><dd>${number(h.foodDays)}${h.foodDays === null ? '' : ' วัน'}</dd></div><div><dt>ผลิตไฟฟ้าจากโซลาร์ (ตัวอย่าง)</dt><dd>${number(h.solarKwh)} kWh/วัน</dd></div><div><dt>ใช้ไฟฟ้าทั้งครัวเรือน</dt><dd>${number(h.electricityKwh)} kWh/วัน</dd></div></dl>
    <div class="sharing-status ${h.sharing ? 'active' : ''}"><span>●</span> ${h.sharing ? 'สนใจแบ่งปัน' : 'ยังไม่เปิดแบ่งปัน'}</div>
    <p class="caution">น้ำสำรอง ÷ การใช้น้ำรวมต่อวัน เป็นเพียงประมาณการ ไม่ยืนยันว่าน้ำดื่มได้ ตัวเลขโซลาร์รายวันไม่ยืนยันว่าจะใช้ไฟฟ้าได้เมื่อไฟดับ</p>`;
  document.querySelector('#close').onclick = closeDetails;
}
function closeDetails() {
  document.querySelector('#details').hidden = true;
  village?.select(null);
  document.querySelectorAll('[data-house]').forEach(b => b.setAttribute('aria-pressed', 'false'));
}
try { village = createVillage(document.querySelector('#scene'), selectHouse, resourcePanel.open, households); }
catch (error) { console.error(error); document.querySelector('#fallback').hidden = false; }
document.querySelector('#reset').onclick = () => village?.reset();
document.querySelector('#sharing').onchange = event => {
  village?.setSharing(event.target.checked);
  document.querySelector('#network-note').hidden = !event.target.checked;
};
document.querySelectorAll('[data-house]').forEach(button => button.onclick = () => selectHouse(button.dataset.house));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeDetails(); resourcePanel.close(); } });

setupNetworkPages();
