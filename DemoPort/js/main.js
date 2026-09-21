(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // DOM을 안전하게 만드는 헬퍼 (데이터는 innerHTML을 거치지 않는다)
  function el(tag, props, ...kids) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) node.append(kid);
    return node;
  }

  /* ---------- 테마 (F-06) ---------- */
  const root = document.documentElement;
  const themeMeta = $('meta[name="theme-color"]');
  function syncThemeColor() {
    if (themeMeta) themeMeta.setAttribute("content", root.dataset.theme === "light" ? "#f6f8fb" : "#0e1116");
  }
  syncThemeColor();
  $("#themeBtn").addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* 저장이 막힌 환경 */ }
    syncThemeColor();
  });

  /* ---------- 모바일 메뉴 ---------- */
  const nav = $("#nav");
  const menuBtn = $("#menuBtn");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener("resize", () => { if (innerWidth > 720) setMenu(false); });

  /* ---------- 스크롤 위치에 따라 내비게이션 강조 (F-10) ---------- */
  const navLinks = $$("a", nav);
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of navLinks) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        }
      }
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$("main section[id]").forEach(s => navObserver.observe(s));
    // 맨 위(Hero)에서는 강조를 해제
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) navLinks.forEach(a => a.removeAttribute("aria-current"));
    }, { rootMargin: "-40% 0px -55% 0px" }).observe($("#hero"));
  }

  /* ---------- 스크롤 등장 애니메이션 (F-08) ---------- */
  const revealObserver = "IntersectionObserver" in window && !reduceMotion
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        }
      }, { threshold: .12 })
    : null;
  function observeReveal(scope) {
    $$(".reveal", scope).forEach(node => {
      if (revealObserver) revealObserver.observe(node); else node.classList.add("in");
    });
  }

  /* ---------- Hero 배경: 떠오르는 테트로미노 ---------- */
  (function floatBlocks() {
    const field = $("#floatField");
    if (!field || reduceMotion) return;
    const shapes = [
      [[0, 0], [1, 0], [2, 0], [3, 0]], // I
      [[0, 0], [1, 0], [0, 1], [1, 1]], // O
      [[0, 0], [1, 0], [2, 0], [1, 1]], // T
      [[1, 0], [2, 0], [0, 1], [1, 1]], // S
      [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
      [[0, 0], [0, 1], [1, 1], [2, 1]], // J
      [[2, 0], [0, 1], [1, 1], [2, 1]], // L
    ];
    const colors = ["#00d8f0", "#ffd400", "#b04dff", "#20d870", "#ff3b50", "#3d7bff", "#ff9a1a"];
    const count = innerWidth < 720 ? 8 : 14;
    for (let i = 0; i < count; i++) {
      const u = Math.round(rand(14, 26));
      const step = u + 2;
      const shape = shapes[i % shapes.length];
      const color = colors[i % colors.length];
      const [x0, y0] = shape[0];
      const shadow = shape.slice(1).map(([x, y]) => `${(x - x0) * step}px ${(y - y0) * step}px 0 ${color}`).join(",");
      const block = el("div", { class: "float-block" });
      block.style.cssText =
        `left:${rand(2, 94).toFixed(1)}%;--u:${u}px;--c:${color};--d:${rand(16, 30).toFixed(1)}s;` +
        `--delay:-${rand(0, 30).toFixed(1)}s;--r:${Math.round(rand(-300, 300))}deg;box-shadow:${shadow}`;
      field.append(block);
    }
  })();

  /* ---------- 개발자 정보 반영 ---------- */
  $$("[data-project-count]").forEach(n => { n.textContent = PROJECTS.length; });
  if (PROFILE.photo) {
    $("#avatar").replaceChildren(el("img", { src: PROFILE.photo, alt: "" }));
  }
  if (PROFILE.github) {
    const gh = $("#githubLink");
    gh.href = PROFILE.github;
    gh.hidden = false;
  }

  /* ---------- 프로젝트 카드 / 필터 (F-03, F-09, F-11) ---------- */
  const grid = $("#cardGrid");
  const filtersBox = $("#filters");

  function buildCard(p) {
    const open = () => openProject(p.id, false);
    const actions = el("div", { class: "card-actions" },
      p.demo ? el("button", { class: "btn primary small", type: "button", "aria-label": `${p.title} 데모 실행`, onclick: () => openProject(p.id, true) }, "▶ 데모") : null,
      el("button", { class: "btn small", type: "button", "aria-label": `${p.title} 자세히 보기`, onclick: open }, "자세히"),
      p.source ? el("a", { class: "btn small", href: p.source, download: "", "aria-label": `${p.title} 소스 다운로드` }, "소스") : null
    );
    return el("article", { class: "card reveal", "data-cats": p.categories.join("|") },
      el("div", { class: "card-thumb", onclick: open },
        el("img", { src: p.thumb, alt: "", width: p.thumbSize[0], height: p.thumbSize[1], loading: "lazy" })),
      el("div", { class: "card-body" },
        el("h3", { text: p.title }),
        el("p", { text: p.summary }),
        el("div", { class: "tags" }, p.tags.map(t => el("span", { class: "tag", text: t }))),
        actions
      )
    );
  }

  function renderProjects() {
    grid.replaceChildren(...PROJECTS.map(buildCard));
    observeReveal(grid);

    // 프로젝트가 4개 이상일 때만 필터를 노출한다
    if (PROJECTS.length < 4) return;
    const cats = [];
    PROJECTS.forEach(p => p.categories.forEach(c => { if (!cats.includes(c)) cats.push(c); }));
    const buttons = ["전체", ...cats].map(name => el("button", {
      class: "filter", type: "button", "aria-pressed": String(name === "전체"),
      onclick: e => {
        buttons.forEach(b => b.setAttribute("aria-pressed", String(b === e.currentTarget)));
        $$(".card", grid).forEach(card => {
          card.hidden = !(name === "전체" || card.dataset.cats.split("|").includes(name));
        });
      },
    }, name));
    filtersBox.replaceChildren(...buttons);
    filtersBox.hidden = false;
  }
  renderProjects();

  // 기술 섹션: 분야별 관련 프로젝트 링크
  $$(".skill[data-cat]").forEach(card => {
    const list = $("ul", card);
    const related = PROJECTS.filter(p => p.categories.includes(card.dataset.cat));
    if (!related.length) { $(".skill-links", card).hidden = true; return; }
    related.forEach(p => list.append(el("li", {},
      el("button", { class: "link-btn", type: "button", onclick: () => openProject(p.id, false) }, p.title))));
  });

  observeReveal(document);

  /* ---------- 프로젝트 상세 모달 + 데모 실행 (F-04) ---------- */
  const dlg = $("#projectDialog");
  const dlgBody = $("#pdBody");

  function section(title, ...content) {
    return [el("h4", { text: title }), ...content];
  }

  function buildDetail(p) {
    const box = { startDemo: null };
    const parts = [
      el("h3", { id: "pd-title", text: p.title }),
      el("div", { class: "tags" }, p.tags.map(t => el("span", { class: "tag", text: t }))),
    ];

    if (p.demo) {
      const demoBox = el("div", { class: "demo" });
      const poster = el("button", { class: "demo-poster", type: "button", "aria-label": `${p.title} 데모 실행` },
        el("img", { src: p.thumb, alt: "" }),
        el("span", { class: "demo-play" }, "▶ 지금 플레이"));
      const start = () => {
        const iframe = el("iframe", {
          src: p.demo.url,
          title: `${p.title} 데모`,
          sandbox: "allow-scripts allow-same-origin",
          referrerpolicy: "no-referrer",
        });
        // 게임이 뜨면 바로 키보드 입력을 받도록 포커스를 넘긴다
        iframe.addEventListener("load", () => { try { iframe.contentWindow.focus(); } catch (e) { /* 무시 */ } });
        demoBox.replaceChildren(iframe);
        iframe.focus();
      };
      poster.addEventListener("click", start);
      demoBox.append(poster);
      box.startDemo = start;
      parts.push(...section("데모", demoBox, el("p", { class: "demo-hint", text: p.demo.hint })));
    } else {
      parts.push(...section("실행 방법",
        el("p", { text: p.demoNote }),
        p.run ? el("code", { class: "run", text: p.run }) : null));
    }

    parts.push(...section("개요", el("p", { class: "lead-p", text: p.overview })));
    parts.push(...section("핵심 기능", el("ul", { class: "bullets" }, p.features.map(f => el("li", { text: f })))));
    parts.push(...section("만든 과정", el("p", { text: p.process })));
    parts.push(...section("배운 점", el("p", { text: p.learned })));

    if (!p.demo && p.images && p.images.length) {
      parts.push(...section("스크린샷", ...p.images.map(img =>
        el("figure", { class: "shot", style: "margin:8px 0 0" }, el("img", { src: img.src, alt: img.alt })))));
    }

    parts.push(el("div", { class: "dlg-actions" },
      p.demo ? el("a", { class: "btn primary", href: p.demo.url, target: "_blank", rel: "noopener noreferrer" }, "새 탭에서 열기 ↗") : null,
      p.source ? el("a", { class: "btn", href: p.source, download: "" }, "소스 다운로드") : null,
      el("button", { class: "btn", type: "button", onclick: () => dlg.close() }, "닫기")));

    return { nodes: parts, startDemo: box.startDemo };
  }

  function openProject(id, autoplay) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    const detail = buildDetail(p);
    dlgBody.replaceChildren(...detail.nodes);
    document.body.classList.add("modal-open");
    dlg.showModal();
    $(".dlg", dlg).scrollTop = 0;
    if (autoplay && detail.startDemo) detail.startDemo();
  }

  dlg.addEventListener("close", () => {
    dlgBody.replaceChildren();               // iframe을 제거해 게임을 완전히 종료
    document.body.classList.remove("modal-open");
  });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("#dlgClose").addEventListener("click", () => dlg.close());

  /* ---------- 이메일 주소 복사 (F-05) ---------- */
  const copyStatus = $("#copyStatus");
  let copyTimer;
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* 아래 대체 방식으로 진행 */ }
    const ta = el("textarea", { readonly: "", "aria-hidden": "true", style: "position:fixed;top:-100px;opacity:0" });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  $("#copyBtn").addEventListener("click", async () => {
    const ok = await copyText(PROFILE.email);
    copyStatus.textContent = ok ? "복사됨 ✓" : "복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyStatus.textContent = ""; }, 2500);
  });
})();
