/* =========================================================================
   TESR · Speedybot User Manual — single source for the web page and PDFs
   Merged from: TESR Thai setup notes, CSJBot "Speedybot H5 (New Version)
   Product Manual" V1.1.0 (2026-10-08) and "Indoor/Outdoor Speedbot Mapping
   Deployment V1.0 Operation Guide".
   Every text field is { th, en }. Strings may contain simple inline HTML.
   Step: { t: title, d: detail, img: [[file, caption]], warn, tip }
   ========================================================================= */
(function () {
  const L = (th, en) => ({ th, en });
  const I = (file, th, en) => [file, L(th, en)];

  const VIDEO = (id) => ({
    id,
    view: "https://drive.google.com/file/d/" + id + "/view",
    embed: "https://drive.google.com/file/d/" + id + "/preview",
    // direct stream for the TESR player (falls back to the Drive player if it fails)
    stream: "https://drive.usercontent.google.com/download?id=" + id + "&export=download&confirm=t",
  });

  window.MANUAL = {
    version: "1.0",
    updated: "2026-10-15",
    title: L("คู่มือการใช้งานหุ่นยนต์ส่งของ Speedybot", "Speedybot Delivery Robot — User Manual"),
    subtitle: L(
      "ติดตั้ง · สร้างแผนที่ · แก้ไขแผนที่ · เพิ่มจุด · สั่งงาน · ทดสอบ — ทีละขั้นตอน พร้อมวิดีโอสอน",
      "Setup · Mapping · Map editing · Adding points · Running tasks · Testing — step by step with video tutorials"
    ),
    links: {
      h5: "https://alpha-pro.csjbot.com/#/login",
      deploy: "http://192.168.99.2:3578/alpha-pro-scan/index.html",
      videos: "https://drive.google.com/drive/folders/1nU23VCrMb2vPsbBdeekD89LOT_le2pSM",
      apiLab: "https://tesr-channel.github.io/Speedybot_API/",
      manualWeb: "https://tesr-channel.github.io/Speedybot_API/manual.html",
    },
    videos: {
      v01: Object.assign(VIDEO("1Kf488uSSo0MfIbchaxYraZx1Jy9lO2II"), { title: L("01 · ติดตั้งและตั้งค่าพื้นฐาน", "01 · Basic setup") }),
      v02: Object.assign(VIDEO("13CF4OGyT-PtTbzVsXLsD0kw0piT98234"), { title: L("02 · สร้างแผนที่ (Mapping)", "02 · Mapping") }),
      v03: Object.assign(VIDEO("1giYCBIMVQR7IzrefL58bDnhaG8VScCPE"), { title: L("03 · แก้ไขแผนที่ (Edit Map)", "03 · Edit map") }),
      v04: Object.assign(VIDEO("1xfZTQYDCSzyhE4_aFloX-QBX4snaxaxr"), { title: L("04 · เพิ่มจุดนำทาง (Add Point)", "04 · Navigation — add points") }),
      v05: Object.assign(VIDEO("1_w0PwMQ-si4WrHpa9ZKcgraM39YFk34C"), { title: L("05 · สั่งหุ่นวิ่งทำงาน (Robot Run)", "05 · Navigation — robot run") }),
      v06: Object.assign(VIDEO("19uW-sWlgD4ksZYHdVEgyuLAABZoas5ji"), { title: L("06 · ทดสอบภาคสนามนอกอาคาร", "06 · Outdoor field test") }),
    },

    /* ------------------------------------------------------------ before you start */
    intro: {
      lead: L(
        "Speedybot คือหุ่นยนต์ส่งของที่วิ่งได้ทั้งในอาคารและนอกอาคาร มีช่องเก็บของล็อกได้ นำทางด้วย LiDAR และหลบสิ่งกีดขวางอัตโนมัติ คู่มือนี้สรุปทุกอย่างที่ต้องทำตั้งแต่แกะกล่องจนหุ่นวิ่งส่งของได้จริง เรียงตามลำดับการทำงาน 6 หัวข้อ แต่ละหัวข้อมีวิดีโอสอนประกอบ",
        "Speedybot is an indoor/outdoor delivery robot with lockable compartments, LiDAR navigation and automatic obstacle avoidance. This manual walks through everything from unboxing to running real deliveries in six sections, in the order you do them. Each section has a video tutorial."
      ),
      img: [I("img/en-k01.jpg", "สเปกและส่วนประกอบหลักของหุ่น", "Product specifications"), I("img/en-k02.jpg", "คุณสมบัติหลัก", "Core features")],
      need: {
        title: L("สิ่งที่ต้องเตรียม", "What you need"),
        items: [
          L("ประแจหกเหลี่ยม (Hex key) สำหรับถอดฝาข้างและแผงวงจร", "Hex (Allen) key to remove the side cover and the board"),
          L("ซิมการ์ด 4G/5G ที่เปิดใช้งานอินเทอร์เน็ตแล้ว", "An activated 4G/5G data SIM card"),
          L("แบตเตอรี่และที่ชาร์จที่มากับหุ่น (ใช้ของผู้ผลิตเท่านั้น)", "The robot battery and charger (manufacturer parts only)"),
          L("แท็บเล็ต/คอมพิวเตอร์ที่ต่อ WiFi ได้ สำหรับสร้างแผนที่ (ผู้ผลิตแจ้งว่ายังไม่รองรับอุปกรณ์ Apple)", "A WiFi tablet or computer for mapping (the vendor notes Apple devices are not supported yet)"),
          L("สมาร์ตโฟนสำหรับเปิดแอป H5 สั่งงานหุ่น", "A smartphone for the H5 web app"),
          L("บัญชีผู้ดูแล (Admin) ที่ TESR มอบให้ — ใช้ทั้งหน้า Deployment และแอป H5", "The admin account issued by TESR — used for both the Deployment page and the H5 app"),
        ],
      },
      creds: {
        title: L("ข้อมูลเข้าระบบของหุ่นคุณ", "Your robot's access details"),
        note: L("กรอกเก็บไว้ · ห้ามแชร์บัญชีให้บุคคลอื่น · ติดต่อ TESR หากลืมรหัส", "Fill in and keep safe · do not share the account · contact TESR for resets"),
        pwNote: L("* รหัสผ่านในคู่มือนี้เป็น<b>รหัสตัวอย่าง (ค่าเริ่มต้น)</b> อาจมีการเปลี่ยนแปลงในอนาคต หากต้องการเปลี่ยนรหัส หรือใช้รหัสนี้ไม่ได้ กรุณาแจ้งผู้ดูแลระบบ (Admin) / TESR", "* Passwords in this manual are <b>example (default) passwords</b> and may change in the future. To change a password, or if it no longer works, please contact your administrator (Admin) / TESR."),
        rows: [
          [L("Robot SN (หมายเลขเครื่อง)", "Robot SN"), ""],
          [L("WiFi Hotspot ของหุ่น", "Robot WiFi hotspot"), "SpeedyBot + SN"],
          [L("รหัส WiFi (รหัสตัวอย่าง*)", "WiFi password (example*)"), "dnk131212"],
          [L("บัญชีผู้ดูแล (Username)", "Admin username"), ""],
          [L("รหัสผ่าน", "Password"), ""],
          [L("หน้าสร้างแผนที่ (ต่อ WiFi หุ่นก่อน)", "Mapping page (on robot WiFi)"), "http://192.168.99.2:3578/alpha-pro-scan/index.html"],
          [L("แอป H5 สั่งงาน", "H5 operation app"), "https://alpha-pro.csjbot.com"],
        ],
      },
      flow: [
        L("ติดตั้ง", "Setup"), L("สร้างแผนที่", "Mapping"), L("แก้ไขแผนที่", "Edit map"),
        L("เพิ่มจุด", "Add points"), L("สั่งงาน", "Run tasks"), L("ทดสอบ", "Test"),
      ],
      safety: {
        title: L("ข้อควรระวังด้านความปลอดภัย", "Safety first"),
        items: [
          L("ถอดแบตเตอรี่ออกทุกครั้งก่อนถอดหรือใส่แผงวงจร", "Always remove the battery before removing or refitting the circuit board"),
          L("ห้ามเข็นหุ่นด้วยมือขณะเปิดเครื่องหรือกำลังทำงาน — ปลดล็อกล้อ (Release hub) ก่อน และเข็นไม่เกิน 30 เมตร/นาที", "Do not push the robot while it is powered on and working — release the hub first, and push no faster than 30 m/min"),
          L("ห้ามบัง LiDAR (เซ็นเซอร์ด้านบน) ระหว่างสร้างแผนที่และวิ่งงาน", "Never block the LiDAR on top of the robot during mapping or tasks"),
          L("ใช้รีโมตคอนโทรลเฉพาะเมื่อมองเห็นหุ่นชัด ไม่มีคนใกล้ และทางโล่ง", "Use remote control only when the robot is in sight, nobody is nearby and the path is clear"),
          L("ห้ามใส่สารอันตราย ของเหลวหกง่าย หรือของเกินขนาด/น้ำหนักช่องเก็บ", "Do not load hazardous goods, spill-prone liquids or items beyond the compartment size/weight"),
          L("ห้ามแกะเครื่องหรือแก้สายไฟภายในเอง ติดต่อ TESR เมื่อพบปัญหา", "Do not disassemble the robot or alter wiring; contact TESR for repairs"),
        ],
      },
    },

    /* ------------------------------------------------------------ sections */
    sections: [
      /* ============================================== 1. SETUP */
      {
        id: "setup",
        n: 1,
        video: "v01",
        title: L("ติดตั้งอุปกรณ์และเปิดใช้งาน", "Hardware setup & power"),
        summary: L(
          "ใส่ซิมการ์ด ใส่แบตเตอรี่ ปิดฝาข้าง เปิด–ปิดเครื่อง และชาร์จแบต",
          "Insert the SIM, fit the battery, close the side cover, power on/off and charge"
        ),
        groups: [
          {
            title: L("1.1 ใส่ซิมการ์ด", "1.1 Insert the SIM card"),
            steps: [
              {
                t: L("ถอดฝาด้านข้าง", "Remove the side cover"),
                d: L("ใช้ประแจหกเหลี่ยมไขสกรูออก 4 ตัว (ฝั่งละ 2 ตัว) แล้วยกฝาข้างออก", "Use the hex key to remove 4 screws (2 on each side), then lift off the side cover."),
                img: [I("img/th-d01.jpg", "ตำแหน่งสกรูฝาข้าง", "Side cover screws")],
              },
              {
                t: L("ถอดแบตเตอรี่ออกก่อน", "Remove the battery first"),
                d: L("ต้องถอดแบตออก <b>ทุกครั้ง</b> ก่อนถอดแผงวงจร", "The battery must be removed <b>every time</b> before you remove the circuit board."),
                warn: L("ห้ามถอด/ใส่แผงวงจรขณะแบตยังเสียบอยู่", "Never remove or fit the board with the battery connected"),
                img: [I("img/th-i01.jpg", "การถอดแบตเตอรี่", "Removing the battery")],
              },
              {
                t: L("ถอดแผงวงจรสีเขียว", "Remove the green board"),
                d: L("ไขสกรู 4 ตัวที่ยึดแผงวงจรสีเขียว แล้วยกออกเพื่อให้ใส่ซิมได้สะดวก", "Unscrew the 4 screws holding the green board and lift it out so the SIM slot is easy to reach."),
                img: [I("img/th-d02.jpg", "สกรู 4 ตัวของแผงวงจร และช่องใส่ซิม", "The 4 board screws and the SIM slot")],
              },
              {
                t: L("ใส่ซิมแล้วประกอบกลับ", "Insert the SIM and refit"),
                d: L("เสียบซิมเข้าช่องให้สุด จากนั้นขันสกรูยึดแผงวงจรสีเขียวกลับเข้าที่", "Push the SIM fully into the slot, then screw the green board back in place."),
                img: [I("img/th-d03.jpg", "ช่องใส่ซิม", "SIM slot close-up")],
              },
            ],
          },
          {
            title: L("1.2 ใส่แบตเตอรี่และปิดฝาข้าง", "1.2 Fit the battery and close the cover"),
            steps: [
              {
                t: L("ใส่แบตเตอรี่", "Insert the battery"),
                d: L("ดันแบตเข้าช่องจนสุดและล็อกให้แน่น (ถอดออกให้ทำย้อนขั้นตอน)", "Slide the battery fully into its bay and lock it (reverse the steps to remove it)."),
                img: [I("img/th-d04.jpg", "การใส่แบตเตอรี่", "Inserting the battery")],
              },
              {
                t: L("ใส่ฝาข้างกลับ", "Refit the side cover"),
                d: L("วางฝาให้ตรงตำแหน่ง แล้วขันสกรูทั้ง 4 ตัวกลับให้แน่น", "Align the cover and tighten all 4 screws."),
                img: [I("img/th-i02.jpg", "ประกอบฝาข้างกลับเรียบร้อย", "Side cover refitted")],
              },
            ],
          },
          {
            title: L("1.3 เปิด–ปิดเครื่อง", "1.3 Power on / off"),
            steps: [
              {
                t: L("เปิดเครื่อง", "Power on"),
                d: L("กดปุ่มเปิดเครื่องสีเงินใต้ตัวหุ่นประมาณ 1 วินาที จนได้ยินเสียง “ตี๊ด” 1 ครั้ง ระบบใช้เวลาบูตประมาณ 5 นาที", "Press the silver power button under the robot for about 1 second until it beeps once. Booting takes about 5 minutes."),
                img: [I("img/th-d06.jpg", "ปุ่มเปิดเครื่องใต้ตัวหุ่น", "Power button under the robot"), I("img/en-k03.jpg", "ตำแหน่งสวิตช์ (จากคู่มือผู้ผลิต)", "Switch location (vendor manual)")],
              },
              {
                t: L("ปิดเครื่อง", "Power off"),
                d: L("วิธีที่ 1: กดปุ่มเปิดเครื่องค้างไว้ 10 วินาที<br>วิธีที่ 2: ในแอป H5 ไปที่ <b>Management Operations → Power off</b> แล้วกดยืนยัน", "Method 1: press and hold the power button for 10 seconds.<br>Method 2: in the H5 app open <b>Management Operations → Power off</b> and confirm."),
                img: [I("img/en-k04.jpg", "ปิดเครื่องจากแอป H5", "Power off from the H5 app")],
                tip: L("สั่งปิดเครื่องเมื่อหุ่นว่างและรอบตัวปลอดภัยเท่านั้น", "Only power off when the robot is idle and the area is safe"),
              },
            ],
          },
          {
            title: L("1.4 การชาร์จแบตเตอรี่", "1.4 Charging"),
            note: L(
              "ซอฟต์แวร์เวอร์ชันปัจจุบันยังไม่รองรับการกลับแท่นชาร์จอัตโนมัติ ต้องเข็นหุ่นไปชาร์จเอง",
              "The current software does not yet support automatic return-to-dock. Push the robot to the charger manually."
            ),
            steps: [
              {
                t: L("ปลดล็อกล้อแล้วเข็นไปที่ชาร์จ", "Release the hub and push to the charger"),
                d: L("ในแอป H5 กด <b>Release hub shaft</b> (ปลดล็อกล้อ) จึงจะเข็นหุ่นได้ — ชาร์จเสร็จแล้วกด <b>Lock hub shaft</b> กลับก่อนสั่งงาน", "In the H5 app tap <b>Release hub shaft</b> so the robot can be pushed. After charging tap <b>Lock hub shaft</b> again before starting tasks."),
              },
              {
                t: L("เสียบที่ชาร์จ", "Plug in the charger"),
                d: L("เสียบปลั๊กที่ชาร์จเข้าไฟบ้านก่อน รอ 2–3 วินาที แล้วจึงเสียบหัวชาร์จเข้าช่องชาร์จด้านหลังล่างของหุ่น<br>ไฟที่ชาร์จ: <b>แดง</b> = กำลังชาร์จ · <b>เขียว</b> = เต็ม/ไม่ได้ชาร์จ", "Plug the charger into mains first, wait 2–3 seconds, then connect it to the charging port at the lower rear of the robot.<br>Charger light: <b>red</b> = charging · <b>green</b> = full / idle."),
                img: [I("img/th-d05.jpg", "ปลดล็อกล้อ และไฟสถานะที่ชาร์จ", "Releasing the hub and charger lights")],
              },
            ],
            warn: L(
              "ใช้แบตเตอรี่และที่ชาร์จของผู้ผลิตเท่านั้น · ถ้าไม่ได้ใช้งานนาน ให้ชาร์จเต็มอย่างน้อยเดือนละครั้ง · ถ้าชาร์จไม่เข้าหรือไฟผิดปกติ ให้หยุดใช้และติดต่อ TESR",
              "Use only the manufacturer's battery and charger · when stored, fully charge at least once a month · if it will not charge or the light is abnormal, stop and contact TESR"
            ),
          },
        ],
      },

      /* ============================================== 2. MAPPING */
      {
        id: "mapping",
        n: 2,
        video: "v02",
        title: L("สร้างแผนที่ (Mapping)", "Mapping"),
        summary: L(
          "ต่อ WiFi ของหุ่น เข้าหน้า Open Deployment Platform สร้างแผนที่ใหม่ แล้วเข็นหุ่นเดินให้ทั่วพื้นที่",
          "Join the robot's WiFi, open the Open Deployment Platform, create a map and walk the robot through the whole area"
        ),
        principle: L(
          "หลักสำคัญ: ก่อนเริ่มต้องกำหนด <b>จุดเริ่มต้น (Origin) และทิศหน้าหุ่น</b> · ระหว่างสร้างแผนที่ต้องเดินตามหุ่นตลอดและให้สัญญาณ WiFi คงที่ · จบแล้วต้องกลับมาที่ Origin ด้วยทิศเดิม",
          "Key rule: before you start, fix the <b>origin and the robot's heading</b> · walk with the robot the whole time and keep WiFi stable · finish back at the origin with the same heading"
        ),
        groups: [
          {
            title: L("2.1 เตรียมจุดเริ่มต้น (Origin)", "2.1 Prepare the origin"),
            steps: [
              {
                t: L("เลือกจุดเริ่มต้น", "Choose the start point"),
                d: L("ขณะปิดเครื่อง เข็นหุ่นไปยังจุดเริ่มต้น เลือกจุดที่คนสัญจรน้อยและกลับมาได้ง่าย (หลีกเลี่ยงกลางล็อบบี้)", "With the robot off, push it to the start point. Pick a quiet spot that is easy to return to (avoid the middle of a lobby)."),
              },
              {
                t: L("ถ่ายรูปตำแหน่งและทิศหุ่น", "Photograph the position and heading"),
                d: L("ถ่ายรูปเก็บไว้ว่าหุ่นอยู่ตรงไหนและหันหน้าไปทางใด เพื่อกลับมาวางตำแหน่งเดิมได้แม่นยำ — จุดนี้จะเป็นจุดที่หุ่น <b>เริ่มระบุตำแหน่งทุกครั้งที่เปิดเครื่อง</b>", "Take a photo of where the robot stands and which way it faces so you can put it back exactly. This is where the robot <b>localizes every time it powers on</b>."),
              },
              {
                t: L("เปิดเครื่องแล้วรอ", "Power on and wait"),
                d: L("เปิดเครื่องที่จุดนี้ แล้วรอให้ระบบพร้อมประมาณ 5 นาที", "Power on at this spot and wait about 5 minutes for the system to be ready."),
              },
            ],
          },
          {
            title: L("2.2 ต่อ WiFi ของหุ่นและเข้าสู่ระบบ", "2.2 Join the robot WiFi and log in"),
            steps: [
              {
                t: L("ต่อ WiFi Hotspot ของหุ่น", "Join the robot's hotspot"),
                d: L("เปิด WiFi ในแท็บเล็ต/คอมพิวเตอร์ เลือกชื่อ <code>SpeedyBot</code> + หมายเลขเครื่อง (เช่น <code>SpeedyBot4E002625001B</code>) รหัสผ่าน <code>dnk131212</code> (รหัสตัวอย่าง)", "On the tablet or computer, join <code>SpeedyBot</code> + serial number (e.g. <code>SpeedyBot4E002625001B</code>), password <code>dnk131212</code> (example password)."),
                tip: L("<code>dnk131212</code> เป็นรหัสตัวอย่าง (ค่าเริ่มต้นจากโรงงาน) อาจเปลี่ยนแปลงได้ในอนาคต หากต้องการเปลี่ยนรหัส หรือเชื่อมต่อไม่ได้ กรุณาแจ้งแอดมิน", "<code>dnk131212</code> is an example (factory default) password and may change in the future. To change it, or if it does not connect, please contact the admin."),
                img: [I("img/th-d07.jpg", "เลือก WiFi ของหุ่น", "Selecting the robot's WiFi")],
                warn: L("เดินตามหุ่นตลอดและรักษาสัญญาณ WiFi ไม่น้อยกว่า 2 ขีด ถ้าหลุดนานอาจต้องเริ่มสร้างแผนที่ใหม่", "Stay with the robot and keep at least 2 bars of WiFi. A long disconnection may force you to remap."),
              },
              {
                t: L("เปิดหน้า Open Deployment Platform", "Open the Open Deployment Platform"),
                d: L("เปิดเบราว์เซอร์ไปที่ <code>http://192.168.99.2:3578/alpha-pro-scan/index.html</code> แล้วล็อกอินด้วยบัญชีผู้ดูแลที่ TESR มอบให้", "In a browser open <code>http://192.168.99.2:3578/alpha-pro-scan/index.html</code> and log in with the admin account from TESR."),
                tip: L("รหัสผ่านบัญชีอาจมีการเปลี่ยนแปลง หากต้องการเปลี่ยนรหัสหรือเข้าสู่ระบบไม่ได้ กรุณาแจ้งแอดมิน", "Account passwords may change. To change yours, or if you cannot log in, please contact the admin."),
                img: [I("img/th-d08.jpg", "หน้าเข้าสู่ระบบ (บัญชีถูกปิดบัง)", "Login page (account hidden)")],
              },
            ],
          },
          {
            title: L("2.3 สร้างแผนที่ใหม่", "2.3 Create a new map"),
            steps: [
              {
                t: L("กด Create map", "Click Create map"),
                d: L("ไปที่หน้า <b>Map management</b> แล้วกด <b>Create map</b> มุมขวาบน", "Go to <b>Map management</b> and click <b>Create map</b> at the top right."),
                img: [I("img/map-01.jpg", "หน้า Map management และปุ่ม Create map", "Map management and the Create map button")],
              },
              {
                t: L("กรอกข้อมูลแผนที่", "Fill in the map details"),
                d: L("กรอก Map Number, ชื่อแผนที่ และชั้น ตามตารางด้านล่าง แล้วกด <b>Save and start mapping</b>", "Fill in the map number, name and floor as in the table below, then click <b>Save and start mapping</b>."),
                img: [I("img/map-02.jpg", "ฟอร์มข้อมูลแผนที่", "Map information form")],
                table: {
                  head: [L("ช่อง", "Field"), L("กติกา", "Rule"), L("ตัวอย่าง", "Example")],
                  rows: [
                    [L("Map Number (รหัสแผนที่)", "Map number (ID)"), L("อังกฤษ ตัวเลข และ _ เท่านั้น ไม่มีช่องว่าง/ภาษาไทย ไม่เกิน 10 ตัวอักษร ห้ามซ้ำ", "Letters, digits and _ only; no spaces or Thai/Chinese; max 10 characters; unique"), L("A_ZONE_4F", "A_ZONE_4F")],
                    [L("Map nickname (ชื่อแสดง)", "Map nickname"), L("ไทยหรืออังกฤษก็ได้ ตั้งให้จำง่ายหน้างาน", "Any language; easy to recognise on site"), L("อาคาร A ชั้น 4", "Building A 4F")],
                    [L("Floor (ชั้น)", "Floor"), L("ตัวเลข ใช้เชื่อมระบบลิฟต์ภายหลัง", "A number; used later for elevator integration"), L("4", "4")],
                  ],
                },
              },
            ],
          },
          {
            title: L("2.4 เริ่มสแกนแผนที่", "2.4 Scan the map"),
            steps: [
              {
                t: L("ยืนยันจุดเริ่มต้น", "Confirm the origin"),
                d: L("ตรวจว่าหุ่นอยู่ที่ Origin และหันทิศตรงกับรูปที่ถ่ายไว้ แล้วกด <b>Confirm origin and start mapping</b> (ล้อจะถูกล็อกไว้จนกว่าระบบจะพร้อม)", "Check the robot is on the origin with the recorded heading, then click <b>Confirm origin and start mapping</b> (the wheels stay locked until the system is ready)."),
                img: [I("img/map-03.jpg", "หน้าต่างยืนยันจุดเริ่มต้น", "Confirm-origin dialog")],
              },
              {
                t: L("รอ Initialize", "Wait for initialization"),
                d: L("ระบบจะ Initialize ไม่เกิน ~10 วินาที <b>ห้ามเข็นหรือบังคับหุ่น</b> จนกว่าจะขึ้นข้อความว่าเริ่มเข็นได้", "Initialization takes up to ~10 seconds. <b>Do not push or drive the robot</b> until the ready message appears."),
                img: [I("img/map-04.jpg", "กำลัง Initialize", "Initializing"), I("img/map-05.jpg", "Initialize เสร็จ เริ่มเข็นได้", "Initialization complete — you can move the robot")],
                tip: L("ถ้าเกิน 10 วินาทีแล้วยังไม่พร้อมและปุ่มอื่นกดไม่ได้ ให้รีสตาร์ทหุ่นที่ Origin รอ ~5 นาที แล้วเริ่มใหม่", "If nothing happens after 10 s and other buttons are inactive, restart the robot at the origin, wait ~5 min and start again"),
              },
              {
                t: L("เข็นหุ่นให้ทั่วพื้นที่", "Cover the whole area"),
                d: L("<b>ในอาคาร:</b> เข็นด้วยความเร็วสม่ำเสมอ ผ่านทุกทางเดิน ห้อง และทางเลี้ยวที่ต้องการให้หุ่นวิ่ง<br><b>นอกอาคาร:</b> ใช้ Remote control ช่วยได้ (ล็อกล้อก่อน ใช้ค่าเริ่มต้น Angular 0.50 / Linear 0.8) เดินตามหุ่นในระยะไม่เกิน 20 เมตร", "<b>Indoors:</b> push at a steady pace through every corridor, room and turn the robot will use.<br><b>Outdoors:</b> you may use remote control (lock the hub first; keep defaults angular 0.50 / linear 0.8) and stay within 20 m of the robot."),
                warn: L("ห้ามบัง LiDAR ระหว่างเข็น · เวอร์ชันนี้ยังดูแผนที่สดระหว่างสแกนไม่ได้ ต้องเดินให้ครอบคลุมทุกเส้นทาง", "Do not block the LiDAR · this version cannot show the live map while scanning, so cover every route on foot"),
              },
            ],
          },
          {
            title: L("2.5 จบการสร้างแผนที่", "2.5 Finish mapping"),
            steps: [
              {
                t: L("กลับมาที่จุดเริ่มต้น", "Return to the origin"),
                d: L("เข็นหุ่นกลับมาที่ Origin ให้คลาดเคลื่อนไม่เกิน 20 ซม. และหันทิศเดียวกับตอนเริ่ม", "Push the robot back to the origin within 20 cm and with the same heading as at the start."),
              },
              {
                t: L("ยืนยันว่ากลับถึงจุดเริ่มต้น", "Confirm return to origin"),
                d: L("กด <b>Confirm returned to origin</b> แล้วรอระบบประมวลผลแผนที่ ห้ามปิดหน้าเว็บหรือตัด WiFi ระหว่างนี้ เสร็จแล้วระบบจะเข้าหน้าแก้ไขแผนที่ให้อัตโนมัติ", "Click <b>Confirm returned to origin</b> and wait for processing. Do not close the page or drop WiFi. The map editor opens automatically when done."),
                img: [I("img/map-06.jpg", "หน้าต่างจบการสร้างแผนที่", "Finish-mapping dialog")],
              },
            ],
          },
        ],
      },

      /* ============================================== 3. EDIT MAP */
      {
        id: "edit-map",
        n: 3,
        video: "v03",
        title: L("แก้ไขแผนที่และตั้งเป็นแผนที่หลัก", "Edit the map & set it as default"),
        summary: L(
          "ลบจุดรบกวน วาดกำแพงเสมือน/เส้นทางเสมือน บันทึก แล้วซิงก์และตั้งเป็น Default map ในแอป H5",
          "Erase noise, draw virtual walls/routes, save, then sync and set the default map in the H5 app"
        ),
        groups: [
          {
            title: L("3.1 แก้ไขแผนที่บนหน้า Deployment (แนะนำใช้แท็บเล็ต)", "3.1 Edit on the Deployment page (tablet recommended)"),
            steps: [
              {
                t: L("เข้าหน้าแก้ไขแผนที่", "Open the editor"),
                d: L("ปกติระบบเปิดให้อัตโนมัติหลังสร้างเสร็จ ถ้าออกไปแล้วให้กด <b>Edit map</b> ที่แผนที่ในรายการ<br>ใช้ 2 นิ้วลากเพื่อเลื่อน · บีบ/ถ่าง 2 นิ้วเพื่อซูม · <b>Reset 100%</b> เพื่อกลับขนาดเดิม", "It opens automatically after mapping; otherwise click <b>Edit map</b> on the map in the list.<br>Two-finger drag to pan · pinch to zoom · <b>Reset 100%</b> to restore zoom."),
                img: [I("img/map-07.jpg", "แถบเครื่องมือแก้ไขแผนที่", "Map editor toolbar")],
              },
              {
                t: L("ลบจุดรบกวนด้วยยางลบ (Eraser)", "Remove noise with the Eraser"),
                d: L("เลือก <b>Eraser</b> → เลือกขนาด (เล็ก/กลาง/ใหญ่) → ใช้นิ้วเดียวลากทับจุดรบกวนหรือเส้นที่ไม่ต้องการ", "Choose <b>Eraser</b> → pick a size (small/medium/large) → swipe with one finger over the noise."),
              },
              {
                t: L("วาดกำแพงเสมือน (Virtual wall)", "Draw virtual walls"),
                d: L("<b>Line wall:</b> แตะจุดบนแผนที่ต่อกันเป็นเส้น แล้วกด Finish (ถ้าหลายเส้นแยกกัน ให้กด Finish drawing ทุกเส้นก่อนเริ่มเส้นใหม่)<br><b>Rectangle:</b> ลากเป็นกรอบสี่เหลี่ยม แล้วกด Finish<br>หุ่นจะไม่วิ่งผ่านกำแพงเสมือน ใช้กั้นบันได ขอบทาง หรือพื้นที่ห้ามเข้า", "<b>Line wall:</b> tap points to draw a polyline, then Finish (for separate segments, click Finish drawing after each).<br><b>Rectangle:</b> drag a box, then Finish.<br>The robot never crosses a virtual wall — use it for stairs, kerbs and no-go areas."),
                img: [I("img/map-08.jpg", "ยืนยันหลังวาดกำแพงเสมือน", "Confirming a virtual wall")],
              },
              {
                t: L("วาดเส้นทางเสมือน (ถ้าต้องการ)", "Draw virtual routes (optional)"),
                d: L("ซูมเข้าแล้วใช้แปรงวาดเส้นทางที่ต้องการให้หุ่นวิ่งตาม เส้นทางหลายเส้นต้องเชื่อมกัน (มีจุดตัดกันอย่างน้อย 1 จุด) — ถ้าไม่ต้องใช้ข้ามได้", "Zoom in and brush the routes the robot should follow. Multiple routes must connect (at least one intersection). Skip if not needed."),
              },
              {
                t: L("บันทึก", "Save"),
                d: L("กด <b>Save and finish editing</b> รอจนขึ้นว่าสร้างแผนที่สำเร็จ", "Click <b>Save and finish editing</b> and wait for the success message."),
                img: [I("img/map-09.jpg", "สร้างแผนที่เสร็จสมบูรณ์", "Map creation complete")],
              },
            ],
          },
          {
            title: L("3.2 เข้าแอป H5 บนมือถือ", "3.2 Log in to the H5 app"),
            steps: [
              {
                t: L("เปิดแอป H5", "Open the H5 app"),
                d: L("สแกน QR Code บนตัวหุ่น หรือเปิด <code>https://alpha-pro.csjbot.com</code> แล้วล็อกอินด้วยบัญชีผู้ดูแล (บัญชีเดียวกับหน้า Deployment) ติ๊กยอมรับข้อตกลงแล้วกด Login", "Scan the QR code on the robot or open <code>https://alpha-pro.csjbot.com</code>, log in with the admin account (same as the Deployment page), accept the agreement and tap Login."),
                tip: L("รหัสผ่านอาจมีการเปลี่ยนแปลง หากต้องการเปลี่ยนรหัสหรือเข้าสู่ระบบไม่ได้ กรุณาแจ้งแอดมิน", "Passwords may change. To change yours, or if you cannot log in, please contact the admin."),
                img: [I("img/th-d10.jpg", "QR Code บนตัวหุ่น", "QR code on the robot"), I("img/en-k05.jpg", "หน้าเข้าสู่ระบบ H5", "H5 login page")],
              },
              {
                t: L("เปลี่ยนภาษาเป็นอังกฤษ", "Switch the language to English"),
                d: L("กด <b>Language</b> ด้านล่างหน้า Login เลือกภาษาอังกฤษ และหลังล็อกอินแล้วให้เลือกภาษาอีกครั้งที่ด้านล่างหน้า Home", "Tap <b>Language</b> at the bottom of the login page and choose English; after login choose it again at the bottom of Home."),
                img: [I("img/th-d11.jpg", "เปลี่ยนภาษาก่อนล็อกอิน", "Language before login"), I("img/th-d12.jpg", "เปลี่ยนภาษาหลังล็อกอิน", "Language after login")],
              },
            ],
          },
          {
            title: L("3.3 ซิงก์แผนที่และตั้งเป็น Default map", "3.3 Sync the map and set it as default"),
            steps: [
              {
                t: L("ซิงก์แผนที่", "Synchronize maps"),
                d: L("ไปที่ <b>My account → Map management</b> กด <b>Synchronize map</b> รอจนขึ้น Synchronization successful", "Go to <b>My account → Map management</b> and tap <b>Synchronize map</b>; wait for “Synchronization successful”."),
                img: [I("img/en-k73.jpg", "รายการแผนที่และปุ่ม Synchronize map", "Map list and Synchronize map")],
              },
              {
                t: L("ตั้งเป็นแผนที่หลัก", "Set as default"),
                d: L("เลือกแผนที่ที่ต้องการ ปัดไปทางขวาแล้วกด <b>Set default</b> แผนที่นั้นจะมีป้าย <b>Default Map</b>", "Pick the map, swipe right and tap <b>Set default</b>. It now shows a <b>Default Map</b> badge."),
                img: [I("img/th-d13.jpg", "ขั้นตอน 1–6: ซิงก์และตั้ง Default map", "Steps 1–6: sync and set default")],
              },
              {
                t: L("ตั้งชื่อ/ชั้นของแผนที่ (ถ้าต้องการ)", "Rename / set floor (optional)"),
                d: L("กดแก้ไขแผนที่เพื่อตั้งชื่อที่แสดงและชั้น แล้วบันทึก", "Edit the map to set its display name and floor, then save."),
                img: [I("img/th-d14.jpg", "ขั้นตอน 7–9: แก้ชื่อและชั้น", "Steps 7–9: name and floor")],
              },
              {
                t: L("กลับจุดเริ่มต้นแล้วรีสตาร์ทหุ่น", "Return to origin and restart"),
                d: L("ปลดล็อกล้อ เข็นหุ่นกลับไปที่ <b>จุดเริ่มต้นของแผนที่</b> (ทิศเดิม) แล้ว <b>ปิด–เปิดเครื่องใหม่</b> หุ่นจะโหลด Default map และระบุตำแหน่งจากจุดนี้", "Release the hub, push the robot back to the <b>map origin</b> (same heading) and <b>power-cycle</b> it. The robot loads the default map and localizes from there."),
                warn: L("การตั้ง Default map ไม่ได้สลับแผนที่ทันที ต้องรีสตาร์ทหุ่นที่จุดเริ่มต้นของแผนที่นั้นเสมอ", "Setting a default map does not switch maps immediately — always restart the robot at that map's origin"),
              },
              {
                t: L("ตรวจสอบแผนที่", "Check the map"),
                d: L("เมื่อหุ่นพร้อม (สถานะ <b>in_idle</b>) กดที่การ์ดสถานะในหน้า Home เพื่อดูแผนที่และตำแหน่งหุ่น ตรวจว่าตำแหน่งตรงกับความจริง", "When the robot is ready (<b>in_idle</b>), tap the status card on Home to see the map and robot position; check it matches reality."),
                img: [I("img/th-d15.jpg", "ตรวจสอบแผนที่จากการ์ดสถานะ", "Checking the map from the status card")],
                tip: L("ดูแผนที่และตำแหน่งแบบเรียลไทม์ได้ที่แดชบอร์ดของ TESR Speedybot API Lab ด้วย", "You can also watch the live map and position on the TESR Speedybot API Lab dashboard"),
              },
            ],
          },
        ],
      },

      /* ============================================== 4. ADD POINTS */
      {
        id: "add-point",
        n: 4,
        video: "v04",
        title: L("เพิ่มจุดนำทาง (Add Point)", "Navigation — add points"),
        summary: L(
          "เก็บพิกัดจุดส่งของ จุดรอ และจุดพิเศษ แล้วซิงก์ให้หุ่นรู้จักเส้นทาง",
          "Record delivery, waiting and special points, then sync them so the robot can route between them"
        ),
        groups: [
          {
            title: L("4.1 จุดปกติ (Common points)", "4.1 Common points"),
            steps: [
              {
                t: L("เข้า Point management", "Open Point management"),
                d: L("ไปที่ <b>My account → Point management</b> เลือกแท็บ <b>Common points</b> และตรวจว่า <b>Current map</b> เป็นแผนที่ที่ใช้งานอยู่ (กด Switch เพื่อเปลี่ยน)", "Go to <b>My account → Point management</b>, choose <b>Common points</b> and check <b>Current map</b> is the active map (tap Switch to change)."),
                img: [I("img/en-k72.jpg", "เมนูผู้ดูแลในหน้า My account", "Admin menu in My account"), I("img/en-k86.jpg", "Common points: Start / Intermediate / End", "Common points: Start / Intermediate / End")],
              },
              {
                t: L("เข็นหุ่นไปยังตำแหน่งจริง", "Push the robot to the spot"),
                d: L("ปลดล็อกล้อ แล้วเข็นหุ่นไปยังตำแหน่งที่ต้องการบันทึก (เช่น หน้าห้อง จุดรับของ) หันหน้าหุ่นไปทางที่ต้องการให้จอด", "Release the hub and push the robot to the place you want to save (e.g. a door or pickup spot), facing the way it should park."),
              },
              {
                t: L("กด Add point +", "Tap Add point +"),
                d: L("กรอก <b>ชื่อจุด</b> และ <b>Point type</b>: Start point (จุดเริ่ม) / Intermediate point (จุดผ่าน) / End point (จุดปลายทาง)", "Enter the <b>point name</b> and <b>Point type</b>: Start, Intermediate or End point."),
                img: [I("img/th-d16.jpg", "เพิ่มจุดใหม่", "Adding a point")],
              },
              {
                t: L("เลือกรูปแบบการเคลื่อนที่", "Choose the movement type"),
                d: L("มี Obstacle avoidance (หลบสิ่งกีดขวาง) / Track (วิ่งตามเส้นทาง) / Track-priority — <b>ปัจจุบันให้ใช้ Obstacle Avoidance</b>", "Options are Obstacle avoidance / Track / Track-priority — <b>use Obstacle Avoidance for now</b>."),
                img: [I("img/th-d17.jpg", "ตัวเลือก Movement type", "Movement type options")],
              },
              {
                t: L("ใส่พิกัด", "Set the coordinates"),
                d: L("<b>Real time coordinates</b> (แนะนำ): กด <b>Get coordinates</b> ระบบจะดึงตำแหน่งปัจจุบันของหุ่นมาให้<br><b>Manual fill:</b> พิมพ์ X, Y, Z และมุมหมุนเอง (เช่น Origin = 0, 0, 0)", "<b>Real time coordinates</b> (recommended): tap <b>Get coordinates</b> to use the robot's current position.<br><b>Manual fill:</b> type X, Y, Z and rotation (e.g. origin = 0, 0, 0)."),
                img: [I("img/th-d18.jpg", "ดึงพิกัดแบบ Manual / Real-time", "Manual vs real-time coordinates"), I("img/en-k91.jpg", "Get coordinates", "Get coordinates")],
              },
              {
                t: L("บันทึก", "Save"),
                d: L("กด <b>Save</b> ทำซ้ำขั้นตอนนี้จนครบทุกจุด", "Tap <b>Save</b>. Repeat for every point."),
              },
            ],
          },
          {
            title: L("4.2 จุดพิเศษ (Special points)", "4.2 Special points"),
            steps: [
              {
                t: L("จุดรอ (Waiting point)", "Waiting point"),
                d: L("แท็บ <b>Special points</b> → <b>Waiting point → Add point</b> ใช้เป็นจุดที่หุ่นกลับไปรอหลังจบงานหรือยกเลิกงาน", "<b>Special points</b> tab → <b>Waiting point → Add point</b>. This is where the robot goes after finishing or cancelling a task."),
                img: [I("img/th-d32.jpg", "ตั้งจุด Waiting point", "Setting a waiting point")],
              },
              {
                t: L("จุดลิฟต์", "Elevator points"),
                d: L("Elevator call point / Observation point / Waiting point outside the elevator — ใช้เมื่อเชื่อมระบบลิฟต์ (ตั้งตามหน้างาน)", "Elevator call point / observation point / waiting point outside the elevator — for elevator integration, set per site."),
                img: [I("img/en-k87.jpg", "ประเภทจุดพิเศษ", "Special point types")],
              },
            ],
          },
          {
            title: L("4.3 ซิงก์และทดสอบจุด", "4.3 Sync and test the points"),
            steps: [
              {
                t: L("กด Synchronization points (สำคัญ)", "Tap Synchronization points (important)"),
                d: L("หลังเพิ่ม/แก้ไขจุดทุกครั้ง ให้กด <b>Synchronization points</b> มุมขวาบน เพื่อส่งความเชื่อมโยงของจุดขึ้นระบบ ถ้าไม่ซิงก์ หุ่นจะหาเส้นทางระหว่างจุดไม่ได้", "After adding or editing points, always tap <b>Synchronization points</b> (top right) to upload point connectivity. Without it the robot cannot route between points."),
                img: [I("img/en-k92.jpg", "ปุ่ม Synchronization points", "Synchronization points button")],
              },
              {
                t: L("ล็อกล้อแล้วทดสอบวิ่งไปจุด", "Lock the hub and test Go"),
                d: L("ล็อกล้อ (Lock hub shaft) เลือกจุด แล้วกด <b>Go</b> → <b>Confirm</b> หุ่นจะวิ่งไปจุดนั้น (มี Lateral movement / Back สำหรับขยับตำแหน่งเล็กน้อย)", "Lock the hub, select a point and tap <b>Go</b> → <b>Confirm</b>; the robot drives there (Lateral movement / Back nudge the position)."),
                img: [I("img/en-k89.jpg", "ยืนยันสั่งวิ่งไปจุด", "Confirm Go")],
              },
              {
                t: L("แก้ไข/ลบจุด", "Edit or delete"),
                d: L("เลือกจุดแล้วกดไอคอนดินสอเพื่อแก้ หรือถังขยะเพื่อลบ — ก่อนลบตรวจว่าไม่มีเส้นทางหรืองานส่งของอ้างอิงจุดนั้น แล้วซิงก์อีกครั้ง", "Select a point and tap the pencil to edit or the bin to delete. Check no route or delivery uses it, then sync again."),
              },
            ],
          },
        ],
      },

      /* ============================================== 5. ROBOT RUN */
      {
        id: "robot-run",
        n: 5,
        video: "v05",
        title: L("สั่งหุ่นวิ่งทำงาน (Robot Run)", "Navigation — robot run"),
        summary: L(
          "ตั้งค่าก่อนวิ่ง เรียกหุ่น ส่งของ รับของ ติดตามงาน และใช้เมนูผู้ดูแล",
          "Pre-run settings, summon, deliver, pick up, track tasks and use the admin controls"
        ),
        groups: [
          {
            title: L("5.1 หน้า Home และสถานะหุ่น", "5.1 Home and robot status"),
            steps: [
              {
                t: L("อ่านการ์ดสถานะ", "Read the status card"),
                d: L("ด้านบนแสดงชื่อหุ่น, SN, ออนไลน์/ออฟไลน์, % แบต, ระยะวิ่งได้โดยประมาณ, ความเร็ว, สัญญาณ และสถานะงาน (in_idle = ว่าง)", "The top card shows the robot name, SN, online state, battery %, estimated range, speed, signal and task status (in_idle = idle)."),
                img: [I("img/en-k11.jpg", "หน้า Home ของผู้ดูแล", "Admin home page"), I("img/en-k26.jpg", "การ์ดสถานะขณะทำงาน", "Status card during a task")],
              },
              {
                t: L("ความหมายของสถานะ", "Status meanings"),
                d: L("<b>เขียว Online</b> ใช้งานได้ปกติ · <b>เทา Offline</b> ตรวจไฟ/เครือข่าย · <b>เหลือง Self-testing</b> รอให้ตรวจระบบเสร็จ · <b>แดง Fault</b> หยุดสั่งงานและแจ้งผู้ดูแล · <b>ดำ Disabled</b> ผู้ใช้ทั่วไปสั่งงานไม่ได้", "<b>Green Online</b> ready · <b>Grey Offline</b> check power/network · <b>Yellow Self-testing</b> wait · <b>Red Fault</b> stop tasks and call an admin · <b>Black Disabled</b> regular users cannot operate."),
                img: [I("img/en-k13.jpg", "ไฟสถานะ", "Status indicators")],
              },
              {
                t: L("ล็อก/ปลดล็อกล้อ", "Lock / release the hub"),
                d: L("ใน Quick operation: <b>Lock hub shaft</b> = พร้อมวิ่งงาน · <b>Release hub shaft</b> = เข็นด้วยมือได้ (ห้ามสั่งงานขณะปลดล็อก)", "In Quick operation: <b>Lock hub shaft</b> = ready for tasks · <b>Release hub shaft</b> = can be pushed by hand (do not start tasks while released)."),
                img: [I("img/en-k30.jpg", "สถานะล้อล็อก", "Hub locked"), I("img/en-k31.jpg", "สถานะล้อปลดล็อก", "Hub released")],
              },
            ],
          },
          {
            title: L("5.2 ตั้งค่าก่อนวิ่ง", "5.2 Pre-run settings"),
            steps: [
              {
                t: L("ความเร็วและเวลารอ (Delivery settings)", "Speed and wait times (Delivery settings)"),
                d: L("<b>My account → Delivery settings</b>: ปรับ Walking speed (0.1–2 ม./วินาที), เวลารอที่จุด, เวลารอเปิดช่องรับของ, วิธียืนยันตัวตนเปิดช่อง แล้วกด <b>Save and Publish</b>", "<b>My account → Delivery settings</b>: set walking speed (0.1–2 m/s), point wait time, compartment pickup wait time and the opening verification method, then <b>Save and Publish</b>."),
                img: [I("img/en-k70.jpg", "Delivery settings", "Delivery settings")],
                tip: L("เริ่มทดสอบด้วยความเร็วต่ำ (เช่น 0.3–0.5 ม./วินาที) แล้วค่อยเพิ่ม", "Start testing at low speed (e.g. 0.3–0.5 m/s), then increase"),
              },
              {
                t: L("ภาษา เสียง และพลังงาน (Personalization)", "Language, volume and power (Personalization)"),
                d: L("<b>My account → Personalization settings</b>: ภาษา, Automatic recharge (ยังไม่รองรับในเวอร์ชันนี้), เปิด–ปิดอัตโนมัติ, ระดับเสียง และช่วงเวลาประกาศเสียงขณะวิ่ง แล้วกด <b>Save and Publish</b>", "<b>My account → Personalization settings</b>: language, automatic recharge (not supported in this version yet), scheduled power on/off, volume and voice-prompt interval, then <b>Save and Publish</b>."),
                img: [I("img/th-d19.jpg", "ปรับเสียง (ปรับความเร็วในหน้านี้ยังไม่รองรับ — ใช้ Delivery settings)", "Volume (speed here is not supported — use Delivery settings)"), I("img/en-k85.jpg", "Personalization settings", "Personalization settings")],
              },
              {
                t: L("สมุดรายชื่อผู้รับ (Address book)", "Address book"),
                d: L("<b>My account → General management → Address book → + Add contact</b> ใส่ชื่อและเบอร์โทร (นำเข้าด้วย Excel ได้) แล้วผูกผู้รับกับจุดได้สูงสุด 3 คน ใน Smart point information", "<b>My account → General management → Address book → + Add contact</b>: name and phone (Excel import available). Bind up to 3 recipients per point in Smart point information."),
                img: [I("img/th-d22.jpg", "General management → Address book", "General management → Address book"), I("img/th-d23.jpg", "ฟอร์มเพิ่มผู้ติดต่อ", "Add contact form")],
              },
            ],
          },
          {
            title: L("5.3 เรียกหุ่น (Summon)", "5.3 Summon"),
            steps: [
              {
                t: L("เลือกจุดที่ต้องการเรียก", "Pick the point"),
                d: L("หน้า Home กด <b>Summon</b> → เลือกจุด (หรือค้นหาชื่อ) → ตรวจชื่อ/เบอร์ผู้รับแจ้งเตือน", "On Home tap <b>Summon</b> → select (or search) the point → check the notification contact."),
                img: [I("img/th-d24.jpg", "ขั้นตอน 1–3 การเรียกหุ่น", "Summon steps 1–3")],
              },
              {
                t: L("ยืนยันการเรียก", "Confirm"),
                d: L("กด <b>Summon to</b> → <b>Confirm</b> หุ่นจะวิ่งไปยังจุดนั้น ดูความคืบหน้าได้ที่แท็บ Task", "Tap <b>Summon to</b> → <b>Confirm</b>; the robot drives to the point. Follow progress in the Task tab."),
                img: [I("img/th-d25.jpg", "ยืนยันและผลการเรียกหุ่น", "Confirmation and result"), I("img/en-k21.jpg", "รายละเอียดงานระหว่างวิ่ง", "Task details en route")],
              },
              {
                t: L("ยกเลิกงาน", "Cancel"),
                d: L("กด <b>Cancel task</b> ในรายละเอียดงาน หุ่นจะกลับไปจุดกลับที่ผู้ดูแลตั้งไว้ (Waiting point)", "Tap <b>Cancel task</b> in the task details; the robot returns to the admin-set return point."),
              },
            ],
          },
          {
            title: L("5.4 ส่งของ (Delivery)", "5.4 Send an item (Delivery)"),
            note: L("ต้อง <b>สั่งส่งของก่อน</b> จึงจะกดรับของได้ ถ้ากดรับก่อนจะขึ้นข้อผิดพลาด", "You must <b>create a delivery first</b>; tapping Retrieve before that shows an error."),
            steps: [
              {
                t: L("เปิดหน้าส่งของ", "Open Delivery"),
                d: L("หน้า Home กด <b>I want to deliver something</b>", "On Home tap <b>I want to deliver something</b>."),
                img: [I("img/th-d26.jpg", "กดรับของก่อนส่งจะขึ้นข้อผิดพลาด", "Retrieve before delivery shows an error")],
              },
              {
                t: L("เลือกปลายทาง ผู้รับ และประเภทของ", "Choose destination, recipient and item type"),
                d: L("กด <b>Select location</b> เลือกจุด → ระบบใส่ผู้รับเริ่มต้นของจุดให้ (แก้ได้สูงสุด 3 คน) → เลือกประเภทของ (Parcel / Takeaway / Documents …)", "Tap <b>Select location</b> and pick a point → the default recipient fills in (edit up to 3) → choose the item type (Parcel / Takeaway / Documents …)."),
                img: [I("img/th-d27.jpg", "ขั้นตอน 1–5 การส่งของ", "Delivery steps 1–5"), I("img/en-k39.jpg", "เลือกประเภทของ", "Choose item type")],
              },
              {
                t: L("เปิดช่อง ใส่ของ แล้วสั่งวิ่ง", "Open, load and send"),
                d: L("กด <b>Open the hatch</b> ใส่ของให้มั่นคงไม่ขวางฝา แล้วกดตามขั้นที่ 6 (ปิดฝา) หุ่นจะปิดฝาและวิ่งไปปลายทางอัตโนมัติ", "Tap <b>Open the hatch</b>, load the item securely so it does not block the lid, then do step 6 (close). The robot closes the lid and drives off."),
                img: [I("img/th-d28.jpg", "ขั้นที่ 6 ปิดฝาและเริ่มส่ง", "Step 6: close and dispatch"), I("img/en-k38.jpg", "หน้ายืนยันข้อมูลการส่ง", "Delivery confirmation")],
              },
            ],
          },
          {
            title: L("5.5 รับของ (Retrieve)", "5.5 Pick up an item (Retrieve)"),
            steps: [
              {
                t: L("เปิดหน้ารับของ", "Open Retrieve"),
                d: L("เมื่อหุ่นถึงปลายทาง กด <b>I want to get something</b> (Retrieve) ในหน้า Home", "When the robot arrives, tap <b>I want to get something</b> (Retrieve) on Home."),
                img: [I("img/th-d29.jpg", "ขั้นตอน 1–3 การรับของ", "Retrieve steps 1–3")],
              },
              {
                t: L("ยืนยันตัวตน", "Verify"),
                d: L("ใส่เลข 4 ตัวท้ายของเบอร์ผู้รับ หรือรหัสรับของตามที่ตั้งไว้ แล้วกด <b>Verify</b> → ตรวจข้อมูลออเดอร์ → <b>Open the door</b>", "Enter the last 4 digits of the recipient's phone or the pickup password, tap <b>Verify</b> → check the order → <b>Open the door</b>."),
                img: [I("img/en-k43.jpg", "ใส่รหัสยืนยัน", "Verification"), I("img/en-k44.jpg", "ข้อมูลออเดอร์", "Order information")],
              },
              {
                t: L("หยิบของแล้วปิดฝา", "Take the item and close"),
                d: L("หยิบของออกก่อนเวลานับถอยหลังหมด แล้วกด <b>Close the door</b> เป็นการจบงาน แอปจะกลับหน้า Home อัตโนมัติ", "Take the item before the countdown ends, then tap <b>Close the door</b> to finish. The app returns to Home."),
                img: [I("img/th-d33.jpg", "ผลการยืนยันและเวลานับถอยหลัง", "Verification and countdown"), I("img/en-k46.jpg", "รับของสำเร็จ", "Pickup successful")],
                warn: L("ห้ามดึงหรือกระแทกฝาช่องเก็บของ ถ้าเปิดไม่ได้ให้ติดต่อผู้ดูแล", "Do not force or strike the hatch; contact the admin if it does not open"),
              },
            ],
          },
          {
            title: L("5.6 ตั้งค่างานส่งของเพิ่มเติม", "5.6 Extra delivery settings"),
            steps: [
              {
                t: L("เวลารอและรหัสรับของ", "Wait time and pickup password"),
                d: L("ใน Delivery settings ตั้งเวลารอที่จุดส่ง/รับของ — <b>ถ้าเกินเวลา หุ่นจะยกเลิกงานและไม่ยอมเปิดฝา ต้องเริ่มใหม่</b> · ตั้งวิธีเปิดช่อง: None / Default password (รหัสตายตัว) / 4 ตัวท้ายเบอร์ / OTP", "In Delivery settings set the wait time at the point — <b>after timeout the robot cancels the task and will not open; start again</b> · choose the opening method: None / Default password / last 4 phone digits / SMS code."),
                img: [I("img/th-d30.jpg", "ตั้งเวลารอและรหัส (รหัสในภาพถูกปิดบัง)", "Wait time and password (password hidden)")],
                tip: L("รหัสรับของเป็นค่าที่ตั้งเองได้และเปลี่ยนได้ทุกเมื่อ หากต้องการเปลี่ยน กรุณาแจ้งแอดมิน", "The pickup password is set by the admin and can be changed at any time — contact the admin to change it."),
              },
              {
                t: L("จุดกลับหลังจบงาน และการรับงานใหม่", "Return point and new tasks"),
                d: L("เลือกให้หุ่นกลับ <b>Charging point</b> หรือ <b>Waiting point</b> หลังจบ/ยกเลิกงาน และเลือกว่าจะรับงานใหม่ได้หรือไม่ขณะยังมีของในช่อง แล้วกด <b>Save and Publish</b>", "Choose whether the robot returns to the <b>Charging point</b> or <b>Waiting point</b> after a task, and whether it accepts new tasks while items remain inside, then <b>Save and Publish</b>."),
                img: [I("img/th-d31.jpg", "จุดกลับและการรับงานใหม่", "Return point and new tasks")],
              },
            ],
          },
          {
            title: L("5.7 ติดตามงาน (Task)", "5.7 Track tasks"),
            steps: [
              {
                t: L("รายการงาน", "Task list"),
                d: L("แท็บ <b>Task</b> ด้านล่าง แสดงงานทั้งหมด กรองตามประเภท/สถานะได้ กดที่งานเพื่อดูรายละเอียด แผนที่ ความคืบหน้า และยกเลิกงาน", "The <b>Task</b> tab lists all tasks with type/status filters. Tap a task for details, map, progress and cancel."),
                img: [I("img/en-k62.jpg", "แท็บ Task", "Task tab"), I("img/en-k66.jpg", "รายละเอียดงาน", "Task details")],
              },
            ],
          },
          {
            title: L("5.8 เมนูผู้ดูแล (Management Operations)", "5.8 Admin controls (Management Operations)"),
            steps: [
              {
                t: L("เปิดหน้า Management Operations", "Open Management Operations"),
                d: L("หน้า Home กด <b>Management Operations</b> ทุกคำสั่งจะมีหน้าต่างยืนยันอีกครั้งก่อนทำงาน", "On Home tap <b>Management Operations</b>. Every command asks for confirmation."),
                img: [I("img/th-d20.jpg", "เข้าเมนูและยกเลิกงาน", "Menu entry and cancel task"), I("img/en-k56.jpg", "หน้าต่างยืนยันคำสั่ง", "Confirmation dialog")],
                table: {
                  head: [L("ปุ่ม", "Button"), L("ใช้ทำอะไร", "What it does")],
                  rows: [
                    [L("Power off", "Power off"), L("ปิดเครื่องจากระยะไกล (เมื่อหุ่นว่างและปลอดภัย)", "Remote shutdown (only when idle and safe)")],
                    [L("Reboot", "Reboot"), L("รีสตาร์ทเมื่อหุ่นค้างหรือทำงานผิดปกติ", "Restart when unresponsive or abnormal")],
                    [L("Wheel hub clearance", "Wheel hub clearance"), L("ล้างความผิดปกติของล้อ (ให้คนถอยห่างก่อน)", "Clear wheel faults (keep people away)")],
                    [L("Recharge", "Recharge"), L("สั่ง/ยกเลิกกลับไปชาร์จ", "Start / cancel return to charge")],
                    [L("Pause", "Pause"), L("หยุดงานชั่วคราว", "Pause the current task")],
                    [L("Cancel task", "Cancel task"), L("ยกเลิกงานปัจจุบัน (จัดการของในช่องก่อน)", "Cancel the task (handle any items first)")],
                  ],
                },
              },
              {
                t: L("ตั้งค่าพื้นฐาน", "Basic settings"),
                d: L("เปิด/ปิดฝาช่อง (Cabin door / Hatch control A–B–C), เปิด/ปิดการใช้งานของผู้ใช้ (User disable), ล็อก/ปลดล็อกล้อ (Hub status), ไฟหน้า (Light status)", "Open/close the hatch (Cabin door / Hatch control A–B–C), enable/disable users, lock/release the hub, front light on/off."),
                img: [I("img/th-d21.jpg", "ฝา ล้อ รีโมต และไฟหน้า", "Door, hub, remote and front light"), I("img/en-k58.jpg", "Hatch control", "Hatch control")],
              },
              {
                t: L("บังคับด้วยรีโมต (Remote control)", "Remote control"),
                d: L("กด <b>Remote control</b> → เปิดสวิตช์ → ใช้จอยกลางจอบังคับเดินหน้า/ถอย/เลี้ยว ปรับ Angular / Linear velocity ด้วย − / + เสร็จแล้ว <b>ปิดสวิตช์ทันที</b>", "Tap <b>Remote control</b> → switch it on → use the joystick to drive; adjust angular/linear velocity with − / +. <b>Switch it off</b> when done."),
                img: [I("img/en-k60.jpg", "Remote control ปิด", "Remote control off"), I("img/en-k61.jpg", "Remote control เปิด", "Remote control on")],
                warn: L("มีความเสี่ยงชน — ใช้เฉพาะเมื่อมองเห็นหุ่น ไม่มีคนใกล้ ทางโล่ง และใช้ความเร็วต่ำ", "Collision risk — only with the robot in sight, nobody nearby, a clear path and low speed"),
              },
              {
                t: L("แจ้งเตือนแบตและผู้ติดต่อฉุกเฉิน", "Battery alerts and emergency contacts"),
                d: L("<b>My account → Warning management</b>: เปิด Anti-lost mode, ตั้งผู้ติดต่อฉุกเฉินสูงสุด 3 คน และระดับแบตเตือน/วิกฤต (ค่าวิกฤตต้องต่ำกว่าค่าเตือน)", "<b>My account → Warning management</b>: anti-lost mode, up to 3 emergency contacts, warning and critical battery levels (critical must be lower)."),
                img: [I("img/en-k93.jpg", "Warning management", "Warning management")],
              },
            ],
          },
        ],
      },

      /* ============================================== 6. TESTING */
      {
        id: "testing",
        n: 6,
        video: "v06",
        title: L("ทดสอบการทำงานและส่งมอบ", "Testing & hand-over"),
        summary: L(
          "ทดสอบตามลำดับก่อนใช้งานจริง ทั้งในอาคารและนอกอาคาร พร้อมเช็กลิสต์ การแก้ปัญหา และการบำรุงรักษา",
          "A step-by-step test before going live, indoors and outdoors, plus checklist, troubleshooting and maintenance"
        ),
        groups: [
          {
            title: L("6.1 ขั้นตอนการทดสอบ", "6.1 Test procedure"),
            steps: [
              {
                t: L("ตรวจความพร้อม", "Pre-check"),
                d: L("หุ่นออนไลน์ (เขียว), แบตมากกว่า 50%, สถานะ in_idle, ล้อล็อกแล้ว, ฝาช่องปิด, ความเร็วตั้งต่ำไว้ก่อน", "Robot online (green), battery above 50%, status in_idle, hub locked, hatches closed, speed set low."),
              },
              {
                t: L("ทดสอบระบุตำแหน่ง", "Localization"),
                d: L("รีสตาร์ทหุ่นที่ Origin แล้วดูแผนที่ว่าตำแหน่งและทิศของหุ่นตรงกับความจริง", "Restart at the origin and confirm the position and heading on the map match reality."),
              },
              {
                t: L("ทดสอบวิ่งไปทุกจุด", "Drive to every point"),
                d: L("ใช้ <b>Point management → Go</b> สั่งไปทีละจุด ตรวจว่าจอดตรงตำแหน่ง ไม่ชนขอบทาง และไม่ข้ามกำแพงเสมือน", "Use <b>Point management → Go</b> for each point; check it parks accurately, avoids kerbs and respects virtual walls."),
              },
              {
                t: L("ทดสอบหลบสิ่งกีดขวาง", "Obstacle avoidance"),
                d: L("ให้คนเดินตัดหน้าหรือวางกล่องขวางทางในระยะปลอดภัย หุ่นต้องชะลอ/หยุดและหาทางอ้อม", "Have a person step in front or place a box in the path at a safe distance; the robot must slow/stop and route around."),
              },
              {
                t: L("ทดสอบงานจริงครบวงจร", "End-to-end task"),
                d: L("Summon → Delivery (ใส่ของ) → Retrieve (ยืนยันตัวตนและหยิบของ) → หุ่นกลับ Waiting point · จับเวลาและตรวจการแจ้งเตือนผู้รับ", "Summon → Delivery (load) → Retrieve (verify and unload) → robot returns to the waiting point · time it and check recipient notifications."),
              },
              {
                t: L("ทดสอบกรณีผิดปกติ", "Exception cases"),
                d: L("Pause / Cancel task ระหว่างวิ่ง, ปล่อยให้เกินเวลารอรับของ (หุ่นต้องยกเลิกงานเอง), ลองรหัสผิด, ทดลอง Remote control ระยะสั้น", "Pause / cancel mid-route, let the pickup wait expire (the robot must cancel itself), try a wrong code, short remote-control drive."),
              },
              {
                t: L("นอกอาคาร (Field test)", "Outdoors (field test)"),
                d: L("ตรวจพื้นผิว ทางลาด ขอบฟุตบาท จุดอับสัญญาณ 4G/5G และสภาพอากาศ ทดลองวิ่งทั้งเส้นทางจริงอย่างน้อย 2–3 รอบ โดยมีคนเดินตาม", "Check surfaces, ramps, kerbs, 4G/5G dead spots and weather. Run the real route at least 2–3 times with someone following."),
              },
            ],
          },
          {
            title: L("6.2 เช็กลิสต์ส่งมอบ", "6.2 Hand-over checklist"),
            checklist: [
              L("ใส่ซิม แบต และปิดฝาข้างเรียบร้อย หุ่นออนไลน์", "SIM, battery and side cover fitted; robot online"),
              L("ต่อ WiFi หุ่นได้ และล็อกอินหน้า Deployment ได้", "Robot WiFi and Deployment login work"),
              L("สร้างแผนที่ครบทุกพื้นที่ กลับ Origin คลาดเคลื่อนไม่เกิน 20 ซม. ทิศเดิม", "Whole area mapped; returned to origin within 20 cm, same heading"),
              L("แก้ไขแผนที่ (ลบจุดรบกวน กำแพงเสมือน เส้นทางเสมือนถ้าต้องใช้) และบันทึกแล้ว", "Map edited (noise, virtual walls, routes if needed) and saved"),
              L("ซิงก์แผนที่ ตั้ง Default map และรีสตาร์ทที่ Origin แล้ว", "Map synced, set as default and robot restarted at the origin"),
              L("เพิ่มจุดทั้งหมด (รวม Waiting point) และกด Synchronization points แล้ว", "All points added (incl. waiting point) and Synchronization points done"),
              L("ทดสอบ Go ไปทุกจุดผ่าน", "Go to every point passed"),
              L("ทดสอบ Summon / Delivery / Retrieve ครบวงจรผ่าน", "Summon / Delivery / Retrieve end-to-end passed"),
              L("ตั้งเวลารอ รหัสรับของ จุดกลับ ผู้รับ และผู้ติดต่อฉุกเฉินแล้ว", "Wait times, pickup code, return point, recipients and emergency contacts set"),
              L("อบรมผู้ใช้เรื่องการชาร์จ ล็อก/ปลดล็อกล้อ และการหยุดฉุกเฉิน", "Users trained on charging, hub lock/release and emergency stop"),
            ],
          },
          {
            title: L("6.3 ปัญหาที่พบบ่อยและวิธีแก้", "6.3 Troubleshooting"),
            faq: [
              [L("เริ่มสร้างแผนที่แล้วค้างที่ Initialize นาน", "Mapping initialization hangs"), L("รีสตาร์ทหุ่นที่ Origin ต่อ WiFi ใหม่ รอ ~5 นาที แล้วเริ่มใหม่", "Restart at the origin, reconnect WiFi, wait ~5 min and start again")],
              [L("โหมดรีโมตแล้วล้อไม่หมุน", "Wheels do not move in remote mode"), L("ตรวจว่าล้อถูกล็อก (Lock hub shaft) แล้วก่อนใช้รีโมต", "Make sure the hub is locked before remote control")],
              [L("WiFi หลุดระหว่างสร้างแผนที่", "WiFi drops while mapping"), L("เดินเข้าใกล้หุ่นทันทีแล้วทำต่อเมื่อสัญญาณกลับมา ถ้าหลุดนานให้สร้างใหม่", "Move closer and continue once the signal returns; remap if lost for long")],
              [L("บันทึกการแก้ไขแล้วแผนที่ไม่เปลี่ยน", "Edits not shown after saving"), L("ตรวจว่ากด Save and finish editing แล้ว รอสักครู่ แล้วออก–เข้าใหม่", "Confirm Save and finish editing was clicked, wait, then exit and re-enter")],
              [L("แผนที่ใหม่ไม่ถูกใช้งาน", "New map not in use"), L("ตรวจว่าตั้ง Default map แล้ว และรีสตาร์ทหุ่นที่ Origin ของแผนที่นั้น", "Check it is the default map and the robot was restarted at that map's origin")],
              [L("หุ่นวิ่งไปจุดไม่ได้ / หาเส้นทางไม่เจอ", "Robot cannot reach a point"), L("กด Synchronization points อีกครั้ง ตรวจว่าเลือกแผนที่ถูก และจุดอยู่ในพื้นที่โล่งไม่ติดกำแพงเสมือน", "Sync points again, check the right map is selected and the point is in open space away from virtual walls")],
              [L("กดรับของแล้วขึ้นข้อผิดพลาด", "Retrieve shows an error"), L("ต้องมีงานส่งของที่ถึงปลายทางแล้วก่อน จึงจะรับของได้", "There must be a delivery that has arrived before you can retrieve")],
              [L("ฝาไม่เปิด / งานถูกยกเลิกเอง", "Hatch will not open / task cancelled"), L("อาจเกินเวลารอที่ตั้งไว้ เริ่มงานใหม่ หรือให้ผู้ดูแลเปิดฝาจาก Management Operations", "The wait time probably expired; start again or let an admin open the hatch from Management Operations")],
              [L("หุ่นออฟไลน์ (สีเทา)", "Robot offline (grey)"), L("ตรวจแบต ซิม/สัญญาณ 4G และรีสตาร์ทหุ่น", "Check battery, SIM/4G signal and restart the robot")],
              [L("สถานะ Fault (สีแดง)", "Fault (red)"), L("หยุดสั่งงาน ใช้ Wheel hub clearance หรือ Reboot ถ้ายังไม่หาย แจ้ง TESR พร้อมรูป/วิดีโอ", "Stop tasks, try Wheel hub clearance or Reboot; if it persists send TESR photos/video")],
            ],
          },
          {
            title: L("6.4 การดูแลรักษาและการขนย้าย", "6.4 Care and transport"),
            bullets: [
              L("ตรวจสถานะออนไลน์ แบต และงานค้างทุกวันก่อนใช้งาน ชาร์จเมื่อแบตต่ำ", "Check online state, battery and pending tasks every day; charge when low"),
              L("พื้นที่ชาร์จต้องแห้งและโล่ง ห้ามย้ายอุปกรณ์ชาร์จโดยไม่ได้รับอนุญาต", "Keep the charging area dry and clear; do not move the charger without permission"),
              L("ทำความสะอาดจอ จุด QR Code ช่องเก็บของ และล้อเป็นประจำ เพื่อไม่ให้เศษสิ่งสกปรกกระทบการทำงาน", "Clean the screen, QR area, compartments and wheels regularly"),
              L("ขนย้ายระยะใกล้: เข็นบนพื้นเรียบไม่เกิน 30 ม./นาที ขณะปิดเครื่องหรือปลดล็อกล้อ · ขึ้นลงรถ/บันได/ขั้นสูงเกิน 5 มม. ต้องใช้อุปกรณ์ขนย้ายของผู้ผลิตและยก 2 คน", "Short moves: push on flat floor ≤30 m/min with power off or hub released · vehicles, stairs or steps over 5 mm need the vendor's handling tool and two people"),
              L("ขนส่งระยะไกล: ใช้กล่องและวัสดุกันกระแทกของผู้ผลิต ยึดหุ่นกับกระบะ (ความสูงภายในมากกว่า 1.5 ม.) เสริมโฟมหนา 2 ซม.", "Long-distance: use the vendor box and padding, strap the robot down (cargo height over 1.5 m) with 2 cm foam"),
            ],
          },
        ],
      },
    ],

    support: {
      title: L("ติดต่อ TESR", "Contact TESR"),
      text: L(
        "บริษัท TESR จำกัด (Thai Embedded System and Robotics) · tesrshop.com · tesracademy.com — แจ้งปัญหาพร้อมหมายเลขเครื่อง (SN) รูปถ่าย/วิดีโอ และขั้นตอนที่ทำก่อนเกิดปัญหา",
        "TESR Co., Ltd. (Thai Embedded System and Robotics) · tesrshop.com · tesracademy.com — report issues with the robot SN, photos/video and the steps that led to the problem."
      ),
    },
    sources: L(
      "เรียบเรียงจาก: คู่มือ TESR (ภาษาไทย), Speedybot H5 (New Version) Product Manual V1.1.0 และ Indoor/Outdoor Speedbot Mapping Deployment V1.0 Operation Guide ของผู้ผลิต",
      "Compiled from: TESR Thai setup notes, the vendor's Speedybot H5 (New Version) Product Manual V1.1.0 and the Indoor/Outdoor Speedbot Mapping Deployment V1.0 Operation Guide"
    ),
  };
})();
