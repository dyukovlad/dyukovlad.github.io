/* Все эффекты — прогрессивное улучшение: без JS страница полностью читаема. */
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Появление секций при скролле ===== */
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ===== Печатающаяся строка ролей ===== */
const roles = ['Senior Frontend Developer', 'Frontend Team Lead', 'React • TypeScript • Next.js'];
const typed = document.getElementById('typed');
if (typed && !reduceMotion) {
  let role = 0;
  let pos = roles[0].length;
  let deleting = true;
  function tick() {
    const word = roles[role];
    pos += deleting ? -1 : 1;
    typed.textContent = word.slice(0, pos);
    let delay = deleting ? 40 : 85;
    if (!deleting && pos === word.length) {
      deleting = true;
      delay = 2400;
    } else if (deleting && pos === 0) {
      deleting = false;
      role = (role + 1) % roles.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2400);
}

/* ===== Счётчики метрик ===== */
const nums = document.querySelectorAll('.metric-num');
function runCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) {
    el.textContent = prefix + target + suffix;
    return;
  }
  const start = performance.now();
  const duration = 1200;
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const metricsBlock = document.querySelector('.metrics');
if (metricsBlock && nums.length) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    nums.forEach(runCounter);
  } else {
    const mio = new IntersectionObserver(
      (entries, obs) => {
        if (entries.some((e) => e.isIntersecting)) {
          nums.forEach(runCounter);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    mio.observe(metricsBlock);
  }
}

/* ===== Canvas-«созвездие» в hero ===== */
const canvas = document.getElementById('bg');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  const mouse = { x: null, y: null };
  let w = 0;
  let h = 0;
  let points = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.offsetWidth;
    h = hero.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.floor((w * h) / 16000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }

  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  window.addEventListener('resize', resize);
  resize();

  const LINK_DIST = 110;
  const MOUSE_DIST = 150;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(61, 219, 180, 0.55)';
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.strokeStyle = 'rgba(61, 219, 180, ' + 0.16 * (1 - d / LINK_DIST) + ')';
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const dm = Math.hypot(points[i].x - mouse.x, points[i].y - mouse.y);
        if (dm < MOUSE_DIST) {
          ctx.strokeStyle = 'rgba(61, 219, 180, ' + 0.3 * (1 - dm / MOUSE_DIST) + ')';
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ===== vCard ===== */
const vcardBtn = document.getElementById('vcard');
if (vcardBtn) {
  vcardBtn.addEventListener('click', () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Дюков;Владислав;Николаевич;;',
      'FN:Владислав Дюков',
      'TITLE:Senior Frontend Developer',
      'TEL;TYPE=CELL:+79817380301',
      'EMAIL:dyukovlad@gmail.com',
      'URL:https://dyukovlad.github.io/',
      'END:VCARD',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([vcard], { type: 'text/vcard' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'vladislav-dyukov.vcf' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

/* ===== Копирование телефона ===== */
const copyBtn = document.getElementById('copy-phone');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('+7 981 738-03-01');
      const original = copyBtn.textContent;
      copyBtn.textContent = 'скопировано ✓';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1600);
    } catch {
      /* буфер обмена недоступен — молча пропускаем */
    }
  });
}

/* ===== Звёзды GitHub (не показываем, если 0 или API недоступен) ===== */
document.querySelectorAll('.stars[data-repo]').forEach(async (el) => {
  try {
    const res = await fetch('https://api.github.com/repos/' + el.dataset.repo);
    if (!res.ok) return;
    const data = await res.json();
    if (data.stargazers_count > 0) el.textContent = '★ ' + data.stargazers_count;
  } catch {
    /* API недоступен — карточка остаётся без звёзд */
  }
});
