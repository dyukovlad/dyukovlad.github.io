# План реализации: персональный сайт-резюме dyukovlad.github.io

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить index.html на одностраничный тёмный dev-сайт-резюме с данными из PDF, canvas-эффектом, таймлайном опыта и витриной GitHub-проектов.

**Architecture:** Три статических файла в корне репозитория (`index.html` — весь контент, `styles.css` — тема, `script.js` — прогрессивные эффекты) плюс `resume.pdf`. Без сборки и зависимостей; GitHub Pages отдаёт файлы как есть.

**Tech Stack:** Ванильные HTML5 / CSS3 / ES2020, Canvas 2D, IntersectionObserver, GitHub REST API (только звёзды, с graceful fallback).

## Global Constraints

- Никаких сборщиков, npm-зависимостей и внешних загрузок (шрифты — системные стеки).
- Все файлы — в корне репозитория `/Users/dyukovlad/dev/github/dyukovlad.github.io`; папку `budgety/` не трогать.
- Источник данных — PDF-резюме; НЕ переносить из старого сайта: «15 лет+», NestJS, MSSQL.
- Язык страницы — только русский, `lang="ru"`.
- Контент полностью читаем без JavaScript; все анимации отключаются при `prefers-reduced-motion: reduce`.
- Палитра: фон `#0b0f14`, текст `#e8eef7`, приглушённый `#8b97a8`, акцент `#3ddbb4`, рамки `rgba(255,255,255,0.08)`.
- Контакты: Telegram `https://t.me/dyukovlad`, GitHub `https://github.com/dyukovlad`, email `dyukovlad@gmail.com`, телефон `+7 (981) 738-03-01` (tel:+79817380301), Setka `https://set.ki/bfeQ5ZS`.
- Коммиты после каждой задачи; `git push` — только после явного подтверждения пользователя.

---

### Task 1: index.html с полным контентом + resume.pdf

**Files:**
- Create (перезапись): `index.html`
- Create: `resume.pdf` (копия `/Users/dyukovlad/Документы/Резюме/Frontend Developer Дюков Владислав Николаевич.pdf`)

**Interfaces:**
- Produces: id `bg` (canvas), `typed`, `vcard`, `copy-phone`; классы `reveal`, `metrics`, `metric-num[data-count|data-suffix]`, `stars[data-repo]` — их используют Task 2 (стили) и Task 3 (скрипт). Подключает `styles.css` и `script.js` (defer).

- [ ] **Step 1: Скопировать PDF в репозиторий**

```bash
cp "/Users/dyukovlad/Документы/Резюме/Frontend Developer Дюков Владислав Николаевич.pdf" \
   "/Users/dyukovlad/dev/github/dyukovlad.github.io/resume.pdf"
```

- [ ] **Step 2: Записать index.html целиком**

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Владислав Дюков — Senior Frontend Developer</title>
  <meta name="description" content="Senior Frontend Developer / Frontend Team Lead с 11+ годами опыта. React, TypeScript, Next.js, микрофронтенды. Санкт-Петербург." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ru_RU" />
  <meta property="og:title" content="Владислав Дюков — Senior Frontend Developer" />
  <meta property="og:description" content="11+ лет опыта: SaaS-платформы, микрофронтенды, команды до 10 разработчиков. React, TypeScript, Next.js." />
  <meta property="og:url" content="https://dyukovlad.github.io/" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230b0f14'/><text x='50' y='70' font-size='52' text-anchor='middle' fill='%233ddbb4' font-family='monospace'>&#10095;_</text></svg>" />
  <link rel="stylesheet" href="styles.css" />
  <script src="script.js" defer></script>
</head>
<body>

