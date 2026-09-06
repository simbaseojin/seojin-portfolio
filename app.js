/* =====================================================================
   이서진 / Product Leader renderer
   모든 콘텐츠는 content.json 에 있습니다. 이 파일은 그리기만 합니다.
   페이지 종류는 <body data-page="..."> 로 구분합니다.
   ===================================================================== */

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const el = (id) => document.getElementById(id);
const L = (a, f) => (a || []).map(f).join("");
const has = (a) => Array.isArray(a) && a.length > 0;
const linkify = (s) => esc(s).replace(
  /((?:https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?)/gi,
  (m) => `<a href="${m.startsWith("http") ? m : "https://" + m}" target="_blank" rel="noopener">${m}</a>`);

/* 이미지 파일이 아직 없을 때: 해당 칸을 숨기고, 그룹이 통째로 비면 라벨까지 숨긴다 */
function hideShot(img) {
  const fig = img.closest("figure");
  if (fig) fig.hidden = true;
  const grid = img.closest(".b-shots");
  if (grid && !grid.querySelector("figure:not([hidden])")) {
    const wrap = grid.closest(".b");
    if (wrap) wrap.hidden = true;
  }
}
window.hideShot = hideShot;

const PAGE = document.body.dataset.page;
const CASE = document.body.dataset.case;
/* ?open=all : 전체 섹션 펼쳐 보기 (검토, 인쇄용) */
const OPEN_ALL = new URLSearchParams(location.search).get("open") === "all";

/* ------------------------------------------------------------ CHROME */
function chrome(d) {
  const here = location.pathname.split("/").pop() || "index.html";
  el("nav").innerHTML = `
    <div class="nav__in">
      <a class="nav__brand" href="index.html">${esc(d.brand)}</a>
      <nav class="nav__links">
        ${L(d.nav, (n) => `<a href="${esc(n.href)}"${n.href === here ? ' class="on"' : ""}>${esc(n.label)}</a>`)}
      </nav>
    </div>`;
  el("footer").innerHTML = `
    <div class="footer__in">
      <span>${esc(d.footer.copy)}</span>
      <a href="${esc(d.footer.href)}">${esc(d.footer.cta)}</a>
    </div>`;
}

/* --------------------------------------------------------------- HOME */
function renderHome(d) {
  const h = d.home;
  el("main").innerHTML = `
    <section class="hero"><div class="wrap">
      <div class="hero__grid">
        <div>
          <div class="eyebrow rv">${esc(h.eyebrow)}</div>
          <h1 class="hero__h rv">${L(h.headline, (l) => esc(l) + "<br>")}</h1>
        </div>
        ${h.portrait ? `<img class="hero__portrait rv" src="${esc(h.portrait)}" alt="">` : ""}
      </div>
      <div class="hero__meta rv">
        <div class="hero__yrs">${esc(h.years)}</div>
        <div class="hero__dom">${esc(h.domains)}</div>
        <div class="hero__span">${esc(h.span)}</div>
      </div>
      <div class="hero__scroll rv">${esc(h.scroll)}</div>
    </div></section>

    <section class="sec"><div class="wrap">
      <div class="sec__label rv">${esc(h.journey.label)}</div>
      <h2 class="sec__title rv">${L(h.journey.title, (t) => esc(t) + "<br>")}</h2>
      <div class="jr">
        ${L(h.journey.items, (it) => `
          <div class="jr__row rv">
            <div class="jr__no">${esc(it.no)}</div>
            <div>
              <div class="jr__t">${esc(it.t)}</div>
              <div class="jr__d">${esc(it.d)}</div>
              <ul class="jr__p">${L(it.p, (x) => `<li>${esc(x)}</li>`)}</ul>
            </div>
          </div>`)}
      </div>
    </div></section>

    <section class="sec sec--tint"><div class="wrap">
      <div class="sec__label rv">${esc(h.principles.label)}</div>
      <div class="pr">
        ${L(h.principles.items, (p) => `
          <div class="rv"><div class="pr__no">${esc(p.no)}</div>
          <div class="pr__t">${L(p.t, (l) => esc(l) + "<br>")}</div></div>`)}
      </div>
    </div></section>`;
}

/* --------------------------------------------------------------- WORK */
function renderWork(d) {
  const w = d.work;
  el("main").innerHTML = `
    <div class="page"><div class="wrap">
      <h1 class="page__t rv">${esc(w.title)}</h1>
      <p class="page__d rv">${esc(w.desc)}</p>
      <div class="wk">
        ${L(w.items, (it) => `
          <a class="wk__item rv" href="${esc(it.href)}">
            <div>
              <div class="wk__no">${esc(it.no)}</div>
              <h2 class="wk__t">${L(it.title, (t) => esc(t) + "<br>")}</h2>
              <div class="wk__m">${esc(it.meta)}</div>
              <p class="wk__d">${esc(it.desc)}</p>
              <span class="wk__go">View case →</span>
            </div>
            <div class="wk__thumb wk__thumb--${esc(it.visual || "campaign")}">${L(it.thumbs || [it.thumb], (src) => `<img src="${esc(src)}" alt="" loading="lazy">`)}</div>
          </a>`)}
      </div>
    </div></div>`;
}

/* -------------------------------------------------------- CASE BLOCKS */
function block(b) {
  switch (b.t) {
    case "h":       return `<h3 class="b b-h">${esc(b.v)}</h3>`;
    case "p":       return `<p class="b b-p">${esc(b.v)}</p>`;
    case "quote":   return `<ul class="b b-quote">${L(b.items, (x) => `<li>${esc(x)}</li>`)}</ul>`;
    case "callout": return `<p class="b b-callout">${esc(b.v)}</p>`;
    case "list":    return `<div class="b">${b.label ? `<div class="b-list__lbl">${esc(b.label)}</div>` : ""}
                       <ul class="b-list">${L(b.items, (x) => `<li>${esc(x)}</li>`)}</ul></div>`;
    case "pairs":   return `<div class="b">${b.label ? `<div class="b-pairs__lbl">${esc(b.label)}</div>` : ""}
                       <dl class="b-pairs">${L(b.items, (x) => `<div><dt>${esc(x.k)}</dt><dd>${esc(x.v)}</dd></div>`)}</dl></div>`;
    case "tl":      return `<ol class="b b-tl">${L(b.items, (x) =>
                       `<li><span class="d">${esc(x.d)}</span><span class="t">${esc(x.t)}</span></li>`)}</ol>`;
    case "metrics": return `<ul class="b b-metrics">${L(b.items, (x) =>
                       `<li><span class="v">${esc(x.v)}</span><span class="l">${esc(x.l)}</span></li>`)}</ul>`;
    case "shots":   return `<div class="b">${b.label ? `<div class="b-shots__lbl">${esc(b.label)}</div>` : ""}
                    <div class="b-shots${b.layout ? " b-shots--" + esc(b.layout) : ""} n${Math.min(b.items.length, 4)}">${L(b.items, (g) => `
                       <figure>${g.tag ? `<span class="shot-tag">${esc(g.tag)}</span>` : ""}
                       <a class="shot-link${g.crop ? " shot-link--crop shot-link--" + esc(g.crop) : ""}" href="${esc(g.src)}" target="_blank" rel="noopener" aria-label="${esc(g.caption)}, 원본 이미지 새 탭에서 보기"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy" decoding="async" onerror="hideShot(this)"></a>
                       ${g.caption ? `<figcaption>${esc(g.caption)}${g.crop ? '<span class="shot-original">일부 화면 · 클릭하면 전체 보기</span>' : ""}</figcaption>` : ""}</figure>`)}</div></div>`;
    case "note":    return `<p class="b b-note">${linkify(b.v)}</p>`;
    case "todo":    return `<p class="b b-todo">${esc(b.v)}</p>`;
    default:        return "";
  }
}

function renderCase(d) {
  const c = d.cases[CASE];
  if (!c) { el("main").innerHTML = `<div class="page"><div class="wrap"><p>케이스를 찾을 수 없습니다.</p></div></div>`; return; }
  document.title = `${c.title} / 이서진`;

  const ids = Object.keys(d.cases);
  const i = ids.indexOf(CASE);
  const prev = i > 0 ? ids[i - 1] : null;
  const next = i < ids.length - 1 ? ids[i + 1] : null;

  const heroList = Array.isArray(c.hero) ? c.hero : (c.hero && c.hero.src ? [c.hero] : []);
  const hero = heroList.length ? `
    <div class="cs__hero rv${heroList.length > 1 ? " cs__hero--multi" : ""}">
      ${L(heroList, (g) => `<figure><img src="${esc(g.src)}" alt="" onerror="hideShot(this)">
        ${g.caption ? `<figcaption class="cs__cap">${esc(g.caption)}</figcaption>` : ""}</figure>`)}
    </div>` : "";

  const shotsTop = has(c.shotsTop) ? `
    <div class="cs__shotsTop rv">${L(c.shotsTop, (g) => `<img src="${esc(g.src)}" alt="" loading="lazy">`)}</div>` : "";

  el("main").innerHTML = `
    <div class="page"><div class="wrap">
      <a class="back" href="work.html">← Work</a>
      <div class="cs__eyebrow rv">${esc(c.no)}. ${esc(c.company)}</div>
      <h1 class="cs__t rv">${esc(c.title)}</h1>
      <div class="cs__pd rv">${esc(c.period)}${c.role ? ", " + esc(c.role) : ""}</div>
      ${c.lead ? `<p class="cs__lead rv">${esc(c.lead)}</p>` : ""}

      <div class="kpi rv">
        ${L(c.metrics, (m) => `
          <div><div class="kpi__v">${esc(m.v)}</div><div class="kpi__l">${esc(m.l)}</div>
          ${m.s ? `<div class="kpi__s">${esc(m.s)}</div>` : ""}</div>`)}
      </div>

      ${c.shotsTop ? shotsTop : hero}

      <div class="acc">
        ${L(c.sections, (s, n) => `
          <div class="acc__item rv${(OPEN_ALL) ? " open" : ""}">
            <button class="acc__btn" id="section-${n}-button" aria-controls="section-${n}" aria-expanded="${OPEN_ALL}">
              <span class="acc__no">${esc(s.no)}</span>
              <span class="acc__t">${esc(s.t)}<span class="acc__s">${esc(s.sub)}</span></span>
              <span class="acc__pm" aria-hidden="true"></span>
            </button>
            <div class="acc__panel" id="section-${n}" role="region" aria-labelledby="section-${n}-button" ${(OPEN_ALL) ? "" : "inert"}><div class="acc__inner"><div class="acc__body">
              ${L(s.blocks, block)}
            </div></div></div>
          </div>`)}
      </div>

      <nav class="csnav">
        <span>${prev ? `<a href="case-${prev}.html">← ${esc(d.cases[prev].title)}</a>` : ""}</span>
        <span>${next ? `<a href="case-${next}.html">${esc(d.cases[next].title)} →</a>` : ""}</span>
      </nav>
    </div></div>`;

  document.querySelectorAll(".acc__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".acc__item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      item.querySelector(".acc__panel").inert = !open;
    });
  });
}

