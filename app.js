/* =========================================================================
   이서진 Portfolio — Renderer
   content.json 을 읽어 전체 페이지를 그린다. 콘텐츠 수정은 content.json 만 고치면 됨.
   ========================================================================= */

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const el = (id) => document.getElementById(id);

// 회사 → 2글자 모노그램 (카드 워터마크용)
const MONOGRAM = {
  "번개장터": "BJ", "SK플래닛 / 11번가": "11", "티몬": "TM",
  "신세계 I&C": "SH", "SK커뮤니케이션즈": "SK", "스타벅스 코리아": "ST"
};
const mono = (c) => MONOGRAM[c] || (c || "").slice(0, 2).toUpperCase();

let DATA = null;

async function boot() {
  DATA = await fetch("content.json?v=" + Date.now()).then((r) => r.json());
  document.title = DATA.meta.title;
  renderNav();
  renderHero();
  renderCareer();
  renderProjects();
  renderAI();
  renderTrajectory();
  renderContact();
  wireNavScroll();
  wireReveal();
}

/* ---------------- NAV ---------------- */
function renderNav() {
  const n = DATA.nav.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("");
  el("nav").innerHTML = `
    <a class="nav__brand" href="#top">
      <img class="nav__mark" src="assets/sj-mark.png" alt="">
      <span class="nav__name"><b>${esc(DATA.brand.name)}</b><span>${esc(DATA.brand.sub)}</span></span>
    </a>
    <nav class="nav__links" id="navLinks">${n}</nav>
    <a class="nav__cta" href="#contact">Contact <span aria-hidden="true">↗</span></a>
    <button class="nav__toggle" id="navToggle" aria-label="메뉴">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>`;
  el("navToggle").addEventListener("click", () => el("navLinks").classList.toggle("open"));
  el("navLinks").addEventListener("click", (e) => { if (e.target.tagName === "A") el("navLinks").classList.remove("open"); });
}

/* ---------------- HERO ---------------- */
function renderHero() {
  const h = DATA.hero;
  const title = h.headline.map((l) => `<span class="${l.accent ? "coral" : ""}">${esc(l.text)}</span>`).join("");
  const stats = h.stats.map((s, i) => `
    <div class="hero__stat ${i === 2 || i === 3 ? "accent" : ""}">
      <b>${esc(s.value)}</b><span>${esc(s.label)}</span>
    </div>`).join("");
  const flow = h.flow.steps.map((s, i) => `
    ${i > 0 ? '<span class="hero__flow-arrow">→</span>' : ""}
    <div class="hero__flow-step"><small>${esc(s.stage)}</small><b>${esc(s.label)}</b></div>`).join("");
  el("hero").innerHTML = `
    <div class="hero__bg"><img src="assets/hero-system.webp" alt=""></div>
    <div class="hero__grid-lines"></div>
    <div class="hero__side">${h.eyebrow.map(esc).join("</span><span>")}</div>
    <div class="wrap">
      <div class="hero__main">
        <div>
          <div class="hero__kicker eyebrow">${esc(h.kicker)}</div>
          <h1 class="hero__title">${title}</h1>
          <p class="hero__summary">${esc(h.summary)}</p>
          <a class="hero__cta mono" href="#career">${esc(h.cta)}</a>
        </div>
        <div class="hero__stats">${stats}</div>
      </div>
    </div>
    <div class="hero__flow"><div class="wrap"><div class="hero__flow-inner">
      <span class="hero__flow-label">${esc(h.flow.label)}</span>${flow}
    </div></div></div>`;
}