<header class="hero">
  <canvas id="bg" aria-hidden="true"></canvas>
  <div class="container hero-inner">
    <p class="hero-hello mono">// привет, я</p>
    <h1 class="hero-name">Владислав<br />Дюков</h1>
    <p class="hero-role mono"><span id="typed">Senior Frontend Developer</span><span class="cursor" aria-hidden="true">▌</span></p>
    <p class="hero-lead">11+ лет делаю сложные веб-приложения быстрыми и понятными: SaaS-платформы, микрофронтенды, команды до 10 разработчиков. Санкт-Петербург.</p>
    <ul class="chips">
      <li><a class="chip" href="https://t.me/dyukovlad" target="_blank" rel="noopener">tg: @dyukovlad</a></li>
      <li><a class="chip" href="https://github.com/dyukovlad" target="_blank" rel="noopener">github.com/dyukovlad</a></li>
      <li><a class="chip" href="mailto:dyukovlad@gmail.com">dyukovlad@gmail.com</a></li>
      <li><a class="chip" href="tel:+79817380301">+7 (981) 738-03-01</a></li>
      <li><button class="chip chip-btn" id="copy-phone" type="button">⧉ копировать номер</button></li>
      <li><a class="chip" href="https://set.ki/bfeQ5ZS" target="_blank" rel="noopener">setka</a></li>
    </ul>
    <div class="actions">
      <a class="btn btn-primary" href="resume.pdf" download="Дюков Владислав — Frontend Developer.pdf">↓ Скачать резюме (PDF)</a>
      <button class="btn btn-ghost" id="vcard" type="button">+ Сохранить контакт (vCard)</button>
    </div>
  </div>
</header>