/* -------------------------------------------------------------- ABOUT */
function renderAbout(d) {
  const a = d.about, e = a.education;
  el("main").innerHTML = `
    <div class="page"><div class="wrap">
      <h1 class="ab__t rv">${esc(a.title)}</h1>
      <p class="ab__body rv">${L(a.body, (l) => esc(l) + "<br>")}</p>
      <blockquote class="ab__creed rv">
        <p>“${esc(a.creed.line)}”</p><p>${esc(a.creed.body)}</p>
      </blockquote>

      <h2 class="h-sub rv" id="career">${esc(a.careerTitle)}</h2>
      <div class="cr">
        ${L(a.career, (r) => `
          <div class="cr__row rv">
            <div class="cr__pd">${esc(r.period)}</div>
            <div class="cr__co">${esc(r.company)}${r.role ? `<span class="cr__rl">${esc(r.role)}</span>` : ""}</div>
          </div>`)}
      </div>

      <h2 class="h-sub rv">${esc(a.eduTitle)}</h2>
      <div class="cr">
        <div class="cr__row rv">
          <div class="cr__pd">${esc(e.period)}</div>
          <div class="cr__co">${esc(e.school)}<span class="cr__rl">${esc(e.major)}</span></div>
        </div>
      </div>
    </div></div>`;
}