/* ---------------- CAREER SYSTEM ---------------- */
function projectCard(p) {
  const list = (arr) => arr.map((x) => `<li>${esc(x)}</li>`).join("");
  const did = p.whatIDid && p.whatIDid.length
    ? `<div class="pcard__block"><h4>WHAT I DID</h4><ul>${list(p.whatIDid)}</ul></div>` : "";
  const out = p.outcome && p.outcome.length
    ? `<div class="pcard__block outcome"><h4>OUTCOME</h4><ul>${list(p.outcome)}</ul></div>` : "";
  const tags = (p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  return `<article class="pcard reveal">
    <div class="pcard__mono">${esc(mono(p.company))}</div>
    <div class="pcard__date mono">${esc(p.date)}</div>
    <div class="pcard__company">${esc(p.company)}</div>
    <div class="pcard__role">${esc(p.role)}</div>
    <h3 class="pcard__title">${esc(p.title)}</h3>
    <p class="pcard__desc">${esc(p.desc)}</p>
    ${did}${out}
    <div class="pcard__tags">${tags}</div>
  </article>`;
}

function renderCareer() {
  const c = DATA.careerSystem;
  el("career-head").innerHTML = `
    <div class="section__label eyebrow">${esc(c.sectionNo)} / ${esc(c.sectionLabel)}</div>
    <h2 class="section__title">${c.title.map((t) => `<span>${esc(t)}</span>`).join("")}</h2>
    <p class="section__desc">${esc(c.desc)}</p>`;

  const vCap = c.views.capability, vCo = c.views.company;
  el("career-ctl").innerHTML = `
    <div class="viewctl">
      <div class="viewctl__bar"><small>VIEW CONTROL</small><small id="viewMode">${esc(vCap.mode)}</small></div>
      <div class="viewctl__tabs">
        <button class="viewctl__tab active" data-view="capability"><span class="check">✓</span> ${esc(vCap.label)}</button>
        <button class="viewctl__tab" data-view="company"><span class="check">✓</span> ${esc(vCo.label)}</button>
      </div>
    </div>
    <div class="viewctl__note" id="viewNote">${esc(vCap.note)}</div>
    <div class="groupmeta" id="groupMeta"><small id="groupSub">${esc(vCap.sub)}</small><p id="groupSubDesc">${esc(vCap.subDesc)}</p></div>`;

  document.querySelectorAll(".viewctl__tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".viewctl__tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderClusters(btn.dataset.view);
    });
  });
  renderClusters("capability");
}

function renderClusters(view) {
  const c = DATA.careerSystem;
  const v = c.views[view];
  el("viewMode").textContent = v.mode;
  el("viewNote").textContent = v.note;
  el("groupSub").textContent = v.sub;
  el("groupSubDesc").textContent = v.subDesc;

  let clusters;
  if (view === "capability") {
    clusters = c.capabilities.map((g) => ({ no: g.no, title: g.title, desc: g.desc, projects: g.projects }));
  } else {
    // 회사별 그룹핑: 모든 프로젝트를 회사 기준으로 재정렬 (최신 회사 순)
    const order = ["번개장터", "스타벅스 코리아", "SK플래닛 / 11번가", "티몬", "신세계 I&C", "SK커뮤니케이션즈"];
    const byCo = {};
    c.capabilities.forEach((g) => g.projects.forEach((p) => { (byCo[p.company] = byCo[p.company] || []).push(p); }));
    clusters = order.filter((co) => byCo[co]).map((co, i) => ({
      no: String(i + 1).padStart(2, "0"), title: co,
      desc: byCo[co].length + "개 프로젝트", projects: byCo[co]
    }));
  }

  el("career-clusters").innerHTML = clusters.map((g) => `
    <div class="cluster">
      <div class="cluster__head">
        <span class="cluster__no">${esc(g.no)}</span>
        <div class="cluster__info"><h3>${esc(g.title)}</h3><p>${esc(g.desc)}</p></div>
        <span class="cluster__count">${g.projects.length} PROJECTS</span>
      </div>
      <div class="cards">${g.projects.map(projectCard).join("")}</div>
    </div>`).join("");
  wireReveal();
}

