import resources from './resources.json';

// Treat imported text as text, never as HTML.
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
const link = (url, label) => safeUrl(url) ? `<a href="${escape(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>` : '';

export function setupResources(onOpen) {
  const panel = document.querySelector('#resources');
  const trigger = document.querySelector('#open-resources');
  let category = 'อาหาร';
  let returnFocus = trigger;
  panel.innerHTML = `<div class="panel-head"><span class="eyebrow">แหล่งข้อมูลภายนอกหมู่บ้าน</span><button id="close-resources">ปิดแหล่งข้อมูล ×</button></div>
    <h2 id="resources-title">แหล่งช่วยเหลือ<br>และเรียนรู้</h2>
    <p class="resource-intro">เริ่มค้นหาความรู้และช่องทางประสานงาน<br>อาหาร น้ำ และพลังงานสำหรับครัวเรือน</p>
    <p class="resource-disclaimer">รวบรวมจากตารางที่ผู้ใช้ให้มา ยังไม่ได้ตรวจสอบข้อมูลกับหน่วยงาน ไม่ยืนยันว่ามีทรัพยากรพร้อมแจกหรือเปิดรับบริการในขณะนี้ กรุณาติดต่อก่อนเดินทาง</p>
    <div class="resource-categories" role="group" aria-label="เลือกหมวดแหล่งข้อมูล">${['อาหาร', 'น้ำ', 'พลังงาน'].map(c => `<button data-category="${c}" aria-pressed="${c === category}">${c} <span>10</span></button>`).join('')}</div>
    <label class="resource-search">ค้นหาชื่อ พื้นที่ หรือเรื่องที่ต้องการ<input id="resource-search" type="search" placeholder="เช่น เชียงใหม่ โซลาร์ ตรวจดิน"></label>
    <p id="resource-count" role="status" aria-live="polite"></p><div id="resource-list"></div>`;
  const search = panel.querySelector('#resource-search');
  function render() {
    const query = search.value.trim().toLocaleLowerCase('th');
    const matches = resources.filter(r => r.category === category && `${r.name} ${r.area} ${r.summary}`.toLocaleLowerCase('th').includes(query));
    panel.querySelector('#resource-count').textContent = `${category} · พบ ${matches.length} แห่ง`;
    panel.querySelector('#resource-list').innerHTML = matches.length ? matches.map(r => `<article class="resource-card">
      <span class="resource-badge">${escape(r.category)} · แหล่งความรู้ / ช่องทางประสานงาน</span>
      <h3>${escape(r.name)}</h3><p class="resource-area">พื้นที่: ${escape(r.area)}</p>
      <p class="resource-summary">${escape(r.summary)}</p><div class="resource-links">${link(r.url, 'เว็บไซต์ / ติดต่อ')}${link(r.sourceUrl, 'แหล่งอ้างอิง')}</div>
      <p class="resource-meta">อ้างอิง: ${escape(r.sourceName)}<br>ตรวจสอบล่าสุด: ${r.verifiedAt ? escape(r.verifiedAt) : 'ยังไม่ได้ตรวจสอบ'} · ไม่มีเบอร์ติดต่อในตาราง</p>
    </article>`).join('') : '<p class="resource-empty">ไม่พบแหล่งข้อมูล ลองเปลี่ยนคำค้นหรือเลือกหมวดอื่น</p>';
  }
  function open() {
    returnFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : trigger;
    onOpen(); panel.hidden = false; trigger.setAttribute('aria-expanded', 'true');
    document.querySelector('.explorer').classList.add('resources-open');
    panel.querySelector('#close-resources').focus({ preventScroll: true });
  }
  function close(restoreFocus = true) {
    if (panel.hidden) return;
    panel.hidden = true; trigger.setAttribute('aria-expanded', 'false');
    document.querySelector('.explorer').classList.remove('resources-open');
    if (restoreFocus) returnFocus.focus({ preventScroll: true });
  }
  trigger.onclick = () => panel.hidden ? open() : close();
  panel.querySelector('#close-resources').onclick = () => close();
  panel.querySelectorAll('[data-category]').forEach(button => button.onclick = () => {
    category = button.dataset.category;
    panel.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    render();
  });
  search.oninput = render;
  render();
  return { open, close };
}