/* ------------------------------------------------------------- REVEAL */
function reveal() {
  const n = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window)) return n.forEach((x) => x.classList.add("in"));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -5% 0px", threshold: .02 });
  n.forEach((x) => io.observe(x));
  setTimeout(() => n.forEach((x) => x.classList.add("in")), 2200);
}

/* ---------------------------------------------------------------- BOOT */
fetch("content.json", { cache: "no-cache" })
  .then((r) => { if (!r.ok) throw new Error("content.json " + r.status); return r.json(); })
  .then((d) => {
    chrome(d);
    if (PAGE === "home") renderHome(d);
    else if (PAGE === "work") renderWork(d);
    else if (PAGE === "case") renderCase(d);
    else if (PAGE === "about") renderAbout(d);
    reveal();
    if (location.hash) {
      const t = document.querySelector(location.hash);
      if (t) requestAnimationFrame(() => t.scrollIntoView({ behavior: "instant", block: "start" }));
    }
  })
  .catch((err) => {
    console.error(err);
    el("main").innerHTML = `<div class="page"><div class="wrap"><p style="color:#DE4526">콘텐츠를 불러오지 못했습니다. content.json 의 JSON 문법을 확인해 주세요.<br><small>${esc(err.message)}</small></p></div></div>`;
  });
