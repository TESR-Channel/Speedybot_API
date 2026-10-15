/* =========================================================================
   TESR video player — HTML5 <video> with custom controls
   play/pause · seek bar (drag) · −10/+10 s · speed 0.5–2× · volume ·
   fullscreen · keyboard · double-tap to skip · resume where you left off.
   Falls back to the Google Drive player if the direct stream fails.
   Usage: TesrPlayer.mount(boxEl, { src, embed, view, title, key, lang, poster })
   ========================================================================= */
(function () {
  "use strict";
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const TXT = {
    th: {
      play: "เล่น", pause: "หยุดชั่วคราว", back: "ย้อน 10 วินาที", fwd: "ข้าม 10 วินาที", speed: "ความเร็ว",
      mute: "ปิดเสียง", unmute: "เปิดเสียง", full: "เต็มจอ", exitFull: "ออกจากเต็มจอ", seek: "เลื่อนเวลา",
      loading: "กำลังโหลดวิดีโอ…", resume: "ดูต่อจาก", restart: "เริ่มใหม่",
      fallback: "เปิดวิดีโอแบบนี้ไม่ได้ — เปลี่ยนไปใช้เครื่องเล่น Google Drive", useDrive: "ใช้เครื่องเล่น Google Drive",
      useOurs: "กลับไปใช้เครื่องเล่นนี้", keys: "คีย์ลัด: Space เล่น/หยุด · ← → 5 วิ · J L 10 วิ · < > ความเร็ว · F เต็มจอ · M เสียง",
    },
    en: {
      play: "Play", pause: "Pause", back: "Back 10 s", fwd: "Forward 10 s", speed: "Speed",
      mute: "Mute", unmute: "Unmute", full: "Fullscreen", exitFull: "Exit fullscreen", seek: "Seek",
      loading: "Loading video…", resume: "Resume from", restart: "Start over",
      fallback: "This video can't play here — switching to the Google Drive player", useDrive: "Use the Google Drive player",
      useOurs: "Back to this player", keys: "Keys: Space play/pause · ← → 5 s · J L 10 s · < > speed · F fullscreen · M mute",
    },
  };
  const I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><text x="12" y="15.5" font-size="7.5" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif">10</text></svg>',
    fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/><text x="12" y="15.5" font-size="7.5" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif">10</text></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
    muted: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>',
  };
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    s = Math.floor(s);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0");
  };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const players = new Set();

  function driveFrame(box, o, T, reason) {
    box.querySelectorAll(".vp, iframe, .vp-note").forEach((n) => n.remove());
    const f = document.createElement("iframe");
    f.src = o.embed; f.allow = "autoplay; fullscreen"; f.allowFullscreen = true; f.title = o.title;
    box.prepend(f);
    if (reason) {
      const n = document.createElement("div");
      n.className = "vp-note"; n.textContent = T.fallback;
      f.after(n);
    }
    const sw = box.querySelector(".vp-switch");
    if (sw) { sw.textContent = T.useOurs; sw.onclick = () => mount(box, o); }
  }

  function mount(box, o) {
    const T = TXT[o.lang === "en" ? "en" : "th"];
    const posKey = "tesr.vpos." + o.key, spdKey = "tesr.vspeed";
    box.querySelectorAll(".vplay, iframe, .vp, .vp-note").forEach((n) => n.remove());
    box.classList.add("on");

    const wrap = document.createElement("div");
    wrap.className = "vp paused show";
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", o.title);
    wrap.innerHTML = `
      <video playsinline preload="metadata"${o.poster ? ` poster="${o.poster}"` : ""}></video>
      <div class="vp-tap l"><span>−10</span></div><div class="vp-tap r"><span>+10</span></div>
      <button type="button" class="vp-big" aria-label="${T.play}">${I.play}</button>
      <div class="vp-spin" aria-hidden="true"></div>
      <div class="vp-resume" hidden><button type="button" class="vp-res-go"></button><button type="button" class="vp-res-no">${T.restart}</button></div>
      <div class="vp-ui">
        <div class="vp-seekwrap">
          <div class="vp-buf"></div>
          <input class="vp-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="${T.seek}" />
          <div class="vp-tip" hidden></div>
        </div>
        <div class="vp-row">
          <button type="button" class="vp-btn vp-pp" aria-label="${T.play}" title="${T.play} (Space)">${I.play}</button>
          <button type="button" class="vp-btn vp-back" aria-label="${T.back}" title="${T.back} (J)">${I.back}</button>
          <button type="button" class="vp-btn vp-fwd" aria-label="${T.fwd}" title="${T.fwd} (L)">${I.fwd}</button>
          <span class="vp-time"><b class="vp-cur">0:00</b> / <span class="vp-dur">0:00</span></span>
          <span class="vp-grow"></span>
          <button type="button" class="vp-btn vp-mute" aria-label="${T.mute}" title="${T.mute} (M)">${I.vol}</button>
          <input class="vp-vol" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume" />
          <label class="vp-speed" title="${T.speed} (< >)"><span class="sr">${T.speed}</span>
            <select aria-label="${T.speed}">${SPEEDS.map((s) => `<option value="${s}"${s === 1 ? " selected" : ""}>${s}×</option>`).join("")}</select>
          </label>
          <button type="button" class="vp-btn vp-fs" aria-label="${T.full}" title="${T.full} (F)">${I.full}</button>
        </div>
      </div>`;
    box.prepend(wrap);

    const $ = (s) => wrap.querySelector(s);
    const v = $("video"), seek = $(".vp-seek"), buf = $(".vp-buf"), tip = $(".vp-tip");
    const pp = $(".vp-pp"), big = $(".vp-big"), cur = $(".vp-cur"), dur = $(".vp-dur");
    const mute = $(".vp-mute"), vol = $(".vp-vol"), sel = $(".vp-speed select"), fs = $(".vp-fs");
    let dragging = false, hideT = 0, failed = false, started = false;

    /* footer: switch to Drive + key help */
    const foot = box.querySelector(".vfoot");
    if (foot && !foot.querySelector(".vp-switch")) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "vp-switch";
      foot.insertBefore(b, foot.lastElementChild);
    }
    const sw = box.querySelector(".vp-switch");
    if (sw) { sw.textContent = T.useDrive; sw.onclick = () => { v.pause(); players.delete(api); driveFrame(box, o, T, false); }; }
    wrap.title = "";
    wrap.dataset.keys = T.keys;

    const fail = () => {
      if (failed || started && v.readyState > 1) return;
      failed = true; players.delete(api);
      driveFrame(box, o, T, true);
    };
    const loadTimer = setTimeout(() => { if (v.readyState < 1) fail(); }, 20000);
    v.addEventListener("error", fail);
    v.src = o.src;

    /* speed (remembered) */
    const sp = parseFloat(store.get(spdKey)) || 1;
    const setSpeed = (s) => {
      s = Math.min(2, Math.max(0.5, s));
      v.playbackRate = s; v.defaultPlaybackRate = s;
      sel.value = String(SPEEDS.includes(s) ? s : 1);
      store.set(spdKey, s);
      flash(s + "×");
    };
    v.playbackRate = sp; sel.value = String(sp);
    sel.onchange = () => setSpeed(parseFloat(sel.value));

    /* ui show/hide */
    const show = () => {
      wrap.classList.add("show");
      clearTimeout(hideT);
      if (!v.paused) hideT = setTimeout(() => { if (!dragging && !wrap.matches(":focus-within select:focus")) wrap.classList.remove("show"); }, 2600);
    };
    wrap.addEventListener("mousemove", show);
    wrap.addEventListener("focusin", show);

    let flashEl = null;
    function flash(text) {
      if (!flashEl) { flashEl = document.createElement("div"); flashEl.className = "vp-flash"; wrap.appendChild(flashEl); }
      flashEl.textContent = text; flashEl.classList.remove("on"); void flashEl.offsetWidth; flashEl.classList.add("on");
    }

    /* play / pause */
    const toggle = () => {
      if (v.paused || v.ended) {
        players.forEach((p) => p !== api && p.pause());
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
      } else v.pause();
    };
    pp.onclick = toggle;
    big.onclick = toggle;
    v.addEventListener("play", () => { started = true; wrap.classList.remove("paused"); pp.innerHTML = I.pause; pp.setAttribute("aria-label", T.pause); pp.title = T.pause + " (Space)"; $(".vp-resume").hidden = true; show(); });
    v.addEventListener("pause", () => { wrap.classList.add("paused"); pp.innerHTML = I.play; pp.setAttribute("aria-label", T.play); pp.title = T.play + " (Space)"; show(); save(); });
    v.addEventListener("waiting", () => wrap.classList.add("wait"));
    ["playing", "canplay", "seeked"].forEach((ev) => v.addEventListener(ev, () => wrap.classList.remove("wait")));
    v.addEventListener("ended", () => { store.set(posKey, 0); });

    /* tap on video: desktop click toggles, touch shows ui; double-tap sides skips */
    let lastTap = 0, tapT = 0;
    const isTouch = matchMedia("(pointer: coarse)").matches;
    v.addEventListener("click", (e) => {
      const now = Date.now(), r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
      if (now - lastTap < 300) {
        clearTimeout(tapT); lastTap = 0;
        if (x < 0.35) skip(-10, "l"); else if (x > 0.65) skip(10, "r"); else toggleFs();
        return;
      }
      lastTap = now;
      tapT = setTimeout(() => {
        if (isTouch && !wrap.classList.contains("show") && !v.paused) show();
        else toggle();
      }, 260);
    });

    /* seeking */
    const skip = (d, side) => {
      if (!isFinite(v.duration)) return;
      v.currentTime = Math.min(v.duration - 0.2, Math.max(0, v.currentTime + d));
      if (side) { const s = $(".vp-tap." + side); s.classList.remove("on"); void s.offsetWidth; s.classList.add("on"); }
      else flash((d > 0 ? "+" : "−") + Math.abs(d) + " s");
      show();
    };
    $(".vp-back").onclick = () => skip(-10);
    $(".vp-fwd").onclick = () => skip(10);
    const paintSeek = () => {
      const p = isFinite(v.duration) && v.duration ? v.currentTime / v.duration : 0;
      if (!dragging) seek.value = Math.round(p * 1000);
      seek.style.setProperty("--p", (seek.value / 10) + "%");
      cur.textContent = fmt(dragging ? (seek.value / 1000) * v.duration : v.currentTime);
    };
    const paintBuf = () => {
      if (!v.duration || !v.buffered.length) return;
      let end = 0;
      for (let i = 0; i < v.buffered.length; i++) if (v.buffered.start(i) <= v.currentTime + 1) end = Math.max(end, v.buffered.end(i));
      buf.style.width = (end / v.duration) * 100 + "%";
    };
    v.addEventListener("timeupdate", () => { paintSeek(); paintBuf(); });
    v.addEventListener("progress", paintBuf);
    v.addEventListener("loadedmetadata", () => {
      clearTimeout(loadTimer);
      dur.textContent = fmt(v.duration);
      paintSeek();
      const at = parseFloat(store.get(posKey));
      if (at > 8 && at < v.duration - 8) {
        const r = $(".vp-resume");
        r.hidden = false;
        r.querySelector(".vp-res-go").textContent = "▶ " + T.resume + " " + fmt(at);
        r.querySelector(".vp-res-go").onclick = () => { v.currentTime = at; toggle(); };
        r.querySelector(".vp-res-no").onclick = () => { store.set(posKey, 0); v.currentTime = 0; toggle(); };
      }
    });
    seek.addEventListener("input", () => {
      dragging = true;
      seek.style.setProperty("--p", (seek.value / 10) + "%");
      cur.textContent = fmt((seek.value / 1000) * (v.duration || 0));
      show();
    });
    seek.addEventListener("change", () => {
      if (isFinite(v.duration)) v.currentTime = (seek.value / 1000) * v.duration;
      dragging = false; show();
    });
    seek.addEventListener("pointerup", () => { dragging = false; });
    const tipAt = (e) => {
      if (!isFinite(v.duration)) return;
      const r = seek.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, ((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width));
      tip.hidden = false; tip.textContent = fmt(x * v.duration);
      tip.style.left = x * 100 + "%";
    };
    seek.addEventListener("mousemove", tipAt);
    seek.addEventListener("touchmove", tipAt, { passive: true });
    seek.addEventListener("mouseleave", () => (tip.hidden = true));
    seek.addEventListener("touchend", () => (tip.hidden = true));

    /* volume */
    const paintVol = () => {
      const m = v.muted || v.volume === 0;
      mute.innerHTML = m ? I.muted : I.vol;
      mute.setAttribute("aria-label", m ? T.unmute : T.mute);
      vol.value = v.muted ? 0 : v.volume;
      vol.style.setProperty("--p", vol.value * 100 + "%");
    };
    mute.onclick = () => { v.muted = !v.muted; if (!v.muted && v.volume === 0) v.volume = 0.6; paintVol(); };
    vol.oninput = () => { v.volume = parseFloat(vol.value); v.muted = v.volume === 0; paintVol(); };
    v.addEventListener("volumechange", paintVol);
    paintVol();

    /* fullscreen (container keeps our controls; iOS falls back to native) */
    const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
    function toggleFs() {
      if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
      if (req) { const r = req.call(wrap); if (r && r.catch) r.catch(() => {}); try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {}); } catch (e) {} }
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    }
    fs.onclick = toggleFs;
    const onFs = () => {
      const on = fsEl() === wrap;
      wrap.classList.toggle("fs", on);
      fs.innerHTML = on ? I.exit : I.full;
      fs.setAttribute("aria-label", on ? T.exitFull : T.full);
    };
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);

    /* keyboard */
    wrap.addEventListener("keydown", (e) => {
      if (e.target === sel || e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key;
      const map = {
        " ": toggle, k: toggle, K: toggle,
        ArrowLeft: () => skip(-5), ArrowRight: () => skip(5),
        j: () => skip(-10), J: () => skip(-10), l: () => skip(10), L: () => skip(10),
        f: toggleFs, F: toggleFs, m: () => mute.onclick(), M: () => mute.onclick(),
        ">": () => setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(nearest()) + 1)]),
        "<": () => setSpeed(SPEEDS[Math.max(0, SPEEDS.indexOf(nearest()) - 1)]),
        Home: () => { v.currentTime = 0; }, End: () => { v.currentTime = Math.max(0, v.duration - 1); },
      };
      if (/^[0-9]$/.test(k) && isFinite(v.duration)) { v.currentTime = v.duration * (+k / 10); e.preventDefault(); show(); return; }
      if (map[k] && !(e.target === seek && (k === "ArrowLeft" || k === "ArrowRight"))) { e.preventDefault(); map[k](); show(); }
    });
    const nearest = () => SPEEDS.reduce((a, b) => (Math.abs(b - v.playbackRate) < Math.abs(a - v.playbackRate) ? b : a));

    /* remember position */
    let lastSave = 0;
    const save = () => { if (isFinite(v.currentTime) && v.currentTime > 0) store.set(posKey, v.currentTime); };
    v.addEventListener("timeupdate", () => { const n = Date.now(); if (n - lastSave > 4000) { lastSave = n; save(); } });

    const api = { pause: () => v.pause(), el: wrap };
    players.add(api);
    show();
    toggle();          // the user clicked "watch": start right away
    wrap.focus({ preventScroll: true });
    return api;
  }

  window.TesrPlayer = { mount };
})();
