import { loadNetwork, saveNetwork, networkHouseholds, slots, validateRequest } from './network-store.js';
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => n.toLocaleString('th-TH', { maximumFractionDigits: 2 });
const field = (name,label,type='text',extra='required',value='') => `<label>${label}<input name="${name}" type="${type}" ${extra} value="${escape(value)}"></label>`;
const optionalNumber = (name,label) => field(name,label,'number','min="0" max="10000000" step="any"');
const localNote = '<p class="local-note">ต้นแบบทดลอง · บันทึกเฉพาะเบราว์เซอร์นี้ ไม่ส่งข้อมูลให้เครือข่ายหรือบุคคลอื่น ยังไม่มีบัญชีสมาชิกหรือระบบชำระเงิน</p>';
const consent = '<label class="check-field"><input type="checkbox" name="consent" required>ยินยอมบันทึกข้อมูลในเบราว์เซอร์นี้และแสดงชื่อครัวเรือนกับพื้นที่โดยประมาณ ช่องทางติดต่อไม่แสดงในรายการสาธารณะ</label>';
export function setupNetworkPages() {
  const page = document.querySelector('#network-page');
  const explorer = document.querySelector('.explorer');
  let data = loadNetwork();
  function status(message) { page.querySelector('#form-status').textContent = message; }
  function persist(next) {
    try { saveNetwork(next); data = next; return true; }
    catch { status('บันทึกไม่ได้ กรุณาอนุญาตพื้นที่จัดเก็บของเบราว์เซอร์หรือเพิ่มพื้นที่ว่าง แล้วลองอีกครั้ง'); return false; }
  }
  function route() {
    const name = location.hash.slice(1);
    const active = ['who-we-are','join','sharing'].includes(name);
    explorer.hidden = active; page.hidden = !active;
    document.querySelectorAll('.site-nav a').forEach(a => { if (a.hash === location.hash && active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.querySelector('#nav-links').classList.remove('expanded');document.querySelector('#nav-toggle').setAttribute('aria-expanded','false');
    if (!active) { document.title = 'Anijjung Village Explorer'; return; }
    data = loadNetwork();
    const titles = { 'who-we-are': 'รู้จัก Anijjung Network', join: 'เข้าร่วม Anijjung Network', sharing: 'พื้นที่แบ่งปันทรัพยากร' };
    document.title = `${titles[name]} · Anijjung`;
    page.innerHTML = `<a class="back-link" href="#">← กลับไปสำรวจหมู่บ้าน</a><h1 tabindex="-1">${titles[name]}</h1>${localNote}<div id="page-content"></div><p id="form-status" role="status" aria-live="polite"></p>`;
    const content = page.querySelector('#page-content');
    if (name === 'who-we-are') {
      content.innerHTML = `<section class="about-card"><p class="eyebrow">อาหาร · น้ำ · พลังงาน · การแบ่งปันโดยสมัครใจ</p><h2>เริ่มจากบ้าน เชื่อมถึงชุมชน</h2><p>Anijjung Network เป็นแนวคิดเครือข่ายครัวเรือนในประเทศไทย ที่ช่วยสำรวจและวางแผนทรัพยากรด้านอาหาร น้ำ และพลังงาน พร้อมเชื่อมผู้ที่สนใจแบ่งปันทรัพยากรโดยสมัครใจ</p><p>หมู่บ้าน 3D เป็นผังสมมติเพื่อการเรียนรู้ บ้านเริ่มต้นทั้งห้าหลังใช้ข้อมูลจำลอง ส่วนบ้านที่คุณเพิ่มใช้ข้อมูลที่คุณกรอก ไม่ใช่ตำแหน่งจริงหรือผังรับรองทางวิศวกรรม</p><div class="about-grid"><article><h3>รู้จักทรัพยากรของบ้าน</h3><p>บันทึกข้อมูลที่มี เว้นช่องที่ยังไม่ทราบ แล้วสำรวจวันสำรองน้ำตามการใช้รวมของครัวเรือน</p></article><article><h3>เลือกแบ่งปันด้วยตัวเอง</h3><p>ความสนใจแบ่งปันไม่เท่ากับทรัพยากรพร้อมแจก ต้องสร้างรายการและระบุจำนวนกับเงื่อนไขแยกต่างหาก</p></article><article><h3>เรียนรู้ร่วมกัน</h3><p>เข้าถึงแหล่งความรู้ด้านอาหาร น้ำ และพลังงานจากหน้าแรก โดยตรวจสอบบริการกับหน่วยงานก่อน</p></article></div><p>ต้นแบบนี้ไม่ยืนยันคุณภาพน้ำ ความพร้อมเมื่อไฟดับ หรือระดับการพึ่งตนเอง และยังไม่ใช่บริการรับคำขอจริง</p><a class="primary-link" href="#join">เริ่มเพิ่มครัวเรือน →</a></section>`;
    } else if (name === 'join') {
      content.innerHTML = `<form id="join-form" class="network-form"><h2>ข้อมูลครัวเรือน</h2><p>ผังทดลองรองรับบ้านเพิ่ม ${slots.length} หลัง (เพิ่มแล้ว ${data.members.length}) ตำแหน่งจัดให้อัตโนมัติในผังจำลอง</p><div class="form-grid">${field('name','ชื่อครัวเรือน','text','required maxlength="80"')}${field('residents','จำนวนสมาชิก (คน)','number','required min="1" max="100" step="1"')}${field('area','จังหวัด / อำเภอ','text','required maxlength="120"')}${field('contact','ช่องทางติดต่อ (เก็บไว้เฉพาะในเบราว์เซอร์)','text','required maxlength="160"')}</div><h3>ทรัพยากรของบ้าน · เว้นว่างได้ถ้ายังไม่ทราบ</h3><div class="form-grid">${optionalNumber('waterLitres','น้ำที่เก็บไว้ (ลิตร)')}${optionalNumber('dailyWaterLitres','ใช้น้ำรวมทั้งครัวเรือน (ลิตร/วัน)')}${optionalNumber('foodDays','อาหารสำรอง (วัน)')}${optionalNumber('solarKwh','ผลิตไฟฟ้าโซลาร์ (kWh/วัน)')}${optionalNumber('electricityKwh','ใช้ไฟฟ้ารวม (kWh/วัน)')}</div><fieldset><legend>ความสนใจแบ่งปันทรัพยากร</legend><label class="check-field"><input type="radio" name="sharing" value="yes" required>สนใจแบ่งปัน</label><label class="check-field"><input type="radio" name="sharing" value="no" checked>ยังไม่เปิดแบ่งปัน</label></fieldset>${consent}<button class="primary-button" ${data.members.length >= slots.length ? 'disabled' : ''}>บันทึกและเพิ่มบ้านในหน้าแรก</button>${data.members.length >= slots.length ? '<p>ครบพื้นที่ผังทดลองแล้ว ยังดูบ้านและสร้างรายการแบ่งปันได้</p>' : ''}</form>`;
      page.querySelector('#join-form').onsubmit = event => {
        event.preventDefault(); if (data.members.length >= slots.length) return;
        const form = new FormData(event.target); const member = { id: String(data.members.length+6).padStart(2,'0'), name: form.get('name').trim(), area: form.get('area').trim(), contact: form.get('contact').trim(), residents: Number(form.get('residents')), sharing: form.get('sharing') === 'yes' };
        if (!member.name || !member.area || !member.contact) return status('กรุณากรอกชื่อ พื้นที่ และช่องทางติดต่อ');
        for (const key of ['waterLitres','dailyWaterLitres','foodDays','solarKwh','electricityKwh']) member[key] = form.get(key) === '' ? null : Number(form.get(key));
        if (persist({...data,members:[...data.members,member]})) { location.hash = '#village/local'; location.reload(); }
      };
    } else renderSharing(content);
    page.querySelector('h1').focus({preventScroll:true}); window.scrollTo(0,0);
  }
  function renderSharing(content) {
    const owners = networkHouseholds(data).filter(h=>h.sharing);
    content.innerHTML = `<p>ระบุเฉพาะทรัพยากรที่ต้องการเสนอ ไม่ดึงน้ำหรืออาหารสำรองของบ้านมาลงรายการอัตโนมัติ บ้าน 01–05 เป็นตัวอย่างจำลอง</p><details class="offer-editor"><summary>＋ เพิ่มรายการที่สนใจแบ่งปัน</summary><form id="offer-form" class="network-form"><div class="form-grid"><label>บ้านที่สนใจแบ่งปัน<select name="ownerId" required>${owners.map(h=>`<option value="${h.id}">บ้าน ${h.id} · ${escape(h.name || 'ข้อมูลจำลอง')}</option>`).join('')}</select></label><label>หมวด<select name="category"><option>อาหาร</option><option>น้ำ</option><option>พลังงาน</option><option>อื่น ๆ</option></select></label>${field('name','ชื่อทรัพยากร','text','required maxlength="100"')}${field('quantity','จำนวนที่เสนอ','number','required min="0.01" max="1000000" step="any"')}${field('unit','หน่วย เช่น ซอง กก. ลิตร','text','required maxlength="30"')}${field('price','ราคา (บาท/หน่วย) · 0 คือฟรี','number','required min="0" max="1000000" step="0.01"')}${field('area','พื้นที่รับของโดยประมาณ','text','required maxlength="120"')}</div><label>เงื่อนไข / วิธีรับของ<textarea name="conditions" required maxlength="500" placeholder="เช่น นัดรับเอง กรุณาสอบถามก่อน"></textarea></label><p>การลงรายการไม่ยืนยันคุณภาพ ความปลอดภัย หรือจำนวนพร้อมส่ง โปรดระบุเงื่อนไขให้ชัดเจน</p><button class="primary-button">บันทึกรายการในเบราว์เซอร์</button></form></details><h2>รายการที่เสนอแบ่งปัน</h2><div class="offers-grid">${data.offers.length ? data.offers.map(o=>`<article class="offer-card"><span class="resource-badge">${escape(o.category)} · บ้าน ${escape(o.ownerId)}</span><h3>${escape(o.name)}</h3><p>${fmt(o.quantity)} ${escape(o.unit)} · <strong>${o.price===0 ? 'ฟรี' : `${fmt(o.price)} บาท/${escape(o.unit)}`}</strong></p><p>พื้นที่: ${escape(o.area)}</p><p>${escape(o.conditions)}</p><small>อัปเดต ${escape(new Date(o.updatedAt).toLocaleDateString('th-TH'))} · รายการทดลองในเบราว์เซอร์นี้</small><button class="request-button" data-offer="${escape(o.id)}">ขอแบ่งปัน</button></article>`).join('') : '<p class="empty-offers">ยังไม่มีรายการ เพิ่มรายการจากบ้านที่สนใจแบ่งปันได้ด้านบน</p>'}</div><section id="request-section" hidden></section><h2>คำขอที่บันทึกไว้ในเครื่องนี้ (${data.requests.length})</h2><p>ยังไม่ได้ส่งให้เจ้าของรายการ ไม่หักจำนวนสินค้าและไม่ถือว่าได้รับการอนุมัติ</p><ul class="local-requests">${data.requests.map(r=>`<li>${escape(data.offers.find(o=>o.id===r.offerId)?.name || 'รายการ')} · ขอ ${fmt(r.quantity)} ${escape(data.offers.find(o=>o.id===r.offerId)?.unit)} · รอประสานงานเอง</li>`).join('')}</ul>`;
    content.querySelector('#offer-form').onsubmit = event => {
      event.preventDefault(); const f = new FormData(event.target);
      const offer = {id:crypto.randomUUID(),ownerId:f.get('ownerId'),category:f.get('category'),name:f.get('name').trim(),quantity:Number(f.get('quantity')),unit:f.get('unit').trim(),price:Number(f.get('price')),area:f.get('area').trim(),conditions:f.get('conditions').trim(),updatedAt:new Date().toISOString()};
      if (!owners.some(h=>h.id===offer.ownerId) || !offer.name || !offer.unit || !offer.area || !offer.conditions || offer.quantity<=0 || offer.price<0) return status('กรุณากรอกข้อมูลรายการให้ครบและตรวจสอบจำนวน / ราคา');
      if (persist({...data,offers:[offer,...data.offers]})) { renderSharing(content);status('บันทึกรายการแล้ว เฉพาะในเบราว์เซอร์นี้'); }
    };
    content.querySelectorAll('[data-offer]').forEach(button=>button.onclick=()=>{
      const offer=data.offers.find(o=>o.id===button.dataset.offer); const section=content.querySelector('#request-section');section.hidden=false;
      section.innerHTML=`<form id="request-form" class="network-form"><h2>ขอแบ่งปัน: ${escape(offer.name)}</h2><p>ราคา ${offer.price===0?'ฟรี':`${fmt(offer.price)} บาท/${escape(offer.unit)}`} · ยังไม่รวมค่าเดินทางหรือค่าจัดส่ง</p><div class="form-grid">${field('name','ชื่อผู้ขอ','text','required maxlength="80"')}${field('contact','ช่องทางติดต่อ (ไม่แสดงในรายการ)','text','required maxlength="160"')}${field('quantity',`จำนวนที่ขอ (${escape(offer.unit)})`,'number',`required min="0.01" max="${offer.quantity}" step="any"`)}</div><label>ข้อความถึงผู้แบ่งปัน<textarea name="note" maxlength="500"></textarea></label><p id="request-total">เลือกจำนวนเพื่อดูยอดประมาณการ</p><label class="check-field"><input type="checkbox" required>เข้าใจว่าคำขอนี้บันทึกเฉพาะในเครื่อง ไม่ส่งให้เจ้าของรายการ</label><button class="primary-button">บันทึกคำขอทดลอง</button><button type="button" id="cancel-request">ยกเลิก</button></form>`;
      const form=section.querySelector('form');form.elements.quantity.oninput=()=>{const q=Number(form.elements.quantity.value);section.querySelector('#request-total').textContent=validateRequest(q,offer)?`ยอดประมาณการ ${fmt(q*offer.price)} บาท`:'จำนวนต้องมากกว่า 0 และไม่เกินจำนวนที่เสนอ';};
      section.querySelector('#cancel-request').onclick=()=>{section.hidden=true;button.focus();};
      form.onsubmit=event=>{event.preventDefault();const f=new FormData(form),quantity=Number(f.get('quantity'));if(!validateRequest(quantity,offer)||!f.get('name').trim()||!f.get('contact').trim())return status('ตรวจสอบจำนวน ชื่อ และช่องทางติดต่อ');const request={id:crypto.randomUUID(),offerId:offer.id,name:f.get('name').trim(),contact:f.get('contact').trim(),note:f.get('note').trim(),quantity,createdAt:new Date().toISOString()};if(persist({...data,requests:[request,...data.requests]})){renderSharing(content);status('บันทึกคำขอในเครื่องแล้ว ยังไม่ได้ส่งให้เจ้าของรายการ');}};
      section.scrollIntoView({behavior:'smooth',block:'start'});form.elements.name.focus({preventScroll:true});
    });
  }
  document.querySelector('#nav-toggle').onclick=()=>{const expanded=document.querySelector('#nav-links').classList.toggle('expanded');document.querySelector('#nav-toggle').setAttribute('aria-expanded',String(expanded));};
  window.addEventListener('hashchange',route); route();
}
