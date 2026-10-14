/* =========================================================================
 * Speedybot Open API v5 — endpoint catalogue
 * Source: 飞毛腿室内外配送机器人 开放接口1.0 (CSJBot, updated 2026-08-26)
 * Host:   https://alpha-pro.csjbot.com
 *
 * risk:  "read"   = อ่านข้อมูลอย่างเดียว ปลอดภัย
 *        "action" = สั่งงานอุปกรณ์ (ไฟ/ฝา/ตั้งค่า) ไม่ทำให้หุ่นเคลื่อนที่
 *        "motion" = หุ่นยนต์จะเคลื่อนที่/ล้ออิสระ ต้องเปิด ARM ก่อน
 * param.in: "query" | "body"
 * param.auto: "sn" -> เติม Robot SN จาก config ให้อัตโนมัติ
 * ========================================================================= */
var SPEEDY = (window.SPEEDY = window.SPEEDY || {});

SPEEDY.BASE_URL = "https://alpha-pro.csjbot.com";

SPEEDY.LANGS = [
  { code: "en-US", label: "English" },
  { code: "zh-CN", label: "中文 (汉语)" },
  { code: "ja-JP", label: "日本語" },
  { code: "ru-RU", label: "Русский" },
];

SPEEDY.ERRORS = [
  { code: 200, th: "สำเร็จ", en: "Success" },
  { code: 999, th: "ลายเซ็น (Alpha-Sign) ไม่ถูกต้อง", en: "Signature verification failed" },
  { code: 1000, th: "ลายเซ็นไม่ถูกต้อง — ตรวจ appSecret / App Key / เวลาเครื่อง", en: "Signature verification failed" },
  { code: 1031001003, th: "หุ่นยนต์ออฟไลน์ (ไม่ได้เชื่อมต่อ Cloud)", en: "Robot is not online" },
];

SPEEDY.CATEGORIES = [
  { id: "status", icon: "pulse", th: "สถานะหุ่นยนต์", en: "Robot Status",
    desc: "เช็กว่าออนไลน์ไหม แบตเหลือเท่าไร กำลังทำอะไรอยู่ — ปลอดภัย กดได้ตลอด" },
  { id: "body", icon: "door", th: "ฝาช่องเก็บของ & ไฟ", en: "Cabin & Lights",
    desc: "เปิด/ปิดฝาช่องเก็บของ 80 ลิตร และควบคุมไฟนีออน/ไฟบรรยากาศรอบตัวรถ" },
  { id: "chassis", icon: "wheel", th: "ล้อ & การขับเคลื่อน", en: "Chassis & Drive",
    desc: "ขับด้วยมือ (เดินหน้า/ถอย/เลี้ยว/หยุด) และล็อก/ปลดล็อกล้อสำหรับเข็นด้วยมือ" },
  { id: "map", icon: "map", th: "แผนที่ & จุดหมาย", en: "Maps & Points",
    desc: "ดูแผนที่ที่หุ่นสร้างไว้ รายชื่อจุดหมาย ลิฟต์ ตำแหน่งปัจจุบันแบบเรียลไทม์ และบันทึกจุดใหม่" },
  { id: "nav", icon: "route", th: "นำทาง & งานส่งของ", en: "Navigation & Tasks",
    desc: "สั่งให้หุ่นวิ่งไปจุดหมาย เรียกหุ่น หยุดพัก/ยกเลิก/ทำงานต่อ และสั่งกลับแท่นชาร์จ" },
];

