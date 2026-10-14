/* =========================================================================
 * TESR · Speedybot API Lab — UI
 * ========================================================================= */
(function () {
  "use strict";
  const S = window.SPEEDY;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const EP = Object.fromEntries(S.ENDPOINTS.map((e) => [e.id, e]));

  /* ---------------------------------------------------------------- icons */
  const I = {
    pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    door: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
    map: '<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/>',
    route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>',
    battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
    wifi: '<path d="M5 12.55a11 11 0 0 1 14 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    spark: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>', down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    left: '<path d="M19 12H5M12 19l-7-7 7-7"/>', right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>', pause: '<path d="M8 5v14M16 5v14"/>',
    pin: '<path d="M12 22s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
    elevator: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8l3-3 3 3M9 16l3 3 3-3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>', play: '<path d="M6 4l14 8-14 8z"/>',
    home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>', save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>', copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
  };
  const svg = (n, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${I[n] || I.info}</svg>`;
  const EP_ICON = {
    online: "wifi", homepage: "battery", latest: "info", "door-open": "door", "door-close": "door",
    "neon-on": "bulb", "neon-off": "bulb", "ambient-blink": "spark", "ambient-steady": "bulb",
    stop: "stop", forward: "up", backward: "down", left: "left", right: "right", "pause-move": "pause",
    "hub-unlock": "unlock", "hub-lock": "lock", "map-detail": "map", maps: "list", points: "pin",
    "realtime-point": "target", "sse-ui-point": "radio", elevators: "elevator", "point-dict": "list",
    "set-point": "save", "goto-id": "pin", "goto-xy": "target", summon: "phone", "task-cancel": "x",
    "task-resume": "play", recharge: "home", "task-pause": "pause", "cancel-goto": "x", "backward-id": "down",
  };
  const RISK = { read: ["read", "อ่านอย่างเดียว · ปลอดภัย"], action: ["action", "สั่งงานอุปกรณ์"], motion: ["motion", "หุ่นเคลื่อนที่ · ต้อง ARM"] };

  /* robot photo hotspots (percent of image) */
  const HOTSPOTS = [
    { n: 1, x: 36, y: 8, th: "LiDAR 3D / เซนเซอร์นำทาง", go: "cat-map" },
    { n: 2, x: 63, y: 13, th: "ฝาช่องเก็บของ 80 ลิตร", go: "ep-door-open" },
    { n: 3, x: 18, y: 17, th: "ไฟบรรยากาศ (Ambient)", go: "ep-ambient-blink" },
    { n: 4, x: 31, y: 44, th: "หน้าจอ LED · สถานะหุ่น", go: "cat-status" },
    { n: 5, x: 76, y: 59, th: "แถบไฟนีออน", go: "ep-neon-on" },
    { n: 6, x: 57, y: 86, th: "ล้อ & ระบบขับเคลื่อน", go: "cat-chassis" },
  ];
  const CAT_RINGS = {
    status: [[31, 44]], body: [[63, 13], [76, 59]], chassis: [[57, 86], [19, 84]],
    map: [[36, 8]], nav: [[36, 8], [57, 86]],
  };

  /* ---------------------------------------------------------------- state */
  const STORE = "tesr.speedybot.cfg";
  const state = {
    cfg: { sn: "", appId: "", appKey: "", appSecret: "", lang: "en-US", remember: false },
    armed: false, armTimer: null,
    values: {},          // per-endpoint form values
    last: {},            // per-endpoint last result
    points: [],          // flattened point list (#14)
    dict: [],            // point type dict (#25)
    codeCtx: null,
  };

  function loadCfg() {
    try {
      const raw = sessionStorage.getItem(STORE) || localStorage.getItem(STORE);
      if (raw) Object.assign(state.cfg, JSON.parse(raw));
    } catch (e) { /* storage blocked */ }
  }
  function saveCfg() {
    const data = JSON.stringify(state.cfg);
    try {
      sessionStorage.removeItem(STORE); localStorage.removeItem(STORE);
      (state.cfg.remember ? localStorage : sessionStorage).setItem(STORE, data);
    } catch (e) { toast("เบราว์เซอร์ไม่อนุญาตให้เก็บค่า — ค่าจะหายเมื่อรีเฟรช", "bad"); }
  }
  const configured = () => !!(state.cfg.sn && state.cfg.appId && state.cfg.appKey && state.cfg.appSecret);
  const mask = (s) => (!s ? "" : s.length <= 4 ? "••••" : s.slice(0, 4) + "•".repeat(Math.min(12, s.length - 4)));

  /* ---------------------------------------------------------------- toast & ask */
  function toast(msg, kind = "", action) {
    const el = document.createElement("div");
    el.className = "toast " + kind;
    el.innerHTML = `<span class="grow">${msg}</span>`;
    if (action) {
      const b = document.createElement("button");
      b.className = "btn xs gold"; b.type = "button"; b.textContent = action.label;
      b.onclick = () => { action.fn(); el.remove(); };
      el.appendChild(b);
    }
    $("#toasts").appendChild(el);
    setTimeout(() => el.remove(), action ? 9000 : 4200);
  }
  function ask(title, html, yes = "ยืนยัน") {
    return new Promise((resolve) => {
      const m = $("#askModal");
      $("#askTitle").innerHTML = title;
      $("#askBody").innerHTML = html;
      $("#askYes").textContent = yes;
      m.classList.add("on");
      const done = (v) => { m.classList.remove("on"); $("#askYes").onclick = $("#askNo").onclick = null; resolve(v); };
      $("#askYes").onclick = () => done(true);
      $("#askNo").onclick = () => done(false);
      $("#askYes").focus();
    });
  }
  function openModal(id) { $(id).classList.add("on"); }
  function closeModal(el) { el.closest(".modal-bg").classList.remove("on"); }
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]") || e.target.closest("[data-close]")) closeModal(e.target);
    else if (e.target.classList.contains("modal-bg") && e.target.id !== "askModal") e.target.classList.remove("on");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".modal-bg.on").forEach((m) => { if (m.id === "askModal") $("#askNo").click(); else m.classList.remove("on"); });
  });

  /* ---------------------------------------------------------------- ARM */
  function setArmed(on) {
    state.armed = on;
    const b = $("#armBtn");
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
    $("#pad").classList.toggle("locked", !on);
    $("#padBadge").textContent = on ? "ARMED" : "ต้อง ARM";
    $("#padBadge").className = "badge " + (on ? "read" : "motion");
    $$("[data-run]").forEach((btn) => updateRunBtn(btn));
    bumpArm();
  }
  function bumpArm() {
    clearTimeout(state.armTimer);
    if (state.armed) state.armTimer = setTimeout(() => { setArmed(false); toast("ปลด ARM อัตโนมัติ (ไม่มีการสั่งเคลื่อนที่ 10 นาที)"); }, 10 * 60 * 1000);
  }
  async function requestArm() {
    if (state.armed) return true;
    const ok = await ask(`${svg("alert", 'width="20" style="color:var(--red-2)"')} เปิด ARM?`,
      `<p style="margin:0 0 8px">เมื่อเปิด ARM คุณจะสั่งให้ <b>หุ่นยนต์จริงเคลื่อนที่</b> ได้ (เดินหน้า/เลี้ยว/ไปยังจุด/ปลดล็อกล้อ)</p>
       <ul class="sec-list"><li>ตรวจว่ารอบตัวหุ่นไม่มีคนหรือสิ่งกีดขวาง</li><li>มีคนเห็นหุ่นอยู่ หรือดูตำแหน่งสดบนแผนที่</li><li>ปุ่ม <b style="color:var(--red-2)">STOP</b> มุมขวาล่างกดได้ตลอดเวลา</li></ul>`, "เปิด ARM");
    if (ok) setArmed(true);
    return ok;
  }
  $("#armBtn").onclick = () => (state.armed ? setArmed(false) : requestArm());

  /* ---------------------------------------------------------------- config modal */
  function fillCfgForm() {
    $("#c-sn").value = state.cfg.sn; $("#c-id").value = state.cfg.appId;
    $("#c-key").value = state.cfg.appKey; $("#c-secret").value = state.cfg.appSecret;
    $("#c-lang").value = state.cfg.lang; $("#c-remember").checked = !!state.cfg.remember;
  }
  $("#c-lang").innerHTML = S.LANGS.map((l) => `<option value="${l.code}">${l.code} · ${l.label}</option>`).join("");
  const openCfg = () => { fillCfgForm(); openModal("#cfgModal"); setTimeout(() => $("#c-sn").focus(), 50); };
  $("#cfgBtn").onclick = openCfg; $("#heroCfg").onclick = openCfg;
  $$("[data-reveal]").forEach((b) => (b.onclick = () => { const i = $("#" + b.dataset.reveal); i.type = i.type === "password" ? "text" : "password"; }));
  $("#pasteApply").onclick = () => {
    const txt = $("#pasteBox").value;
    const get = (re) => (txt.match(re) || [])[1]?.trim();
    const sn = get(/Robot[-_ ]?Sn\s*[:=]\s*([^\s,;]+)/i) || get(/\bsn\s*[:=]\s*["']?([^\s"',;]+)/i);
    const id = get(/App[-_ ]?Id\s*[:=]\s*["']?([^\s"',;]+)/i);
    const key = get(/App[-_ ]?Key\s*[:=]\s*["']?([^\s"',;]+)/i);
    const sec = get(/app[-_ ]?Secret\s*[:=]\s*["']?([^\s"',;]+)/i);
    if (sn) $("#c-sn").value = sn; if (id) $("#c-id").value = id; if (key) $("#c-key").value = key; if (sec) $("#c-secret").value = sec;
    $("#pasteBox").value = "";
    toast(`แยกได้ ${[sn, id, key, sec].filter(Boolean).length}/4 ค่า`, [sn, id, key, sec].every(Boolean) ? "ok" : "");
  };
  $("#cfgSave").onclick = async () => {
    Object.assign(state.cfg, {
      sn: $("#c-sn").value.trim(), appId: $("#c-id").value.trim(), appKey: $("#c-key").value.trim(),
      appSecret: $("#c-secret").value.trim(), lang: $("#c-lang").value, remember: $("#c-remember").checked,
    });
    saveCfg();
    closeModal($("#cfgSave"));
    onCfgChanged();
    if (configured()) testConnection();
  };
  $("#cfgClear").onclick = async () => {
    if (!(await ask("ล้างค่าทั้งหมด?", "ลบ Robot SN / App ID / App Key / appSecret ออกจากเบราว์เซอร์นี้"))) return;
    state.cfg = { sn: "", appId: "", appKey: "", appSecret: "", lang: "en-US", remember: false };
    try { sessionStorage.removeItem(STORE); localStorage.removeItem(STORE); } catch (e) {}
    fillCfgForm(); onCfgChanged(); toast("ล้างค่าแล้ว", "ok");
  };
  function onCfgChanged() {
    $$("input[data-auto=sn]").forEach((i) => (i.value = state.cfg.sn || "(ใส่ใน config)"));
    if (!configured()) setStatus("idle", "ยังไม่ได้ตั้งค่า");
    renderSignDemo();
  }

  /* ---------------------------------------------------------------- status pill */
  function setStatus(kind, txt) {
    const d = $("#statusDot");
    d.className = "dot " + (kind === "ok" ? "ok live" : kind === "bad" ? "bad" : kind === "warn" ? "warn" : "");
    $("#statusTxt").textContent = txt;
  }
  $("#statusPill").onclick = () => (configured() ? refreshStatus(true) : openCfg());

  /* ---------------------------------------------------------------- call wrapper */
  function needCfg() {
    if (configured()) return false;
    toast("ใส่ API Key ก่อนนะ", "bad", { label: "ตั้งค่า", fn: openCfg });
    return true;
  }
  async function run(epId, values = {}, { quiet = false, nolog = false } = {}) {
    const ep = EP[epId];
    if (needCfg()) return null;
    const args = S.buildArgs(ep, values, state.cfg);
    try {
      const r = await S.call(ep.method, ep.path, args, state.cfg);
      if (!nolog || !r.ok) log(ep, r);
      if (ep.risk === "motion") bumpArm();
      if (!quiet && !r.ok) toast(`#${ep.no} ${ep.th}: ${humanCode(r)}`, "bad");
      return r;
    } catch (e) {
      const r = { ok: false, status: 0, ms: 0, json: null, text: String(e), error: e };
      log(ep, r);
      if (!quiet) toast(`#${ep.no}: เชื่อมต่อไม่ได้ — ${esc(e.message || e)}`, "bad");
      return r;
    }
  }
  function humanCode(r) {
    if (!r) return "";
    if (r.status === 0) return "เชื่อมต่อเครือข่ายไม่ได้";
    const c = r.json && r.json.code;
    const e = S.ERRORS.find((x) => x.code === c);
    if (e) return e.th + (r.json.msg && c !== 200 ? ` (${r.json.msg})` : "");
    if (c !== undefined) return `code ${c}${r.json.msg ? " · " + r.json.msg : ""}`;
    return "HTTP " + r.status;
  }
  /* guarded run: risk checks + confirmations */
  async function guardedRun(ep, values) {
    if (ep.disabled) { toast(ep.disabled, "bad"); return null; }
    if (needCfg()) return null;
    const missing = (ep.params || []).filter((p) => p.required && !p.auto && p.default === undefined && (values[p.name] === undefined || values[p.name] === ""));
    if (missing.length) { toast(`กรอก ${missing.map((p) => "<code>" + esc(p.name) + "</code>").join(", ")} ก่อน`, "bad"); return null; }
    if (ep.risk === "motion" && !state.armed && !(await requestArm())) return null;
    if (ep.confirm) {
      const ok = await ask(`ยืนยัน #${ep.no} ${esc(ep.th)}`, `<p style="margin:0">${esc(ep.desc)}</p>`, "สั่งเลย");
      if (!ok) return null;
    }
    return run(ep.id, values);
  }

  /* ---------------------------------------------------------------- log */
  const logLines = [];
  function log(ep, r) {
    const t = new Date().toLocaleTimeString("th-TH", { hour12: false });
    logLines.unshift(`<div><time>${t}</time><span class="${r.ok ? "ok" : "bad"}">${r.ok ? "✔" : "✖"}</span><span>#${ep.no} ${esc(ep.th)}</span><span style="color:var(--dim)">${r.ms ? r.ms + "ms" : ""} ${r.ok ? "" : esc(humanCode(r))}</span></div>`);
    logLines.length = Math.min(logLines.length, 40);
    $("#log").innerHTML = logLines.join("");
  }
  $("#clearLog").onclick = () => { logLines.length = 0; $("#log").innerHTML = '<div><time>--:--:--</time><span>ล้างแล้ว</span></div>'; };

  /* ---------------------------------------------------------------- dashboard */
  async function testConnection() {
    if (needCfg()) return;
    setStatus("warn", "กำลังเชื่อมต่อ…");
    const r = await run("online", {}, { quiet: true });
    if (!r || !r.ok) {
      setStatus("bad", r && r.json ? humanCode(r) : "เชื่อมต่อไม่ได้");
      toast(`ทดสอบไม่ผ่าน: ${esc(humanCode(r))}${r && r.json && (r.json.code === 1000 || r.json.code === 999) ? " — ตรวจ appSecret และเวลาของเครื่อง" : ""}`, "bad");
      return;
    }
    toast(r.json.data ? `✔ เชื่อมต่อสำเร็จ — หุ่น ${esc(state.cfg.sn)} ออนไลน์` : "เชื่อมต่อ API ได้ แต่หุ่นออฟไลน์อยู่", r.json.data ? "ok" : "");
    refreshStatus();
  }
  $("#heroTest").onclick = testConnection;

  async function refreshStatus(manual) {
    if (!configured()) { if (manual) needCfg(); return; }
    const r = await run("homepage", {}, { quiet: !manual, nolog: !manual });
    if (!r || !r.ok) { setStatus("bad", humanCode(r)); $("#liveDot").className = "dot bad"; return; }
    const d = r.json.data || {};
    const online = d.robotOnlineStatus !== false;
    setStatus(online ? "ok" : "bad", `${online ? "ออนไลน์" : "ออฟไลน์"} · ${d.battery ?? "?"}%`);
    $("#liveDot").className = "dot " + (online ? "ok live" : "bad");
    $("#t-batt").textContent = d.battery != null ? d.battery + "%" : "—";
    const bar = $("#t-batt-bar"); bar.style.width = (d.battery || 0) + "%"; bar.classList.toggle("low", (d.battery || 0) < 25);
    $("#t-state").textContent = d.robotRunningState || "—";
    $("#t-state").title = d.robotRunningState || "";
    $("#t-point").textContent = d.currentPointName || "—";
    $("#t-range").textContent = d.estimatedRange != null ? d.estimatedRange + " km" : "—";
    $("#t-speed").textContent = d.linearVelocity != null ? Number(d.linearVelocity).toFixed(2) + " m/s" : "—";
    $("#t-charge").textContent = d.isCharging ? "⚡ ชาร์จอยู่" : d.backToChargeFlag ? "กำลังกลับ" : "ไม่ได้ชาร์จ";
    $("#t-hub").textContent = d.hubShaftStatus === true ? "🔒 ล็อก" : d.hubShaftStatus === false ? "ปลดล็อก" : "—";
    $("#t-ping").textContent = d.pingValue != null ? Math.round(d.pingValue) + " ms" : "—";
    if (d.isEmergencyStop) toast("⚠ หุ่นอยู่ในสถานะหยุดฉุกเฉิน (ปุ่มที่ตัวรถ)", "bad");
  }
  $("#refreshBtn").onclick = () => refreshStatus(true);
  let autoTimer = null;
  $("#autoRefresh").onchange = (e) => {
    clearInterval(autoTimer);
    if (e.target.checked) { if (needCfg()) { e.target.checked = false; return; } refreshStatus(); autoTimer = setInterval(() => { if (!document.hidden) refreshStatus(); }, 5000); }
  };

  /* quick actions */
  const QUICK = [
    ["neon-on", "ไฟนีออน ON", "bulb"], ["neon-off", "ไฟนีออน OFF", "bulb"],
    ["ambient-blink", "ไฟกะพริบ", "spark"], ["ambient-steady", "ไฟติดค้าง", "bulb"],
    ["door-open", "เปิดฝา", "door"], ["door-close", "ปิดฝา", "door"],
    ["hub-lock", "ล็อกล้อ", "lock"], ["hub-unlock", "ปลดล็อกล้อ", "unlock"],
    ["pause-move:true", "พักการวิ่ง", "pause"], ["pause-move:false", "วิ่งต่อ", "play"],
    ["task-cancel", "ยกเลิกงาน", "x"], ["recharge", "กลับแท่นชาร์จ", "home"],
  ];
  $("#quick").innerHTML = QUICK.map(([id, label, ic]) => {
    const ep = EP[id.split(":")[0]];
    return `<button class="btn sm ${ep.risk === "motion" ? "danger" : ""}" data-quick="${id}" type="button" title="#${ep.no} ${esc(ep.en)}">${svg(ic)}${label}</button>`;
  }).join("");
  $("#quick").onclick = async (e) => {
    const b = e.target.closest("[data-quick]"); if (!b) return;
    const [id, flag] = b.dataset.quick.split(":");
    const vals = flag ? { flag: flag === "true" } : {};
    b.disabled = true;
    const r = await guardedRun(EP[id], vals);
    b.disabled = false;
    if (r && r.ok) toast(`✔ ${esc(b.textContent.trim())}`, "ok");
  };

  /* ---------------------------------------------------------------- E-STOP */
  async function emergencyStop() {
    if (needCfg()) return;
    const a = await run("stop", {}, { quiet: true });
    const b = await run("pause-move", { flag: true }, { quiet: true });
    if (state.armed) setArmed(false);
    holdStop();
    const ok = (a && a.ok) || (b && b.ok);
    toast(ok ? "🛑 สั่งหยุดแล้ว (หยุด + พักการเคลื่อนที่) · ปลด ARM แล้ว" : "สั่งหยุดไม่สำเร็จ — กดปุ่มฉุกเฉินที่ตัวรถ!", ok ? "ok" : "bad",
      ok ? { label: "ปล่อยให้วิ่งต่อ", fn: () => run("pause-move", { flag: false }).then((r) => r && r.ok && toast("ปล่อยแล้ว", "ok")) } : null);
  }
  $("#estop").onclick = emergencyStop;

  /* ---------------------------------------------------------------- drive pad */
  let holdTimer = null, holdDir = null, inflight = false;
  async function sendMove(dir) {
    if (inflight) return;
    inflight = true;
    try { await run(dir, {}, { quiet: true }); } finally { inflight = false; }
  }
  function holdStop(send) {
    clearInterval(holdTimer); holdTimer = null;
    $$("#pad button.held").forEach((b) => b.classList.remove("held"));
    if (send && holdDir) run("stop", {}, { quiet: true });
    holdDir = null;
  }
  async function holdStart(dir, btn) {
    if (needCfg()) return;
    if (dir === "stop") { holdStop(); run("stop").then((r) => r && r.ok && toast("หยุดแล้ว", "ok")); return; }
    if (!state.armed) { await requestArm(); return; }
    holdDir = dir; btn && btn.classList.add("held");
    sendMove(dir);
    clearInterval(holdTimer);
    holdTimer = setInterval(() => sendMove(dir), 500);
  }
  $("#pad").addEventListener("pointerdown", (e) => {
    const b = e.target.closest("button[data-move]"); if (!b) return;
    e.preventDefault(); b.setPointerCapture?.(e.pointerId);
    holdStart(b.dataset.move, b);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => $("#pad").addEventListener(ev, () => holdDir && holdStop(true)));
  const KEYS = { ArrowUp: "forward", ArrowDown: "backward", ArrowLeft: "left", ArrowRight: "right" };
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input,textarea,select") || $(".modal-bg.on")) return;
    if (e.code === "Space" && configured() && (state.armed || holdDir)) { e.preventDefault(); holdStop(); run("stop", {}, { quiet: true }); return; }
    const dir = KEYS[e.key];
    if (!dir || !state.armed || e.repeat) return;
    e.preventDefault();
    holdStart(dir, $(`#pad [data-move=${dir}]`));
  });
  document.addEventListener("keyup", (e) => { if (KEYS[e.key] && holdDir === KEYS[e.key]) holdStop(true); });
  window.addEventListener("blur", () => holdDir && holdStop(true));

  /* ---------------------------------------------------------------- map */
  const map = { data: null, img: null, s: 1, ox: 0, oy: 0, robot: null, sel: null, dpr: 1, abort: null };
  const cv = $("#mapCanvas"), ctx = cv.getContext("2d"), box = $("#mapBox");
  function resizeCanvas() {
    map.dpr = window.devicePixelRatio || 1;
    cv.width = box.clientWidth * map.dpr; cv.height = box.clientHeight * map.dpr;
    draw();
  }
  function fitMap() {
    if (!map.data) return;
    const w = box.clientWidth, h = box.clientHeight;
    map.s = Math.min(w / map.data.width, h / map.data.height) * 0.94;
    map.ox = (w - map.data.width * map.s) / 2; map.oy = (h - map.data.height * map.s) / 2;
    draw();
  }
  const toScreen = (x, y) => [map.ox + x * map.s, map.oy + y * map.s];
  function draw() {
    ctx.setTransform(map.dpr, 0, 0, map.dpr, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!map.data) return;
    ctx.save();
    ctx.translate(map.ox, map.oy); ctx.scale(map.s, map.s);
    ctx.imageSmoothingEnabled = map.s < 1;
    if (map.img && map.img.complete && map.img.naturalWidth) {
      ctx.globalAlpha = 0.85; ctx.filter = "invert(1) hue-rotate(180deg) brightness(0.9)";
      ctx.drawImage(map.img, 0, 0, map.data.width, map.data.height);
      ctx.filter = "none"; ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 2 / map.s; ctx.strokeRect(0, 0, map.data.width, map.data.height);
    }
    ctx.restore();
    // points
    (map.data.graphicPointList || []).forEach((p) => {
      const [x, y] = toScreen(p.pointX, p.pointY);
      const on = map.sel === p;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = on ? "#e3324a" : "#d8b66c"; ctx.strokeStyle = "#140608"; ctx.lineWidth = 2;
      const r = on ? 8 : 6; ctx.fillRect(-r, -r, r * 2, r * 2); ctx.strokeRect(-r, -r, r * 2, r * 2);
      ctx.restore();
      ctx.font = "600 12px Kanit, sans-serif"; ctx.textAlign = "center";
      ctx.lineWidth = 4; ctx.strokeStyle = "rgba(10,3,5,.9)"; ctx.strokeText(p.pointName, x, y - 13);
      ctx.fillStyle = "#fff"; ctx.fillText(p.pointName, x, y - 13);
    });
    // robot
    if (map.robot) {
      const [x, y] = toScreen(map.robot.pointX, map.robot.pointY);
      const a = -((map.robot.rotation || 0) * Math.PI) / 180;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "rgba(44,199,240,.18)"; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
      ctx.rotate(a);
      ctx.fillStyle = "#2cc7f0"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-9, -9); ctx.lineTo(-4, 0); ctx.lineTo(-9, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
  async function loadMap() {
    if (needCfg()) return;
    $("#mapEmpty").textContent = "กำลังโหลดแผนที่…";
    const r = await run("map-detail");
    if (!r || !r.ok) { $("#mapEmpty").textContent = "โหลดแผนที่ไม่สำเร็จ: " + humanCode(r); return; }
    map.data = r.json.data; map.sel = null;
    $("#mapEmpty").hidden = true;
    $("#mapInfo").hidden = false;
    $("#mapInfo").textContent = `${map.data.mapName} · ${map.data.width}×${map.data.height}px · ${map.data.resolution} m/px`;
    map.img = new Image();
    map.img.referrerPolicy = "no-referrer";
    map.img.onload = draw;
    map.img.onerror = () => toast("โหลดรูปแผนที่ไม่ได้ (แสดงเฉพาะจุด)", "");
    map.img.src = map.data.mapUrl;
    fitMap();
    loadPoints(true);
  }
  $("#loadMapBtn").onclick = loadMap;
  $("#zoomIn").onclick = () => zoomAt(box.clientWidth / 2, box.clientHeight / 2, 1.35);
  $("#zoomOut").onclick = () => zoomAt(box.clientWidth / 2, box.clientHeight / 2, 1 / 1.35);
  $("#zoomFit").onclick = fitMap;
  function zoomAt(cx, cy, f) {
    if (!map.data) return;
    const ns = Math.min(8, Math.max(0.02, map.s * f));
    map.ox = cx - ((cx - map.ox) * ns) / map.s; map.oy = cy - ((cy - map.oy) * ns) / map.s; map.s = ns;
    draw(); positionPop();
  }
  box.addEventListener("wheel", (e) => { if (!map.data) return; e.preventDefault(); const r = box.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
  let drag = null;
  box.addEventListener("pointerdown", (e) => {
    if (!map.data || e.target.closest(".map-tools,.map-pop")) return;
    drag = { x: e.clientX, y: e.clientY, ox: map.ox, oy: map.oy, moved: false };
    box.setPointerCapture(e.pointerId); box.classList.add("drag");
  });
  box.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    map.ox = drag.ox + dx; map.oy = drag.oy + dy; draw(); positionPop();
  });
  box.addEventListener("pointerup", (e) => {
    box.classList.remove("drag");
    if (drag && !drag.moved) pickPoint(e);
    drag = null;
  });
  function pickPoint(e) {
    const r = box.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = null, bd = 16;
    (map.data.graphicPointList || []).forEach((p) => { const [x, y] = toScreen(p.pointX, p.pointY); const d = Math.hypot(x - mx, y - my); if (d < bd) { bd = d; best = p; } });
    map.sel = best; draw(); showPop();
  }
  function findPointId(name) {
    const mapName = map.data && map.data.mapName;
    const hit = state.points.find((p) => p.pointName === name && (!mapName || p.mapName === mapName)) || state.points.find((p) => p.pointName === name);
    return hit ? hit.id : null;
  }
  function showPop() {
    $("#mapPop")?.remove();
    if (!map.sel) return;
    const p = map.sel, id = findPointId(p.pointName);
    const el = document.createElement("div");
    el.className = "map-pop"; el.id = "mapPop";
    el.innerHTML = `<h4>${esc(p.pointName)}</h4><p>px (${Math.round(p.pointX)}, ${Math.round(p.pointY)})${id ? " · id " + id : ""}</p>
      <div class="actions">${id ? `<button class="btn xs danger" type="button" data-goto="${id}">${svg("pin")}ไปที่จุดนี้</button>` : `<button class="btn xs" type="button" data-loadpts>โหลด ID จุด (#14)</button>`}
      <button class="btn xs ghost" type="button" data-closepop>ปิด</button></div>`;
    box.appendChild(el); positionPop();
    el.onclick = async (ev) => {
      if (ev.target.closest("[data-closepop]")) { map.sel = null; el.remove(); draw(); }
      if (ev.target.closest("[data-loadpts]")) { await loadPoints(); showPop(); }
      const g = ev.target.closest("[data-goto]");
      if (g) { const r = await guardedRun(EP["goto-id"], { id: g.dataset.goto }); if (r && r.ok) toast(`🚀 กำลังไป ${esc(p.pointName)}`, "ok"); }
    };
  }
  function positionPop() {
    const el = $("#mapPop"); if (!el || !map.sel) return;
    const [x, y] = toScreen(map.sel.pointX, map.sel.pointY);
    el.style.left = Math.max(100, Math.min(box.clientWidth - 100, x)) + "px"; el.style.top = Math.max(110, y) + "px";
  }
  window.addEventListener("resize", () => { resizeCanvas(); positionPop(); });

  /* SSE live position */
  async function sseLoop() {
    while ($("#sseToggle").checked) {
      map.abort = new AbortController();
      try {
        await S.stream(EP["sse-ui-point"].path, { sn: state.cfg.sn }, state.cfg, (d) => {
          if (d && typeof d === "object" && "pointX" in d) { map.robot = d; draw(); }
        }, map.abort.signal);
      } catch (e) { if (e.name === "AbortError") break; }
      if ($("#sseToggle").checked) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  $("#sseToggle").onchange = (e) => {
    if (e.target.checked) {
      if (needCfg()) { e.target.checked = false; return; }
      if (!map.data) loadMap();
      toast("เริ่มฟังตำแหน่งสด (SSE)", "ok");
      sseLoop();
    } else if (map.abort) map.abort.abort();
  };

  /* ---------------------------------------------------------------- points & dict cache */
  async function loadPoints(quiet) {
    const r = await run("points", {}, { quiet });
    if (!r || !r.ok) return [];
    state.points = [];
    (r.json.data || []).forEach((g) => (g.pointList || []).forEach((p) => state.points.push({ ...p, flagName: g.pointFlagName })));
    renderPointChips();
    $$("select[data-picker=point]").forEach(fillPointSelect);
    if (!quiet) toast(`โหลดจุดแล้ว ${state.points.length} จุด`, "ok");
    return state.points;
  }
  function renderPointChips() {
    $("#pointsList").innerHTML = state.points.map((p) =>
      `<span class="chip">${esc(p.pointName)} <em>#${p.id} · ${esc(p.flagName || "")}</em><button class="btn xs danger" type="button" data-goto="${p.id}" title="#23 ไปที่จุดนี้">ไป</button></span>`).join("");
  }
  $("#pointsList").onclick = async (e) => {
    const g = e.target.closest("[data-goto]"); if (!g) return;
    const r = await guardedRun(EP["goto-id"], { id: g.dataset.goto });
    if (r && r.ok) toast("🚀 ส่งคำสั่งไปยังจุดแล้ว", "ok");
  };
  function fillPointSelect(sel) {
    const cur = sel.value;
    sel.innerHTML = `<option value="">— เลือกจุด (${state.points.length}) —</option>` +
      state.points.map((p) => `<option value="${p.id}">#${p.id} · ${esc(p.pointName)} (${esc(p.flagName || p.mapName || "")})</option>`).join("");
    sel.value = cur;
  }
  async function loadDict() {
    const r = await run("point-dict", { dictType: "robot_point_flag" }, { quiet: true });
    if (r && r.ok) { state.dict = r.json.data || []; $$("select[data-picker=dict]").forEach(fillDictSelect); toast(`โหลดประเภทจุด ${state.dict.length} แบบ`, "ok"); }
  }
  function fillDictSelect(sel) {
    const cur = sel.value;
    sel.innerHTML = state.dict.map((d) => `<option value="${esc(d.value)}">${esc(d.value)} · ${esc(d.label)}</option>`).join("");
    if (cur) sel.value = cur;
  }

  /* ---------------------------------------------------------------- hero */
  $("#heroFrame").insertAdjacentHTML("beforeend", HOTSPOTS.map((h) =>
    `<button class="hotspot" type="button" style="left:${h.x}%;top:${h.y}%" data-go="${h.go}" aria-label="${esc(h.th)}">${h.n}<span class="tip">${esc(h.th)}</span></button>`).join(""));
  $("#heroLegend").innerHTML = HOTSPOTS.map((h) => `<button type="button" data-go="${h.go}"><i>${h.n}</i>${esc(h.th)}</button>`).join("");
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]"); if (!g) return;
    goTo(g.dataset.go);
  });
  function goTo(anchor) {
    const el = document.getElementById(anchor); if (!el) return;
    if (anchor.startsWith("ep-")) openEp(anchor.slice(3), true);
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------------------------------------------------------- explorer */
  function epHead(ep) {
    const [rc, rt] = RISK[ep.risk];
    return `<div class="ep-head" data-toggle>
      <div class="ep-icon">${svg(EP_ICON[ep.id])}</div>
      <div class="ep-title">
        <h4><span class="num">#${ep.no}</span>${esc(ep.th)}
          <span class="badge ${ep.deprecated || ep.disabled ? "dep" : rc}">${ep.disabled ? "ปิดใช้งาน" : ep.deprecated ? "เลิกใช้แล้ว" : rt}</span>
          ${ep.note ? `<span class="badge note">${esc(ep.note)}</span>` : ""}
          ${ep.stream ? '<span class="badge note">SSE stream</span>' : ""}</h4>
        <div class="ep-sub">${esc(ep.en)} · <span class="zh">${esc(ep.zh)}</span></div>
        <div class="path"><span class="m ${ep.method}">${ep.method}</span><code>${esc(ep.path)}</code>
          <button class="btn xs ghost" type="button" data-copy="${esc(S.BASE_URL + ep.path)}" title="คัดลอก URL">${svg("copy")}</button></div>
      </div>
      <div class="ep-toggle">${svg("chev", 'width="20" height="20"')}</div>
    </div>`;
  }
  function fieldHtml(ep, p) {
    const id = `f-${ep.id}-${p.name.replace(/\./g, "_")}`;
    const v = state.values[ep.id]?.[p.name] ?? p.default ?? "";
    const lab = `<label for="${id}"><code>${esc(p.name)}</code>${p.required ? '<span class="req">*</span>' : ""}<em>${esc(p.type)} · ${p.in}</em></label>`;
    const help = `<div class="help">${esc(p.desc || "")}</div>`;
    let input;
    if (p.auto === "sn") input = `<input id="${id}" data-auto="sn" readonly value="${esc(state.cfg.sn || "(ใส่ใน config)")}" title="เติมจาก config อัตโนมัติ" />`;
    else if (p.options) input = `<select id="${id}" data-p="${p.name}">${p.options.map(([ov, ol]) => `<option value="${ov}" ${String(ov) === String(v) ? "selected" : ""}>${esc(ol)}</option>`).join("")}</select>`;
    else if (p.type === "bool") input = `<select id="${id}" data-p="${p.name}"><option value="true" ${String(v) === "true" ? "selected" : ""}>true</option><option value="false" ${String(v) === "false" ? "selected" : ""}>false</option></select>`;
    else if (p.picker === "point") input = `<div class="row"><input id="${id}" data-p="${p.name}" type="number" placeholder="id" value="${esc(v)}" style="max-width:110px" /><select data-picker="point" data-for="${id}"><option value="">— กด “โหลดจุด” —</option></select><button class="btn sm" type="button" data-loadpoints>โหลดจุด</button></div>`;
    else if (p.picker === "dict") input = `<div class="row"><select id="${id}" data-p="${p.name}" data-picker="dict"><option value="${esc(v)}">${esc(v)}</option></select><button class="btn sm" type="button" data-loaddict>โหลดประเภท</button></div>`;
    else input = `<input id="${id}" data-p="${p.name}" type="${p.type === "int" || p.type === "number" ? "number" : "text"}" ${p.type === "number" ? 'step="any"' : ""} value="${esc(v)}" placeholder="${p.required ? "" : "(ไม่บังคับ)"}" spellcheck="false" />`;
    const wide = p.auto || p.picker || p.options || p.type === "string";
    return `<div class="field${wide ? " wide" : ""}">${lab}${input}${help}</div>`;
  }
  function epBody(ep) {
    const params = ep.params || [];
    const warn = ep.disabled ? `<div class="warn-box dep">${svg("alert")}<span>${esc(ep.disabled)}</span></div>`
      : ep.deprecated ? `<div class="warn-box dep">${svg("alert")}<span>เลิกใช้แล้ว — ${esc(ep.deprecated)}</span></div>`
      : ep.risk === "motion" ? `<div class="warn-box motion">${svg("alert")}<span>คำสั่งนี้ทำให้หุ่นเคลื่อนที่จริง — ต้องเปิด ARM และตรวจพื้นที่รอบหุ่นก่อน</span></div>` : "";
    return `<div class="ep-body">
      <div class="ep-left">
        <p class="ep-desc">${esc(ep.desc)}</p>
        ${warn}
        ${params.length ? `<div class="params${params.filter((p) => !p.auto).length >= 3 ? " cols" : ""}">${params.map((p) => fieldHtml(ep, p)).join("")}</div>` : `<div class="no-params">ไม่ต้องใส่พารามิเตอร์ — header ลายเซ็นทั้งหมดสร้างให้อัตโนมัติ</div>`}
        <div class="actions">
          <button class="btn primary run" type="button" data-run="${ep.id}"></button>
          <button class="btn gold sm" type="button" data-export="js" title="Export JavaScript">${svg("code")}JS</button>
          <button class="btn gold sm" type="button" data-export="py" title="Export Python">${svg("code")}Python</button>
        </div>
      </div>
      <div class="ep-right">
        <div class="tabs" role="tablist">
          <button class="on" type="button" data-tab="resp">ผลลัพธ์</button>
          <button type="button" data-tab="fields">ความหมายของแต่ละช่อง</button>
          <button type="button" data-tab="req">Request ที่ส่ง</button>
        </div>
        <div class="tab on" data-pane="resp"><div class="placeholder">${svg("play")}กด <b>▶ ลองเลย</b> เพื่อเรียก API จริง ผลลัพธ์จะแสดงตรงนี้</div></div>
        <div class="tab" data-pane="fields">${fieldsDocHtml(ep)}</div>
        <div class="tab" data-pane="req"><div class="placeholder">ยังไม่มี request — กดลองก่อน</div></div>
      </div>
    </div>`;
  }
  function fieldsDocHtml(ep, json) {
    const rows = [];
    const doc = ep.fields || {};
    if (json && typeof json === "object") {
      const seen = new Set();
      const walk = (o, path, depth) => {
        if (rows.length > 80) return;
        if (Array.isArray(o)) { if (o.length) walk(o[0], path + "[]", depth + 1); else rows.push([path, "[]", doc[path] || ""]); return; }
        if (o && typeof o === "object" && depth < 4) { Object.entries(o).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k, depth + 1)); return; }
        if (seen.has(path)) return; seen.add(path);
        rows.push([path, o === null ? "null" : typeof o === "object" ? "{…}" : String(o), doc[path] || ""]);
      };
      walk(json.data, "data", 0);
      return `<div class="table-scroll"><table class="fields"><tbody>${rows.map(([k, v, d]) => `<tr><td>${esc(k)}</td><td>${esc(v.length > 60 ? v.slice(0, 60) + "…" : v)}</td><td>${esc(d || "—")}</td></tr>`).join("")}</tbody></table></div>
        <p class="help" style="font-size:12px;color:var(--dim);margin:10px 0 0">แสดงค่าจริงจากผลลัพธ์ล่าสุด (array แสดงเฉพาะตัวแรก)</p>`;
    }
    const ent = Object.entries(doc);
    if (!ent.length) return '<div class="placeholder">ไม่มีข้อมูลฟิลด์</div>';
    return `<div class="table-scroll"><table class="fields"><tbody>
      <tr><td>code</td><td>int</td><td>200 = สำเร็จ · ดูตารางรหัสด้านล่าง</td></tr>
      <tr><td>msg</td><td>string</td><td>ข้อความแจ้งเตือน/ข้อผิดพลาด</td></tr>
      ${ent.map(([k, d]) => `<tr><td>${esc(k)}</td><td></td><td>${esc(d)}</td></tr>`).join("")}</tbody></table></div>`;
  }
  function updateRunBtn(btn) {
    const ep = EP[btn.dataset.run];
    if (ep.disabled) { btn.disabled = true; btn.innerHTML = `${svg("x")}เรียกไม่ได้`; return; }
    const locked = ep.risk === "motion" && !state.armed;
    btn.classList.toggle("motion-locked", locked);
    btn.innerHTML = locked ? `${svg("lock")}ARM แล้วลอง` : ep.stream ? `${svg("radio")}ฟังสตรีม 15 วิ` : `${svg("play")}ลองเลย`;
  }

  function renderExplorer() {
    const side = [], cats = [], mob = [];
    S.CATEGORIES.forEach((c) => {
      const eps = S.ENDPOINTS.filter((e) => e.cat === c.id);
      side.push(`<h5>${esc(c.th)}</h5>` + eps.map((e) => `<a href="#ep-${e.id}" data-ep="${e.id}" class="${e.deprecated || e.disabled ? "off" : ""}"><span class="no">${e.no}</span><span class="m ${e.method}">${e.method}</span>${esc(e.th)}</a>`).join(""));
      mob.push(`<a href="#cat-${c.id}">${esc(c.th)}</a>`);
      const rings = (CAT_RINGS[c.id] || []).map(([x, y]) => `<span class="ring" style="left:${x}%;top:${y}%"></span>`).join("");
      cats.push(`<div class="cat" id="cat-${c.id}">
        <div class="card cat-banner cut">
          <div class="mini-robot"><img src="assets/img/speedybot.jpg" alt="ตำแหน่งบนตัวหุ่น: ${esc(c.th)}" loading="lazy" />${rings}</div>
          <div><h3>${svg(c.icon, 'width="26" height="26" style="color:var(--red-2)"')}${esc(c.th)} <small>${esc(c.en)}</small></h3><p>${esc(c.desc)}</p></div>
        </div>
        ${eps.map((e) => `<article class="card ep" id="ep-${e.id}" data-id="${e.id}">${epHead(e)}</article>`).join("")}
      </div>`);
    });
    $("#sideList").innerHTML = side.join("");
    $("#catList").innerHTML = cats.join("");
    $("#mobileCats").innerHTML = mob.join("");
    $("#errTable").innerHTML = S.ERRORS.map((e) => `<tr><td>${e.code}</td><td>${esc(e.th)}<br/><span style="color:var(--dim);font-size:12.5px">${esc(e.en)}</span></td></tr>`).join("") +
      `<tr><td>HTTP 0</td><td>เรียกไม่ถึงเซิร์ฟเวอร์ (อินเทอร์เน็ต / ไฟร์วอลล์ / CORS)</td></tr>`;
  }

  function openEp(id, scroll) {
    const art = $(`#ep-${id}`); if (!art) return;
    if (!art.querySelector(".ep-body")) {
      art.insertAdjacentHTML("beforeend", epBody(EP[id]));
      updateRunBtn(art.querySelector("[data-run]"));
      art.querySelectorAll("select[data-picker=point]").forEach(fillPointSelect);
      if (state.dict.length) art.querySelectorAll("select[data-picker=dict]").forEach(fillDictSelect);
      if (state.last[id]) renderResult(EP[id], state.last[id]);
    }
    art.classList.add("open");
    if (scroll) {
      art.scrollIntoView({ behavior: "smooth", block: "start" });
      art.classList.remove("flash"); void art.offsetWidth; art.classList.add("flash");
    }
    $$("#sideList a").forEach((a) => a.classList.toggle("active", a.dataset.ep === id));
  }

  function collectValues(ep, art) {
    const v = {};
    art.querySelectorAll("[data-p]").forEach((i) => { v[i.dataset.p] = i.value; });
    state.values[ep.id] = v;
    return v;
  }

  $("#catList").addEventListener("click", async (e) => {
    const art = e.target.closest(".ep"); if (!art) return;
    const ep = EP[art.dataset.id];
    const cp = e.target.closest("[data-copy]");
    if (cp) { copy(cp.dataset.copy, cp.closest(".path") ? "คัดลอก URL แล้ว" : "คัดลอกแล้ว"); return; }
    if (e.target.closest("[data-toggle]")) {
      if (art.classList.contains("open")) art.classList.remove("open"); else openEp(ep.id);
      return;
    }
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      art.querySelectorAll("[data-tab]").forEach((t) => t.classList.toggle("on", t === tab));
      art.querySelectorAll("[data-pane]").forEach((p) => p.classList.toggle("on", p.dataset.pane === tab.dataset.tab));
      return;
    }
    if (e.target.closest("[data-loadpoints]")) { if (!needCfg()) loadPoints(); return; }
    if (e.target.closest("[data-loaddict]")) { if (!needCfg()) loadDict(); return; }
    const ex = e.target.closest("[data-export]");
    if (ex) { openCode({ ep, values: collectValues(ep, art) }, ex.dataset.export); return; }
    const rb = e.target.closest("[data-run]");
    if (rb) {
      const values = collectValues(ep, art);
      if (ep.stream) { runStream(ep, art, rb); return; }
      rb.disabled = true; const old = rb.innerHTML; rb.innerHTML = "กำลังเรียก…";
      const r = await guardedRun(ep, values);
      rb.disabled = false; rb.innerHTML = old; updateRunBtn(rb);
      if (r) {
        state.last[ep.id] = r; renderResult(ep, r);
        if (ep.id === "points" && r.ok) { state.points = []; (r.json.data || []).forEach((g) => (g.pointList || []).forEach((p) => state.points.push({ ...p, flagName: g.pointFlagName }))); renderPointChips(); $$("select[data-picker=point]").forEach(fillPointSelect); }
        if (ep.id === "point-dict" && r.ok) { state.dict = r.json.data || []; $$("select[data-picker=dict]").forEach(fillDictSelect); }
      }
    }
  });
  $("#catList").addEventListener("change", (e) => {
    const sel = e.target.closest("select[data-picker=point]");
    if (sel && sel.value) $("#" + sel.dataset.for).value = sel.value;
  });
  $("#sideList").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-ep]"); if (!a) return;
    e.preventDefault(); openEp(a.dataset.ep, true);
  });
  function filterEndpoints(raw) {
    const q = raw.trim().toLowerCase();
    S.ENDPOINTS.forEach((ep) => {
      const hit = !q || [ep.th, ep.en, ep.zh, ep.path, "#" + ep.no, ep.method, ep.desc].join(" ").toLowerCase().includes(q);
      $(`#ep-${ep.id}`).style.display = hit ? "" : "none";
      $(`#sideList a[data-ep="${ep.id}"]`).style.display = hit ? "" : "none";
    });
    $$(".cat").forEach((c) => { c.style.display = [...c.querySelectorAll(".ep")].some((a) => a.style.display !== "none") ? "" : "none"; });
  }
  ["#search", "#msearch"].forEach((sel) => $(sel).addEventListener("input", (e) => {
    const other = sel === "#search" ? "#msearch" : "#search";
    $(other).value = e.target.value;
    filterEndpoints(e.target.value);
  }));

  async function runStream(ep, art, btn) {
    if (needCfg()) return;
    const pane = art.querySelector('[data-pane="resp"]');
    const ac = new AbortController();
    const events = [];
    btn.disabled = true; btn.innerHTML = "กำลังฟัง… 15";
    let left = 15;
    const tick = setInterval(() => { left--; btn.innerHTML = `กำลังฟัง… ${left}`; if (left <= 0) ac.abort(); }, 1000);
    const paint = () => {
      pane.innerHTML = `<div class="resp-meta"><span class="chip ok">SSE</span><span class="human">ได้รับ ${events.length} event</span></div>
        <pre class="json">${events.slice(-20).map((x) => highlightJson(x)).join("\n")}</pre>`;
    };
    paint();
    try {
      await S.stream(ep.path, { sn: state.cfg.sn }, state.cfg, (d) => {
        events.push(d);
        if (d && typeof d === "object" && "pointX" in d && map.data) { map.robot = d; draw(); }
        paint();
      }, ac.signal);
      log(ep, { ok: true, ms: 0 });
    } catch (err) {
      if (err.name !== "AbortError") { pane.innerHTML = `<div class="placeholder">สตรีมผิดพลาด: ${esc(err.message)}</div>`; log(ep, { ok: false, status: 0, text: String(err) }); }
      else log(ep, { ok: true, ms: 15000 });
    }
    clearInterval(tick); btn.disabled = false; updateRunBtn(btn);
  }

  function highlightJson(obj) {
    const s = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
    return esc(s).replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)?|\b(true|false)\b|\bnull\b|-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/g, (m, str, colon, bool) => {
      if (str) return colon ? `<span class="k">${str}</span>${colon}` : `<span class="s">${str}</span>`;
      if (bool) return `<span class="b">${m}</span>`;
      if (m === "null") return `<span class="z">${m}</span>`;
      return `<span class="n">${m}</span>`;
    });
  }
  function renderResult(ep, r) {
    const art = $(`#ep-${ep.id}`); if (!art || !art.querySelector(".ep-body")) return;
    const code = r.json && r.json.code;
    art.querySelector('[data-pane="resp"]').innerHTML = `
      <div class="resp-meta">
        <span class="chip ${r.status === 200 ? "ok" : "bad"}">HTTP ${r.status || "—"}</span>
        ${code !== undefined && code !== null ? `<span class="chip ${code === 200 ? "ok" : "bad"}">code ${code}</span>` : ""}
        ${r.ms ? `<span class="chip">${r.ms} ms</span>` : ""}
        <span class="human">${esc(humanCode(r))}</span>
      </div>
      <div class="code-wrap"><pre class="json">${r.json ? highlightJson(r.json) : esc(r.text || "")}</pre>
      ${r.json ? `<button class="btn xs" type="button" data-copy="${esc(JSON.stringify(r.json, null, 2))}">${svg("copy")}คัดลอก</button>` : ""}</div>`;
    if (r.json && r.json.data !== undefined) art.querySelector('[data-pane="fields"]').innerHTML = fieldsDocHtml(ep, r.json);
    if (r.req) {
      const h = { ...r.req.headers, "Alpha-App-Key": mask(r.req.headers["Alpha-App-Key"]) };
      art.querySelector('[data-pane="req"]').innerHTML = `
        <div class="mono-box" style="margin-bottom:10px"><span class="h">${ep.method}</span> ${esc(r.req.url)}</div>
        <dl class="kv">${Object.entries(h).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
        ${r.req.payload !== undefined ? `<div style="margin-top:10px;font-size:12px;color:var(--dim)">Body</div><div class="mono-box">${esc(r.req.payload)}</div>` : ""}
        <div style="margin-top:10px;font-size:12px;color:var(--dim)">ข้อความที่นำไป SHA-1 (ซ่อน appSecret)</div>
        <div class="mono-box">${esc(r.req.explain.signInputMasked)}</div>`;
    }
  }

  function copy(text, msg = "คัดลอกแล้ว") {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => toast(msg, "ok"))
      .catch(() => { const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); toast(msg, "ok"); });
  }

  /* ---------------------------------------------------------------- code export */
  function highlightCode(code, lang) {
    const kw = lang === "js"
      ? "const|let|async|await|function|return|if|else|for|of|new|class|try|catch|throw|while|require|module|exports|static|this|undefined|null|true|false"
      : "def|import|from|with|as|return|if|else|elif|for|in|not|and|or|class|try|except|raise|while|None|True|False|self|super";
    const cm = lang === "js" ? "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" : "#[^\\n]*|\"\"\"[\\s\\S]*?\"\"\"";
    const re = new RegExp(`(${cm})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|\\b(${kw})\\b|\\b(\\d+(?:\\.\\d+)?)\\b`, "g");
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const t = esc(m[0]);
      out += m[1] ? `<span class="c">${t}</span>` : m[2] ? `<span class="s">${t}</span>` : m[3] ? `<span class="kw">${t}</span>` : `<span class="n">${t}</span>`;
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }
  function currentCode() {
    const c = state.codeCtx, lang = c.lang, ws = $("#withSecrets").checked;
    return c.sdk ? S.exportSdk(lang, state.cfg, ws) : S.exportEndpoint(c.ep, c.values, state.cfg, lang, ws);
  }
  function renderCode() {
    const c = state.codeCtx;
    $$("#codeSeg button").forEach((b) => b.classList.toggle("on", b.dataset.lang === c.lang));
    $("#codeTitle").innerHTML = c.sdk ? `${svg("code", 'width="20"')} Speedybot SDK — ${c.lang === "js" ? "JavaScript" : "Python"}`
      : `${svg("code", 'width="20"')} #${c.ep.no} ${esc(c.ep.th)}`;
    $("#codeOut").innerHTML = highlightCode(currentCode(), c.lang);
  }
  function openCode(ctx, lang) {
    state.codeCtx = { ...ctx, lang };
    $("#withSecrets").checked = false;
    renderCode(); openModal("#codeModal");
  }
  $("#codeSeg").onclick = (e) => { const b = e.target.closest("button[data-lang]"); if (!b) return; state.codeCtx.lang = b.dataset.lang; renderCode(); };
  $("#withSecrets").onchange = (e) => {
    if (e.target.checked && !configured()) { e.target.checked = false; needCfg(); return; }
    if (e.target.checked) toast("⚠ โค้ดตอนนี้มี key จริง — ห้ามแชร์หรือ commit ขึ้น Git", "bad");
    renderCode();
  };
  $("#codeCopy").onclick = () => copy(currentCode(), "คัดลอกโค้ดแล้ว");
  $("#codeDl").onclick = () => {
    const c = state.codeCtx, ext = c.lang === "js" ? "js" : "py";
    const name = c.sdk ? `speedybot.${ext}` : `speedybot_${c.ep.no}_${c.ep.id.replace(/-/g, "_")}.${ext}`;
    const blob = new Blob([currentCode()], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(`ดาวน์โหลด ${name}`, "ok");
  };
  $$("[data-sdk]").forEach((b) => (b.onclick = () => openCode({ sdk: true }, b.dataset.sdk)));

  /* ---------------------------------------------------------------- sign demo */
  let signKind = "get";
  $("#signSeg").onclick = (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; signKind = b.dataset.k; $$("#signSeg button").forEach((x) => x.classList.toggle("on", x === b)); renderSignDemo(); };
  $("#signRegen").onclick = () => renderSignDemo();
  async function renderSignDemo() {
    const box = $("#signDemo");
    if (!configured()) { box.innerHTML = `<div class="placeholder">ใส่ API Key ก่อน แล้วระบบจะคำนวณลายเซ็นให้ดูทีละขั้น<br/>(appSecret จะแสดงเป็น ‹appSecret› เสมอ)</div>`; return; }
    const ep = signKind === "get" ? EP["realtime-point"] : EP.points;
    const args = S.buildArgs(ep, {}, state.cfg);
    const req = await S.signRequest(ep.method, ep.path, args, state.cfg);
    const x = req.explain;
    const colored = esc(x.signInputMasked)
      .replace("‹appSecret›", '<span class="s">‹appSecret›</span>')
      .replace(esc(x.fixed), `<span class="f">${esc(x.fixed)}</span>`)
      .replace(x.paramStr ? esc(x.paramStr) : "\u0000", `<span class="p">${esc(x.paramStr)}</span>`)
      .replace(x.payload ? esc(x.payload) : "\u0000", `<span class="p">${esc(x.payload || "")}</span>`);
    box.innerHTML = `
      <p style="margin:0 0 8px;font-size:13.5px;color:var(--muted)">ตัวอย่าง: <span class="m ${ep.method}">${ep.method}</span> <code>${esc(ep.path)}</code></p>
      <dl class="kv" style="margin-bottom:12px">
        <dt>Timestamp</dt><dd>${req.headers.Timestamp}</dd>
        <dt>Alpha-Nonce</dt><dd>${req.headers["Alpha-Nonce"]}</dd>
        <dt>${ep.method === "GET" ? "query (sorted)" : "body (compact)"}</dt><dd>${esc(ep.method === "GET" ? x.paramStr : x.payload)}</dd>
      </dl>
      <div style="font-size:12px;color:var(--dim);margin-bottom:4px">ข้อความก่อน SHA-1 = <span style="color:var(--gold-2)">appSecret</span> + ${ep.method === "GET" ? '<span style="color:var(--cyan)">query</span> + <span style="color:#ffb3bd">fixed</span>' : '<span style="color:#ffb3bd">fixed</span> + <span style="color:var(--cyan)">body</span>'}</div>
      <div class="mono-box" style="margin-bottom:12px">${colored}</div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:4px">Alpha-Sign = sha1(…)</div>
      <div class="mono-box"><span class="h">${req.sign}</span></div>`;
  }

  /* ---------------------------------------------------------------- mobile menu */
  const menuBtn = $("#menuBtn"), mnav = $("#mnav");
  const setMenu = (on) => { mnav.classList.toggle("on", on); menuBtn.setAttribute("aria-expanded", on); };
  menuBtn.onclick = (e) => { e.stopPropagation(); setMenu(!mnav.classList.contains("on")); };
  mnav.addEventListener("click", (e) => { if (e.target.closest("a,button")) setMenu(false); });
  document.addEventListener("click", (e) => { if (mnav.classList.contains("on") && !e.target.closest("#mnav")) setMenu(false); });
  window.addEventListener("resize", () => { if (innerWidth >= 1100) setMenu(false); });
  $$("[data-open-cfg]").forEach((b) => (b.onclick = openCfg));

  /* highlight the category chip of the section in view (phone/tablet bar) */
  function observeCats() {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      $$("#mobileCats a").forEach((a) => {
        const on = a.getAttribute("href") === "#" + en.target.id;
        a.classList.toggle("on", on);
        if (on) { const bar = $("#mobileCats"); bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" }); }
      });
    }), { rootMargin: "-140px 0px -60% 0px" });
    $$(".cat").forEach((c) => io.observe(c));
  }

  /* ---------------------------------------------------------------- init */
  loadCfg();
  renderExplorer();
  observeCats();
  resizeCanvas();
  onCfgChanged();
  setArmed(false);
  if (configured()) { setStatus("warn", "กำลังเชื่อมต่อ…"); refreshStatus(); }
  else setTimeout(() => toast("เริ่มต้น: ใส่ API Key ของหุ่นก่อน", "", { label: "ตั้งค่า", fn: openCfg }), 700);
  if (location.hash.startsWith("#ep-")) openEp(location.hash.slice(4), true);
})();
