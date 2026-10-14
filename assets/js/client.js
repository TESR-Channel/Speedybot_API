/* =========================================================================
 * Speedybot API client (browser) + code exporters (JavaScript / Python)
 *
 * Alpha-Sign (verified against the live API):
 *   fixed = "alphaAppId={appId}&alphaAppKey={appKey}&alphaNonce={nonce}&timestamp={ts}"
 *   GET      : sha1( appSecret + sortedQuery("k=v&k=v") + fixed )
 *   POST/PUT : sha1( appSecret + fixed + JSON.stringify(body) )   (body {} when empty)
 *   -> lowercase hex
 * appSecret is used ONLY to compute the signature; it is never sent anywhere.
 * ========================================================================= */
(function () {
  const S = (window.SPEEDY = window.SPEEDY || {});

  /* ---------- SHA-1 (WebCrypto, with pure-JS fallback for file:// / http) ---------- */
  function sha1Fallback(msg) {
    const bytes = new TextEncoder().encode(msg);
    const ml = bytes.length * 8;
    const withPad = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
    withPad.set(bytes);
    withPad[bytes.length] = 0x80;
    const dv = new DataView(withPad.buffer);
    dv.setUint32(withPad.length - 4, ml >>> 0);
    dv.setUint32(withPad.length - 8, Math.floor(ml / 2 ** 32));
    let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
    const w = new Uint32Array(80);
    for (let off = 0; off < withPad.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 80; i++) { const x = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]; w[i] = (x << 1) | (x >>> 31); }
      let a = h0, b = h1, c = h2, d = h3, e = h4;
      for (let i = 0; i < 80; i++) {
        let f, k;
        if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
        else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
        else { f = b ^ c ^ d; k = 0xca62c1d6; }
        const t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) >>> 0;
        e = d; d = c; c = (b << 30) | (b >>> 2); b = a; a = t;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
    }
    return [h0, h1, h2, h3, h4].map((x) => x.toString(16).padStart(8, "0")).join("");
  }
  async function sha1(msg) {
    if (window.crypto && crypto.subtle && window.isSecureContext) {
      const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(msg));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return sha1Fallback(msg);
  }
  S.sha1 = sha1;

  function nonce(len = 10) {
    const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const r = new Uint8Array(len);
    crypto.getRandomValues(r);
    return [...r].map((x) => abc[x % abc.length]).join("");
  }

  /* ---------- helpers ---------- */
  function setPath(obj, path, val) {
    const keys = path.split(".");
    let o = obj;
    keys.slice(0, -1).forEach((k) => { o[k] = o[k] || {}; o = o[k]; });
    o[keys[keys.length - 1]] = val;
  }
  S.setPath = setPath;

  /** Build query + body objects from an endpoint definition and form values */
  S.buildArgs = function (ep, values, cfg) {
    const query = {}, body = {};
    (ep.params || []).forEach((p) => {
      let v = p.auto === "sn" ? cfg.sn : values[p.name];
      if (v === undefined || v === null || v === "") {
        if (p.required && p.default !== undefined) v = p.default; else if (!p.required) return; else v = "";
      }
      if (p.type === "int") v = v === "" ? v : parseInt(v, 10);
      else if (p.type === "number") v = v === "" ? v : Number(v);
      else if (p.type === "bool") v = v === true || v === "true";
      else v = String(v);
      if (p.in === "query") query[p.name] = v; else setPath(body, p.name, v);
    });
    return { query, body };
  };

  /** Build a fully signed request (does not send it) */
  S.signRequest = async function (method, path, { query = {}, body = null } = {}, cfg) {
    const ts = String(Math.floor(Date.now() / 1000));
    const nc = nonce();
    const fixed = `alphaAppId=${cfg.appId}&alphaAppKey=${cfg.appKey}&alphaNonce=${nc}&timestamp=${ts}`;
    let url = S.BASE_URL + path, payload = undefined, signInput, paramStr = "";
    if (method === "GET") {
      paramStr = Object.keys(query).sort().map((k) => `${k}=${query[k]}`).join("&");
      signInput = cfg.appSecret + paramStr + fixed;
      const qs = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString();
      if (qs) url += "?" + qs;
    } else {
      payload = JSON.stringify(body || {});
      signInput = cfg.appSecret + fixed + payload;
    }
    const sign = await sha1(signInput);
    const headers = {
      "Alpha-Robot-Sn": cfg.sn,
      "Alpha-App-Id": cfg.appId,
      "Alpha-App-Key": cfg.appKey,
      "Alpha-Nonce": nc,
      "Timestamp": ts,
      "Alpha-language": cfg.lang || "en-US",
      "Alpha-Sign": sign,
    };
    if (payload !== undefined) headers["Content-Type"] = "application/json";
    return {
      method, url, headers, payload, sign,
      // for the explainer UI — the secret itself is replaced by a placeholder
      explain: { fixed, paramStr, payload, signInputMasked: "‹appSecret›" + signInput.slice(cfg.appSecret.length) },
    };
  };

  /** Send a signed request. Returns {ok,status,ms,json,text,req} */
  S.call = async function (method, path, args, cfg, { signal } = {}) {
    const req = await S.signRequest(method, path, args, cfg);
    const t0 = performance.now();
    const res = await fetch(req.url, { method, headers: req.headers, body: req.payload, signal });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) { /* not json */ }
    return { ok: res.ok && json && json.code === 200, status: res.status, ms: Math.round(performance.now() - t0), json, text, req };
  };

  /** Server-Sent Events with signed headers (EventSource can't send headers) */
  S.stream = async function (path, query, cfg, onEvent, signal) {
    const req = await S.signRequest("GET", path, { query }, cfg);
    const res = await fetch(req.url, { headers: req.headers, signal });
    if (!res.ok || !res.body) throw new Error("HTTP " + res.status);
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2);
        const data = chunk.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("\n");
        if (!data) continue;
        let obj = data; try { obj = JSON.parse(data); } catch (e) {}
        onEvent(obj, chunk);
      }
    }
  };

  /* =======================================================================
   *  CODE EXPORT
   * ===================================================================== */
  const jsStr = (s) => JSON.stringify(String(s));
  const pyStr = (s) => JSON.stringify(String(s)); // JSON string literal is valid Python for our values
  const camel = (id) => id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const snake = (id) => id.replace(/-/g, "_");

  function cfgBlock(lang, cfg, withSecrets) {
    const v = (k, ph) => (withSecrets && cfg[k] ? cfg[k] : ph);
    if (lang === "js") {
      return `const CONFIG = {
  baseUrl: "${S.BASE_URL}",
  sn:        process.env.SPEEDY_SN         || ${jsStr(v("sn", "YOUR_ROBOT_SN"))},
  appId:     process.env.SPEEDY_APP_ID     || ${jsStr(v("appId", "YOUR_APP_ID"))},
  appKey:    process.env.SPEEDY_APP_KEY    || ${jsStr(v("appKey", "YOUR_APP_KEY"))},
  appSecret: process.env.SPEEDY_APP_SECRET || ${jsStr(v("appSecret", "YOUR_APP_SECRET"))}, // ห้ามเผยแพร่!
  language:  ${jsStr(cfg.lang || "en-US")},
};`;
    }
    return `CONFIG = {
    "base_url": "${S.BASE_URL}",
    "sn":         os.getenv("SPEEDY_SN",         ${pyStr(v("sn", "YOUR_ROBOT_SN"))}),
    "app_id":     os.getenv("SPEEDY_APP_ID",     ${pyStr(v("appId", "YOUR_APP_ID"))}),
    "app_key":    os.getenv("SPEEDY_APP_KEY",    ${pyStr(v("appKey", "YOUR_APP_KEY"))}),
    "app_secret": os.getenv("SPEEDY_APP_SECRET", ${pyStr(v("appSecret", "YOUR_APP_SECRET"))}),  # ห้ามเผยแพร่!
    "language":   ${pyStr(cfg.lang || "en-US")},
}`;
  }

  const JS_CORE = `const crypto = require("crypto");

const sha1 = (s) => crypto.createHash("sha1").update(s, "utf8").digest("hex");

/** ส่ง request ที่เซ็น Alpha-Sign แล้ว (Node.js 18+ มี fetch ในตัว) */
async function speedyRequest(method, path, { query = {}, body = null } = {}) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = crypto.randomBytes(5).toString("hex");
  const fixed = \`alphaAppId=\${CONFIG.appId}&alphaAppKey=\${CONFIG.appKey}&alphaNonce=\${nonce}&timestamp=\${timestamp}\`;
  let url = CONFIG.baseUrl + path;
  let payload, sign;
  if (method === "GET") {
    // GET: appSecret + query เรียงตามชื่อ (k=v&k=v) + fixed
    const paramStr = Object.keys(query).sort().map((k) => \`\${k}=\${query[k]}\`).join("&");
    sign = sha1(CONFIG.appSecret + paramStr + fixed);
    const qs = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString();
    if (qs) url += "?" + qs;
  } else {
    // POST/PUT: appSecret + fixed + JSON แบบไม่มีช่องว่าง
    payload = JSON.stringify(body ?? {});
    sign = sha1(CONFIG.appSecret + fixed + payload);
  }
  const headers = {
    "Alpha-Robot-Sn": CONFIG.sn,
    "Alpha-App-Id": CONFIG.appId,
    "Alpha-App-Key": CONFIG.appKey,
    "Alpha-Nonce": nonce,
    "Timestamp": timestamp,
    "Alpha-language": CONFIG.language,
    "Alpha-Sign": sign,
  };
  if (payload !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(url, { method, headers, body: payload });
  return res.json();
}`;

  const PY_CORE = `def _sha1(s: str) -> str:
    return hashlib.sha1(s.encode("utf-8")).hexdigest()


def _s(v):
    """แปลงค่าเป็น string แบบเดียวกับ JavaScript (True -> 'true')"""
    if isinstance(v, bool):
        return "true" if v else "false"
    return str(v)


def _clean(o):
    """ตัด key ที่เป็น None ออก (optional params)"""
    if isinstance(o, dict):
        return {k: _clean(v) for k, v in o.items() if v is not None}
    return o


def speedy_request(method: str, path: str, query: dict | None = None, body: dict | None = None):
    """ส่ง request ที่เซ็น Alpha-Sign แล้ว"""
    timestamp = str(int(time.time()))
    nonce = secrets.token_hex(5)
    fixed = (f"alphaAppId={CONFIG['app_id']}&alphaAppKey={CONFIG['app_key']}"
             f"&alphaNonce={nonce}&timestamp={timestamp}")
    headers = {
        "Alpha-Robot-Sn": CONFIG["sn"],
        "Alpha-App-Id": CONFIG["app_id"],
        "Alpha-App-Key": CONFIG["app_key"],
        "Alpha-Nonce": nonce,
        "Timestamp": timestamp,
        "Alpha-language": CONFIG["language"],
    }
    url = CONFIG["base_url"] + path
    if method == "GET":
        # GET: appSecret + query เรียงตามชื่อ (k=v&k=v) + fixed
        q = {k: _s(v) for k, v in (query or {}).items()}
        param_str = "&".join(f"{k}={q[k]}" for k in sorted(q))
        headers["Alpha-Sign"] = _sha1(CONFIG["app_secret"] + param_str + fixed)
        r = requests.get(url, params=q, headers=headers, timeout=15)
    else:
        # POST/PUT: appSecret + fixed + JSON แบบไม่มีช่องว่าง
        payload = json.dumps(_clean(body or {}), separators=(",", ":"), ensure_ascii=False)
        headers["Alpha-Sign"] = _sha1(CONFIG["app_secret"] + fixed + payload)
        headers["Content-Type"] = "application/json"
        r = requests.request(method, url, data=payload.encode("utf-8"), headers=headers, timeout=15)
    r.raise_for_status()
    return r.json()`;

  /* literal serialisers: auto "sn" fields reference CONFIG */
  function toJsLiteral(obj, indent = 2, lvl = 1) {
    if (obj && obj.__sn) return "CONFIG.sn";
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
    const pad = " ".repeat(indent * lvl), end = " ".repeat(indent * (lvl - 1));
    const ent = Object.entries(obj);
    if (!ent.length) return "{}";
    return "{\n" + ent.map(([k, v]) => `${pad}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${toJsLiteral(v, indent, lvl + 1)}`).join(",\n") + `,\n${end}}`;
  }
  function toPyLiteral(obj, indent = 4, lvl = 1) {
    if (obj && obj.__sn) return 'CONFIG["sn"]';
    if (obj === true) return "True";
    if (obj === false) return "False";
    if (obj === null || obj === undefined) return "None";
    if (typeof obj !== "object") return JSON.stringify(obj);
    const pad = " ".repeat(indent * lvl), end = " ".repeat(indent * (lvl - 1));
    const ent = Object.entries(obj);
    if (!ent.length) return "{}";
    return "{\n" + ent.map(([k, v]) => `${pad}${JSON.stringify(k)}: ${toPyLiteral(v, indent, lvl + 1)}`).join(",\n") + `,\n${end}}`;
  }
  function argsWithSnMarker(ep, values) {
    const fakeCfg = { sn: "__SN__" };
    const { query, body } = S.buildArgs(ep, values, fakeCfg);
    const mark = (o) => { for (const k in o) { if (o[k] === "__SN__") o[k] = { __sn: true }; else if (o[k] && typeof o[k] === "object") mark(o[k]); } return o; };
    return { query: mark(query), body: mark(body) };
  }

  function header(ep, lang) {
    const c = lang === "js" ? "//" : "#";
    return `${c} ==============================================================
${c}  TESR · Speedybot API — #${ep.no} ${ep.th}
${c}  ${ep.en} (${ep.zh})
${c}  ${ep.method} ${ep.path}
${c}  ${lang === "js" ? "Node.js 18+ — ไม่ต้องติดตั้งอะไรเพิ่ม   รัน: node speedybot.js" : "Python 3.10+ — pip install requests   รัน: python speedybot.py"}
${c}  ตั้งค่า key ผ่าน environment variables: SPEEDY_SN, SPEEDY_APP_ID,
${c}  SPEEDY_APP_KEY, SPEEDY_APP_SECRET (ปลอดภัยกว่าเขียนในโค้ด)
${c} ==============================================================`;
  }

  /** Export code for ONE endpoint using the current form values */
  S.exportEndpoint = function (ep, values, cfg, lang, withSecrets) {
    const { query, body } = argsWithSnMarker(ep, values);
    const hasQ = Object.keys(query).length > 0;
    const isGet = ep.method === "GET";
    if (lang === "js") {
      if (ep.stream) {
        return `${header(ep, "js")}
${JS_CORE.split("\n/** ส่ง request")[0]}
${cfgBlock("js", cfg, withSecrets)}

/** ฟัง Server-Sent Events (ตำแหน่งหุ่นแบบเรียลไทม์) */
async function listen() {
  const query = ${toJsLiteral(query)};
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = crypto.randomBytes(5).toString("hex");
  const fixed = \`alphaAppId=\${CONFIG.appId}&alphaAppKey=\${CONFIG.appKey}&alphaNonce=\${nonce}&timestamp=\${timestamp}\`;
  const paramStr = Object.keys(query).sort().map((k) => \`\${k}=\${query[k]}\`).join("&");
  const res = await fetch(CONFIG.baseUrl + ${jsStr(ep.path)} + "?" + new URLSearchParams(query), {
    headers: {
      "Alpha-Robot-Sn": CONFIG.sn, "Alpha-App-Id": CONFIG.appId, "Alpha-App-Key": CONFIG.appKey,
      "Alpha-Nonce": nonce, "Timestamp": timestamp, "Alpha-language": CONFIG.language,
      "Alpha-Sign": sha1(CONFIG.appSecret + paramStr + fixed),
    },
  });
  const decoder = new TextDecoder();
  let buf = "";
  for await (const chunk of res.body) {
    buf += decoder.decode(chunk, { stream: true });
    let i;
    while ((i = buf.indexOf("\\n\\n")) >= 0) {
      const evt = buf.slice(0, i); buf = buf.slice(i + 2);
      const data = evt.split("\\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join("");
      if (data) console.log(JSON.parse(data)); // { pointX, pointY, rotation, pointName }
    }
  }
}

listen().catch(console.error);
`;
      }
      const call = isGet
        ? (hasQ ? `speedyRequest("GET", ${jsStr(ep.path)}, {\n  query: ${toJsLiteral(query, 2, 2)},\n})` : `speedyRequest("GET", ${jsStr(ep.path)})`)
        : (Object.keys(body).length ? `speedyRequest(${jsStr(ep.method)}, ${jsStr(ep.path)}, {\n  body: ${toJsLiteral(body, 2, 2)},\n})` : `speedyRequest(${jsStr(ep.method)}, ${jsStr(ep.path)}, { body: {} })`);
      return `${header(ep, "js")}
${JS_CORE.split("\n\n/** ส่ง request")[0]}

${cfgBlock("js", cfg, withSecrets)}

/** ส่ง request${JS_CORE.split("/** ส่ง request")[1]}

// ---- #${ep.no} ${ep.th} ----
${call}
  .then((res) => {
    if (res.code !== 200) console.error("❌ code", res.code, res.msg);
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((err) => console.error("Request failed:", err));
`;
    }
    /* ---------- python ---------- */
    const imports = `import hashlib\nimport json\nimport os\nimport secrets\nimport time\n\nimport requests  # pip install requests`;
    if (ep.stream) {
      return `${header(ep, "py")}
${imports}

${cfgBlock("py", cfg, withSecrets)}


${PY_CORE.split("\n\n\ndef _clean")[0]}


def listen():
    """ฟัง Server-Sent Events (ตำแหน่งหุ่นแบบเรียลไทม์)"""
    query = {k: _s(v) for k, v in ${toPyLiteral(query, 4, 2)}.items()}
    timestamp = str(int(time.time()))
    nonce = secrets.token_hex(5)
    fixed = (f"alphaAppId={CONFIG['app_id']}&alphaAppKey={CONFIG['app_key']}"
             f"&alphaNonce={nonce}&timestamp={timestamp}")
    param_str = "&".join(f"{k}={query[k]}" for k in sorted(query))
    headers = {
        "Alpha-Robot-Sn": CONFIG["sn"], "Alpha-App-Id": CONFIG["app_id"],
        "Alpha-App-Key": CONFIG["app_key"], "Alpha-Nonce": nonce,
        "Timestamp": timestamp, "Alpha-language": CONFIG["language"],
        "Alpha-Sign": _sha1(CONFIG["app_secret"] + param_str + fixed),
        "Accept": "text/event-stream",
    }
    url = CONFIG["base_url"] + ${pyStr(ep.path)}
    with requests.get(url, params=query, headers=headers, stream=True, timeout=(10, None)) as r:
        r.raise_for_status()
        for line in r.iter_lines(decode_unicode=True):
            if line and line.startswith("data:"):
                print(json.loads(line[5:]))  # {'pointX':..., 'pointY':..., 'rotation':..., 'pointName':...}


if __name__ == "__main__":
    listen()
`;
    }
    const pcall = isGet
      ? (hasQ ? `speedy_request("GET", ${pyStr(ep.path)}, query=${toPyLiteral(query, 4, 2)})` : `speedy_request("GET", ${pyStr(ep.path)})`)
      : (Object.keys(body).length ? `speedy_request(${pyStr(ep.method)}, ${pyStr(ep.path)}, body=${toPyLiteral(body, 4, 2)})` : `speedy_request(${pyStr(ep.method)}, ${pyStr(ep.path)}, body={})`);
    return `${header(ep, "py")}
${imports}

${cfgBlock("py", cfg, withSecrets)}


${PY_CORE}


if __name__ == "__main__":
    # ---- #${ep.no} ${ep.th} ----
    res = ${pcall}
    if res.get("code") != 200:
        print("❌ code", res.get("code"), res.get("msg"))
    print(json.dumps(res, indent=2, ensure_ascii=False))
`;
  };

  /* ---------------- full SDK ---------------- */
  function leafName(p) { return p.name.split(".").pop(); }
  function sdkTree(ep, lang) {
    const q = {}, b = {};
    (ep.params || []).forEach((p) => {
      const ref = p.auto === "sn" ? { __ref: lang === "js" ? "this.sn" : "self.sn" } : { __ref: lang === "js" ? leafName(p) : leafName(p) };
      if (p.in === "query") q[p.name] = ref; else setPath(b, p.name, ref);
    });
    return { q, b };
  }
  function refLiteral(obj, lang, lvl) {
    if (obj && obj.__ref) return obj.__ref;
    const pad = " ".repeat((lang === "js" ? 2 : 4) * lvl);
    const ent = Object.entries(obj);
    if (!ent.length) return "{}";
    if (lang === "js") return "{ " + ent.map(([k, v]) => (v && v.__ref === k ? k : `${k}: ${refLiteral(v, lang, lvl + 1)}`)).join(", ") + " }";
    return "{" + ent.map(([k, v]) => `${JSON.stringify(k)}: ${refLiteral(v, lang, lvl + 1)}`).join(", ") + "}";
  }
  function jsDefault(p) {
    if (p.default !== undefined) return " = " + JSON.stringify(p.default);
    return "";
  }
  function pyDefault(p) {
    if (p.default !== undefined) return p.type === "bool" ? (p.default ? "True" : "False") : JSON.stringify(p.default);
    return "None";
  }

  S.exportSdk = function (lang, cfg, withSecrets) {
    const eps = S.ENDPOINTS.filter((e) => !e.disabled && !e.stream).slice().sort((a, b) => a.no - b.no);
    const sse = S.ENDPOINTS.find((e) => e.stream);
    if (lang === "js") {
      const methods = eps.map((ep) => {
        const user = (ep.params || []).filter((p) => !p.auto);
        const { q, b } = sdkTree(ep, "js");
        const sig = user.length ? `{ ${user.map((p) => leafName(p) + jsDefault(p)).join(", ")} } = {}` : "";
        let args = "";
        if (ep.method === "GET" && Object.keys(q).length) args = `, { query: ${refLiteral(q, "js", 2)} }`;
        if (ep.method !== "GET") args = `, { body: ${refLiteral(b, "js", 2)} }`;
        const dep = ep.deprecated ? ` (เลิกใช้แล้ว — ${ep.deprecated})` : "";
        return `  /** #${ep.no} ${ep.th}${dep} — ${ep.en} */
  ${camel(ep.id)}(${sig}) {
    return this.request(${jsStr(ep.method)}, ${jsStr(ep.path)}${args});
  }`;
      }).join("\n\n");
      return `// ==============================================================
//  TESR · Speedybot API SDK (JavaScript / Node.js 18+)
//  สร้างจาก Speedybot API Lab — ครบทุก endpoint ตามเอกสาร v5
//  ใช้งาน:  const bot = new Speedybot();  await bot.homepage();
// ==============================================================
const crypto = require("crypto");

${cfgBlock("js", cfg, withSecrets)}

class Speedybot {
  constructor(cfg = CONFIG) {
    Object.assign(this, cfg);
  }

  static sha1(s) {
    return crypto.createHash("sha1").update(s, "utf8").digest("hex");
  }

  /** เซ็น Alpha-Sign แล้วส่ง request */
  async request(method, path, { query = {}, body = null } = {}) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const nonce = crypto.randomBytes(5).toString("hex");
    const fixed = \`alphaAppId=\${this.appId}&alphaAppKey=\${this.appKey}&alphaNonce=\${nonce}&timestamp=\${timestamp}\`;
    let url = this.baseUrl + path, payload, sign;
    if (method === "GET") {
      const paramStr = Object.keys(query).sort().map((k) => \`\${k}=\${query[k]}\`).join("&");
      sign = Speedybot.sha1(this.appSecret + paramStr + fixed);
      const qs = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString();
      if (qs) url += "?" + qs;
    } else {
      payload = JSON.stringify(body ?? {}); // undefined fields are dropped automatically
      sign = Speedybot.sha1(this.appSecret + fixed + payload);
    }
    const headers = {
      "Alpha-Robot-Sn": this.sn, "Alpha-App-Id": this.appId, "Alpha-App-Key": this.appKey,
      "Alpha-Nonce": nonce, "Timestamp": timestamp, "Alpha-language": this.language, "Alpha-Sign": sign,
    };
    if (payload !== undefined) headers["Content-Type"] = "application/json";
    const res = await fetch(url, { method, headers, body: payload });
    const json = await res.json();
    if (json.code !== 200) {
      const err = new Error(\`Speedybot API error \${json.code}: \${json.msg}\`);
      err.response = json;
      throw err;
    }
    return json.data;
  }

${methods}

  /** #${sse.no} ${sse.th} — async generator: for await (const p of bot.livePosition()) {...} */
  async *livePosition() {
    const query = { sn: this.sn };
    const timestamp = String(Math.floor(Date.now() / 1000));
    const nonce = crypto.randomBytes(5).toString("hex");
    const fixed = \`alphaAppId=\${this.appId}&alphaAppKey=\${this.appKey}&alphaNonce=\${nonce}&timestamp=\${timestamp}\`;
    const res = await fetch(this.baseUrl + ${jsStr(sse.path)} + "?" + new URLSearchParams(query), {
      headers: {
        "Alpha-Robot-Sn": this.sn, "Alpha-App-Id": this.appId, "Alpha-App-Key": this.appKey,
        "Alpha-Nonce": nonce, "Timestamp": timestamp, "Alpha-language": this.language,
        "Alpha-Sign": Speedybot.sha1(this.appSecret + "sn=" + this.sn + fixed),
      },
    });
    const decoder = new TextDecoder();
    let buf = "";
    for await (const chunk of res.body) {
      buf += decoder.decode(chunk, { stream: true });
      let i;
      while ((i = buf.indexOf("\\n\\n")) >= 0) {
        const evt = buf.slice(0, i); buf = buf.slice(i + 2);
        const data = evt.split("\\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join("");
        if (data) yield JSON.parse(data); // { pointX, pointY, rotation, pointName }
      }
    }
  }
}

module.exports = { Speedybot, CONFIG };

// ---- ตัวอย่าง: node speedybot-sdk.js ----
if (require.main === module) {
  (async () => {
    const bot = new Speedybot();
    console.log("online :", await bot.online());
    console.log("status :", await bot.homepage());
    // await bot.neonOn();
    // await bot.gotoId({ id: 123 });
  })().catch((e) => console.error(e.message, e.response ?? ""));
}
`;
    }
    /* python SDK */
    const pmethods = eps.map((ep) => {
      const user = (ep.params || []).filter((p) => !p.auto);
      const { q, b } = sdkTree(ep, "py");
      const req = user.filter((p) => p.required && p.default === undefined);
      const opt = user.filter((p) => !(p.required && p.default === undefined));
      const sig = ["self", ...req.map(leafName), ...opt.map((p) => `${leafName(p)}=${pyDefault(p)}`)].join(", ");
      let args = "";
      if (ep.method === "GET" && Object.keys(q).length) args = `, query=${refLiteral(q, "py", 2)}`;
      if (ep.method !== "GET") args = `, body=${refLiteral(b, "py", 2)}`;
      const dep = ep.deprecated ? ` (เลิกใช้แล้ว — ${ep.deprecated})` : "";
      return `    def ${snake(ep.id)}(${sig}):
        """#${ep.no} ${ep.th}${dep} — ${ep.en}"""
        return self.request(${pyStr(ep.method)}, ${pyStr(ep.path)}${args})`;
    }).join("\n\n");
    return `# ==============================================================
#  TESR · Speedybot API SDK (Python 3.10+)
#  สร้างจาก Speedybot API Lab — ครบทุก endpoint ตามเอกสาร v5
#  pip install requests
#  ใช้งาน:  bot = Speedybot();  print(bot.homepage())
# ==============================================================
import hashlib
import json
import os
import secrets
import time

import requests

${cfgBlock("py", cfg, withSecrets)}


class SpeedybotError(Exception):
    def __init__(self, response: dict):
        super().__init__(f"Speedybot API error {response.get('code')}: {response.get('msg')}")
        self.response = response


def _s(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    return str(v)


def _clean(o):
    if isinstance(o, dict):
        return {k: _clean(v) for k, v in o.items() if v is not None}
    return o


class Speedybot:
    def __init__(self, config: dict = CONFIG):
        self.base_url = config["base_url"]
        self.sn = config["sn"]
        self.app_id = config["app_id"]
        self.app_key = config["app_key"]
        self.app_secret = config["app_secret"]
        self.language = config.get("language", "en-US")
        self.session = requests.Session()

    def request(self, method: str, path: str, query: dict | None = None, body: dict | None = None):
        """เซ็น Alpha-Sign แล้วส่ง request — คืนค่า data เมื่อ code == 200"""
        timestamp = str(int(time.time()))
        nonce = secrets.token_hex(5)
        fixed = (f"alphaAppId={self.app_id}&alphaAppKey={self.app_key}"
                 f"&alphaNonce={nonce}&timestamp={timestamp}")
        headers = {
            "Alpha-Robot-Sn": self.sn, "Alpha-App-Id": self.app_id, "Alpha-App-Key": self.app_key,
            "Alpha-Nonce": nonce, "Timestamp": timestamp, "Alpha-language": self.language,
        }
        url = self.base_url + path
        if method == "GET":
            q = {k: _s(v) for k, v in (query or {}).items() if v is not None}
            param_str = "&".join(f"{k}={q[k]}" for k in sorted(q))
            headers["Alpha-Sign"] = hashlib.sha1((self.app_secret + param_str + fixed).encode()).hexdigest()
            r = self.session.get(url, params=q, headers=headers, timeout=15)
        else:
            payload = json.dumps(_clean(body or {}), separators=(",", ":"), ensure_ascii=False)
            headers["Alpha-Sign"] = hashlib.sha1((self.app_secret + fixed + payload).encode("utf-8")).hexdigest()
            headers["Content-Type"] = "application/json"
            r = self.session.request(method, url, data=payload.encode("utf-8"), headers=headers, timeout=15)
        r.raise_for_status()
        res = r.json()
        if res.get("code") != 200:
            raise SpeedybotError(res)
        return res.get("data")

${pmethods}

    def live_position(self):
        """#${sse.no} ${sse.th} — generator: for p in bot.live_position(): ..."""
        timestamp = str(int(time.time()))
        nonce = secrets.token_hex(5)
        fixed = (f"alphaAppId={self.app_id}&alphaAppKey={self.app_key}"
                 f"&alphaNonce={nonce}&timestamp={timestamp}")
        headers = {
            "Alpha-Robot-Sn": self.sn, "Alpha-App-Id": self.app_id, "Alpha-App-Key": self.app_key,
            "Alpha-Nonce": nonce, "Timestamp": timestamp, "Alpha-language": self.language,
            "Alpha-Sign": hashlib.sha1((self.app_secret + f"sn={self.sn}" + fixed).encode()).hexdigest(),
            "Accept": "text/event-stream",
        }
        url = self.base_url + ${pyStr(sse.path)}
        with self.session.get(url, params={"sn": self.sn}, headers=headers, stream=True, timeout=(10, None)) as r:
            r.raise_for_status()
            for line in r.iter_lines(decode_unicode=True):
                if line and line.startswith("data:"):
                    yield json.loads(line[5:])


if __name__ == "__main__":
    bot = Speedybot()
    print("online :", bot.online())
    print("status :", json.dumps(bot.homepage(), indent=2, ensure_ascii=False))
    # bot.neon_on()
    # bot.goto_id(123)
`;
  };
})();