/* ---------------- SELECTED PROJECTS ---------------- */
function renderProjects() {
  const s = DATA.selectedProjects;
  el("projects-head").innerHTML = `
    <div class="section__label eyebrow">${esc(s.sectionNo)} / ${esc(s.sectionLabel)}</div>
    <h2 class="section__title">${s.title.map((t) => `<span>${esc(t)}</span>`).join("")}</h2>
    <p class="section__desc">${esc(s.desc)}</p>`;

  el("cases").innerHTML = s.cases.map((cs, i) => `
    <article class="case reveal">
      <div class="case__no">${esc(cs.no)}</div>
      <div class="case__cat">${esc(cs.no)} / ${esc(cs.category)}</div>
      <div class="case__badge">${esc(cs.badge)}</div>
      <div class="case__flow">${esc(cs.flow)}</div>
      <h3 class="case__title">${esc(cs.title)}</h3>
      <p class="case__desc">${esc(cs.desc)}</p>
      <div class="case__meta">
        <div><small>CONTEXT</small><b>${esc(cs.period)}</b></div>
        <div class="res"><small>RESULT</small><b>${esc(cs.result)}</b></div>
      </div>
      <button class="case__open mono" data-case="${i}">OPEN CASE <span aria-hidden="true">↗</span></button>
    </article>`).join("");

  document.querySelectorAll(".case__open").forEach((b) =>
    b.addEventListener("click", () => openCase(+b.dataset.case)));
  wireReveal();
}

function openCase(i) {
  const cs = DATA.selectedProjects.cases[i];
  const d = cs.detail || {};
  const secs = (d.sections || []).map((x) => `
    <div class="modal__sec"><div class="modal__sec-no mono">${esc(x.no)}</div>
      <div><h4>${esc(x.title)}</h4><p>${esc(x.body)}</p></div></div>`).join("");
  const gallery = (d.gallery && d.gallery.length)
    ? `<div class="modal__gallery">${d.gallery.map((g) =>
        `<figure><img src="${esc(g.src)}" alt="${esc(g.caption || "")}">${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}</figure>`).join("")}</div>` : "";
  const note = d.note ? `<p class="modal__note">${esc(d.note)}</p>` : "";

  el("modal").innerHTML = `
    <div class="modal__scrim" data-close></div>
    <div class="modal__panel">
      <button class="modal__close" data-close aria-label="닫기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
      <div class="modal__left">
        <div class="modal__left-grid"></div>
        <div class="modal__diamond">
          <svg viewBox="0 0 300 300" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2">
            <path d="M30 90 L150 150 L30 210"/><path d="M30 150 L150 150"/>
            <rect x="120" y="120" width="60" height="60" transform="rotate(45 150 150)" fill="#E4513B" stroke="#fff" stroke-width="4"/>
          </svg>
        </div>
        <div class="modal__cat">${esc(cs.no)} / ${esc(cs.category)}</div>
      </div>
      <div class="modal__right">
        <h3 class="modal__title">${esc(cs.title)}</h3>
        <p class="modal__desc">${esc(cs.desc)}</p>
        <div class="modal__facts">
          <div class="modal__fact"><small>PERIOD</small><b>${esc(cs.period)}</b></div>
          <div class="modal__fact"><small>ROLE</small><b>${esc(cs.role)}</b></div>
          <div class="modal__fact"><small>OUTCOME</small><b>${esc(cs.result)}</b></div>
        </div>
        <div class="modal__sections">${secs}</div>
        ${gallery}${note}
      </div>
    </div>`;
  el("modal").classList.add("open");
  document.body.style.overflow = "hidden";
  el("modal").querySelectorAll("[data-close]").forEach((x) => x.addEventListener("click", closeCase));
}
function closeCase() {
  el("modal").classList.remove("open");
  el("modal").innerHTML = "";
  document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCase(); });

