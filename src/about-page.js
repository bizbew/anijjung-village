import logoUrl from '../logo.png';
import villageUrl from './assets/village-overview.png';
import './about-page.css';

const icons = {
  food: '<path d="M12 21v-9M12 15C4 16 3 10 3 5c6 0 10 2 9 10ZM12 11C12 5 16 3 21 3c0 5-2 9-9 8Z"/>',
  water: '<path d="M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  energy: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
};
const icon = key => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;

export function aboutPage() {
  return `
    <section class="about-hero" data-about-section aria-labelledby="about-title">
      <div class="about-hero-copy">
        <div class="about-identity"><img src="${logoUrl}" alt="" width="52" height="52"><span>WHO WE ARE <small>รู้จัก Anijjung Network</small></span></div>
        <h1 id="about-title" tabindex="-1">เริ่มจากบ้านที่มั่นคง<br>สู่เครือข่ายที่<span>แบ่งปัน</span></h1>
        <p class="about-lead">พื้นที่เล็ก ๆ ที่ชวนเราเข้าใจทรัพยากรของบ้าน<br>เตรียมพร้อม และเติบโตไปด้วยกัน</p>
        <a class="about-text-link" href="#about-story">รู้จักแนวคิดของเรา <span aria-hidden="true">↓</span></a>
      </div>
      <figure class="about-village"><img src="${villageUrl}" alt="ภาพหมู่บ้านจำลอง Anijjung พร้อมบ้าน สวนผัก ต้นไม้ และบ่อน้ำ" width="1100" height="850" fetchpriority="high"><figcaption>หมู่บ้านสมมติเพื่อการเรียนรู้ · ไม่ใช่สถานที่จริง</figcaption></figure>
    </section>

    <section id="about-story" class="about-story" data-about-section aria-labelledby="story-title">
      <div><p class="about-overline">01 / จุดเริ่มต้น</p><h2 id="story-title">บ้านที่เข้าใจตัวเอง<br>คือจุดเริ่มต้นของชุมชนที่แข็งแรง</h2></div>
      <div class="about-prose"><p>แต่ละบ้านมีทรัพยากร ความรู้ และข้อจำกัดต่างกัน Anijjung Network เกิดจากแนวคิดที่อยากให้ครัวเรือนในประเทศไทยมองเห็นสิ่งที่มี และค่อย ๆ เตรียมสิ่งที่จำเป็นสำหรับชีวิตประจำวัน</p><p>เราอยากช่วยให้บ้านอื่น ๆ เรียนรู้การผลิตพลังงาน การจัดหาน้ำดื่มที่ปลอดภัย และการปลูกอาหารหมุนเวียน เพื่อมุ่งสู่การพึ่งตนเองได้ตลอดปี โดยมีเครือข่ายที่พร้อมแลกเปลี่ยนความรู้และเลือกแบ่งปันกันตามความสมัครใจ</p><p class="about-footnote">การพึ่งตนเองตลอดปีเป็นเป้าหมายของโครงการ ไม่ใช่ผลที่ต้นแบบรับรองหรือสิ่งที่ทุกบ้านต้องทำได้เหมือนกัน</p></div>
    </section>

    <section class="about-pillars" data-about-section aria-labelledby="pillars-title">
      <p class="about-overline">02 / สามเสาหลัก</p><h2 id="pillars-title">ดูแลสิ่งจำเป็น เริ่มจากสิ่งใกล้ตัว</h2>
      <div class="pillar-grid">
        <article class="pillar-card"><div class="pillar-icon">${icon('food')}</div><span class="pillar-en">FOOD</span><h3>อาหาร</h3><p>รู้จักอาหารที่มี วางแผนปลูก เก็บรักษา และมีผลผลิตหมุนเวียนตามฤดูกาลสำหรับคนในบ้าน</p><small>จากอาหารสำรอง สู่การผลิตที่ต่อเนื่อง</small></article>
        <article class="pillar-card"><div class="pillar-icon">${icon('water')}</div><span class="pillar-en">WATER</span><h3>น้ำ</h3><p>เข้าใจปริมาณน้ำที่เก็บและใช้ วางแผนแหล่งน้ำ การสำรอง การบำบัด และตรวจสอบคุณภาพก่อนใช้ดื่ม</p><small>มีน้ำใช้ พร้อมใส่ใจความปลอดภัย</small></article>
        <article class="pillar-card"><div class="pillar-icon">${icon('energy')}</div><span class="pillar-en">ENERGY</span><h3>พลังงาน</h3><p>รู้จักการใช้ไฟของบ้าน สำรวจการผลิตพลังงานเอง และทางเลือกกักเก็บหรือสำรองที่เหมาะสม</p><small>เข้าใจทั้งการผลิต การใช้ และข้อจำกัด</small></article>
      </div>
    </section>

    <section class="about-process" data-about-section aria-labelledby="process-title">
      <div class="process-heading"><p class="about-overline">03 / เครือข่ายทำงานอย่างไร</p><h2 id="process-title">รู้จักบ้าน เตรียมพร้อม แล้วเชื่อมถึงกัน</h2><p>ไม่ต้องเริ่มจากการมีทุกอย่าง เริ่มจากข้อมูลที่รู้และสิ่งที่อยากเรียนรู้</p></div>
      <ol class="process-steps">
        <li><span class="step-number">01</span><h3>รู้จักบ้านตัวเอง</h3><p>สำรวจอาหาร น้ำ และพลังงาน ผ่านข้อมูลที่ครัวเรือนประเมินด้วยตนเอง เว้นช่องที่ยังไม่ทราบได้</p></li>
        <li><span class="step-number">02</span><h3>เตรียมพร้อม</h3><p>ใช้ข้อมูลเป็นจุดเริ่มต้นของการวางแผน และค้นหาแหล่งเรียนรู้ด้านที่อยากพัฒนาเพิ่มเติม</p></li>
        <li><span class="step-number">03</span><h3>เลือกแบ่งปัน</h3><p>แสดงความสนใจและสร้างรายการที่ต้องการเสนอด้วยตัวเอง ไม่มีการนำทรัพยากรสำรองไปแบ่งปันอัตโนมัติ</p></li>
      </ol>
      <div class="process-note"><strong>ข้อมูลเพื่อเรียนรู้ ไม่ใช่คำรับรองความพร้อม</strong><p>ค่าทรัพยากรเป็น self-assessment ระยะเวลาจริงอาจต่างจากประมาณการตามการใช้และฤดูกาล ตัวเลขน้ำไม่ยืนยันว่าน้ำดื่มได้ และยอดโซลาร์รายวันไม่รับรองว่าจะใช้ไฟได้เมื่อไฟดับ การเข้าร่วมและแบ่งปันเป็นไปโดยสมัครใจ</p></div>
    </section>

    <section class="about-invitation" data-about-section aria-labelledby="invitation-title">
      <p class="about-overline">04 / เริ่มจากบ้านของคุณ</p><h2 id="invitation-title">ก้าวเล็ก ๆ ของบ้านหนึ่งหลัง<br>อาจเป็นจุดเริ่มต้นของการเรียนรู้ร่วมกัน</h2><p>ลองสำรวจหมู่บ้าน หรือเพิ่มข้อมูลครัวเรือนเพื่อทดลองแนวคิดด้วยตัวคุณเอง</p>
      <div class="about-actions"><a class="about-button" href="#join">เข้าร่วมเครือข่าย <span aria-hidden="true">→</span></a><a class="about-button secondary" href="#">สำรวจหมู่บ้าน <span aria-hidden="true">→</span></a></div>
      <div class="about-prototype"><strong>สถานะปัจจุบัน: ต้นแบบทดลอง</strong><p>ผัง 3D เป็นแนวคิด ไม่ใช่ผังรับรองทางวิศวกรรม บ้านเริ่มต้นใช้ข้อมูลจำลอง บ้านที่เพิ่มใช้ข้อมูลที่คุณกรอกและเก็บเฉพาะเบราว์เซอร์นี้ ยังไม่มีบัญชีสมาชิก ฐานข้อมูลร่วม การส่งคำขอจริง หรือระบบชำระเงิน ความสนใจแบ่งปันไม่ยืนยันว่ามีทรัพยากรพร้อมส่ง</p></div>
    </section>`;
}