<main>
  <section id="about" class="section reveal">
    <div class="container">
      <h2 class="section-title mono">// обо мне</h2>
      <p class="about-text">Senior Frontend Developer / Frontend Team Lead с 11+ годами опыта разработки высоконагруженных веб-приложений, SaaS-платформ и корпоративных информационных систем. Эксперт в React, TypeScript, Next.js и архитектуре frontend-приложений. Управлял командами до 10 разработчиков, внедрял Micro Frontend архитектуру, автоматизировал процессы разработки и выводил продукты с нуля до production.</p>
    </div>
  </section>

  <section class="section reveal" aria-label="Ключевые метрики">
    <div class="container">
      <div class="metrics">
        <div class="metric"><span class="metric-num" data-count="11" data-suffix="+">11+</span><span class="metric-label">лет опыта</span></div>
        <div class="metric"><span class="metric-num" data-count="10" data-prefix="до ">до 10</span><span class="metric-label">человек в команде</span></div>
        <div class="metric"><span class="metric-num" data-count="80" data-prefix="+" data-suffix="%">+80%</span><span class="metric-label">к скорости релизов</span></div>
        <div class="metric"><span class="metric-num" data-count="60" data-suffix="+">60+</span><span class="metric-label">проектов</span></div>
      </div>
    </div>
  </section>

  <section id="experience" class="section reveal">
    <div class="container">
      <h2 class="section-title mono">// опыт работы</h2>
      <div class="timeline">
        <article class="job">
          <h3 class="job-title">Frontend-разработчик</h3>
          <p class="job-meta mono">июнь 2024 — настоящее время</p>
          <ul class="job-list">
            <li>Платформа кибербезопасности на React, Next.js и TypeScript: международная локализация, защищённая маршрутизация, автогенерация API-клиента через OpenAPI.</li>
            <li>Аналитическая платформа геоданных: интерактивные карты, тепловые зоны и визуализация на Leaflet, D3.js и Three.js.</li>
            <li>B2B-платформа управления оборудованием и заказами на React, Redux Toolkit и TypeScript.</li>
            <li>Система электронного документооборота с OCR, AI-ассистентом и версионностью документов для нефтегазовой компании.</li>
            <li>Система мониторинга аномалий с интерактивными дашбордами и данными в реальном времени.</li>
            <li>Внедрил архитектуру Feature-Sliced Design — выше масштабируемость и поддерживаемость кода.</li>
          </ul>
        </article>
        <article class="job">
          <h3 class="job-title">Frontend Team Lead / Senior Frontend Developer <span class="job-company">— ООО «Гаскар групп»</span></h3>
          <p class="job-meta mono">февраль 2020 — июнь 2024 · Москва</p>
          <ul class="job-list">
            <li>Руководил командой из 10 разработчиков: платформа мониторинга персонала на базе смарт-часов.</li>
            <li>Спроектировал frontend-архитектуру на React, TypeScript, TanStack Query и Material UI.</li>
            <li>Внедрил Micro Frontend на Module Federation — выпуск новых функций ускорился на 80%.</li>
            <li>Разработал корпоративный UI Kit: 40+ переиспользуемых компонентов в Storybook.</li>
            <li>Автоматизировал интеграцию API через OpenAPI Generator — время разработки сократилось на 40%.</li>
            <li>Выстроил автоматизированное тестирование: 60% unit- и 40% интеграционного покрытия.</li>
            <li>Разработал модуль электронной подписи (ЭЦП) и интегрировал PDFTron для цифровых документов.</li>
          </ul>
        </article>
        <article class="job">
          <h3 class="job-title">Frontend-разработчик</h3>
          <p class="job-meta mono">август 2019 — февраль 2020 · Казань</p>
          <ul class="job-list">
            <li>Разработал систему онлайн-оплаты для транспортного портала города Казань.</li>
            <li>Сократил количество повторных рендеров React-компонентов на 25%.</li>
            <li>Интегрировал современные React-модули в legacy-систему на Twig.</li>
            <li>Создал UI Kit на базе Material UI и Storybook.</li>
          </ul>
        </article>
        <article class="job">
          <h3 class="job-title">Frontend-разработчик <span class="job-company">— Сейлтекс</span></h3>
          <p class="job-meta mono">август 2014 — август 2019 · Санкт-Петербург</p>
          <ul class="job-list">
            <li>Разработал 60+ коммерческих проектов: корпоративные порталы, интернет-магазины, SaaS-приложения.</li>
            <li>Внедрял решения на React, Vue.js, Laravel, Django и WordPress.</li>
            <li>Автоматизировал сборку и деплой с использованием Webpack, Gulp и Bash.</li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <section id="skills" class="section reveal">
    <div class="container">
      <h2 class="section-title mono">// навыки</h2>
      <div class="skill-group">
        <span class="skill-name">frontend</span>
        <ul class="tags"><li class="tag">React</li><li class="tag">Vue 3</li><li class="tag">TypeScript</li><li class="tag">Next.js</li><li class="tag">HTML5</li><li class="tag">CSS3</li><li class="tag">ES6+</li><li class="tag">SSR</li></ul>
      </div>
      <div class="skill-group">
        <span class="skill-name">state &amp; data</span>
        <ul class="tags"><li class="tag">Redux</li><li class="tag">TanStack Query</li><li class="tag">GraphQL</li><li class="tag">REST API</li><li class="tag">WebSockets</li></ul>
      </div>
      <div class="skill-group">
        <span class="skill-name">backend &amp; db</span>
        <ul class="tags"><li class="tag">Node.js</li><li class="tag">Bun</li><li class="tag">Python</li><li class="tag">PostgreSQL</li><li class="tag">MongoDB</li><li class="tag">SQL</li></ul>
      </div>
      <div class="skill-group">
        <span class="skill-name">tooling &amp; devops</span>
        <ul class="tags"><li class="tag">Docker</li><li class="tag">Git</li><li class="tag">Bash</li><li class="tag">Webpack</li><li class="tag">CI/CD</li><li class="tag">Material Design</li></ul>
      </div>
    </div>
  </section>

  <section id="projects" class="section reveal">
    <div class="container">
      <h2 class="section-title mono">// проекты на github</h2>
      <div class="projects">
        <a class="project" href="https://github.com/dyukovlad/atomx" target="_blank" rel="noopener">
          <h3 class="project-name">/atomx</h3>
          <p class="project-desc">Быстрый реактивный state-менеджер без привязки к фреймворку.</p>
          <p class="project-foot"><span><span class="lang-dot" aria-hidden="true"></span>TypeScript</span><span class="stars" data-repo="dyukovlad/atomx"></span></p>
        </a>
        <a class="project" href="https://github.com/dyukovlad/the-last-of-guss" target="_blank" rel="noopener">
          <h3 class="project-name">/the-last-of-guss</h3>
          <p class="project-desc">Браузерная мультиплеерная игра-кликер с раундами и таблицей лидеров.</p>
          <p class="project-foot"><span><span class="lang-dot" aria-hidden="true"></span>TypeScript</span><span class="stars" data-repo="dyukovlad/the-last-of-guss"></span></p>
        </a>
        <a class="project" href="https://github.com/dyukovlad/spirit-nexus" target="_blank" rel="noopener">
          <h3 class="project-name">/spirit-nexus</h3>
          <p class="project-desc">Веб-приложение на Next.js (App Router) и TypeScript.</p>
          <p class="project-foot"><span><span class="lang-dot" aria-hidden="true"></span>TypeScript</span><span class="stars" data-repo="dyukovlad/spirit-nexus"></span></p>
        </a>
        <a class="project" href="https://github.com/dyukovlad/trading-lab-starter" target="_blank" rel="noopener">
          <h3 class="project-name">/trading-lab-starter</h3>
          <p class="project-desc">Стартер торговой лаборатории на TypeScript и Vite.</p>
          <p class="project-foot"><span><span class="lang-dot" aria-hidden="true"></span>TypeScript</span><span class="stars" data-repo="dyukovlad/trading-lab-starter"></span></p>
        </a>
      </div>
    </div>
  </section>

  <section id="education" class="section reveal">
    <div class="container">
      <h2 class="section-title mono">// образование</h2>
      <div class="edu">
        <div class="edu-item">
          <h3 class="edu-title">Казанский (Приволжский) федеральный университет</h3>
          <p class="edu-meta mono">бакалавр · Институт вычислительной математики и ИТ · 2016</p>
        </div>
        <div class="edu-item">
          <h3 class="edu-title">Бугульминский машиностроительный техникум</h3>
          <p class="edu-meta mono">информационные технологии · 2008</p>
        </div>
      </div>
      <p class="langs">русский — родной · английский — B1</p>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container">
    <ul class="chips">
      <li><a class="chip" href="https://t.me/dyukovlad" target="_blank" rel="noopener">tg: @dyukovlad</a></li>
      <li><a class="chip" href="mailto:dyukovlad@gmail.com">dyukovlad@gmail.com</a></li>
      <li><a class="chip" href="https://github.com/dyukovlad" target="_blank" rel="noopener">github.com/dyukovlad</a></li>
    </ul>
    <p>© 2026 Владислав Дюков</p>
    <p class="footer-note mono">чистый HTML/CSS/JS, без фреймворков · <a href="https://github.com/dyukovlad/dyukovlad.github.io" target="_blank" rel="noopener">исходники</a></p>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 3: Проверить, что контент на месте**