/* ---------------- AI LEADERSHIP ---------------- */
function renderAI() {
  const a = DATA.aiLeadership;
  const wf = a.workflow.items.map((x) => `
    <div class="flow3__item reveal"><div class="flow3__no mono">${esc(x.no)}</div>
      <div class="flow3__label">${esc(x.label)}</div>
      <div class="flow3__title">${esc(x.title)}</div>
      <div class="flow3__desc">${esc(x.desc)}</div></div>`).join("");
  const org = a.organization.items.map((x) => `
    <div class="org__item reveal"><div class="org__no">${esc(x.no)} / ${esc(x.label)}</div>
      <div class="org__title">${esc(x.title)}</div>
      <div class="org__desc">${esc(x.desc)}</div></div>`).join("");
  el("ai").innerHTML = `
    <div class="wrap">
      <div class="section__label eyebrow">${esc(a.sectionNo)} / ${esc(a.sectionLabel)}</div>
      <div class="ai__top">
        <h2 class="ai__headline">${a.headline.map((t) => `<span>${esc(t)}</span>`).join("")}</h2>
        <div class="ai__meta"><small>${esc(a.meta.period)}</small><b>${esc(a.meta.role)}</b></div>
        <p class="ai__intro">${esc(a.intro)}</p>
      </div>
      <div class="block-label">${esc(a.workflow.label)}</div>
      <div class="ai__blocktitle">${a.workflow.title.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <p class="ai__blockdesc">${esc(a.workflow.desc)}</p>
      <div class="flow3">${wf}</div>
      <div class="block-label">${esc(a.organization.label)}</div>
      <div class="ai__blocktitle" style="margin-bottom:36px">${esc(a.organization.title)}</div>
      <div class="org">${org}</div>
    </div>`;
}

/* ---------------- TRAJECTORY ---------------- */
function renderTrajectory() {
  const t = DATA.trajectory;
  const steps = t.steps.map((s) => `
    <div class="traj__step reveal"><div class="traj__dot"></div>
      <div class="traj__period mono">${esc(s.period)}</div>
      <div class="traj__no">${esc(s.no)}</div>
      <div class="traj__role">${esc(s.role)}</div>
      <div class="traj__company">${esc(s.company)}</div>
      <div class="traj__desc">${esc(s.desc)}</div></div>`).join("");
  el("trajectory").innerHTML = `
    <div class="wrap">
      <div class="section__head">
        <div class="section__label eyebrow">${esc(t.sectionNo)} / ${esc(t.sectionLabel)}</div>
        <h2 class="section__title">${t.headline.map((x) => `<span>${esc(x)}</span>`).join("")}</h2>
        <p class="section__desc">${esc(t.desc)}</p>
      </div>
      <div class="traj__axis"><span>${esc(t.axis.from)}</span><span>${esc(t.axis.to)}</span></div>
      <div class="traj__track">${steps}</div>
    </div>`;
}

/* ---------------- CONTACT ---------------- */
function renderContact() {
  const c = DATA.contact;
  const items = c.items.map((x) => `
    <div class="contact__item"><small>${esc(x.label)}</small>
      ${x.href ? `<a href="${esc(x.href)}">${esc(x.value)}</a>` : `<b>${esc(x.value)}</b>`}</div>`).join("");
  el("contact").innerHTML = `
    <div class="wrap contact">
      <div class="contact__tagline">${esc(c.tagline)}</div>
      <h2 class="contact__headline">${c.headline.map((t) => `<span>${esc(t)}</span>`).join("")}</h2>
      <div class="contact__items">${items}</div>
    </div>`;
  el("footer").innerHTML = `<span>© ${esc(DATA.brand.name)} — Product Leader Portfolio</span><span>USER DATA → PRODUCT DECISION → BUSINESS IMPACT</span>`;
}

/* ---------------- INTERACTIONS ---------------- */
function wireNavScroll() {
  const nav = el("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
function wireReveal() {
  const check = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".reveal:not(.in)").forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) n.classList.add("in");
    });
  };
  if (!wireReveal._wired) {
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    wireReveal._wired = true;
  }
  check();
  // 안전장치: 혹시라도 계산이 어긋나면 잠시 뒤 전부 노출
  setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((n) => {
    const r = n.getBoundingClientRect();
    if (r.top < (window.innerHeight || 0)) n.classList.add("in");
  }), 400);
}

boot();
