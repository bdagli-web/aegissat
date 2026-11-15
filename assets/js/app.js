(function () {
  "use strict";

  const I18N = {
    en: {
      app_title: "AegisSat — Space Mission Design Game",
      subtitle: "Interactive Mission Design Game · KÜPSAT-01 TRL-7 + IAC 2026 + WERR 24-Byte 0-SRAM",
      btn_launch: "Launch Mission",
      btn_launch_short: "Launch!",
      btn_guide: "CubeSat 101",
      btn_share: "Share Design",
      btn_lb: "Leaderboard",
      btn_coop_off: "Co-Op Mode: Solo (1–4 Players)",
      btn_coop_on: "Co-Op Mode: 4-Player NASA MDL ACTIVE",
      btn_slides: "Slides (EN)",
      btn_slides_alt: "Sunum (TR)",
      btn_pdf: "Deck PDF",
      btn_lang: "TR / EN",
      h_config: "1. Mission Design & NASA Segments",
      lbl_orbit: "Orbit / Target (NASA SPENVIS & OMNIWeb)",
      lbl_launch: "Launch Segment (Vehicle Compatibility)",
      lbl_chassis: "Spacecraft Structure (IAC-26-C2.IPB.29)",
      lbl_avionics: "Avionics & AI Memory (WERR Zero-SRAM)",
      lbl_eps: "Power Subsystem (Solar EPS & Battery)",
      lbl_comm: "Ground & Comm Downlink Segment",
      lbl_payloads: "Science Instruments (Multi-Select)",
      lbl_events: "Stress Tests & Fault Injection",
      btn_storm: "Solar Storm: ON",
      btn_storm_off: "Solar Storm: OFF",
      btn_spoof: "Spoof / AI Attack: OFF",
      btn_spoof_on: "Spoof / AI Attack: ACTIVE",
      btn_explode: "Exploded View",
      btn_tumble: "Inject KÜPSAT-01 Burst (3,647.58 °/s)",
      btn_seu: "Flip 1 Bit in 24B Frame (SEU)",
      h_sim: "2. 3D Spacecraft Twin & Mission Viz Orbit",
      btn_viz_cube: "3D CubeSat",
      btn_viz_orbit: "3D Trajectory (Mission Viz)",
      hud_hint: "Drag to rotate · Scroll to zoom",
      chart_adcs: "3-Axis Schwarzian + Koenigs ADCS Energy Damping vs. PID Baseline",
      chart_flight: "KÜPSAT-01 Verified Flight Replay (421 Samples · 25.64 km · +37.23°C Gap)",
      h_telemetry: "3. Mission Score, Gates & 24B WERR",
      lbl_game_score: "MISSION DESIGN SCORE · JPL CML",
      k_survival: "Mission Survival Score",
      k_seu: "SRAM Weight Bit-Flips / Day",
      k_sram: "Mutable Weight SRAM",
      k_temp: "Internal Min Temp",
      k_mass: "1U Payload Margin (1,330 g)",
      k_power: "Bus Power / Bus Cost",
      k_adcs: "ADCS 10-Cycle Damping",
      k_guard: "Watchdog & Spoof Gate",
      lbl_hex: "Immutable 24-Byte (192-bit) WERR Frame + CRC-16/CCITT-FALSE",
      lbl_sw: "Live Space Weather (NOAA SWPC / NASA DONKI / Planetary Computer)",
      h_heritage: "Verified Flight & Research Heritage",
    },
    tr: {
      app_title: "AegisSat — Uzay Görevi Tasarım Oyunu",
      subtitle: "Etkileşimli Uzay Görevi Tasarım Oyunu · KÜPSAT-01 TRL-7 + IAC 2026 + WERR 24B 0-SRAM",
      btn_launch: "Görevi Başlat",
      btn_launch_short: "Fırlat!",
      btn_guide: "CubeSat 101",
      btn_share: "Tasarımı Paylaş",
      btn_lb: "Skor Tablosu",
      btn_coop_off: "Ortak Mod: Tekli (1–4 Oyuncu)",
      btn_coop_on: "Ortak Mod: 4 Oyunculu NASA MDL AKTİF",
      btn_slides: "Slaytlar (EN)",
      btn_slides_alt: "Sunum (TR)",
      btn_pdf: "Sunum PDF",
      btn_lang: "EN / TR",
      h_config: "1. Görev Tasarımı & 4 NASA Segmenti",
      lbl_orbit: "Yörünge / Hedef (NASA SPENVIS & OMNIWeb)",
      lbl_launch: "Fırlatma Segmenti (Roket Uyumluluğu)",
      lbl_chassis: "Uzay Aracı Yapısı (IAC-26-C2.IPB.29)",
      lbl_avionics: "Aviyonik & Yapay Zekâ Belleği (0-SRAM)",
      lbl_eps: "Güç Alt Sistemi (Güneş Paneli EPS & Batarya)",
      lbl_comm: "Yer İstasyonu & İletişim İndirme Hattı",
      lbl_payloads: "Bilimsel Cihazlar (Çoklu Seçim)",
      lbl_events: "Stres Testleri & Hata Enjeksiyonu",
      btn_storm: "Güneş Fırtınası: AÇIK",
      btn_storm_off: "Güneş Fırtınası: KAPALI",
      btn_spoof: "Spoofing / AI Saldırısı: KAPALI",
      btn_spoof_on: "Spoofing / AI Saldırısı: AKTİF",
      btn_explode: "Patlatılmış Görünüm",
      btn_tumble: "KÜPSAT-01 Savrulma (3,647.58 °/s)",
      btn_seu: "24B Çerçevede 1 Bit Çevir (SEU)",
      h_sim: "2. 3D Uzay Aracı & Mission Viz Yörünge",
      btn_viz_cube: "3D Küpsat",
      btn_viz_orbit: "3D Yörünge (Mission Viz)",
      hud_hint: "3D modeli sürükleyip çevirin · Tekerlekle yakınlaştırın",
      chart_adcs: "3-Eksen Schwarzian + Koenigs ADCS Enerji Sönümleme vs. PID Referansı",
      chart_flight: "KÜPSAT-01 Gerçek Uçuş Telemetrisi (421 Örnek · 25.64 km · +37.23°C Fark)",
      h_telemetry: "3. Görev Skoru, Kısıt Kapıları & 24B WERR",
      lbl_game_score: "GÖREV TASARIM SKORU · JPL CML",
      k_survival: "Görev Başarı Skoru",
      k_seu: "Günlük SRAM Bit-Flip Hatası",
      k_sram: "Ağırlık SRAM Belleği",
      k_temp: "İç Minimum Sıcaklık",
      k_mass: "1U Gövde Boşluğu (1,330 g)",
      k_power: "Otobus Gücü / Maliyeti",
      k_adcs: "ADCS 10-Çevrim Sönümleme",
      k_guard: "Bekçi & Spoofing Bariyeri",
      lbl_hex: "Değişmez 24-Bayt (192-bit) WERR Çerçevesi + CRC-16/CCITT-FALSE",
      lbl_sw: "Canlı Uzay Havası (NOAA SWPC / NASA DONKI / Planetary Computer)",
      h_heritage: "Doğrulanmış Uçuş & Araştırma Mirası",
    },
  };

  const BADGE_TR = {
    "Zero-SRAM Survivor": "Sıfır-SRAM Hayatta Kalan",
    "GEVS 14.1 Grms Qualified": "GEVS 14.1 Grms Onaylı",
    "Schwarzian Detumbler": "Schwarzian Sönümleyici",
    "Artemis Flight Ready": "Artemis Uçuşuna Hazır",
  };

  const MDL_ROLES = [
    { id: "cmdr", en: "1. Commander", tr: "1. Görev Komutanı", desc_en: "Owns Orbit, Launch Vehicle & Scenario Budget", desc_tr: "Yörünge, Fırlatma Aracı ve Bütçe Sorumlusu", defName: "Bekirhan" },
    { id: "struct", en: "2. Structures Lead", tr: "2. Yapı & Termal Lideri", desc_en: "Owns Chassis Mass, GEVS 14.1 Grms & MLI Thermal", desc_tr: "Şasi Kütlesi, GEVS 14.1 Grms ve MLI Termal", defName: "Burak" },
    { id: "avionics", en: "3. Avionics & ADCS", tr: "3. Aviyonik & ADCS Lideri", desc_en: "Owns Zero-SRAM CPU, CRC-16 SEU & Spoof Guard", desc_tr: "Sıfır-SRAM CPU, SEU ve Spoofing Bariyeri", defName: "Emrah" },
    { id: "ops", en: "4. Science & Ops", tr: "4. Bilim, Güç & İletişim", desc_en: "Owns Solar EPS, Comm Link & Science Payloads", desc_tr: "Güneş Paneli, İndirme Hattı ve Bilim Yükleri", defName: "Ops Lead" },
  ];

  const SEED_LEADERBOARD = [
    { team: "Team AegisSat (WERR-24B)", scenario: "PI_MARS", score: 826, cml: 4, survival: 100.0, cost: 91200 },
    { team: "KÜPSAT-01 Pathfinder", scenario: "CADET_STRATO", score: 716, cml: 4, survival: 100.0, cost: 18500 },
    { team: "Artemis Rad-Hard TMR", scenario: "ENGINEER_LUNAR", score: 342, cml: 3, survival: 73.5, cost: 104000 },
    { team: "Legacy COTS ARM SRAM", scenario: "PI_MARS", score: 20, cml: 1, survival: 2.0, cost: 81400 },
  ];

  const state = {
    lang: "en",
    scenario: "PI_MARS",
    launch: "DEEP_SPACE_ESCORT",
    chassis: "WERR_AEGIS_HYBRID",
    avionics: "WERR_24B_FNS",
    orbit: "MARS_DEEP_SPACE",
    eps: "DEPLOY_WINGS",
    comm: "SBAND_PATCH",
    payloads: ["WERR_DOSIMETER", "LASER_BEACON", "MAG_PLASMA"],
    solarStorm: true,
    spoofAttack: false,
    exploded: false,
    vizMode: "cube",
    coopEnabled: false,
    rolesSigned: { cmdr: true, struct: true, avionics: false, ops: false },
    roleNames: { cmdr: "Bekirhan", struct: "Burak", avionics: "Emrah", ops: "Ops Lead" },
    tumbleOmegaVisual: 18.0,
    tumbleRateDps: 2735.69,
    lastResult: null,
    seuEvent: null,
    flightSamples: null,
    swData: null,
    snapJson: null,
  };

  function loadShareHash() {
    try {
      if (window.location.hash && window.location.hash.startsWith("#design=")) {
        const b64 = decodeURIComponent(window.location.hash.slice(8));
        const parsed = JSON.parse(atob(b64));
        const core = window.AegisCore;
        if (parsed.sc && core.SCENARIO_SPECS[parsed.sc]) state.scenario = parsed.sc;
        if (parsed.ch && core.CHASSIS_SPECS[parsed.ch]) state.chassis = parsed.ch;
        if (parsed.av && core.AVIONICS_SPECS[parsed.av]) state.avionics = parsed.av;
        if (parsed.orb && core.ORBIT_SPECS[parsed.orb]) state.orbit = parsed.orb;
        if (parsed.lv && core.LAUNCH_SPECS[parsed.lv]) state.launch = parsed.lv;
        if (parsed.eps && core.EPS_SPECS[parsed.eps]) state.eps = parsed.eps;
        if (parsed.cm && core.COMM_SPECS[parsed.cm]) state.comm = parsed.cm;
        if (Array.isArray(parsed.pay)) state.payloads = parsed.pay.filter((k) => !!core.PAYLOAD_SPECS[k]);
        if (typeof parsed.st === "boolean") state.solarStorm = parsed.st;
        if (typeof parsed.sp === "boolean") state.spoofAttack = parsed.sp;
      }
    } catch (_) {}
  }

  function makeShareUrl() {
    const payload = {
      sc: state.scenario,
      ch: state.chassis,
      av: state.avionics,
      orb: state.orbit,
      lv: state.launch,
      eps: state.eps,
      cm: state.comm,
      pay: state.payloads,
      st: state.solarStorm,
      sp: state.spoofAttack,
    };
    const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    return `${window.location.origin}${window.location.pathname}#design=${encoded}`;
  }

  let scene, camera, renderer, cubeGroup, orbitGroup, protonPoints, craftMarker;
  let panels = [], brackets = [], rails = [], wingLeft, wingRight;
  let userRotX = 0.35, userRotY = 0.65, dragging = false, prevMouse = { x: 0, y: 0 }, orbAngle = 0;

  function initThree() {
    const container = document.getElementById("cube-canvas");
    if (!container || typeof THREE === "undefined") return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 4.3);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xf59e0b, 0.6);
    rim.position.set(-4, -3, -2);
    scene.add(rim);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPts = [];
    for (let i = 0; i < 420; i++) {
      starPts.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.055 })));

    // Solar proton stream
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 3.2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    protonPoints = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.065, transparent: true, opacity: 0.85 }));
    scene.add(protonPoints);

    // Hardware Twin Group
    cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const railGeo = new THREE.BoxGeometry(0.11, 1.24, 0.11);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.22 });
    [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]].forEach(([x, z]) => {
      const m = new THREE.Mesh(railGeo, railMat);
      m.position.set(x, 0, z);
      cubeGroup.add(m);
      rails.push(m);
    });

    const pSize = new THREE.BoxGeometry(1.02, 1.02, 0.045);
    const pMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.45, roughness: 0.32, transparent: true, opacity: 0.88 });
    [
      { pos: [0, 0, 0.56], rot: [0, 0, 0], dir: [0, 0, 1] },
      { pos: [0, 0, -0.56], rot: [0, 0, 0], dir: [0, 0, -1] },
      { pos: [0.56, 0, 0], rot: [0, Math.PI / 2, 0], dir: [1, 0, 0] },
      { pos: [-0.56, 0, 0], rot: [0, Math.PI / 2, 0], dir: [-1, 0, 0] },
      { pos: [0, 0.56, 0], rot: [Math.PI / 2, 0, 0], dir: [0, 1, 0] },
      { pos: [0, -0.56, 0], rot: [Math.PI / 2, 0, 0], dir: [0, -1, 0] },
    ].forEach((d) => {
      const m = new THREE.Mesh(pSize, pMat.clone());
      m.position.set(...d.pos);
      m.rotation.set(...d.rot);
      m.userData.base = d.pos;
      m.userData.dir = d.dir;
      cubeGroup.add(m);
      panels.push(m);
    });

    const brkGeo = new THREE.BoxGeometry(0.84, 0.055, 0.84);
    const brkMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 });
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, metalness: 0.5, roughness: 0.3 });
    [-0.26, 0.0, 0.26].forEach((y, idx) => {
      const m = new THREE.Mesh(brkGeo, idx === 1 ? pcbMat : brkMat);
      m.position.set(0, y, 0);
      m.userData.baseY = y;
      cubeGroup.add(m);
      brackets.push(m);
    });

    // Deployable solar wings (shown for DEPLOY_WINGS / DEEP_SPACE_GAAS)
    const wingGeo = new THREE.BoxGeometry(1.15, 0.03, 0.72);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.7, roughness: 0.25 });
    wingLeft = new THREE.Mesh(wingGeo, wingMat);
    wingLeft.position.set(-1.2, 0, 0);
    wingRight = new THREE.Mesh(wingGeo, wingMat);
    wingRight.position.set(1.2, 0, 0);
    cubeGroup.add(wingLeft, wingRight);

    // NASA Mission Viz 3D Trajectory Group
    orbitGroup = new THREE.Group();
    orbitGroup.visible = false;
    scene.add(orbitGroup);

    const earth = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0369a1, emissiveIntensity: 0.35 }));
    earth.position.set(-0.9, 0, 0);
    orbitGroup.add(earth);

    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 18), new THREE.MeshStandardMaterial({ color: 0xcbd5e1 }));
    moon.position.set(0.15, 0.35, 0.4);
    orbitGroup.add(moon);

    const mars = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 22), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.3 }));
    mars.position.set(1.55, 0, -0.35);
    orbitGroup.add(mars);

    const makeRing = (cx, r, color) => {
      const pts = [];
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        pts.push(new THREE.Vector3(cx + Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.48 }));
    };
    orbitGroup.add(makeRing(-0.9, 0.62, 0x38bdf8));
    orbitGroup.add(makeRing(-0.9, 1.32, 0x94a3b8));
    orbitGroup.add(makeRing(0.32, 1.55, 0xf59e0b));

    craftMarker = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.16), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a }));
    orbitGroup.add(craftMarker);

    container.addEventListener("pointerdown", (e) => { dragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
    window.addEventListener("pointerup", () => { dragging = false; });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      userRotY += (e.clientX - prevMouse.x) * 0.008;
      userRotX += (e.clientY - prevMouse.y) * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    container.addEventListener("wheel", (e) => {
      e.preventDefault();
      camera.position.z = Math.max(2.3, Math.min(7.5, camera.position.z + e.deltaY * 0.003));
    }, { passive: false });

    window.addEventListener("resize", () => {
      if (!container.clientWidth) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    let last = performance.now();
    function animate(now) {
      requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const isOrbitView = state.vizMode === "orbit";
      cubeGroup.visible = !isOrbitView;
      orbitGroup.visible = isOrbitView;

      const ex = state.exploded ? 0.58 : 0.0;
      panels.forEach((p) => {
        const [bx, by, bz] = p.userData.base;
        const [dx, dy, dz] = p.userData.dir;
        p.position.set(bx + dx * ex, by + dy * ex, bz + dz * ex);
      });
      brackets.forEach((b, idx) => {
        b.position.y = b.userData.baseY + (idx - 1) * (state.exploded ? 0.22 : 0.0);
      });

      const hasWings = state.eps === "DEPLOY_WINGS" || state.eps === "DEEP_SPACE_GAAS";
      if (wingLeft && wingRight) {
        wingLeft.visible = hasWings;
        wingRight.visible = hasWings;
        wingLeft.position.x = -(1.18 + ex * 0.6);
        wingRight.position.x = +(1.18 + ex * 0.6);
      }

      if (protonPoints) {
        protonPoints.visible = state.solarStorm;
        if (state.solarStorm) {
          const arr = protonPoints.geometry.attributes.position.array;
          for (let i = 0; i < 180; i++) {
            arr[i * 3] += dt * 5.5;
            if (arr[i * 3] > 4.0) arr[i * 3] = -4.0;
          }
          protonPoints.geometry.attributes.position.needsUpdate = true;
        }
      }

      const muVisual = state.lastResult ? state.lastResult.adcs.mu : 0.75;
      state.tumbleOmegaVisual = Math.max(0.24, state.tumbleOmegaVisual * Math.pow(muVisual, dt * 3.0));
      state.tumbleRateDps = Math.max(0.5, state.tumbleRateDps * Math.pow(muVisual, dt * 3.0));
      const hudOmega = document.getElementById("hud-omega");
      if (hudOmega) {
        hudOmega.textContent = isOrbitView
          ? `Orbit: ${state.orbit} | ${state.launch}`
          : `ω = ${state.tumbleRateDps.toFixed(1)} °/s (μ=${muVisual})`;
      }

      if (isOrbitView) {
        orbAngle += dt * 0.9;
        let cx = -0.9, rx = 0.62, rz = 0.62;
        if (state.orbit === "LUNAR_ARTEMIS") { cx = -0.9; rx = 1.32; rz = 1.32; }
        else if (state.orbit === "MARS_DEEP_SPACE") { cx = 0.32; rx = 1.55; rz = 1.45; }
        craftMarker.position.set(cx + Math.cos(orbAngle) * rx, Math.sin(orbAngle * 2) * 0.08, Math.sin(orbAngle) * rz);
        craftMarker.rotation.y += dt * 2.0;
        orbitGroup.rotation.set(userRotX * 0.6, userRotY * 0.6, 0);
      } else {
        if (!dragging) {
          userRotY += state.tumbleOmegaVisual * dt * 0.4;
          userRotX += state.tumbleOmegaVisual * dt * 0.2;
        }
        cubeGroup.rotation.set(userRotX, userRotY, 0);
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }

  function updateThreeColors(res) {
    const colorMap = { AL6061: 0x64748b, CFRP: 0x1e293b, WERR_AEGIS_HYBRID: 0x0ea5e9 };
    const c = colorMap[state.chassis] || 0x1e293b;
    panels.forEach((p) => {
      p.material.color.setHex(res.survival_score_pct < 50 ? 0x991b1b : c);
    });
    if (craftMarker) {
      craftMarker.material.color.setHex(res.mission_success ? 0x22c55e : res.survival_score_pct >= 55 ? 0xf59e0b : 0xef4444);
    }
  }

  function drawAdcsChart(adcs) {
    const canvas = document.getElementById("adcs-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);
    ctx.clearRect(0, 0, w, h);

    const pad = 24;
    ctx.strokeStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.stroke();

    if (Array.isArray(adcs.baseline_pid_energies)) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      adcs.baseline_pid_energies.forEach((e, i) => {
        const x = pad + (i / (adcs.baseline_pid_energies.length - 1)) * (w - pad * 2);
        const y = h - pad - e * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    const pts = adcs.normalized_energy;
    const lineColor = adcs.mu <= 0.8 ? "#22c55e" : adcs.mu <= 0.92 ? "#f59e0b" : "#ef4444";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    pts.forEach((e, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      const y = h - pad - e * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const isTr = state.lang === "tr";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText(isTr ? "E0: %100 (3,647.58°/s) | Kesikli: PID" : "E0: 100% (3,647.58°/s) | Dashed: PID", pad + 4, pad + 10);
    ctx.fillStyle = lineColor;
    ctx.fillText(`E10: ${(pts[pts.length - 1] * 100).toFixed(2)}% (-${adcs.energy_damped_pct}%)`, w - 180, h - pad - 8);
  }

  function drawFlightChart() {
    const canvas = document.getElementById("flight-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);
    ctx.clearRect(0, 0, w, h);

    const pad = 24;
    ctx.strokeStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, h - pad);
    ctx.lineTo(w - pad, h - pad);
    ctx.stroke();

    const samples = state.flightSamples || [];
    if (samples.length > 5) {
      const maxAlt = Math.max(...samples.map((s) => s.alt_m), 26000);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      samples.forEach((s, i) => {
        const x = pad + (i / (samples.length - 1)) * (w - pad * 2);
        const y = h - pad - (s.alt_m / maxAlt) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      const tNormFn = (tc) => Math.max(0, Math.min(1, (tc + 65) / 100));
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      samples.forEach((s, i) => {
        const x = pad + (i / (samples.length - 1)) * (w - pad * 2);
        const y = h - pad - tNormFn(s.t_out_c) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      if (samples[0] && samples[0].t_in_c !== undefined) {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        samples.forEach((s, i) => {
          const x = pad + (i / (samples.length - 1)) * (w - pad * 2);
          const y = h - pad - tNormFn(s.t_in_c) * (h - pad * 2);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    }

    const isTr = state.lang === "tr";
    ctx.fillStyle = "#38bdf8";
    ctx.font = "11px monospace";
    ctx.fillText(isTr ? "Zirve: 25.64 km (ISA) | 22.51 hPa" : "Peak: 25.64 km (ISA) | 22.51 hPa", pad + 6, pad + 12);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(isTr ? "Dış -54.50°C | İç -17.27°C (+37.23°C)" : "Ext -54.50°C | Int -17.27°C (+37.23°C)", w - 245, h - pad - 8);
  }

  function renderGameChrome(res) {
    const core = window.AegisCore;
    const isTr = state.lang === "tr";

    // Scenario tabs
    const scTabs = document.getElementById("scenario-tabs");
    scTabs.innerHTML = "";
    Object.entries(core.SCENARIO_SPECS).forEach(([k, v]) => {
      const btn = document.createElement("button");
      btn.className = "tab-pill" + (state.scenario === k ? " active" : "");
      btn.textContent = isTr ? v.name_tr : v.name_en;
      btn.onclick = () => {
        state.scenario = k;
        if (k !== "SANDBOX") {
          state.orbit = v.orbit;
          state.launch = v.launch;
          state.solarStorm = v.storm;
          state.spoofAttack = v.spoof;
        }
        state.seuEvent = null;
        updateAll();
      };
      scTabs.appendChild(btn);
    });

    // CML 1-4 Bar
    const cmlBar = document.getElementById("cml-bar");
    const cmlNames = isTr
      ? ["CML 1 Kavram", "CML 2 Fizibilite", "CML 3 Takas Analizi", "CML 4 Uçuşa Hazır"]
      : ["CML 1 Concept", "CML 2 Feasibility", "CML 3 Trade Study", "CML 4 Point Design"];
    cmlBar.innerHTML = "";
    cmlNames.forEach((lbl, idx) => {
      const span = document.createElement("span");
      span.className = "cml-pill" + (res.cml_level >= idx + 1 ? " done" : "");
      span.textContent = lbl;
      cmlBar.appendChild(span);
    });

    // Co-Op Dock
    const coopBtn = document.getElementById("btn-coop");
    coopBtn.classList.toggle("active", state.coopEnabled);
    coopBtn.textContent = state.coopEnabled ? I18N[state.lang].btn_coop_on : I18N[state.lang].btn_coop_off;

    const dock = document.getElementById("coop-dock");
    dock.classList.toggle("hidden", !state.coopEnabled);
    if (state.coopEnabled) {
      dock.innerHTML = "";
      MDL_ROLES.forEach((role) => {
        const signed = !!state.rolesSigned[role.id];
        const card = document.createElement("div");
        card.className = "role-card" + (signed ? " signed" : "");
        card.innerHTML = `
          <div class="r-head">
            <span>${isTr ? role.tr : role.en}</span>
            <span>${signed ? (isTr ? "ONAYLI ✓" : "SIGNED ✓") : (isTr ? "BEKLİYOR" : "PENDING")}</span>
          </div>
          <div class="r-desc">${isTr ? role.desc_tr : role.desc_en}</div>
          <input type="text" value="${state.roleNames[role.id] || role.defName}" aria-label="${role.en}" />
          <button class="btn ${signed ? "active" : ""}" style="font-size:0.7rem;padding:0.28rem 0.5rem;">
            ${signed ? (isTr ? "İmzayı Kaldır" : "Unlock Role") : (isTr ? "Tasarımı Onayla" : "Sign Off Role")}
          </button>
        `;
        card.querySelector("input").oninput = (e) => { state.roleNames[role.id] = e.target.value; };
        card.querySelector("button").onclick = () => {
          state.rolesSigned[role.id] = !state.rolesSigned[role.id];
          updateAll();
        };
        dock.appendChild(card);
      });
    }
  }

  function renderOptions() {
    const core = window.AegisCore;
    const isTr = state.lang === "tr";

    const fillCards = (elId, specs, currentKey, onPick, subFn) => {
      const box = document.getElementById(elId);
      box.innerHTML = "";
      Object.entries(specs).forEach(([k, v]) => {
        const btn = document.createElement("button");
        btn.className = "opt-card" + (currentKey === k ? " selected" : "");
        btn.innerHTML = `<span class="title">${isTr ? v.name_tr : v.name_en}</span><span class="sub">${subFn(v)}</span>`;
        btn.onclick = () => { onPick(k); state.seuEvent = null; updateAll(); };
        box.appendChild(btn);
      });
    };

    fillCards("orbit-options", core.ORBIT_SPECS, state.orbit, (k) => { state.orbit = k; },
      (v) => `${v.dose_krad} krad · ${v.ext_temp_min_c}°C / +${v.ext_temp_max_c}°C`);

    fillCards("launch-options", core.LAUNCH_SPECS, state.launch, (k) => { state.launch = k; },
      (v) => `${isTr ? "Maks Kütle" : "Max"} ${v.max_mass_g} g · $${v.cost_usd.toLocaleString()} · ${v.allowed_orbits.join("/")}`);

    fillCards("chassis-options", core.CHASSIS_SPECS, state.chassis, (k) => { state.chassis = k; },
      (v) => `${v.mass_g} g · $${v.cost_usd.toLocaleString()} · ${v.von_mises_mpa} MPa · FS ${v.safety_factor}`);

    fillCards("avionics-options", core.AVIONICS_SPECS, state.avionics, (k) => { state.avionics = k; },
      (v) => {
        const sramLabel = v.weight_sram_bytes === 0 ? (isTr ? "0 B SRAM (24 B Çekirdek)" : "0 B SRAM (24 B Seed)") : `${(v.weight_sram_bytes / 1e6).toFixed(0)} MB SRAM`;
        return `${sramLabel} · ${v.power_w} W · ${v.mass_g} g · $${v.cost_usd.toLocaleString()}`;
      });

    fillCards("eps-options", core.EPS_SPECS, state.eps, (k) => { state.eps = k; },
      (v) => `${v.power_gen_1au_w} W @1AU · ${v.mass_g} g · $${v.cost_usd.toLocaleString()}`);

    fillCards("comm-options", core.COMM_SPECS, state.comm, (k) => { state.comm = k; },
      (v) => `${v.rate_mb_day_leo} MB/d (LEO) · ${v.power_w} W · ${v.mass_g} g · $${v.cost_usd.toLocaleString()}`);

    const payBox = document.getElementById("payload-options");
    payBox.innerHTML = "";
    Object.entries(core.PAYLOAD_SPECS).forEach(([k, v]) => {
      const checked = state.payloads.indexOf(k) !== -1;
      const btn = document.createElement("button");
      btn.className = "opt-card" + (checked ? " selected" : "");
      btn.innerHTML = `<span class="title">${checked ? "[✓] " : "[ ] "}${isTr ? v.name_tr : v.name_en}</span>
        <span class="sub">+${v.science_pts} Sci · ${v.mass_g} g · ${v.power_w} W · ${v.data_mb_day} MB/d · $${v.cost_usd.toLocaleString()}</span>`;
      btn.onclick = () => {
        if (checked) state.payloads = state.payloads.filter((item) => item !== k);
        else state.payloads = state.payloads.concat([k]);
        state.seuEvent = null;
        updateAll();
      };
      payBox.appendChild(btn);
    });
  }

  function renderResourceBarsAndGates(res) {
    const isTr = state.lang === "tr";
    const barsEl = document.getElementById("resource-bars");
    const meters = [
      {
        label: isTr ? "1U Kütle" : "1U Mass",
        val: `${res.total_spacecraft_mass_g} / 1330g`,
        pct: Math.min(100, (res.total_spacecraft_mass_g / 1330) * 100),
        cls: res.gates.mass_ok ? (res.total_spacecraft_mass_g > 1180 ? "warn" : "") : "bad",
      },
      {
        label: isTr ? "Güç (Üretim)" : "Power Balance",
        val: `${res.power_load_w} / ${res.power_gen_w}W`,
        pct: Math.min(100, (res.power_load_w / Math.max(0.1, res.power_gen_w)) * 100),
        cls: res.gates.power_ok ? (res.power_margin_w < 0.35 ? "warn" : "") : "bad",
      },
      {
        label: isTr ? "Görev Bütçesi" : "Mission Budget",
        val: `$${(res.total_mission_cost_usd / 1000).toFixed(1)}k / $${(res.budget_usd / 1000).toFixed(0)}k`,
        pct: Math.min(100, (res.total_mission_cost_usd / Math.max(1, res.budget_usd)) * 100),
        cls: res.gates.budget_ok ? "" : "bad",
      },
      {
        label: isTr ? "Veri İndirme" : "Data Downlink",
        val: `${res.data_gen_mb_day} / ${res.data_cap_mb_day}MB`,
        pct: Math.min(100, (res.data_gen_mb_day / Math.max(0.1, res.data_cap_mb_day)) * 100),
        cls: res.gates.comm_ok ? "" : "bad",
      },
      {
        label: isTr ? "Bilim Hedefi" : "Science Target",
        val: `${res.science_points} / ${res.min_science_pts} pts`,
        pct: res.min_science_pts > 0 ? Math.min(100, (res.science_points / res.min_science_pts) * 100) : 100,
        cls: res.gates.science_ok ? "" : "warn",
      },
    ];
    barsEl.innerHTML = "";
    meters.forEach((m) => {
      const div = document.createElement("div");
      div.className = "res-meter";
      div.innerHTML = `
        <div class="rm-top"><span>${m.label}</span></div>
        <div class="rm-val">${m.val}</div>
        <div class="rm-track"><div class="rm-fill ${m.cls}" style="width:${m.pct.toFixed(0)}%"></div></div>
      `;
      barsEl.appendChild(div);
    });

    const coopBonus = state.coopEnabled && Object.values(state.rolesSigned).every(Boolean) ? 50 : 0;
    const totalScore = Math.min(1000, res.game_score + coopBonus);
    const gsEl = document.getElementById("val-game-score");
    gsEl.textContent = `${totalScore} / 1000 · CML-${res.cml_level}`;
    gsEl.style.color = res.mission_success ? "var(--accent-2)" : res.gates_passed >= 6 ? "var(--warn)" : "var(--danger)";

    const gatesMeta = [
      {
        ok: res.gates.launch_ok,
        name: isTr ? "Fırlatma & GEVS Uyumu" : "Launch & GEVS Compatibility",
        why: res.gates.launch_ok
          ? (isTr ? "Roket yörüngeye ve 14.1 Grms titreşime uygun." : "Vehicle reaches target orbit and meets structural loads.")
          : (isTr ? "Seçilen roket bu yörüngeye veya şasi titreşim sınırına (64 Hz) ulaşamıyor!" : "Selected rocket cannot reach target orbit or 64 Hz chassis fails GEVS!"),
      },
      {
        ok: res.gates.mass_ok,
        name: isTr ? "1U 1,330 g Kütle Limiti" : "1U 1,330 g Mass Limit",
        why: res.gates.mass_ok
          ? (isTr ? `Toplam ${res.total_spacecraft_mass_g} g (1U limiti içinde).` : `Total ${res.total_spacecraft_mass_g} g within 1U envelope.`)
          : (isTr ? `1,330 g sınırı aşıldı (${res.total_spacecraft_mass_g} g) — daha hafif aviyonik/yük seçin!` : `Exceeded 1,330 g (${res.total_spacecraft_mass_g} g) — switch to 28g WERR or fewer sensors!`),
      },
      {
        ok: res.gates.power_ok,
        name: isTr ? "Güneş Gücü & Yörünge Işınımı" : "Solar EPS Power Balance",
        why: res.gates.power_ok
          ? (isTr ? `Yedek güç: +${res.power_margin_w} W.` : `Positive power margin: +${res.power_margin_w} W.`)
          : (isTr ? `GÜÇ KESİNTİSİ (${res.power_margin_w} W)! Mars'ta güneş %45'tir; Kanat veya 0.35W WERR seçin.` : `BROWNOUT (${res.power_margin_w} W)! Mars solar flux is 45%; use Wings or 0.35W WERR!`),
      },
      {
        ok: res.gates.comm_ok,
        name: isTr ? "Veri İndirme & En Az 1 Bilim Yükü" : "Data Downlink & Science Instrument",
        why: res.gates.comm_ok
          ? (isTr ? `İndirme kapasitesi ${res.data_cap_mb_day} MB/gün yeterli.` : `Downlink ${res.data_cap_mb_day} MB/d covers ${res.data_gen_mb_day} MB/d science.`)
          : (isTr ? "Veri hacmi veya sensör eksik! S-Band/Optik seçin veya yük ekleyin." : "Select >=1 instrument and ensure Comm bandwidth exceeds instrument data rate!"),
      },
      {
        ok: res.gates.budget_ok && res.gates.thermal_ok && res.gates.rad_cyber_ok && res.gates.science_ok,
        name: isTr ? "Bütçe, Termal, Radyasyon/Siber & Bilim" : "Budget, Thermal, Radiation/Cyber & Science",
        why: (res.gates.budget_ok && res.gates.thermal_ok && res.gates.rad_cyber_ok && res.gates.science_ok)
          ? (isTr ? `Bütçe, -24.5°C termal, 0 SEU ve ${res.science_points} bilim puanı tam.` : `Budget OK, >=-30°C thermal, 0 SEU flips, and ${res.science_points} science pts achieved.`)
          : [
              !res.gates.budget_ok ? (isTr ? "Bütçe aşıldı" : "Over budget") : "",
              !res.gates.thermal_ok ? (isTr ? "Donma riski (<-30°C)" : "Freeze risk (<-30°C)") : "",
              !res.gates.rad_cyber_ok ? (isTr ? "SEU/Spoof açığı (WERR 24B kullanın)" : "SEU/Spoof risk (Use WERR 24B)") : "",
              !res.gates.science_ok ? (isTr ? `Bilim yetersiz (<${res.min_science_pts})` : `Science < ${res.min_science_pts} pts`) : "",
            ].filter(Boolean).join(" · "),
      },
    ];

    const glEl = document.getElementById("gates-list");
    glEl.innerHTML = "";
    gatesMeta.forEach((g) => {
      const row = document.createElement("div");
      row.className = "gate-row " + (g.ok ? "pass" : "fail");
      row.innerHTML = `<div class="g-head"><span>${g.name}</span><span>${g.ok ? "PASS ✓" : "FAIL ✕"}</span></div><div class="g-why">${g.why}</div>`;
      glEl.appendChild(row);
    });
  }

  function renderHeritage() {
    const el = document.getElementById("heritage-list");
    if (!el) return;
    if (state.lang === "tr") {
      el.innerHTML = `
        <li>• <strong>IAC 2026 Antalya:</strong> <a href="https://iac2026.ipostersessions.com/default.aspx?s=37-F2-E3-3C-C9-44-80-17-24-BB-B9-A7-A6-5B-65-2D&guestview=true" target="_blank" rel="noopener">IAC-26-C2.IPB.29 İnteraktif Poster</a> (%81.7 gerilme düşüşü, 100.76 Hz)</li>
        <li>• <strong>KÜPSAT-01 Uçuş Raporu:</strong> <a href="https://teknosanat.com.tr/lib/cubesat/cubesat_master_flight_report_tr.html" target="_blank" rel="noopener">7 Ağustos 2026 Stratosfer Görevi</a> (25.64 km, 22.51 hPa, -54.50 °C)</li>
        <li>• <strong>Fikri Mülkiyet &amp; Patentler:</strong> TPMK 2025/007159 · TR 2026/016285 · TR 2026/016633 · TR 2026/020266 · arXiv:2611.11641</li>
        <li>• <strong>Sunumlar &amp; İletişim:</strong> <a href="docs/AegisSat_Presentation_TR.pdf" target="_blank" rel="noopener">TR PDF</a> · <a href="docs/AegisSat_Presentation_EN.pdf" target="_blank" rel="noopener">EN PDF</a> · <a href="mailto:info@aegissat.space">info@aegissat.space</a> · <a href="https://www.spaceappschallenge.org/2026/find-a-team/aegissat/?tab=details" target="_blank" rel="noopener">NASA Space Apps Takımı</a></li>
      `;
    } else {
      el.innerHTML = `
        <li>• <strong>IAC 2026 Antalya:</strong> <a href="https://iac2026.ipostersessions.com/default.aspx?s=37-F2-E3-3C-C9-44-80-17-24-BB-B9-A7-A6-5B-65-2D&guestview=true" target="_blank" rel="noopener">IAC-26-C2.IPB.29 Interactive Poster</a> (81.7% stress reduction, 100.76 Hz)</li>
        <li>• <strong>KÜPSAT-01 Flight Report:</strong> <a href="https://teknosanat.com.tr/lib/cubesat/cubesat_master_flight_report_tr.html" target="_blank" rel="noopener">7 Aug 2026 Stratospheric Mission</a> (25.64 km, 22.51 hPa, -54.50 °C)</li>
        <li>• <strong>IP &amp; Patents:</strong> TPMK 2025/007159 · TR 2026/016285 · TR 2026/016633 · TR 2026/020266 · arXiv:2611.11641</li>
        <li>• <strong>Presentations &amp; Contact:</strong> <a href="docs/AegisSat_Presentation_EN.pdf" target="_blank" rel="noopener">EN PDF</a> · <a href="docs/AegisSat_Presentation_TR.pdf" target="_blank" rel="noopener">TR PDF</a> · <a href="mailto:info@aegissat.space">info@aegissat.space</a> · <a href="https://www.spaceappschallenge.org/2026/find-a-team/aegissat/?tab=details" target="_blank" rel="noopener">NASA Space Apps Team</a></li>
      `;
    }
  }

  function renderSpaceWeather() {
    const swEl = document.getElementById("sw-status");
    if (!swEl) return;
    const isTr = state.lang === "tr";
    const swData = state.swData;
    const snapJson = state.snapJson;
    if (!swData) {
      swEl.textContent = isTr ? "Çevrimdışı SPENVIS / OMNIWeb Zarfları Aktif" : "Offline SPENVIS / OMNIWeb Envelope Active";
      return;
    }
    const pcScene = swData.planetary_computer_latest_scene || ((snapJson && snapJson.planetary_computer_corridor) || [])[0];
    const meteo = snapJson && snapJson.meteomatics_launch_weather && snapJson.meteomatics_launch_weather.arslankoy_mersin;
    const donkiList = swData.donki_events || (snapJson && snapJson.nasa_donki && (snapJson.nasa_donki.recent_sep_events || snapJson.nasa_donki.events)) || [];
    const srcLabel = isTr
      ? (swData.source && swData.source.includes("Live") ? "Canlı NOAA SWPC + NASA DONKI + PC STAC" : "Doğrulanmış Anlık Veri (NOAA SWPC + NASA DONKI)")
      : (swData.source || "NOAA SWPC Live");
    let html = `<strong>${srcLabel}</strong><br/>GOES &ge;10 MeV: <code>${swData.goes_proton_10mev_pfu} pfu</code> · Kp: <code>${swData.kp_index}</code>`;
    if (donkiList.length > 0 && donkiList[donkiList.length - 1].gstID) {
      html += `<br/>DONKI GST: <code>${donkiList[donkiList.length - 1].gstID}</code>`;
    }
    if (pcScene && pcScene.id) {
      html += `<br/>Planetary Computer STAC: <code>${pcScene.id.slice(0, 26)}…</code>`;
    }
    if (meteo && meteo["t_2m:C"] !== undefined) {
      html += `<br/>Meteomatics Arslanköy: <code>${meteo["t_2m:C"]}°C</code> · ${isTr ? "Rüzgâr" : "Wind"} <code>${meteo["wind_speed_100m:ms"]} m/s</code>`;
    }
    swEl.innerHTML = html;
  }

  function renderSeuStatus(res) {
    const isTr = state.lang === "tr";
    const el = document.getElementById("seu-status");
    if (!state.seuEvent) {
      if (res.avionics === "ARM_SRAM") {
        el.textContent = isTr
          ? `64 MB Ağırlık SRAM Korumasız (${res.bit_flips_per_day} SEU/gün riski)`
          : `64 MB Weight SRAM Unprotected (${res.bit_flips_per_day} SEU/day risk)`;
      } else {
        el.textContent = isTr ? "CRC-16/CCITT-FALSE: GEÇERLİ (0 bit hatası)" : "CRC-16/CCITT-FALSE: VALID (0 bit errors)";
      }
      return;
    }
    const { bitIdx, avionics, valid } = state.seuEvent;
    if (avionics === "WERR_24B_FNS") {
      el.textContent = isTr
        ? `SEU Bit #${bitIdx} bozuldu -> CRC-16 YAKALADI (valid=${valid}), 0 B Ağırlık SRAM Etkilenmedi!`
        : `SEU Bit #${bitIdx} flipped -> CRC-16 TRAPPED (valid=${valid}), 0 B Weight SRAM Uncorrupted!`;
    } else if (avionics === "ARM_SRAM") {
      el.textContent = isTr
        ? `SEU Bit #${bitIdx} bozuldu -> KORUMASIZ 64 MB Ağırlık SRAM BOZULDU! (${res.bit_flips_per_day} SEU/gün, ADCS riski)`
        : `SEU Bit #${bitIdx} flipped -> UNPROTECTED 64 MB Weight SRAM CORRUPTED! (${res.bit_flips_per_day} flips/day, attitude drift risk)`;
    } else {
      el.textContent = isTr
        ? `SEU Bit #${bitIdx} bozuldu -> TMR 3'lü oylama düzeltti (${res.power_w} W / $${res.total_cost_usd.toLocaleString()} ek maliyet)`
        : `SEU Bit #${bitIdx} flipped -> TMR triple-voted (${res.power_w} W / $${res.total_cost_usd.toLocaleString()} penalty, valid=${valid})`;
    }
  }

  function updateI18n() {
    const dict = I18N[state.lang];
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    const pdfBtn = document.querySelector('[data-i18n="btn_pdf"]');
    if (pdfBtn) {
      pdfBtn.setAttribute("href", state.lang === "tr" ? "docs/AegisSat_Presentation_TR.pdf" : "docs/AegisSat_Presentation_EN.pdf");
    }
    const stormBtn = document.getElementById("btn-storm");
    stormBtn.textContent = state.solarStorm ? dict.btn_storm : dict.btn_storm_off;
    stormBtn.classList.toggle("active", state.solarStorm);

    const spoofBtn = document.getElementById("btn-spoof");
    spoofBtn.textContent = state.spoofAttack ? dict.btn_spoof_on : dict.btn_spoof;
    spoofBtn.classList.toggle("active", state.spoofAttack);

    document.getElementById("btn-explode").classList.toggle("active", state.exploded);
    document.getElementById("btn-viz-cube").classList.toggle("active", state.vizMode === "cube");
    document.getElementById("btn-viz-orbit").classList.toggle("active", state.vizMode === "orbit");
    document.getElementById("hud-mode-label").textContent = state.vizMode === "orbit"
      ? (state.lang === "tr" ? "NASA Mission Viz Modu · 3D Transfer Yörüngesi" : "NASA Mission Viz · 3D Transfer Trajectory")
      : "1U CDS Rev 14.1 · 100×100×113.5 mm";
    renderHeritage();
    renderSpaceWeather();
  }

  function updateAll() {
    const res = window.AegisCore.evaluateGameMission(
      state.chassis, state.avionics, state.orbit, state.solarStorm, state.spoofAttack,
      state.launch, state.eps, state.comm, state.payloads, state.scenario
    );
    state.lastResult = res;

    renderGameChrome(res);
    renderOptions();
    renderResourceBarsAndGates(res);
    updateI18n();

    const isTr = state.lang === "tr";
    const sv = document.getElementById("val-survival");
    sv.textContent = `${res.survival_score_pct}%`;
    sv.className = "k-val " + (res.survival_score_pct >= 90 ? "k-good" : res.survival_score_pct >= 55 ? "k-warn" : "k-bad");

    const seu = document.getElementById("val-seu");
    seu.textContent = `${res.bit_flips_per_day}`;
    seu.className = "k-val " + (res.bit_flips_per_day === 0 ? "k-good" : "k-bad");

    document.getElementById("val-sram").textContent = res.weight_sram_bytes === 0
      ? (isTr ? "0 B (24B Salt Okunur)" : "0 B (24B PROM)")
      : `${(res.weight_sram_bytes / 1e6).toFixed(0)} MB`;

    const tempEl = document.getElementById("val-temp");
    tempEl.textContent = `${res.internal_min_temp_c} °C`;
    tempEl.className = "k-val " + (res.thermal_ok ? "k-good" : "k-bad");

    const massEl = document.getElementById("val-mass");
    massEl.textContent = `${res.payload_margin_g} g`;
    massEl.className = "k-val " + (res.structural_ok && res.payload_margin_g >= 500 ? "k-good" : "k-warn");

    document.getElementById("val-power").textContent = `${res.power_w} W / $${res.total_cost_usd.toLocaleString()}`;
    document.getElementById("val-adcs").textContent = `${res.adcs.energy_damped_pct}% (μ=${res.adcs.mu})`;

    const guardEl = document.getElementById("val-guard");
    if (state.spoofAttack) {
      guardEl.textContent = res.avionics === "WERR_24B_FNS"
        ? (isTr ? "VETO & İZOLE EDİLDİ" : "VETOED & ISOLATED")
        : (isTr ? "ELE GEÇİRİLDİ!" : "COMPROMISED!");
      guardEl.className = "k-val " + (res.avionics === "WERR_24B_FNS" ? "k-good" : "k-bad");
    } else {
      guardEl.textContent = isTr ? "NOMİNAL (γ < 0.585)" : "NOMINAL (γ < 0.585)";
      guardEl.className = "k-val k-good";
    }

    if (!state.seuEvent) {
      document.getElementById("werr24-hex").textContent = res.werr24_hex;
    }
    renderSeuStatus(res);

    const badgesEl = document.getElementById("badges-wrap");
    badgesEl.innerHTML = "";
    res.badges.forEach((b) => {
      const span = document.createElement("span");
      span.className = "badge-chip";
      span.textContent = "★ " + (isTr ? (BADGE_TR[b] || b) : b);
      badgesEl.appendChild(span);
    });

    document.getElementById("hud-status").textContent = `S(f) = ${res.adcs.schwarzian_bound} < 0 | Mode 1: ${window.AegisCore.CHASSIS_SPECS[state.chassis].mode1_hz} Hz`;

    updateThreeColors(res);
    drawAdcsChart(res.adcs);
    drawFlightChart();
  }

  function openModal(title, htmlBody) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = htmlBody;
    document.getElementById("modal-overlay").classList.add("open");
  }

  function getLeaderboard() {
    try {
      const raw = localStorage.getItem("aegissat_leaderboard_v1");
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return SEED_LEADERBOARD.slice();
  }

  function saveScoreToLeaderboard(entry) {
    const lb = getLeaderboard();
    lb.push(entry);
    lb.sort((a, b) => b.score - a.score);
    const trimmed = lb.slice(0, 12);
    try { localStorage.setItem("aegissat_leaderboard_v1", JSON.stringify(trimmed)); } catch (_) {}
    return trimmed;
  }

  function renderLeaderboardHtml(lb) {
    const isTr = state.lang === "tr";
    const rows = lb.map((r, i) => `
      <tr>
        <td>#${i + 1}</td>
        <td><strong>${r.team}</strong></td>
        <td>${r.scenario}</td>
        <td class="mono">${r.score}</td>
        <td>CML-${r.cml}</td>
        <td>${r.survival}%</td>
        <td class="mono">$${Number(r.cost).toLocaleString()}</td>
      </tr>`).join("");
    return `
      <table class="lb-table">
        <thead><tr><th>#</th><th>${isTr ? "Takım" : "Team"}</th><th>${isTr ? "Senaryo" : "Scenario"}</th><th>${isTr ? "Skor" : "Score"}</th><th>CML</th><th>${isTr ? "Sağkalım" : "Survival"}</th><th>${isTr ? "Bütçe" : "Cost"}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function runLaunchSimulation() {
    const res = state.lastResult;
    if (!res) return;
    const isTr = state.lang === "tr";
    state.tumbleOmegaVisual = 24.0;
    state.tumbleRateDps = 3647.58;

    const coopBonus = state.coopEnabled && Object.values(state.rolesSigned).every(Boolean) ? 50 : 0;
    const finalScore = Math.min(1000, res.game_score + coopBonus);
    const evList = [
      { en: "X-Class Proton Gust (+4,200 pfu)", tr: "X-Sınıfı Güneş Proton Sağanağı (+4,200 pfu)", ok: res.bit_flips_per_day === 0 },
      { en: "Cryogenic Eclipse Dip (-150°C ambient)", tr: "Kriyojenik Tutulma (-150°C dış soğuma)", ok: res.thermal_ok },
      { en: "Command Uplink Spoof Injection", tr: "Komut Hattı Sahte Telemetri Enjeksiyonu", ok: res.gates.rad_cyber_ok },
    ];
    const pickedEvent = evList[Math.floor(Math.random() * evList.length)];

    const stepsHtml = `
      <div class="timeline-list">
        <div class="tl-step ${res.gates.launch_ok && res.gates.mass_ok ? "ok" : "bad"}">
          <strong>T+00:00 · ${isTr ? "Fırlatma & GEVS 14.1 Grms Kontrolü" : "Launch Segment & GEVS 14.1 Grms"}:</strong>
          ${res.gates.launch_ok && res.gates.mass_ok
            ? (isTr ? `BAŞARILI (${res.total_spacecraft_mass_g} g <= 1,330 g)` : `NOMINAL (${res.total_spacecraft_mass_g} g <= 1,330 g)`)
            : (isTr ? "Fırlatma / kütle limiti uyumsuzluğu!" : "Launch / mass envelope violation!")}
        </div>
        <div class="tl-step ${res.adcs.energy_damped_pct >= 90 ? "ok" : "bad"}">
          <strong>T+00:15 · ${isTr ? "KÜPSAT-01 3,647.58 °/s Ayrılma Sönümleme" : "KÜPSAT-01 3,647.58 °/s Separation Detumble"}:</strong>
          ${isTr ? `%${res.adcs.energy_damped_pct} enerji sönümlendi (μ=${res.adcs.mu})` : `${res.adcs.energy_damped_pct}% energy damped in 10 cycles (μ=${res.adcs.mu})`}
        </div>
        <div class="tl-step ${pickedEvent.ok ? "ok" : "bad"}">
          <strong>T+00:45 · ${isTr ? "Rastgele Uçuş Olayı" : "Random In-Flight Anomaly"} (${isTr ? pickedEvent.tr : pickedEvent.en}):</strong>
          ${pickedEvent.ok
            ? (isTr ? "DAYANDI — WERR 24B / Hibrit Kalkan olayı nötralize etti" : "SURVIVED — neutralized by Spacecraft Shielding & Zero-SRAM Guard")
            : (isTr ? "ARIZA — Bu olay seçilen mimariyi devre dışı bıraktı!" : "ANOMALY HIT — current architecture degraded by event!")}
        </div>
        <div class="tl-step ${res.gates.power_ok && res.gates.comm_ok ? "ok" : "bad"}">
          <strong>T+01:30 · ${isTr ? "Yer Segmenti & Bilim Veri İndirme" : "Ground Segment Downlink & Science Return"}:</strong>
          ${res.science_points} pts · ${res.data_gen_mb_day}/${res.data_cap_mb_day} MB/d · Margin ${res.power_margin_w} W
        </div>
      </div>
      <div class="score-banner" style="margin-top:0.5rem;">
        <div>
          <div style="font-size:0.75rem;color:var(--muted);">${isTr ? "GÖREV SONUCU" : "FINAL MISSION VERDICT"}</div>
          <div style="font-size:1.35rem;font-weight:800;color:${res.mission_success ? "#22c55e" : "#ef4444"}">
            ${res.mission_success ? (isTr ? "GÖREV BAŞARILI · CML-" : "MISSION SUCCESS · CML-") + res.cml_level : (isTr ? "GÖREV REVİZYONU GEREKLİ · CML-" : "NEEDS DESIGN ITERATION · CML-") + res.cml_level}
            (${finalScore} / 1000)
          </div>
        </div>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
          <button id="btn-save-lb" class="btn primary">${isTr ? "Skoru Kaydet" : "Save to Leaderboard"}</button>
          <button id="btn-print-rpt" class="btn">${isTr ? "Rapor Yazdır" : "Print Report"}</button>
        </div>
      </div>
      <div id="modal-lb-wrap">${renderLeaderboardHtml(getLeaderboard())}</div>
    `;
    openModal(isTr ? "Görev Fırlatma Simülasyonu & Sonuç Raporu" : "Mission Launch Simulation & After-Action Report", stepsHtml);

    document.getElementById("btn-save-lb").onclick = () => {
      const teamName = state.coopEnabled
        ? `${state.roleNames.cmdr || "Team"}+${Object.keys(state.roleNames).length - 1}`
        : `Commander-${res.avionics}`;
      const updated = saveScoreToLeaderboard({
        team: teamName,
        scenario: res.scenario,
        score: finalScore,
        cml: res.cml_level,
        survival: res.survival_score_pct,
        cost: res.total_mission_cost_usd,
      });
      document.getElementById("modal-lb-wrap").innerHTML = renderLeaderboardHtml(updated);
    };
    document.getElementById("btn-print-rpt").onclick = () => window.print();
  }

  function showCubeSat101Modal() {
    const isTr = state.lang === "tr";
    const body = isTr ? `
      <p style="font-size:0.84rem;line-height:1.5;color:#cbd5e1;"><strong>NASA Systems Engineering — 4 Görev Segmenti:</strong> Her uzay görevi <em>Fırlatma (Roket uyumu)</em>, <em>Uzay Segmenti (1U 1,330 g Şasi, Güç EPS, Aviyonik, Bilim Yükleri)</em>, <em>Yer Segmenti (UHF/S-Band/Optik İndirme)</em> ve <em>Kullanıcı Segmenti</em> arasındaki takasları dengeler.</p>
      <ul class="heritage-list" style="font-size:0.8rem;">
        <li>• <strong>Neden 0-SRAM WERR 24 Bayt?</strong> Standart 64 MB uçucu SRAM ağırlıkları Mars proton fırtınasında günde 234 kez bozulur; salt-okunur 24-Bayt matematik çekirdeği + CRC-16 sıfır bit hatası (0 SEU) ve 0.35 W güç ile tüm bütçe/kütle yükünü kurtarır.</li>
        <li>• <strong>JPL Concept Maturity Levels (CML 1–4):</strong> Tüm 8 tasarım kapısını (Kütle, Roket, Güç, Veri, Bütçe, Termal, Siber/Radyasyon, Bilim) geçerek CML-4 aşamasına ulaşın.</li>
        <li>• <strong>Resmi NASA Space Apps Challenge Kaynakları:</strong>
          <a href="https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf?emrc=a454cf" target="_blank" rel="noopener">NASA Science Missions PDF</a> ·
          <a href="https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf" target="_blank" rel="noopener">NASA CubeSat 101</a> ·
          <a href="https://nasa.github.io/mission-viz/" target="_blank" rel="noopener">NASA Mission Viz</a> ·
          <a href="https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/" target="_blank" rel="noopener">GSFC Mission Design Lab</a> ·
          <a href="https://software.nasa.gov/software/GSC-19468-1" target="_blank" rel="noopener">NASA GMAT</a> ·
          <a href="https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl:2014/44299" target="_blank" rel="noopener">JPL CMLs</a>
        </li>
      </ul>` : `
      <p style="font-size:0.84rem;line-height:1.5;color:#cbd5e1;"><strong>NASA Systems Engineering — 4 Mission Segments:</strong> Every spacecraft must balance competing constraints across the <em>Launch Segment</em> (rocket &amp; 14.1 Grms vibration), <em>Space Segment</em> (1U 1,330 g structure, EPS solar power, flight computer, science instruments), <em>Ground Segment</em> (comm bandwidth), and <em>User Segment</em> (science return).</p>
      <ul class="heritage-list" style="font-size:0.8rem;">
        <li>• <strong>Why Zero-SRAM 24-Byte WERR?</strong> Conventional 64 MB volatile AI weight SRAM suffers 234 flips/day in Mars storms and draws 4.2 W. Immutable 24-Byte ROM arithmetic + CRC-16 achieves 0 SEU flips at 0.35 W / 28 g, unlocking higher science payloads and 100% survival.</li>
        <li>• <strong>JPL Concept Maturity Levels (CML 1–4):</strong> Clear all 8 engineering gates (Mass, Launch, Power, Downlink, Budget, Thermal, Cyber/SEU, Science) to advance from Concept (CML-1) to Point Design (CML-4).</li>
        <li>• <strong>Official NASA Challenge Resources:</strong>
          <a href="https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf?emrc=a454cf" target="_blank" rel="noopener">Design Science Missions</a> ·
          <a href="https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf" target="_blank" rel="noopener">NASA CubeSat 101</a> ·
          <a href="https://nasa.github.io/mission-viz/" target="_blank" rel="noopener">NASA Mission Viz</a> ·
          <a href="https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/" target="_blank" rel="noopener">GSFC Mission Design Lab</a> ·
          <a href="https://software.nasa.gov/software/GSC-19468-1" target="_blank" rel="noopener">NASA GMAT</a> ·
          <a href="https://science.nasa.gov/mission/webb/game-build-it-yourself/" target="_blank" rel="noopener">JWST Game</a> ·
          <a href="https://www.asc-csa.gc.ca/eng/youth-educators/digital-games-and-activities.asp" target="_blank" rel="noopener">CSA Games</a>
        </li>
      </ul>`;
    openModal(isTr ? "CubeSat 101 & NASA Görev Tasarımı Rehberi" : "CubeSat 101 & Official NASA Challenge Guide", body);
  }

  async function loadExternalData() {
    try {
      const fResp = await fetch("./data/kupsat01_flight_20260807.json");
      if (fResp.ok) {
        const fJson = await fResp.json();
        state.flightSamples = fJson.samples || [];
        drawFlightChart();
      }
    } catch (_) {}

    try {
      let swData = null;
      let snapJson = null;
      try {
        const snap = await fetch("./data/verified_nasa_space_weather.json");
        if (snap.ok) snapJson = await snap.json();
      } catch (_) {}
      try {
        const edge = await fetch("/api/space-weather");
        if (edge.ok) swData = await edge.json();
      } catch (_) {}
      if (!swData || !swData.ok) {
        if (snapJson) {
          swData = {
            source: "Verified Snapshot (NOAA SWPC + NASA DONKI)",
            goes_proton_10mev_pfu: snapJson.noaa_swpc.goes_proton_10mev_pfu,
            kp_index: snapJson.noaa_swpc.kp_index,
            planetary_computer_latest_scene: (snapJson.planetary_computer_corridor || [])[0] || null,
          };
        }
      }
      state.swData = swData;
      state.snapJson = snapJson;
      renderSpaceWeather();
    } catch (_) {
      state.swData = null;
      renderSpaceWeather();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadShareHash();

    document.getElementById("btn-lang").onclick = () => { state.lang = state.lang === "en" ? "tr" : "en"; updateAll(); };
    document.getElementById("btn-coop").onclick = () => { state.coopEnabled = !state.coopEnabled; updateAll(); };
    document.getElementById("btn-viz-cube").onclick = () => { state.vizMode = "cube"; updateAll(); };
    document.getElementById("btn-viz-orbit").onclick = () => { state.vizMode = "orbit"; updateAll(); };
    document.getElementById("btn-storm").onclick = () => { state.solarStorm = !state.solarStorm; state.seuEvent = null; updateAll(); };
    document.getElementById("btn-spoof").onclick = () => { state.spoofAttack = !state.spoofAttack; state.seuEvent = null; updateAll(); };
    document.getElementById("btn-explode").onclick = () => { state.exploded = !state.exploded; updateAll(); };
    document.getElementById("btn-tumble").onclick = () => { state.tumbleOmegaVisual = 24.0; state.tumbleRateDps = 3647.58; };
    document.getElementById("btn-seu").onclick = () => {
      if (!state.lastResult) return;
      const corrupted = new Uint8Array(state.lastResult.werr24_bytes);
      const bitIdx = Math.floor(Math.random() * 192);
      corrupted[Math.floor(bitIdx / 8)] ^= 1 << (bitIdx % 8);
      const valid = window.AegisCore.verifyWerr24FrameBytes(corrupted);
      document.getElementById("werr24-hex").textContent = window.AegisCore.bytesToHex(corrupted);
      state.seuEvent = { bitIdx, avionics: state.avionics, valid };
      renderSeuStatus(state.lastResult);
    };

    document.getElementById("btn-launch").onclick = runLaunchSimulation;
    document.getElementById("btn-launch-2").onclick = runLaunchSimulation;
    document.getElementById("btn-guide").onclick = showCubeSat101Modal;
    document.getElementById("btn-lb").onclick = () => {
      openModal(state.lang === "tr" ? "Görev Tasarımı Skor Tablosu" : "Mission Design Leaderboard", renderLeaderboardHtml(getLeaderboard()));
    };
    document.getElementById("btn-share").onclick = () => {
      const url = makeShareUrl();
      window.location.hash = url.split("#")[1];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(() => {});
      }
      openModal(
        state.lang === "tr" ? "Paylaşılabilir Görev Bağlantısı" : "Shareable Co-Op Mission Design Link",
        `<p style="font-size:0.84rem;color:#cbd5e1;">${state.lang === "tr" ? "Bu URL'yi takım arkadaşlarınızla paylaşın — aynı donanım tasarımını tarayıcılarında açar:" : "Share this URL with up to 4 teammates to load your exact spacecraft architecture:"}</p>
         <div class="hex-box">${url}</div>`
      );
    };
    document.getElementById("btn-modal-close").onclick = () => {
      document.getElementById("modal-overlay").classList.remove("open");
    };

    initThree();
    updateAll();
    loadExternalData();
  });
})();