```bash
cd /Users/dyukovlad/dev/github/dyukovlad.github.io
grep -c 'class="job"' index.html          # ожидается: 4
grep -c 'class="project"' index.html      # ожидается: 4
grep -o 'resume.pdf' index.html | head -1 # ожидается: resume.pdf
ls -la resume.pdf                          # файл существует, ~44KB
```

- [ ] **Step 4: Commit**

```bash
git add index.html resume.pdf
git commit -m "feat: разметка сайта-резюме с полным контентом из PDF"
```

---

### Task 2: styles.css — тёмная тема, компоненты, печать

**Files:**
- Create: `styles.css`

**Interfaces:**
- Consumes: классы и id из Task 1 (`hero`, `chips`, `btn*`, `section*`, `metrics`, `timeline`, `job*`, `skill-group`, `tags`, `projects`, `edu*`, `footer`, `reveal`, `mono`, `cursor`).
- Produces: класс `.js .reveal` / `.visible` — Task 3 добавляет `js` на `<html>` и `visible` на секции.

- [ ] **Step 1: Записать styles.css целиком**

```css
/* ===== Токены ===== */
:root {
  --bg: #0b0f14;
  --surface: rgba(255, 255, 255, 0.03);
  --border: rgba(255, 255, 255, 0.08);
  --text: #e8eef7;
  --muted: #8b97a8;
  --accent: #3ddbb4;
  --accent-dim: rgba(61, 219, 180, 0.12);
  --mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.mono { font-family: var(--mono); }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
.container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

/* ===== Hero ===== */
.hero { position: relative; min-height: 92vh; display: flex; align-items: center; overflow: hidden; }
#bg { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero-inner { position: relative; padding: 96px 0 64px; }
.hero-hello { color: var(--accent); font-size: 15px; margin: 0 0 12px; }
.hero-name { font-size: clamp(44px, 9vw, 88px); line-height: 1.02; letter-spacing: -0.02em; margin: 0 0 18px; }
.hero-role { font-size: clamp(16px, 2.6vw, 22px); color: var(--muted); margin: 0 0 20px; min-height: 1.6em; }
#typed { color: var(--text); }
.cursor { color: var(--accent); animation: blink 1.06s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.hero-lead { max-width: 560px; color: var(--muted); margin: 0 0 28px; }

/* ===== Чипы контактов ===== */
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 28px; padding: 0; list-style: none; }
.chip {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--mono); font-size: 13px; color: var(--muted);
  border: 1px solid var(--border); border-radius: 999px; padding: 7px 14px;
  background: var(--surface); transition: border-color 0.2s, color 0.2s;
}
a.chip:hover, .chip-btn:hover { color: var(--accent); border-color: var(--accent); text-decoration: none; }
.chip-btn { cursor: pointer; }

/* ===== Кнопки ===== */
.actions { display: flex; flex-wrap: wrap; gap: 14px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 14px; padding: 12px 22px;
  border-radius: 10px; border: 1px solid var(--accent); cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
}
.btn-primary { background: var(--accent); color: #06251c; font-weight: 700; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(61, 219, 180, 0.25); text-decoration: none; }
.btn-ghost { background: transparent; color: var(--accent); }
.btn-ghost:hover { background: var(--accent-dim); transform: translateY(-2px); }

/* ===== Секции ===== */
.section { padding: 72px 0; border-top: 1px solid var(--border); }
.section-title { font-size: 15px; color: var(--accent); letter-spacing: 0.08em; margin: 0 0 32px; }
.about-text { max-width: 720px; font-size: 18px; margin: 0; }

/* ===== Метрики ===== */
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.metric { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px 18px; text-align: center; }
.metric-num { display: block; font-family: var(--mono); font-size: clamp(28px, 4vw, 40px); font-weight: 700; color: var(--accent); }
.metric-label { font-size: 13px; color: var(--muted); }

/* ===== Таймлайн ===== */
.timeline { position: relative; padding-left: 32px; }
.timeline::before {
  content: ""; position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px;
  background: linear-gradient(var(--accent), transparent); opacity: 0.35;
}
.job { position: relative; padding-bottom: 44px; }
.job:last-child { padding-bottom: 0; }
.job::before {
  content: ""; position: absolute; left: -32px; top: 8px;
  width: 12px; height: 12px; border-radius: 50%;
  border: 2px solid var(--accent); background: var(--bg);
}
.job-title { font-size: 20px; margin: 0 0 4px; }
.job-company { color: var(--accent); font-weight: 400; }
.job-meta { font-size: 13px; color: var(--muted); margin: 0 0 14px; }
.job-list { margin: 0; padding: 0; list-style: none; color: var(--muted); }
.job-list li { position: relative; padding-left: 20px; margin: 8px 0; }
.job-list li::before { content: "▸"; position: absolute; left: 0; color: var(--accent); }

/* ===== Навыки ===== */
.skill-group { display: grid; grid-template-columns: 180px 1fr; gap: 16px; padding: 18px 0; border-bottom: 1px dashed var(--border); }
.skill-group:last-of-type { border-bottom: none; }
.skill-name { font-family: var(--mono); font-size: 13px; color: var(--muted); padding-top: 6px; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.tag {
  font-family: var(--mono); font-size: 13px; color: var(--text);
  background: var(--surface); border: 1px solid var(--border);
  padding: 5px 12px; border-radius: 7px; transition: border-color 0.2s, color 0.2s;
}
.tag:hover { border-color: var(--accent); color: var(--accent); }

/* ===== Проекты ===== */
.projects { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.project {
  display: block; background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 22px; color: var(--text);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.project:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35); text-decoration: none; }
.project-name { font-family: var(--mono); font-size: 16px; color: var(--accent); margin: 0 0 8px; }
.project-desc { color: var(--muted); font-size: 14.5px; margin: 0 0 16px; }
.project-foot { display: flex; gap: 16px; font-family: var(--mono); font-size: 12.5px; color: var(--muted); margin: 0; }
.lang-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #3178c6; margin-right: 6px; }

/* ===== Образование ===== */
.edu { display: grid; gap: 14px; max-width: 720px; }
.edu-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 22px; }
.edu-title { margin: 0 0 4px; font-size: 16px; }
.edu-meta { font-family: var(--mono); font-size: 13px; color: var(--muted); margin: 0; }
.langs { margin: 22px 0 0; color: var(--muted); font-family: var(--mono); font-size: 14px; }

/* ===== Футер ===== */
.footer { border-top: 1px solid var(--border); padding: 48px 0 40px; text-align: center; color: var(--muted); font-size: 14px; }
.footer .chips { justify-content: center; margin-bottom: 20px; }
.footer-note { font-size: 12.5px; margin-top: 10px; }

/* ===== Появление при скролле (только с JS) ===== */
.js .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.js .reveal.visible { opacity: 1; transform: none; }

/* ===== Мобильная адаптация ===== */
@media (max-width: 760px) {
  .metrics { grid-template-columns: repeat(2, 1fr); }
  .projects { grid-template-columns: 1fr; }
  .skill-group { grid-template-columns: 1fr; gap: 8px; }
  .skill-name { padding-top: 0; }
  .section { padding: 56px 0; }
}

/* ===== Reduced motion ===== */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .js .reveal { opacity: 1; transform: none; transition: none; }
  .cursor { animation: none; }
  .btn, .project, .tag, .chip { transition: none; }
}

/* ===== Печать ===== */
@media print {
  :root {
    --bg: #fff; --text: #111; --muted: #444; --accent: #0a7f65;
    --surface: #fff; --border: #ddd; --accent-dim: transparent;
  }
  body { background: #fff; }
  #bg, .actions, .chip-btn, .cursor, .footer-note { display: none !important; }
  .hero { min-height: auto; }
  .hero-inner { padding: 24px 0; }
  .section { padding: 24px 0; page-break-inside: avoid; }
  .js .reveal { opacity: 1 !important; transform: none !important; }
  .project:hover, .btn-primary:hover { transform: none; box-shadow: none; }
  a { color: #0a7f65; }
}
```

