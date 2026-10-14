# TESR · Speedybot API Lab

หน้าเว็บคู่มือ + เครื่องมือทดสอบ API ของหุ่นยนต์ส่งของ **Speedybot** (飞毛腿室内外配送机器人) จัดทำโดย **TESR Co., Ltd.**
อ่านง่าย · กดทดสอบกับหุ่นจริงได้ทันที · Export โค้ด JavaScript / Python ได้ทุก endpoint

**เปิดใช้งาน:** https://tesr-channel.github.io/Speedybot_API/

## มีอะไรบ้าง

| ส่วน | รายละเอียด |
|---|---|
| **API Explorer** | ครบ 34 endpoint ตามเอกสารผู้ผลิต v5 + 2 endpoint แผนที่จากคอนโซล CSJBot (2026-08-26) แบ่ง 5 หมวด มีคำอธิบายภาษาไทย ฟอร์มกรอกค่า ปุ่ม ▶ ลองเลย และตารางอธิบายทุกช่องของผลลัพธ์ |
| **Export code** | ทุก endpoint กด **JS** / **Python** ได้โค้ดพร้อมรัน (เซ็น Alpha-Sign ในตัว) จากค่าที่กรอกไว้ |
| **SDK** | `speedybot.js` (Node 18+, ไม่มี dependency) และ `speedybot.py` (Python 3.10+, requests) ครบทุกเมธอด + live position stream |
| **แดชบอร์ดสด** | แบต/สถานะ/จุดปัจจุบัน, แผนที่ + จุดหมาย + ตำแหน่งหุ่นแบบ realtime (SSE), ปุ่มบังคับด้วยมือ, คำสั่งด่วน |
| **ความปลอดภัย** | คำสั่งที่ทำให้หุ่นเคลื่อนที่ต้องเปิด **ARM** ก่อน, ปุ่ม **STOP ฉุกเฉิน** (#15 + #34) กดได้ตลอด, ปลด ARM อัตโนมัติ 10 นาที |
| **วิธีเซ็น** | อธิบาย Alpha-Sign ทีละขั้น พร้อมคำนวณจริงให้ดู (ซ่อน appSecret) |

## แผนที่ (Maps)

| # | Endpoint | หมายเหตุ |
|---|---|---|
| 12 | `GET /app-api/server/map/get-maps` | รายชื่อแผนที่ (เอกสาร v5) |
| 27 | `GET /app-api/server/map/get-current-map-detail` | แผนที่ที่หุ่น**กำลังวิ่งอยู่** (เอกสาร v5) |
| 35 | `GET /app-api/server/map/get-all-map` | รายละเอียดครบทุกแผนที่ (realX/realY/resolution/จุด) — **นอกเอกสาร** ใช้ในคอนโซล CSJBot |
| 36 | `POST /app-api/server/map/set-default-map` body `{"data":"<map name>"}` | ตั้งแผนที่เริ่มต้น (ปุ่ม Set default ในคอนโซล) — **นอกเอกสาร** |

ทั้ง #35 และ #36 ตรวจแล้วว่าใช้ Alpha-Sign เดียวกันได้ · **Set default ไม่ได้สลับแผนที่ที่หุ่นใช้อยู่ทันที** — #27 ยังคืนแผนที่เดิม หุ่นจะใช้แผนที่เริ่มต้นเมื่อโหลดแผนที่ใหม่ (ต้องอยู่ในพื้นที่ของแผนที่นั้นและตั้งตำแหน่งที่ตัวหุ่น)
พิกัดเมตร → พิกเซลบนรูป: `px = (x − realX) / resolution`, `py = height − (y − realY) / resolution`

## การจัดการหุ่น (Management Operations — จากคอนโซล CSJBot, นอกเอกสาร v5)

| # | Endpoint | ปุ่มในคอนโซล |
|---|---|---|
| 37 | `PUT /app-api/server/robot-setting/shutdown-robot` | Power off (ต้อง ARM) |
| 38 | `PUT /app-api/server/robot-setting/reboot-robot` | Reboot (ต้อง ARM) |
| 39 | `PUT /app-api/server/command/chassis/clear-hub-malfunction` | Wheel hub clearance |
| 33 / 40 | `PUT …/battery-recharge` / `PUT …/cancel-battery-recharge` | Recharge (toggle ตาม `backToChargeFlag`) |
| 34 | `GET /app-api/server/move/v2/stop?flag=true\|false` | Pause (toggle ตาม `stopMovingFlag`) |
| 30 | `PUT /app-api/server/task/cancel` | Cancel task |
| 4 / 5 | `PUT …/cabin-door/open` / `close` | Cabin door status |
| 41 | `POST /app-api/server/robot-setting/change-robot-status` body `{"data": true\|false}` | User disable (true = ใช้งานได้) |
| 11 / 10 | `PUT …/chassis/lock-hub-shaft` / `unlock-hub-shaft` | Hub status |
| 42 / 43 | `PUT /app-api/server/light/open-front-light` / `close-front-light` | Light status |
| 44 / 45 | `GET …/get-auto-front-light-setting` / `get-auto-power-on-off-setting` | Auto strategy (อ่านอย่างเดียว) |

สถานะทุกสวิตช์อ่านจาก #2 (`cabinDoorStatus`, `enableStatus`, `hubShaftStatus`, `stopMovingFlag`, `backToChargeFlag`)

## API Key — ไม่มีอยู่ใน repo นี้

- เว็บนี้ **ไม่มี key ฝังในโค้ด** ผู้ใช้กรอกเองที่ปุ่ม ⚙ (Robot SN, App ID, App Key, appSecret)
- ค่าเก็บใน `sessionStorage` (ลบเมื่อปิดแท็บ) หรือ `localStorage` ถ้าติ๊ก “จำไว้ในเครื่องนี้”
- **appSecret ไม่ถูกส่งออกจากเบราว์เซอร์** — ใช้คำนวณ SHA-1 ในเครื่องเท่านั้น
- เบราว์เซอร์คุยตรงกับ `https://alpha-pro.csjbot.com` (เซิร์ฟเวอร์รองรับ CORS) ไม่มี backend กลาง
- โค้ดที่ export ใช้ environment variables เป็นค่าเริ่มต้น:

```bash
export SPEEDY_SN=...  SPEEDY_APP_ID=...  SPEEDY_APP_KEY=...  SPEEDY_APP_SECRET=...
node speedybot.js        # หรือ  python speedybot.py
```

> ⚠ ห้าม commit key ลง Git — ไฟล์ `.env`, `config.local.*` ถูก ignore ไว้แล้ว

## Alpha-Sign (ตรวจสอบกับ API จริงแล้ว)

```text
fixed    = "alphaAppId={appId}&alphaAppKey={appKey}&alphaNonce={nonce}&timestamp={unixSeconds}"
GET      : sha1( appSecret + "k1=v1&k2=v2"(เรียงตามชื่อ) + fixed )
POST/PUT : sha1( appSecret + fixed + JSON.stringify(body) )    // ไม่มี body → "{}"
→ hex ตัวพิมพ์เล็ก ใส่ header Alpha-Sign
```

Headers ที่ต้องส่ง: `Alpha-Robot-Sn`, `Alpha-App-Id`, `Alpha-App-Key`, `Alpha-Nonce`, `Timestamp`, `Alpha-language`, `Alpha-Sign`

## โครงสร้างไฟล์

```text
index.html              หน้าเว็บ
assets/css/style.css    ธีม TESR (แดง/ดำ/ขาว + ทองจากโล่)
assets/js/endpoints.js  รายการ endpoint ทั้งหมด (แก้/เพิ่ม API ที่นี่ที่เดียว)
assets/js/client.js     ระบบเซ็น + เรียก API + ตัวสร้างโค้ด JS/Python/SDK
assets/js/app.js        UI: explorer, dashboard, map, drive pad, ARM/STOP
assets/img/             โลโก้, ภาพพื้นหลัง, ภาพหุ่น
```

เป็น static site ล้วน — เปิด `index.html` ได้เลย หรือ deploy ด้วย GitHub Pages (Settings → Pages → Branch `main` / root)

## อ้างอิง

เอกสารผู้ผลิต: 【飞毛腿室内外配送机器人】开放接口1.0 (CSJBot) · v5 อัปเดต 2026-08-26
#24 ถอยไปยังจุด — ผู้ผลิตปิดใช้งาน · #22, #31 — เลิกใช้แล้ว (ใช้ #30, #34 แทน)

---
© TESR Co., Ltd. — Thai Embedded System and Robotics · [tesrshop.com](https://tesrshop.com) · [tesracademy.com](https://tesracademy.com)
