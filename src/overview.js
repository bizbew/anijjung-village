import { getGroups } from './groups.js';
import { loadNetwork } from './network-store.js';
import { escape } from './network-pages.js';
export function setupOverview() {
  const root = document.querySelector('#overview');
  root.innerHTML = `<div class="overview-heading"><p class="eyebrow">ANIJJUNG / NETWORK EXPLORER</p><h1>หลายบ้าน เชื่อมเป็นเครือข่าย</h1><p>เลือกจุดของกลุ่ม เพื่อสำรวจบ้านในฉาก 3D ทีละหมู่บ้าน</p><p class="local-note">เครือข่ายทดลอง 1,000 ครัวเรือนจำลอง + บ้านที่คุณเพิ่ม · จุดเป็นแผนภาพ ไม่ใช่พิกัดหรือเครือข่ายสมาชิกจริง</p></div><div class="overview-filters"><label>ค้นหากลุ่มหรือพื้นที่<input id="group-search" type="search" placeholder="เช่น เชียงใหม่ กลุ่มจำลอง 12"></label><label>พื้นที่<select id="group-region"><option value="">ทุกพื้นที่</option><option>ผังทดลองในเบราว์เซอร์นี้</option>${['เชียงใหม่','นครนายก','ชลบุรี','ขอนแก่น','นครราชสีมา','ตรัง'].map(r=>`<option>${r}</option>`).join('')}</select></label></div><p id="group-count" role="status"></p><div class="network-diagram" aria-label="จุดกลุ่มหมู่บ้าน"></div><h2>เลือกกลุ่มจากรายการ</h2><div class="group-list"></div>`;
  function render() {
    const groups = getGroups(loadNetwork());
    const query = root.querySelector('#group-search').value.trim().toLowerCase();
    const region = root.querySelector('#group-region').value;
    const matches = groups.filter(g => (!region || g.area === region) && `${g.name} ${g.area}`.toLowerCase().includes(query));
    root.querySelector('#group-count').textContent = `พบ ${matches.length} กลุ่ม · ${matches.reduce((n,g)=>n+g.count,0).toLocaleString('th-TH')} ครัวเรือน · โหลด 3D เฉพาะกลุ่มที่เลือก`;
    root.querySelector('.network-diagram').innerHTML = matches.length ? matches.map(g=>`<a class="group-dot ${g.id === 'local' ? 'local-dot' : ''}" href="#village/${g.id}" aria-label="เปิด ${escape(g.name)} ${g.count} หลัง"><span>${g.count}</span><strong>${escape(g.name)}</strong><small>${escape(g.area)}</small></a>`).join('') : '<p>ไม่พบกลุ่ม ลองเปลี่ยนคำค้นหรือพื้นที่</p>';
    root.querySelector('.group-list').innerHTML = matches.map(g=>`<a href="#village/${g.id}"><span>${escape(g.name)}<small>${escape(g.area)}</small></span><strong>${g.count} หลัง →</strong></a>`).join('');
  }
  root.querySelector('#group-search').oninput = render;
  root.querySelector('#group-region').onchange = render;
  return { render };
}
