(function () {
  "use strict";

  const I18N = {
    en: {
      subtitle: "Space Mission Architecture Simulator · KÜPSAT-01 TRL-7 + IAC 2026 + WERR 24-Byte 0-SRAM",
      btn_slides: "Slides (EN)",
      btn_slides_alt: "Sunum (TR)",
      btn_lang: "TR / EN",
      h_config: "1. Mission Architecture",
      lbl_chassis: "Chassis & Shielding (IAC-26-C2.IPB.29)",
      lbl_avionics: "Avionics & AI Memory",
      lbl_orbit: "Orbit / Environment (NASA SPENVIS & OMNIWeb)",
      lbl_events: "Stress Tests & Controls",
      btn_storm: "Solar Storm: ON",
      btn_storm_off: "Solar Storm: OFF",
      btn_explode: "Exploded View",
      btn_tumble: "Inject KÜPSAT-01 Burst (3,647.58 °/s)",
      h_sim: "2. 3D CubeSat & ADCS Detumbling",
      chart_adcs: "Negative Schwarzian + Koenigs ADCS Energy Damping (10 Cycles = 94.37%)",
      chart_flight: "KÜPSAT-01 Verified Stratospheric Profile (25.64 km / 22.51 hPa / -54.50 °C)",
      h_telemetry: "3. Survivability & 24-Byte WERR Frame",
      k_survival: "Mission Survival Score",
      k_seu: "SRAM Weight Bit-Flips / Day",
      k_sram: "Mutable Weight SRAM",
      k_temp: "Internal Min Temp",
      k_mass: "1U Payload Margin (1,330 g)",
      k_adcs: "ADCS 10-Cycle Damping",
      lbl_hex: "Immutable 24-Byte (192-bit) WERR Frame + CRC-16/CCITT-FALSE",
      h_heritage: "Verified Flight & Research Heritage",
    },
    tr: {
      subtitle: "Uzay Görevi Mimari Simülatörü · KÜPSAT-01 TRL-7 + IAC 2026 + WERR 24-Bayt 0-SRAM",
      btn_slides: "Slaytlar (EN)",
      btn_slides_alt: "Sunum (TR)",
      btn_lang: "EN / TR",
      h_config: "1. Görev Mimarisi Seçimi",
      lbl_chassis: "Şasi & Radyasyon Kalkanı (IAC-26-C2.IPB.29)",
      lbl_avionics: "Aviyonik & Yapay Zekâ Belleği",
      lbl_orbit: "Yörünge / Uzay Ortamı (NASA SPENVIS & OMNIWeb)",
      lbl_events: "Stres Testleri & Kontroller",
      btn_storm: "Güneş Fırtınası: AÇIK",
      btn_storm_off: "Güneş Fırtınası: KAPALI",
      btn_explode: "Patlatılmış Görünüm",
      btn_tumble: "KÜPSAT-01 Savrulma Enjekte Et (3,647.58 °/s)",
      h_sim: "2. 3D Küpsat & ADCS Sönümleme",
      chart_adcs: "Negatif Schwarzian + Koenigs ADCS Enerji Sönümleme (10 Çevrim = %94.37)",
      chart_flight: "KÜPSAT-01 Doğrulanmış Stratosfer Profili (25.64 km / 22.51 hPa / -54.50 °C)",
      h_telemetry: "3. Hayatta Kalma & 24-Bayt WERR Çerçevesi",
      k_survival: "Görev Başarı Skoru",
      k_seu: "Günlük SRAM Bit-Flip Hatası",
      k_sram: "Ağırlık SRAM Belleği",
      k_temp: "İç Minimum Sıcaklık",
      k_mass: "1U Faydalı Yük Payı (1,330 g)",
      k_adcs: "ADCS 10-Çevrim Sönümleme",
      lbl_hex: "Değişmez 24-Bayt (192-bit) WERR Çerçevesi + CRC-16/CCITT-FALSE",
      h_heritage: "Doğrulanmış Uçuş & Araştırma Mirası",
    },
  };

  const state = {
    lang: "en",
    chassis: "WERR_AEGIS_HYBRID",
    avionics: "WERR_24B_FNS",
    orbit: "MARS_DEEP_SPACE",
    solarStorm: true,
    exploded: false,
    tumbleOmegaVisual: 18.0, // rad/s visual spin
    adcsStep: 0,
  };

  // Three.js scene objects
  let scene, camera, renderer, cubeGroup, panels = [], brackets = [], rails = [];

  function initThree() {
    const container = document.getElementById("cube-canvas");
    if (!container || typeof THREE === "undefined") return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(2.9, 2.2, 3.4);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.35);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xf59e0b, 0.55);
    rim.position.set(-4, -3, -2);
    scene.add(rim);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starPts = [];
    for (let i = 0; i < 450; i++) {
      starPts.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.06 })));

    cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // 4 Corner AA7075-T6 rails
    const railGeo = new THREE.BoxGeometry(0.11, 1.24, 0.11);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 });
    [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]].forEach(([x, z]) => {
      const m = new THREE.Mesh(railGeo, railMat);
      m.position.set(x, 0, z);
      m.userData.base = [x, 0, z];
      cubeGroup.add(m);
      rails.push(m);
    });

    // 6 CFRP / Shield panels
    const pGeo = new THREE.BoxGeometry(1.02, 1.02, 0.04);
    const pMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.4, roughness: 0.35, transparent: true, opacity: 0.88 });
    const faceDefs = [
      { pos: [0, 0, 0.56], rot: [0, 0, 0], dir: [0, 0, 1] },
      { pos: [0, 0, -0.56], rot: [0, 0, 0], dir: [0, 0, -1] },
      { pos: [0.56, 0, 0], rot: [0, Math.PI / 2, 0], dir: [1, 0, 0] },
      { pos: [-0.56, 0, 0], rot: [0, Math.PI / 2, 0], dir: [-1, 0, 0] },
      { pos: [0, 0.56, 0], rot: [Math.PI / 2, 0, 0], dir: [0, 1, 0] },
      { pos: [0, -0.56, 0], rot: [Math.PI / 2, 0, 0], dir: [0, -1, 0] },
    ];
    faceDefs.forEach((d) => {
      const m = new THREE.Mesh(pGeo, pMat.clone());
      m.position.set(...d.pos);
      m.rotation.set(...d.rot);
      m.userData.base = d.pos;
      m.userData.dir = d.dir;
      cubeGroup.add(m);
      panels.push(m);
    });

    // Internal Rigid 10K ceramic brackets + PC/104 avionics stack
    const brkGeo = new THREE.BoxGeometry(0.84, 0.06, 0.84);
    const brkMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    [-0.25, 0.0, 0.25].forEach((y, idx) => {
      const m = new THREE.Mesh(brkGeo, idx === 1 ? new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 }) : brkMat);
      m.position.set(0, y, 0);
      m.userData.base = [0, y, 0];
      cubeGroup.add(m);
      brackets.push(m);
    });

    window.addEventListener("resize", () => {
      if (!renderer || !container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    let last = performance.now();
    function animate(now) {
      requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Exploded view interpolation
      const ex = state.exploded ? 0.55 : 0.0;
      panels.forEach((p) => {
        const [bx, by, bz] = p.userData.base;
        const [dx, dy, dz] = p.userData.dir;
        p.position.set(bx + dx * ex, by + dy * ex, bz + dz * ex);
      });

      // Koenigs ADCS damping in visual loop
      state.tumbleOmegaVisual = Math.max(0.28, state.tumbleOmegaVisual * Math.pow(0.866, dt * 3.0));
      cubeGroup.rotation.y += state.tumbleOmegaVisual * dt * 0.45;
      cubeGroup.rotation.x += state.tumbleOmegaVisual * dt * 0.25;

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }

  function updateThreeColors(res) {
    const colorMap = {
      AL6061: 0x64748b,
      CFRP: 0x0f172a,
      WERR_AEGIS_HYBRID: 0x0ea5e9,
    };
    const c = colorMap[state.chassis] || 0x1e293b;
    panels.forEach((p) => {
      p.material.color.setHex(res.survival_score_pct < 50 ? 0x7f1d1d : c);
    });
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

    const pts = adcs.normalized_energy;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    pts.forEach((e, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      const y = h - pad - e * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("E0: 100%", pad + 4, pad + 10);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`E10: ${(pts[pts.length - 1] * 100).toFixed(2)}% (-${adcs.energy_damped_pct}%)`, w - 155, h - pad - 8);
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

    // Representative KÜPSAT-01 ascent/burst/descent profile (07:18 -> 10:19 TSI)
    const altNorm = [0.06, 0.18, 0.35, 0.56, 0.78, 0.94, 1.0, 0.62, 0.31, 0.14, 0.06];
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    altNorm.forEach((v, i) => {
      const x = pad + (i / (altNorm.length - 1)) * (w - pad * 2);
      const y = h - pad - v * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "11px monospace";
    ctx.fillText("Peak: 25.64 km | 22.51 hPa", pad + 6, pad + 12);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("Burst: 20G / 3,647.58 °/s", w - 165, pad + 26);
  }

  function renderOptions() {
    const core = window.AegisCore;
    const isTr = state.lang === "tr";

    const chBox = document.getElementById("chassis-options");
    chBox.innerHTML = "";
    Object.entries(core.CHASSIS_SPECS).forEach(([k, v]) => {
      const btn = document.createElement("button");
      btn.className = "opt-card" + (state.chassis === k ? " selected" : "");
      btn.innerHTML = `<span class="title">${isTr ? v.name_tr : v.name_en}</span>
        <span class="sub">${v.mass_g} g · ${v.von_mises_mpa} MPa · FS ${v.safety_factor} · f1 ${v.mode1_hz} Hz</span>`;
      btn.onclick = () => { state.chassis = k; updateAll(); };
      chBox.appendChild(btn);
    });

    const avBox = document.getElementById("avionics-options");
    avBox.innerHTML = "";
    Object.entries(core.AVIONICS_SPECS).forEach(([k, v]) => {
      const btn = document.createElement("button");
      btn.className = "opt-card" + (state.avionics === k ? " selected" : "");
      const sramLabel = v.weight_sram_bytes === 0 ? "0 B SRAM (24 B Seed)" : `${(v.weight_sram_bytes / 1e6).toFixed(0)} MB SRAM`;
      btn.innerHTML = `<span class="title">${isTr ? v.name_tr : v.name_en}</span>
        <span class="sub">${sramLabel} · ${v.power_w} W · ${v.mass_g} g</span>`;
      btn.onclick = () => { state.avionics = k; updateAll(); };
      avBox.appendChild(btn);
    });

    const orbBox = document.getElementById("orbit-options");
    orbBox.innerHTML = "";
    Object.entries(core.ORBIT_SPECS).forEach(([k, v]) => {
      const btn = document.createElement("button");
      btn.className = "opt-card" + (state.orbit === k ? " selected" : "");
      btn.innerHTML = `<span class="title">${isTr ? v.name_tr : v.name_en}</span>
        <span class="sub">${v.dose_krad} krad · ${v.ext_temp_min_c}°C / +${v.ext_temp_max_c}°C</span>`;
      btn.onclick = () => { state.orbit = k; updateAll(); };
      orbBox.appendChild(btn);
    });
  }

  function updateI18n() {
    const dict = I18N[state.lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    const stormBtn = document.getElementById("btn-storm");
    if (stormBtn) {
      stormBtn.textContent = state.solarStorm ? dict.btn_storm : dict.btn_storm_off;
      stormBtn.classList.toggle("active", state.solarStorm);
    }
    const expBtn = document.getElementById("btn-explode");
    if (expBtn) expBtn.classList.toggle("active", state.exploded);
  }

  function updateAll() {
    renderOptions();
    updateI18n();
    const res = window.AegisCore.evaluateMission(state.chassis, state.avionics, state.orbit, state.solarStorm);

    const sv = document.getElementById("val-survival");
    sv.textContent = `${res.survival_score_pct}%`;
    sv.className = "k-val " + (res.survival_score_pct >= 90 ? "k-good" : res.survival_score_pct >= 55 ? "k-warn" : "k-bad");

    const seu = document.getElementById("val-seu");
    seu.textContent = `${res.bit_flips_per_day}`;
    seu.className = "k-val " + (res.bit_flips_per_day === 0 ? "k-good" : "k-bad");

    document.getElementById("val-sram").textContent = res.weight_sram_bytes === 0 ? "0 B (24B PROM)" : `${(res.weight_sram_bytes / 1e6).toFixed(0)} MB`;
    document.getElementById("val-temp").textContent = `${res.internal_min_temp_c} °C`;
    document.getElementById("val-mass").textContent = `${res.payload_margin_g} g`;
    document.getElementById("val-adcs").textContent = `${res.adcs.energy_damped_pct}% (μ=0.75)`;
    document.getElementById("werr24-hex").textContent = res.werr24_hex;
    document.getElementById("hud-status").textContent = `S(f) = ${res.adcs.schwarzian_bound} < 0 | Mode 1: ${window.AegisCore.CHASSIS_SPECS[state.chassis].mode1_hz} Hz`;

    updateThreeColors(res);
    drawAdcsChart(res.adcs);
    drawFlightChart();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-lang").onclick = () => {
      state.lang = state.lang === "en" ? "tr" : "en";
      updateAll();
    };
    document.getElementById("btn-storm").onclick = () => {
      state.solarStorm = !state.solarStorm;
      updateAll();
    };
    document.getElementById("btn-explode").onclick = () => {
      state.exploded = !state.exploded;
      updateAll();
    };
    document.getElementById("btn-tumble").onclick = () => {
      state.tumbleOmegaVisual = 22.0;
    };

    initThree();
    updateAll();
  });
})();
