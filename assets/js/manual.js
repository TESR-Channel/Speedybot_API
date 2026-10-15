/* =========================================================================
   TESR · Speedybot User Manual — renderer (web page + printable PDF layout)
   Data: assets/manual/manual-data.js  (window.MANUAL)
   Print mode: manual-print.html sets window.MANUAL_PRINT = true
   ========================================================================= */
(function () {
  "use strict";
  const M = window.MANUAL;
  const PRINT = !!window.MANUAL_PRINT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const BASE = "assets/manual/";
  /* wide (multi-screenshot) images get full width instead of the side column */
  window.markWide = (img) => {
    const f = img.closest("figure"); if (!f) return;
    const r = img.naturalWidth / img.naturalHeight;
    f.classList.toggle("tall", r < 0.8);
    f.classList.toggle("mid", r >= 0.8 && r < 1.2);
    f.classList.toggle("wide", r >= 1.2);
  };

  const UI = {
    th: {
      brandSub: "คู่มือการใช้งาน · User Manual",
      apiLab: "API Lab",
      eyebrow: "TESR Robotics · คู่มือการใช้งาน v" + M.version,
      pdfTh: "ดาวน์โหลด PDF (ไทย)",
      pdfEn: "Download PDF (English)",
      videos: "วิดีโอสอนทั้งหมด",
      start: "เริ่มอ่านคู่มือ",
      contents: "สารบัญ",
      overview: "ก่อนเริ่มใช้งาน",
      tutorial: "วิดีโอสอน",
      watch: "ดูวิดีโอสอน",
      openDrive: "เปิดใน Google Drive",
      videoNote: "วิดีโอเปิดผ่าน Google Drive",
      step: "ขั้นที่",
      warn: "ข้อควรระวัง",
      tip: "เคล็ดลับ",
      note: "หมายเหตุ",
      important: "สำคัญ",
      fill: "กรอกเอง",
      fromTesr: "TESR แจ้งให้",
      section: "หัวข้อ",
      problem: "อาการ",
      fix: "วิธีแก้",
      check: "ตรวจแล้ว",
      page: "หน้า",
      updated: "ปรับปรุง",
      scan: "สแกนเพื่อดูวิดีโอ",
      webVer: "อ่านฉบับออนไลน์ (มีวิดีโอ)",
      allVideos: "โฟลเดอร์วิดีโอทั้งหมด",
      tapZoom: "แตะรูปเพื่อขยาย",
      footSrc: M.sources.th,
    },
    en: {
      brandSub: "User Manual · คู่มือการใช้งาน",
      apiLab: "API Lab",
      eyebrow: "TESR Robotics · User Manual v" + M.version,
      pdfTh: "PDF (ภาษาไทย)",
      pdfEn: "Download PDF (English)",
      videos: "All video tutorials",
      start: "Start reading",
      contents: "Contents",
      overview: "Before you start",
      tutorial: "Video tutorial",
      watch: "Watch the tutorial",
      openDrive: "Open in Google Drive",
      videoNote: "Videos play from Google Drive",
      step: "Step",
      warn: "Caution",
      tip: "Tip",
      note: "Note",
      important: "Important",
      fill: "fill in",
      fromTesr: "provided by TESR",
      section: "Section",
      problem: "Problem",
      fix: "Fix",
      check: "Done",
      page: "Page",
      updated: "Updated",
      scan: "Scan to watch",
      webVer: "Read online (with videos)",
      allVideos: "All videos folder",
      tapZoom: "Tap an image to enlarge",
      footSrc: M.sources.en,
    },
  };

  const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
  let lang = document.documentElement.getAttribute("lang") === "en" ? "en" : "th";
  if (PRINT) { const q = (location.search.match(/[?&]lang=(th|en)/) || [])[1]; if (q) lang = q; }
  const t = (o) => (o == null ? "" : typeof o === "string" ? o : o[lang] || o.th || "");
  const u = (k) => UI[lang][k];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const groupId = (s, gi) => "s-" + s.id + "-" + (gi + 1);

  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 12v6M9.5 15.5 12 18l2.5-2.5"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  /* ------------------------------------------------------------- blocks */
  const callout = (kind, body) => {
    if (!body) return "";
    const label = { warn: u("warn"), tip: u("tip"), note: u("note"), key: u("important") }[kind];
    const icon = kind === "warn" ? ICON.warn : kind === "tip" ? ICON.tip : ICON.info;
    return `<div class="callout ${kind}"><span class="ci">${icon}</span><div><b>${label}</b> ${t(body)}</div></div>`;
  };

  const shots = (imgs) => {
    if (!imgs || !imgs.length) return "";
    const one = imgs.length === 1 ? " one" : "";
    return `<div class="shots${one}">` + imgs.map(([src, cap]) =>
      `<figure><button type="button" class="shot" data-src="${BASE + src}" data-cap="${esc(t(cap))}"><img src="${BASE + src}" alt="${esc(t(cap))}" onload="markWide(this)"${PRINT ? "" : ' loading="lazy" decoding="async"'} /></button><figcaption>${t(cap)}</figcaption></figure>`
    ).join("") + "</div>";
  };

  const table = (tb) => {
    if (!tb) return "";
    return `<div class="table-scroll"><table class="m-table"><thead><tr>${tb.head.map((h) => `<th>${t(h)}</th>`).join("")}</tr></thead><tbody>${tb.rows
      .map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="k"' : ""}>${t(c)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  };

  const step = (s, i) => `
    <li class="m-step">
      <div class="sn"><small>${u("step")}</small>${i + 1}</div>
      <div class="sb">
        <h4>${t(s.t)}</h4>
        ${s.d ? `<p>${t(s.d)}</p>` : ""}
        ${table(s.table)}
        ${callout("warn", s.warn)}${callout("tip", s.tip)}
        ${shots(s.img)}
      </div>
    </li>`;

  const group = (s, g, gi) => {
    let h = `<div class="m-group" id="${groupId(s, gi)}"><h3>${t(g.title)}</h3>`;
    h += callout("note", g.note);
    if (g.steps) h += `<ol class="m-steps">${g.steps.map(step).join("")}</ol>`;
    h += callout("warn", g.warn);
    if (g.checklist) h += `<ul class="checklist">${g.checklist.map((c) => `<li><span class="box">${PRINT ? "" : ICON.check}</span>${t(c)}</li>`).join("")}</ul>`;
    if (g.faq) h += `<div class="table-scroll"><table class="m-table faq"><thead><tr><th>${u("problem")}</th><th>${u("fix")}</th></tr></thead><tbody>${g.faq.map(([q, a]) => `<tr><td class="k">${t(q)}</td><td>${t(a)}</td></tr>`).join("")}</tbody></table></div>`;
    if (g.bullets) h += `<ul class="m-bullets">${g.bullets.map((b) => `<li>${t(b)}</li>`).join("")}</ul>`;
    return h + "</div>";
  };

  const videoCard = (s) => {
    const v = M.videos[s.video];
    if (!v) return "";
    if (PRINT) {
      const qr = window.QR && window.QR[s.video];
      return `<div class="vbox print">${qr ? `<img class="qr" src="${qr}" alt="QR" />` : ""}<div><span class="vk">${ICON.play} ${u("tutorial")}</span><b>${t(v.title)}</b><a href="${v.view}">${v.view}</a><small>${u("scan")}</small></div></div>`;
    }
    return `<div class="vbox" data-embed="${v.embed}">
      <button type="button" class="vplay" aria-label="${esc(u("watch"))}">
        <span class="vbg"></span>
        <span class="vbtn">${ICON.play}</span>
        <span class="vtxt"><small>${u("tutorial")}</small><b>${t(v.title)}</b></span>
      </button>
      <div class="vfoot"><span>${u("videoNote")}</span><a href="${v.view}" target="_blank" rel="noopener">${u("openDrive")} ${ICON.ext}</a></div>
    </div>`;
  };

  const sectionHTML = (s) => `
    <section class="m-sec" id="s-${s.id}">
      <header class="m-sec-head">
        <span class="num">${pad(s.n)}</span>
        <div><h2>${t(s.title)}</h2><p>${t(s.summary)}</p></div>
      </header>
      ${videoCard(s)}
      ${callout("key", s.principle)}
      ${s.groups.map((g, gi) => group(s, g, gi)).join("")}
    </section>`;

  const introHTML = (forPrint) => {
    const I = M.intro;
    const creds = `<div class="creds"><h3>${t(I.creds.title)}</h3><table class="m-table cred">${I.creds.rows
      .map(([k, v]) => `<tr><td class="k">${t(k)}</td><td>${v ? `<code>${esc(v)}</code>` : `<span class="blank">${forPrint ? "" : u("fromTesr")}</span>`}</td></tr>`)
      .join("")}</table>${callout("note", I.creds.pwNote)}<p class="small">${t(I.creds.note)}</p></div>`;
    return `
    <section class="m-sec intro" id="s-intro">
      <header class="m-sec-head"><span class="num">00</span><div><h2>${u("overview")}</h2><p>${t(I.lead)}</p></div></header>
      ${shots(I.img)}
      <div class="intro-grid">
        <div class="need"><h3>${t(I.need.title)}</h3><ul class="m-bullets">${I.need.items.map((x) => `<li>${t(x)}</li>`).join("")}</ul></div>
        ${creds}
      </div>
      <div class="safety"><h3>${ICON.warn} ${t(I.safety.title)}</h3><ul class="m-bullets">${I.safety.items.map((x) => `<li>${t(x)}</li>`).join("")}</ul></div>
    </section>`;
  };

  /* ================================================================= PRINT */
  if (PRINT) {
    document.documentElement.setAttribute("lang", lang);
    document.title = t(M.title) + " · TESR";
    const root = $("#print");
    const toc = M.sections.map((s) => `<li><span class="n">${pad(s.n)}</span><span class="tt">${t(s.title)}</span><span class="vt">${ICON.play} ${t(M.videos[s.video].title)}</span></li>`).join("");
    const webQR = window.QR && window.QR.web;
    root.innerHTML = `
      <section class="cover">
        <div class="cv-top"><img src="assets/img/tesr-logo.png" alt="TESR" /><div><b>TESR Co., Ltd.</b><span>Thai Embedded System and Robotics</span></div></div>
        <div class="cv-mid">
          <span class="eyebrow">${u("eyebrow")}</span>
          <h1>${t(M.title)}</h1>
          <p>${t(M.subtitle)}</p>
        </div>
        <img class="cv-robot" src="assets/img/speedybot.jpg" alt="Speedybot" />
        <div class="cv-foot">
          <div>${u("updated")} ${M.updated} · v${M.version}</div>
          <div class="cv-web">${webQR ? `<img class="qr" src="${webQR}" alt="QR" />` : ""}<div><b>${u("webVer")}</b><a href="${M.links.manualWeb}">${M.links.manualWeb}</a><span>${u("allVideos")}: <a href="${M.links.videos}">Google Drive</a></span></div></div>
        </div>
      </section>
      <section class="toc-page">
        <h2>${u("contents")}</h2>
        <ol class="ptoc"><li><span class="n">00</span><span class="tt">${u("overview")}</span><span class="vt"></span></li>${toc}</ol>
        <ol class="flow">${M.intro.flow.map((f, i) => `<li><b>${i + 1}</b>${t(f)}</li>`).join("")}</ol>
      </section>
      ${introHTML(true)}
      ${M.sections.map(sectionHTML).join("")}
      <section class="m-sec support"><h3>${t(M.support.title)}</h3><p>${t(M.support.text)}</p><p class="small">${t(M.sources)}</p></section>`;
    document.body.classList.add("ready");
    return;
  }

  /* ================================================================= WEB */
  function render() {
    document.documentElement.setAttribute("lang", lang);
    document.title = (lang === "en" ? "Speedybot Manual" : "คู่มือ Speedybot") + " · TESR";
    $$("[data-i18n]").forEach((el) => (el.textContent = u(el.dataset.i18n)));
    $$("#langSeg [data-lang-set]").forEach((b) => b.classList.toggle("on", b.dataset.langSet === lang));

    $("#heroEyebrow").textContent = u("eyebrow");
    $("#heroTitle").innerHTML = lang === "en"
      ? 'Speedybot <span class="accent">User Manual</span>'
      : 'คู่มือ <span class="accent">Speedybot</span>';
    $("#heroSub").textContent = t(M.subtitle);
    $("#heroActions").innerHTML = `
      <a class="btn primary" href="${BASE}Speedybot-Manual-TH.pdf" download>${ICON.pdf} ${u("pdfTh")}</a>
      <a class="btn gold" href="${BASE}Speedybot-Manual-EN.pdf" download>${ICON.pdf} ${u("pdfEn")}</a>
      <a class="btn ghost" href="${M.links.videos}" target="_blank" rel="noopener">${ICON.play} ${u("videos")}</a>`;
    $("#flow").innerHTML = M.sections.map((s, i) =>
      `<li><a href="#s-${s.id}"><b>${s.n}</b><span>${t(M.intro.flow[i])}</span></a></li>`).join("");

    // nav
    $("#topnav").innerHTML = `<a href="#s-intro">${u("overview")}</a>` + M.sections.map((s) => `<a href="#s-${s.id}">${s.n}. ${t(M.intro.flow[s.n - 1])}</a>`).join("");
    $("#mnav").innerHTML =
      `<a href="#s-intro"><span>00</span>${u("overview")}</a>` +
      M.sections.map((s) => `<a href="#s-${s.id}"><span>${pad(s.n)}</span>${t(s.title)}</a>`).join("") +
      `<div class="theme-row"><span>Language</span><div class="seg" id="mLangSeg"><button type="button" data-lang-set="th"${lang === "th" ? ' class="on"' : ""}>ไทย</button><button type="button" data-lang-set="en"${lang === "en" ? ' class="on"' : ""}>English</button></div></div>` +
      `<div class="theme-row"><span>${lang === "en" ? "Theme" : "ธีม"}</span><div class="seg" id="mThemeSeg"><button type="button" data-theme-set="dark"${isLight() ? "" : ' class="on"'}>🌙 ${lang === "en" ? "Dark" : "มืด"}</button><button type="button" data-theme-set="light"${isLight() ? ' class="on"' : ""}>☀ ${lang === "en" ? "Light" : "สว่าง"}</button></div></div>` +
      `<a class="btn primary" href="${BASE}Speedybot-Manual-${lang.toUpperCase()}.pdf" download>${ICON.pdf} ${lang === "en" ? u("pdfEn") : u("pdfTh")}</a>` +
      `<a class="btn" href="index.html">Speedybot API Lab</a>`;

    // toc
    $("#toc").innerHTML = `<div class="toc-in"><h4>${u("contents")}</h4><ol>
      <li><a href="#s-intro" data-toc="s-intro"><span>00</span>${u("overview")}</a></li>
      ${M.sections.map((s) => `<li><a href="#s-${s.id}" data-toc="s-${s.id}"><span>${pad(s.n)}</span>${t(s.title)}</a>
        <ol>${s.groups.map((g, gi) => `<li><a href="#${groupId(s, gi)}" data-toc="${groupId(s, gi)}">${t(g.title)}</a></li>`).join("")}</ol></li>`).join("")}
    </ol>
    <div class="toc-dl"><a class="btn sm primary" href="${BASE}Speedybot-Manual-TH.pdf" download>${ICON.pdf} PDF ไทย</a><a class="btn sm gold" href="${BASE}Speedybot-Manual-EN.pdf" download>${ICON.pdf} PDF EN</a></div></div>`;

    // body
    $("#doc").innerHTML = introHTML(false) + M.sections.map(sectionHTML).join("") +
      `<section class="m-sec support"><h3>${t(M.support.title)}</h3><p>${t(M.support.text)}</p></section>`;
    $("#footSrc").textContent = u("footSrc");
    observe();
  }

  /* video: load iframe on demand */
  document.addEventListener("click", (e) => {
    const p = e.target.closest(".vplay");
    if (!p) return;
    const box = p.closest(".vbox");
    const f = document.createElement("iframe");
    f.src = box.dataset.embed;
    f.allow = "autoplay; fullscreen";
    f.allowFullscreen = true;
    f.setAttribute("title", p.querySelector("b").textContent);
    p.replaceWith(f);
    box.classList.add("on");
  });

  /* language */
  const setLang = (l) => {
    if (l === lang) return;
    const y = window.scrollY, anchor = currentAnchor;
    lang = l;
    try { localStorage.setItem("tesr.lang", l); } catch (e) {}
    const url = new URL(location.href); url.searchParams.delete("lang"); history.replaceState(null, "", url);
    render();
    const el = anchor && document.getElementById(anchor);
    if (el) el.scrollIntoView({ block: "start" }); else window.scrollTo(0, y);
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lang-set]");
    if (b) { e.stopPropagation(); setLang(b.dataset.langSet); }
  });

  /* theme */
  const setTheme = (th) => {
    document.documentElement.setAttribute("data-theme", th);
    try { localStorage.setItem("tesr.theme", th); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", th === "light" ? "#fbf7f7" : "#120609");
  };
  $("#themeBtn").onclick = () => setTheme(isLight() ? "dark" : "light");
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-theme-set]");
    if (!b) return;
    e.stopPropagation(); setTheme(b.dataset.themeSet);
    $$("#mThemeSeg [data-theme-set]").forEach((x) => x.classList.toggle("on", x === b));
  });

  /* mobile menu */
  const menuBtn = $("#menuBtn"), mnav = $("#mnav");
  const setMenu = (on) => { mnav.classList.toggle("on", on); menuBtn.setAttribute("aria-expanded", on); };
  menuBtn.onclick = (e) => { e.stopPropagation(); setMenu(!mnav.classList.contains("on")); };
  mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", (e) => { if (mnav.classList.contains("on") && !e.target.closest("#mnav")) setMenu(false); });

  /* active TOC + progress */
  let io, currentAnchor = null;
  function observe() {
    if (io) io.disconnect();
    const targets = $$(".m-sec[id], .m-group[id]");
    const vis = new Map();
    io = new IntersectionObserver((ents) => {
      ents.forEach((en) => vis.set(en.target.id, en.isIntersecting ? en.boundingClientRect.top : null));
      let best = null, bestTop = Infinity;
      vis.forEach((top, id) => { if (top != null && Math.abs(top) < bestTop) { bestTop = Math.abs(top); best = id; } });
      if (!best) return;
      currentAnchor = best;
      $$("#toc a.on, .topnav a.on").forEach((a) => a.classList.remove("on"));
      const a = $(`#toc a[data-toc="${best}"]`);
      if (a) {
        a.classList.add("on");
        const sec = a.closest("ol").closest("li");
        if (sec) sec.firstElementChild.classList.add("on");
      }
      const secId = best.replace(/-\d+$/, "");
      const ta = $(`.topnav a[href="#${secId}"]`); if (ta) ta.classList.add("on");
    }, { rootMargin: "-80px 0px -60% 0px" });
    targets.forEach((el) => io.observe(el));
  }
  const prog = $("#readProgress"), toTop = $("#toTop");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    toTop.classList.toggle("on", scrollY > 800);
  };
  addEventListener("scroll", onScroll, { passive: true });
  toTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

  /* lightbox */
  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let lbList = [], lbIdx = 0;
  const lbShow = (i) => {
    lbIdx = (i + lbList.length) % lbList.length;
    const b = lbList[lbIdx];
    lbImg.src = b.dataset.src; lbImg.alt = b.dataset.cap; lbCap.textContent = b.dataset.cap;
  };
  const lbClose = () => { lb.hidden = true; document.body.classList.remove("noscroll"); };
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".shot");
    if (!b) return;
    lbList = $$(".shot", $("#doc"));
    lbShow(lbList.indexOf(b));
    lb.hidden = false; document.body.classList.add("noscroll");
  });
  lb.addEventListener("click", (e) => {
    if (e.target.closest(".prev")) return lbShow(lbIdx - 1);
    if (e.target.closest(".next")) return lbShow(lbIdx + 1);
    if (e.target === lb || e.target.closest(".lb-close")) lbClose();
  });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbClose();
    if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    if (e.key === "ArrowRight") lbShow(lbIdx + 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) lbShow(lbIdx + (dx < 0 ? 1 : -1));
  });

  render();
  onScroll();
  if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(() => el.scrollIntoView(), 50); }
})();