SPEEDY.ENDPOINTS = [
  /* ---------------- STATUS ---------------- */
  {
    no: 1, id: "online", cat: "status", risk: "read",
    method: "GET", path: "/app-api/server/robot-setting/get-robot-online-status",
    th: "เช็กว่าหุ่นออนไลน์ไหม", en: "Get robot online status", zh: "获取机器人在线状态",
    desc: "ถามระบบ Cloud ว่าตอนนี้ Speedybot เชื่อมต่ออยู่หรือไม่ ได้ค่า true = ออนไลน์ เหมาะใช้เป็นปุ่ม \"ทดสอบการเชื่อมต่อ\" อันแรก",
    params: [],
    fields: { data: "true = ออนไลน์, false = ออฟไลน์" },
  },
  {
    no: 2, id: "homepage", cat: "status", risk: "read",
    method: "GET", path: "/app-api/server/speedy-delivery-robot/get-homepage-info",
    th: "สถานะหลัก + แบตเตอรี่", en: "Online status & battery (home info)", zh: "获取机器人在线状态和电量",
    desc: "ข้อมูลหน้าแรกของหุ่น: % แบต, กำลังชาร์จไหม, สถานะการทำงาน, ระยะวิ่งที่เหลือ, จุดที่อยู่ ฯลฯ — แดชบอร์ดด้านบนใช้ API ตัวนี้",
    params: [],
    fields: {
      "data.battery": "แบตเตอรี่คงเหลือ (%)",
      "data.isCharging": "กำลังชาร์จอยู่ไหม",
      "data.robotRunningState": "สถานะการทำงาน เช่น in_idle = ว่าง",
      "data.robotRunningStateValue": "รหัสสถานะการทำงาน (ตัวเลข)",
      "data.linearVelocity": "ความเร็วเชิงเส้นปัจจุบัน (m/s)",
      "data.robotOnlineStatus": "ออนไลน์หรือไม่",
      "data.estimatedRange": "ระยะวิ่งที่เหลือโดยประมาณ (km)",
      "data.pingValue": "ค่า ping เครือข่าย (ms)",
      "data.hubShaftStatus": "ล้อถูกล็อกอยู่ไหม (true = ล็อก)",
      "data.cabinDoorStatus": "สถานะฝา (0 = ปิด)",
      "data.currentPointName": "ชื่อจุดที่หุ่นอยู่ตอนนี้",
      "data.currentTaskId": "ID งานที่กำลังทำ",
      "data.stopMovingFlag": "ถูกสั่งหยุดเคลื่อนที่ (pause) อยู่ไหม",
      "data.backToChargeFlag": "กำลังกลับแท่นชาร์จไหม",
      "data.isEmergencyStop": "กดปุ่มหยุดฉุกเฉินที่ตัวรถอยู่ไหม",
      "data.onlineTime": "เวลาที่ออนไลน์ล่าสุด (ms timestamp)",
      "data.runningTime": "ระยะเวลาที่ทำงาน (ms)",
    },
  },
  {
    no: 3, id: "latest", cat: "status", risk: "read",
    method: "GET", path: "/app-api/server/robot-setting/get-setting-state-latest",
    th: "สถานะละเอียดล่าสุด", en: "Latest robot state (detailed)", zh: "获取机器人最新状态",
    desc: "สถานะเชิงลึก: เวอร์ชันซอฟต์แวร์, ไมล์สะสม, สถานะการนำทาง, เครือข่าย, ฝา, ล็อกล้อ — เหมาะสำหรับหน้า Maintenance",
    params: [],
    fields: {
      "data.battery_level": "แบตเตอรี่ (%)",
      "data.robot_running_state": "สถานะการทำงาน",
      "data.hub_shaft_status": "ล้อล็อกอยู่ไหม",
      "data.navigation_status": "สถานะการนำทาง",
      "data.cabin_door_status": "สถานะฝาช่องเก็บของ",
      "data.chassis_mileage_info": "ระยะทางสะสม",
      "data.network_ping": "ping เครือข่าย",
      "data.network_status": "สถานะเครือข่าย",
      "data.sdk_version": "เวอร์ชัน SDK",
      "data.navigation_version": "เวอร์ชันระบบนำทาง",
      "data.master_control_version": "เวอร์ชันซอฟต์แวร์บอร์ดหลัก",
      "data.is_update_master_control_version": "มีอัปเดตบอร์ดหลักไหม",
      "data.is_update_navigation_version": "มีอัปเดตระบบนำทางไหม",
    },
  },

  /* ---------------- CABIN & LIGHTS ---------------- */
  {
    no: 4, id: "door-open", cat: "body", risk: "action", confirm: true,
    method: "PUT", path: "/app-api/server/command/cabin-door/open",
    th: "เปิดฝาช่องเก็บของ", en: "Open cabin door", zh: "打开舱门（仅独立舱门支持）",
    desc: "สั่งเปิดฝาช่องเก็บของด้านบน (เฉพาะรุ่นที่มีฝาไฟฟ้าแยก) — ระวังมือ/สิ่งของบริเวณฝา",
    note: "เฉพาะรุ่นที่มีฝาแบบอิสระ (独立舱门)",
    params: [], fields: { data: "true = สั่งสำเร็จ" },
  },
  {
    no: 5, id: "door-close", cat: "body", risk: "action", confirm: true,
    method: "PUT", path: "/app-api/server/command/cabin-door/close",
    th: "ปิดฝาช่องเก็บของ", en: "Close cabin door", zh: "关闭舱门（仅独立舱门支持）",
    desc: "สั่งปิดฝาช่องเก็บของ — ตรวจให้แน่ใจว่าไม่มีมือหรือสิ่งของขวางฝา",
    note: "เฉพาะรุ่นที่มีฝาแบบอิสระ",
    params: [], fields: { data: "true = สั่งสำเร็จ" },
  },
  {
    no: 6, id: "neon-on", cat: "body", risk: "action",
    method: "PUT", path: "/app-api/server/light/open-neon-light",
    th: "เปิดไฟนีออน", en: "Neon light ON", zh: "打开霓虹灯（部分车型支持）",
    desc: "เปิดแถบไฟนีออนรอบตัวรถ (บางรุ่น) — ลองกดแล้วดูที่ตัวรถได้เลย",
    note: "บางรุ่นเท่านั้น", params: [], fields: { data: "true = สำเร็จ" },
  },
  {
    no: 7, id: "neon-off", cat: "body", risk: "action",
    method: "PUT", path: "/app-api/server/light/close-neon-light",
    th: "ปิดไฟนีออน", en: "Neon light OFF", zh: "关闭霓虹灯（部分车型支持）",
    desc: "ปิดแถบไฟนีออน", note: "บางรุ่นเท่านั้น", params: [], fields: { data: "true = สำเร็จ" },
  },
  {
    no: 8, id: "ambient-blink", cat: "body", risk: "action",
    method: "PUT", path: "/app-api/server/light/open-ambient-light",
    th: "ไฟบรรยากาศ: กะพริบ", en: "Ambient light — blink", zh: "氛围灯闪烁（部分车型支持）",
    desc: "ให้ไฟบรรยากาศกะพริบ ใช้ดึงความสนใจตอนถึงจุดส่งของ", note: "บางรุ่นเท่านั้น",
    params: [], fields: { data: "true = สำเร็จ" },
  },
  {
    no: 9, id: "ambient-steady", cat: "body", risk: "action",
    method: "PUT", path: "/app-api/server/light/close-ambient-light",
    th: "ไฟบรรยากาศ: ติดค้าง", en: "Ambient light — steady", zh: "氛围灯常亮（部分车型支持）",
    desc: "ให้ไฟบรรยากาศกลับมาติดค้าง (หยุดกะพริบ)", note: "บางรุ่นเท่านั้น",
    params: [], fields: { data: "true = สำเร็จ" },
  },

  /* ---------------- CHASSIS & DRIVE ---------------- */
  {
    no: 15, id: "stop", cat: "chassis", risk: "read", safe: true,
    method: "GET", path: "/app-api/server/move/stop",
    th: "หยุด", en: "Stop", zh: "停止",
    desc: "สั่งให้หุ่นหยุดทันที — ปุ่มนี้กดได้เสมอแม้ไม่ได้ ARM (เป็นคำสั่งความปลอดภัย)",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 18, id: "forward", cat: "chassis", risk: "motion",
    method: "GET", path: "/app-api/server/move/forward",
    th: "เดินหน้า", en: "Move forward", zh: "前进",
    desc: "ขยับหุ่นไปข้างหน้าทีละนิด (ขับด้วยมือ) — แนะนำใช้ปุ่มบังคับในแดชบอร์ดแทน",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 19, id: "backward", cat: "chassis", risk: "motion",
    method: "GET", path: "/app-api/server/move/backward",
    th: "ถอยหลัง", en: "Move backward", zh: "后退",
    desc: "ขยับหุ่นถอยหลังทีละนิด — ระวังด้านหลังไม่มีเซนเซอร์มองเห็นเท่าด้านหน้า",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 17, id: "left", cat: "chassis", risk: "motion",
    method: "GET", path: "/app-api/server/move/left",
    th: "เลี้ยวซ้าย", en: "Turn left", zh: "左转",
    desc: "หมุน/เลี้ยวหุ่นไปทางซ้าย",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 16, id: "right", cat: "chassis", risk: "motion",
    method: "GET", path: "/app-api/server/move/right",
    th: "เลี้ยวขวา", en: "Turn right", zh: "右转",
    desc: "หมุน/เลี้ยวหุ่นไปทางขวา",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 34, id: "pause-move", cat: "chassis", risk: "read", safe: true,
    method: "GET", path: "/app-api/server/move/v2/stop",
    th: "พักการเคลื่อนที่ / ปล่อยให้วิ่งต่อ", en: "Pause / un-pause movement", zh: "暂停移动/取消暂停移动",
    desc: "flag = true → หุ่นหยุดค้างไว้ (งานยังไม่ถูกยกเลิก) · flag = false → ปล่อยให้วิ่งต่อ ใช้แทน #31 ที่ยกเลิกแล้ว",
    params: [{ in: "query", name: "flag", type: "bool", default: true, required: true, desc: "true = พัก, false = เลิกพัก" }],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 10, id: "hub-unlock", cat: "chassis", risk: "motion", confirm: true,
    method: "PUT", path: "/app-api/server/command/chassis/unlock-hub-shaft",
    th: "ปลดล็อกล้อ (เข็นด้วยมือได้)", en: "Unlock wheel hubs", zh: "轮毂松轴",
    desc: "ปลดเบรกล้อให้หมุนอิสระ ใช้ตอนต้องเข็นหุ่นด้วยมือ — ห้ามทำบนทางลาด หุ่นอาจไหลเองได้",
    params: [], fields: { data: "true = สำเร็จ" },
  },
  {
    no: 11, id: "hub-lock", cat: "chassis", risk: "action",
    method: "PUT", path: "/app-api/server/command/chassis/lock-hub-shaft",
    th: "ล็อกล้อ", en: "Lock wheel hubs", zh: "轮毂锁轴",
    desc: "ล็อกล้อกลับ ให้หุ่นอยู่กับที่ (สถานะปกติก่อนวิ่งงาน)",
    params: [], fields: { data: "true = สำเร็จ" },
  },

  /* ---------------- MAPS & POINTS ---------------- */
  {
    no: 27, id: "map-detail", cat: "map", risk: "read",
    method: "GET", path: "/app-api/server/map/get-current-map-detail",
    th: "รายละเอียดแผนที่ปัจจุบัน", en: "Current map detail", zh: "获取当前地图详情",
    desc: "ได้ URL รูปแผนที่ ขนาด (px) ความละเอียด (m/px) จุดกำเนิด และจุดต่างๆ บนรูป — แผนที่สดในแดชบอร์ดสร้างจาก API นี้",
    params: [],
    fields: {
      "data.mapName": "ชื่อแผนที่ (ไม่ซ้ำ)", "data.floor": "ชั้น", "data.mapUrl": "URL รูปแผนที่ (PNG)",
      "data.width": "กว้าง (px)", "data.height": "สูง (px)", "data.resolution": "ความละเอียด (เมตร/พิกเซล)",
      "data.realX": "พิกัด X ของจุดกำเนิด (m)", "data.realY": "พิกัด Y ของจุดกำเนิด (m)",
      "data.graphicPointList": "จุดต่างๆ ในพิกัดพิกเซลของรูป", "data.isDefault": "เป็นแผนที่เริ่มต้นไหม",
    },
  },
  {
    no: 12, id: "maps", cat: "map", risk: "read",
    method: "GET", path: "/app-api/server/map/get-maps",
    th: "รายชื่อแผนที่ทั้งหมด", en: "List robot maps", zh: "获取机器人地图名称列表",
    desc: "แผนที่ทั้งหมดที่หุ่นตัวนี้มี พร้อมบอกว่าแผนที่ไหนเป็นค่าเริ่มต้น",
    params: [],
    fields: { "data[].id": "ID แผนที่", "data[].name": "ชื่อแผนที่", "data[].isDefault": "แผนที่เริ่มต้นไหม" },
  },
  {
    no: 14, id: "points", cat: "map", risk: "read",
    method: "POST", path: "/app-api/server/point/get-point",
    th: "รายชื่อจุดหมาย (Points)", en: "List points", zh: "获取点位列表",
    desc: "จุดทั้งหมดที่บันทึกไว้ แยกตามประเภท (จุดเริ่ม/จุดผ่าน/จุดปลายทาง/แท่นชาร์จ ฯลฯ) — ใช้ id ไปสั่ง #23 ไปยังจุดนั้น",
    params: [{ in: "body", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: {
      "data[].pointFlagName": "ชื่อประเภทจุด", "data[].pointList[].id": "ID จุด (ใช้กับ #23)",
      "data[].pointList[].pointName": "ชื่อจุด", "data[].pointList[].mapName": "แผนที่",
      "data[].pointList[].pointX": "X (เมตร)", "data[].pointList[].pointY": "Y (เมตร)",
      "data[].pointList[].rotation": "ทิศหัวหุ่น (rad)", "data[].pointList[].floor": "ชั้น",
      "data[].pointList[].pointFlag": "รหัสประเภทจุด (ดู #25)", "data[].pointList[].moveType": "โหมดการวิ่งเข้าจุด",
      "data[].pointList[].elevatorId": "ลิฟต์ที่ผูกไว้",
    },
  },
  {
    no: 29, id: "realtime-point", cat: "map", risk: "read",
    method: "GET", path: "/app-api/server/point/get-real-time-point",
    th: "ตำแหน่งปัจจุบัน (เมตร)", en: "Current real-time position", zh: "获取当前实时点位",
    desc: "ตำแหน่งหุ่นเทียบกับแผนที่เลเซอร์ (หน่วยเมตร) ณ ขณะนี้ — ใช้คู่กับ #26 ตอนบันทึกจุด",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { "data.mapName": "ชื่อแผนที่", "data.pointX": "X (m)", "data.pointY": "Y (m)", "data.pointZ": "Z (m)", "data.rotation": "มุมของหุ่น" },
  },
  {
    no: 28, id: "sse-ui-point", cat: "map", risk: "read", stream: true,
    method: "GET", path: "/app-api/server/point/sse-current-robot-ui-point",
    th: "สตรีมตำแหน่งสด (SSE)", en: "Live UI position stream (SSE)", zh: "推送当前实时UI点位",
    desc: "Server-Sent Events: ส่งตำแหน่งหุ่นเป็นพิกเซลบนรูปแผนที่มาเรื่อยๆ ใช้วาดจุดหุ่นวิ่งบนแผนที่ #27 แบบเรียลไทม์ (กดแล้วจะฟัง 15 วินาที)",
    params: [{ in: "query", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" }],
    fields: { pointX: "X บนรูปแผนที่ (px)", pointY: "Y บนรูปแผนที่ (px)", rotation: "มุม", pointName: "real-UI-point" },
  },
  {
    no: 13, id: "elevators", cat: "map", risk: "read",
    method: "GET", path: "/app-api/server/elevator/list",
    th: "รายชื่อลิฟต์", en: "List elevators", zh: "获取机器人电梯列表",
    desc: "ลิฟต์ที่เชื่อมกับหุ่น (ผ่าน IoT module) สำหรับงานส่งของข้ามชั้น",
    params: [],
    fields: { "data[].id": "ID ลิฟต์", "data[].elevatorName": "ชื่อลิฟต์", "data[].robotId": "ID หุ่น" },
  },
  {
    no: 25, id: "point-dict", cat: "map", risk: "read",
    method: "GET", path: "/app-api/server/dict/list",
    th: "ประเภทของจุด (Dictionary)", en: "Point type dictionary", zh: "获取点位类型字典",
    desc: "รายการประเภทจุด เช่น 0 = จุดเริ่ม, 1 = จุดผ่าน, 2 = จุดปลายทาง … ใช้เป็นค่า pointFlag ตอนบันทึกจุด",
    params: [{ in: "query", name: "dictType", type: "string", default: "robot_point_flag", required: true, desc: "คีย์ของ dictionary" }],
    fields: { "data[].label": "ชื่อประเภท", "data[].value": "ค่า (ใช้เป็น pointFlag)", "data[].sort": "ลำดับ" },
  },
  {
    no: 26, id: "set-point", cat: "map", risk: "action", confirm: true,
    method: "POST", path: "/app-api/server/point/set-point",
    th: "บันทึกจุดใหม่ ณ ตำแหน่งปัจจุบัน", en: "Save point at current position", zh: "设置点位（需结合车的实际位置）",
    desc: "นำหุ่นไปจอด ณ ตำแหน่งที่ต้องการก่อน แล้วกดบันทึกเป็นจุดใหม่ (ใช้ตำแหน่งจริงของรถ)",
    params: [
      { in: "body", name: "pointName", type: "string", default: "TESR-Point", required: true, desc: "ชื่อจุด" },
      { in: "body", name: "pointFlag", type: "int", default: 1, required: true, desc: "ประเภทจุด (ดู #25)", picker: "dict" },
      { in: "body", name: "moveType", type: "int", default: 0, required: true, desc: "0 หลบสิ่งกีดขวาง · 1 วิ่งตามราง · 2 รางก่อน", options: [[0, "0 · หลบสิ่งกีดขวาง"], [1, "1 · วิ่งตามราง"], [2, "2 · รางก่อน"]] },
      { in: "body", name: "elevatorId", type: "int", required: false, desc: "ID ลิฟต์ (ถ้ามี)" },
    ],
    fields: { data: "true = บันทึกสำเร็จ" },
  },

  /* ---------------- NAVIGATION & TASKS ---------------- */
  {
    no: 23, id: "goto-id", cat: "nav", risk: "motion", confirm: true,
    method: "POST", path: "/app-api/server/point/move-to-point-by-id",
    th: "ไปยังจุด (ตาม ID)", en: "Go to point by ID", zh: "按点位Id 去往某个点",
    desc: "สั่งให้หุ่นวิ่งไปยังจุดที่บันทึกไว้ — เลือกจุดจากรายการได้เลย (โหลดจาก #14)",
    params: [{ in: "body", name: "id", type: "int", required: true, desc: "ID ของจุด", picker: "point" }],
    fields: { data: "ผลการสั่งงาน" },
  },
  {
    no: 21, id: "goto-xy", cat: "nav", risk: "motion", confirm: true,
    method: "POST", path: "/app-api/server/move/to-single-point",
    th: "ไปยังพิกัด (x, y)", en: "Go to coordinate", zh: "点位前往（根据坐标）",
    desc: "สั่งให้หุ่นวิ่งไปยังพิกัดบนแผนที่เลเซอร์ (หน่วยเมตร) ได้ requestId กลับมา",
    params: [
      { in: "body", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" },
      { in: "body", name: "coordinate.x", type: "number", default: 0, required: true, desc: "X (m)" },
      { in: "body", name: "coordinate.y", type: "number", default: 0, required: true, desc: "Y (m)" },
      { in: "body", name: "coordinate.z", type: "number", default: 0, required: true, desc: "Z (m)" },
      { in: "body", name: "coordinate.r", type: "number", default: 0, required: true, desc: "ทิศหัวหุ่นปลายทาง" },
      { in: "body", name: "coordinate.gearType", type: "int", default: 6, required: true, desc: "6 = โหมด Ackermann คู่" },
      { in: "body", name: "coordinate.moveType", type: "int", default: 0, required: true, desc: "0 หลบสิ่งกีดขวาง · 1 ราง · 2 รางก่อน", options: [[0, "0 · หลบสิ่งกีดขวาง"], [1, "1 · วิ่งตามราง"], [2, "2 · รางก่อน"]] },
    ],
    fields: {
      "data.requestId": "ID คำสั่ง (เก็บไว้ยกเลิก)", "data.requestStatus": "สถานะการส่งคำสั่ง",
      "data.requestTime": "เวลาส่ง", "data.commandType": "ประเภทคำสั่ง", "data.responseType": "ประเภทการตอบกลับ",
    },
  },
  {
    no: 20, id: "summon", cat: "nav", risk: "motion", confirm: true,
    method: "POST", path: "/app-api/server/speedy-delivery-robot/summon/depart",
    th: "เรียกหุ่น / ออกเดินทาง", en: "Summon — depart", zh: "召唤出发",
    desc: "เรียก Speedybot ให้ออกเดินทางไปยังจุดที่เลือก พร้อมเบอร์โทรผู้เรียก (ไม่บังคับ)",
    params: [
      { in: "body", name: "sn", type: "string", auto: "sn", required: true, desc: "Robot SN" },
      { in: "body", name: "pointId", type: "int", required: true, desc: "ID ของจุดปลายทาง", picker: "point" },
      { in: "body", name: "summonerPhone", type: "string", required: false, desc: "เบอร์ผู้เรียก (ไม่บังคับ)" },
    ],
    fields: { data: "true = สำเร็จ" },
  },
  {
    no: 30, id: "task-cancel", cat: "nav", risk: "action", confirm: true,
    method: "PUT", path: "/app-api/server/task/cancel",
    th: "ยกเลิกงาน", en: "Cancel task", zh: "取消任务",
    desc: "ยกเลิกงานที่หุ่นกำลังทำอยู่ (หุ่นจะหยุดงานนั้นทั้งหมด)",
    params: [], fields: { data: "ผลการยกเลิก" },
  },
  {
    no: 32, id: "task-resume", cat: "nav", risk: "motion",
    method: "PUT", path: "/app-api/server/task/resume",
    th: "ทำงานต่อ", en: "Resume task", zh: "继续任务",
    desc: "ให้หุ่นทำงานที่ค้างไว้ต่อ",
    params: [], fields: { data: "ผลการสั่ง" },
  },
  {
    no: 33, id: "recharge", cat: "nav", risk: "motion", confirm: true,
    method: "PUT", path: "/app-api/server/robot-setting/battery-recharge",
    th: "กลับแท่นชาร์จ", en: "Return to charger", zh: "回充",
    desc: "สั่งให้หุ่นวิ่งกลับไปชาร์จเอง — ต้องมี \"จุดพักหน้าแท่นชาร์จ\" อย่างน้อย 1 จุด",
    note: "ต้องตั้งจุดบัฟเฟอร์หน้าแท่นชาร์จก่อน",
    params: [], fields: { data: "ผลการสั่ง" },
  },
  {
    no: 31, id: "task-pause", cat: "nav", risk: "action", deprecated: "ใช้ #34 แทน",
    method: "PUT", path: "/app-api/server/task/pause",
    th: "พักงาน (เลิกใช้แล้ว)", en: "Pause task (deprecated)", zh: "暂停任务",
    desc: "API นี้ถูกยกเลิกตั้งแต่ v5 — ให้ใช้ #34 พักการเคลื่อนที่ แทน",
    params: [], fields: {},
  },
  {
    no: 22, id: "cancel-goto", cat: "nav", risk: "action", deprecated: "ใช้ #30 แทน",
    method: "POST", path: "/app-api/server/command/cancel",
    th: "ยกเลิกการไปยังพิกัด (เลิกใช้แล้ว)", en: "Cancel go-to (deprecated)", zh: "取消前往（已废弃）",
    desc: "เลิกใช้แล้ว — ใช้ #30 ยกเลิกงาน แทน (ใส่ requestId ที่ได้จาก #21)",
    params: [{ in: "body", name: "data", type: "string", required: true, desc: "requestId จาก #21" }],
    fields: {},
  },
  {
    no: 24, id: "backward-id", cat: "nav", risk: "motion", disabled: "ปิดใช้งานโดยผู้ผลิตเพื่อความปลอดภัย",
    method: "POST", path: "/app-api/server/point/backward-to-point-by-id",
    th: "ถอยไปยังจุด (ปิดใช้งาน)", en: "Back up to point by ID (offline)", zh: "按点位Id 后退",
    desc: "ผู้ผลิตปิด API นี้เนื่องจากปัญหาความปลอดภัย — เรียกไม่ได้",
    params: [{ in: "body", name: "id", type: "int", required: true, desc: "ID ของจุด" }],
    fields: {},
  },
];
