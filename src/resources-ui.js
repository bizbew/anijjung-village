import resources from './resources.json';
import { filterResources, resourceProvinces } from './resource-filters.js';

// Treat imported text as text, never as HTML.
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
const link = (url, label) => safeUrl(url) ? `<a href="${escape(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>` : '';

export function setupResources(onOpen) {
  const panel = document.querySelector('#resources');
  const trigger = document.querySelector('#open-resources');
  let category = 'อาหาร';
  const pageSize = 12;
  let visibleCount = pageSize;
  let returnFocus = trigger;
  panel.innerHTML = `<div class="panel-head"><span class="eyebrow">แหล่งข้อมูลภายนอกหมู่บ้าน</span><button id="close-resources">ปิดแหล่งข้อมูล ×</button></div>
    <h2 id="resources-title">แหล่งช่วยเหลือ<br>และเรียนรู้</h2>
    <p class="resource-intro">เริ่มค้นหาความรู้และช่องทางประสานงาน<br>อาหาร น้ำ และพลังงานสำหรับครัวเรือน</p>
    <p class="resource-disclaimer">รวบรวมจากตารางและไฟล์ Excel ที่ผู้ใช้ให้มา ยังไม่ได้ตรวจสอบข้อมูลกับหน่วยงาน ไม่ยืนยันว่ามีทรัพยากรพร้อมแจกหรือเปิดรับบริการในขณะนี้ กรุณาติดต่อก่อนเดินทาง</p>
    <div class="resource-categories" role="group" aria-label="เลือกหมวดแหล่งข้อมูล">${['อาหาร', 'น้ำ', 'พลังงาน'].map(c => `<button data-category="${c}" aria-pressed="${c === category}">${c} <span>${resources.filter(r => r.category === c).length}</span></button>`).join('')}</div>
    <label class="resource-search">ค้นหาชื่อ พื้นที่ หรือเรื่องที่ต้องการ<input id="resource-search" type="search" placeholder="เช่น เชียงใหม่ โซลาร์ ตรวจดิน"></label>
    <label class="resource-province">จังหวัดที่เกี่ยวข้องตามข้อมูลต้นทาง<select id="resource-province"><option value="">ทุกจังหวัด / ส่วนกลาง</option>${resourceProvinces(resources).map(p => `<option value="${escape(p)}">${escape(p)}</option>`).join('')}</select></label>
    <p class="resource-filter-note">จังหวัดที่ระบุไม่ยืนยันว่าครอบคลุมทุกพื้นที่ โปรดตรวจขอบเขตบริการของแต่ละแห่ง รายการเดิมที่ยังไม่ระบุจังหวัดจะแสดงเมื่อเลือกทุกจังหวัด</p>
    <p id="resource-count" role="status" aria-live="polite"></p><div id="resource-list"></div><button id="resource-more" class="resource-more" hidden>แสดงเพิ่มเติม</button>`;
  const search = panel.querySelector('#resource-search');
  function render() {
    const query = search.value.trim().toLocaleLowerCase('th');
    const matches = filterResources(resources, { category, query, province: panel.querySelector('#resource-province').value });
    panel.querySelector('#resource-count').textContent = `${category} · พบ ${matches.length} แห่ง`;
    panel.querySelector('#resource-list').innerHTML = matches.length ? matches.slice(0, visibleCount).map(r => `<article class="resource-card">
      <span class="resource-badge">${escape(r.category)} · แหล่งความรู้ / ช่องทางประสานงาน</span>
      <h3>${escape(r.name)}</h3><p class="resource-area">พื้นที่: ${escape(r.area)}</p>
      ${r.provinces?.length ? `<p class="resource-area">จังหวัดที่เกี่ยวข้อง: ${r.provinces.map(escape).join(' · ')}</p>` : ''}
      ${r.officeProvince ? `<p class="resource-area">สำนักงานตั้งอยู่: ${escape(r.officeProvince)}</p>` : ''}
      ${r.address ? `<p class="resource-area">ที่ตั้งตามไฟล์: ${escape(r.address)}</p>` : ''}
      ${r.network ? `<p class="resource-area">เครือข่าย: ${escape(r.network)}</p>` : ''}
      <p class="resource-summary">${escape(r.summary)}${r.additionalSummaries?.length ? `<br>${r.additionalSummaries.map(escape).join('<br>')}` : ''}</p>
      ${r.coverageNotes?.length ? `<p class="resource-area">ขอบเขตบริการ: ${r.coverageNotes.map(escape).join(' / ')}</p>` : ''}
      ${r.contacts?.length ? `<p class="resource-contact">ช่องทางตามไฟล์: ${r.contacts.map(escape).join(' / ')}</p>` : ''}
      ${r.limitations?.length ? `<p class="resource-limits">หมายเหตุจากต้นทาง: ${r.limitations.map(escape).join(' / ')}</p>` : ''}<div class="resource-links">${link(r.url, 'เว็บไซต์ / ติดต่อ')}${link(r.sourceUrl, 'แหล่งอ้างอิง')}${(r.referenceUrls || []).filter(url => url !== r.sourceUrl).map(url=>link(url,'อ้างอิงเพิ่มเติม')).join('')}</div>
      <p class="resource-meta">อ้างอิง: ${escape(r.sourceName)}<br>ตรวจสอบล่าสุด: ${r.verifiedAt ? escape(r.verifiedAt) : 'ยังไม่ได้ตรวจสอบ'}${r.contacts?.length ? '' : ' · ยังไม่มีเบอร์ติดต่อในข้อมูล'}${r.sourceSheet ? `<br>ไฟล์: ${escape(r.sourceFile)} · ${escape(r.sourceSheet)} · แถว ${r.sourceRows.join(', ')}` : ''}${r.sourceResearchedAt ? `<br>วันที่สืบค้นที่ระบุในไฟล์: ${escape(r.sourceResearchedAt)} (ยังไม่ได้ยืนยันโดยเว็บไซต์นี้)` : ''}${!r.sourceUrl ? '<br>ต้นทางไม่ได้ระบุเว็บไซต์อ้างอิง' : ''}</p>
    </article>`).join('') : '<p class="resource-empty">ไม่พบแหล่งข้อมูล ลองเปลี่ยนคำค้นหรือเลือกหมวดอื่น</p>';
    panel.querySelector('#resource-more').hidden = visibleCount >= matches.length;
    panel.querySelector('#resource-more').textContent = `แสดงเพิ่มอีก ${Math.min(pageSize, Math.max(0, matches.length-visibleCount))} แห่ง`;
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
    visibleCount = pageSize; render();
  });
  search.oninput = () => { visibleCount = pageSize; render(); };
  panel.querySelector('#resource-province').onchange = () => { visibleCount = pageSize; render(); };
  panel.querySelector('#resource-more').onclick = () => { visibleCount += pageSize; render(); };
  render();
  return { open, close };
}