- [ ] **Step 2: Проверить в браузере**

```bash
cd /Users/dyukovlad/dev/github/dyukovlad.github.io && python3 -m http.server 8000
```

Открыть `http://localhost:8000`: тёмная тема, все секции стилизованы, на ширине 375px нет горизонтального скролла (проверить через `document.documentElement.scrollWidth <= window.innerWidth`).

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: тёмная dev-тема — таймлайн, метрики, карточки, печать, адаптив"
```

---

### Task 3: script.js — эффекты, vCard, звёзды GitHub

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: id `bg`, `typed`, `vcard`, `copy-phone`; классы `reveal`, `metrics`, `metric-num`, `stars[data-repo]` из Task 1; классы `.js`/`.visible` из Task 2.
- Produces: ничего для последующих задач.

- [ ] **Step 1: Записать script.js целиком**

```js
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
```

- [ ] **Step 2: Проверить эффекты в браузере**

На `http://localhost:8000`: canvas-частицы двигаются и тянутся к курсору; строка ролей перепечатывается; секции появляются при скролле; счётчики анимируются; кнопка vCard скачивает `.vcf`; «копировать номер» меняется на «скопировано ✓»; в консоли нет ошибок.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: canvas-созвездие, typing-эффект, счётчики, vCard и звёзды GitHub"
```

---

### Task 4: Финальная проверка (QA)

**Files:** нет изменений (если найдены дефекты — правки в соответствующих файлах + отдельный коммит `fix: ...`).

- [ ] **Step 1: Десктоп-скриншот** — Playwright: `http://localhost:8000`, 1440×900, полный скриншот; визуально проверить все секции.
- [ ] **Step 2: Мобильный скриншот** — resize 390×844; проверить одну колонку и отсутствие горизонтального скролла: `document.documentElement.scrollWidth <= window.innerWidth` → `true`.
- [ ] **Step 3: Проверка ссылок и кнопок** — `resume.pdf` отдаётся сервером (HTTP 200), все внешние ссылки ведут на нужные URL.
- [ ] **Step 4: Показать результат пользователю и спросить про `git push`** — деплой на GitHub Pages только после подтверждения.
