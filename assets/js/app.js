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
      lbl_events: "Stress Tests & Fault Injection",
      btn_storm: "Solar Storm: ON",
      btn_storm_off: "Solar Storm: OFF",
      btn_spoof: "Spoof / AI Attack: OFF",
      btn_spoof_on: "Spoof / AI Attack: ACTIVE",
      btn_explode: "Exploded View",
      btn_tumble: "Inject KÜPSAT-01 Burst (3,647.58 °/s)",
      btn_seu: "Flip 1 Bit in 24B Frame (SEU)",
      h_sim: "2. 3D CubeSat & Rigid-Body ADCS",
      hud_hint: "Drag to rotate 3D CubeSat · Scroll to zoom",
      chart_adcs: "3-Axis Schwarzian + Koenigs ADCS Energy Damping (10 Cycles = 94.37%)",
      chart_flight: "KÜPSAT-01 Verified Flight Replay (421 Samples · 25.64 km · 22.51 hPa)",
      h_telemetry: "3. Survivability, Watchdog & 24B WERR",
      k_survival: "Mission Survival Score",
      k_seu: "SRAM Weight Bit-Flips / Day",
      k_sram: "Mutable Weight SRAM",
      k_temp: "Internal Min Temp",
      k_mass: "1U Payload Margin (1,330 g)",
      k_power: "Avionics Power / Bus Cost",
      k_adcs: "ADCS 10-Cycle Damping",
      k_guard: "Watchdog & Spoof Gate",
      lbl_hex: "Immutable 24-Byte (192-bit) WERR Frame + CRC-16/CCITT-FALSE",
      lbl_sw: "Live Space Weather (NOAA SWPC / NASA DONKI)",
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
      lbl_events: "Stres Testleri & Hata Enjeksiyonu",
      btn_storm: "Güneş Fırtınası: AÇIK",
      btn_storm_off: "Güneş Fırtınası: KAPALI",
      btn_spoof: "Spoofing / AI Saldırısı: KAPALI",
      btn_spoof_on: "Spoofing / AI Saldırısı: AKTİF",
      btn_explode: "Patlatılmış Görünüm",
      btn_tumble: "KÜPSAT-01 Savrulma (3,647.58 °/s)",
      btn_seu: "24B Çerçevede 1 Bit Çevir (SEU)",
      h_sim: "2. 3D Küpsat & Rijit Cisim ADCS",
      hud_hint: "3D Küpsat'ı sürükleyip çevirin · Tekerlekle yakınlaştırın",
      chart_adcs: "3-Eksen Schwarzian + Koenigs ADCS Enerji Sönümleme (10 Çevrim = %94.37)",
      chart_flight: "KÜPSAT-01 Gerçek Uçuş Telemetrisi (421 Örnek · 25.64 km · 22.51 hPa)",
      h_telemetry: "3. Hayatta Kalma, Bekçi & 24B WERR",
      k_survival: "Görev Başarı Skoru",
      k_seu: "Günlük SRAM Bit-Flip Hatası",
      k_sram: "Ağırlık SRAM Belleği",
      k_temp: "İç Minimum Sıcaklık",
      k_mass: "1U Faydalı Yük Payı (1,330 g)",
      k_power: "Güç Tüketimi / Maliyet",
      k_adcs: "ADCS 10-Çevrim Sönümleme",
      k_guard: "Bekçi & Spoofing Bariyeri",
      lbl_hex: "Değişmez 24-Bayt (192-bit) WERR Çerçevesi + CRC-16/CCITT-FALSE",
      lbl_sw: "Canlı Uzay Havası (NOAA SWPC / NASA DONKI)",
      h_heritage: "Doğrulanmış Uçuş & Araştırma Mirası",
    },
  };

  const state = {
    lang: "en",
    chassis: "WERR_AEGIS_HYBRID",
    avionics: "WERR_24B_FNS",
    orbit: "MARS_DEEP_SPACE",
    solarStorm: true,
    spoofAttack: false,
    exploded: false,
    tumbleOmegaVisual: 18.0,
    lastResult: null,
    seuStatusText: "",
    flightSamples: null,
  };

  let scene, camera, renderer, cubeGroup, protonPoints, panels = [], brackets = [], rails = [];
  let userRotX = 0.35, userRotY = 0.65, dragging = false, prevMouse = { x: 0, y: 0 };

  function initThree() {
    const container = document.getElementById("cube-canvas");
    if (!container || typeof THREE === "undefined") return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 4.1);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.68));
    const dir = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0xf59e0b, 0.6);
    rim.position.set(-4, -3, -2);
    scene.add(rim);

    // Background stars
    const starGeo = new THREE.BufferGeometry();
    const starPts = [];
    for (let i = 0; i < 420; i++) {
      starPts.push((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.055 })));

    // Solar proton particle stream (visible when solarStorm = true)
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

    cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // 4 AA7075-T6 corner rails
    const railGeo = new THREE.BoxGeometry(0.11, 1.24, 0.11);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.22 });
    [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]].forEach(([x, z]) => {
      const m = new THREE.Mesh(railGeo, railMat);
      m.position.set(x, 0, z);
      cubeGroup.add(m);
      rails.push(m);
    });

    // 6 CFRP / Shield panels
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

    // Internal Rigid 10K ceramic brackets + PC/104 WERR-24 avionics board
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

    // Mouse / touch orbit controls
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
      camera.position.z = Math.max(2.4, Math.min(7.0, camera.position.z + e.deltaY * 0.002));
    }, { passive: false });

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

      const ex = state.exploded ? 0.58 : 0.0;
      panels.forEach((p) => {
        const [bx, by, bz] = p.userData.base;
        const [dx, dy, dz] = p.userData.dir;
        p.position.set(bx + dx * ex, by + dy * ex, bz + dz * ex);
      });
      brackets.forEach((b, idx) => {
        b.position.y = b.userData.baseY + (idx - 1) * (state.exploded ? 0.22 : 0.0);
      });

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

      state.tumbleOmegaVisual = Math.max(0.24, state.tumbleOmegaVisual * Math.pow(0.866, dt * 3.0));
      if (!dragging) {
        userRotY += state.tumbleOmegaVisual * dt * 0.4;
        userRotX += state.tumbleOmegaVisual * dt * 0.2;
      }
      cubeGroup.rotation.set(userRotX, userRotY, 0);
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
    ctx.fillText("E0: 100% (3,647.58°/s)", pad + 4, pad + 10);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`E10: ${(pts[pts.length - 1] * 100).toFixed(2)}% (-${adcs.energy_damped_pct}%)`, w - 160, h - pad - 8);
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
      const maxAlt = Math.max(...samples.map((s) => s.alt_m), 23000);
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

      // Overlay external temperature normalized
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      samples.forEach((s, i) => {
        const tNorm = Math.max(0, Math.min(1, (s.t_out_c + 60) / 100));
        const x = pad + (i / (samples.length - 1)) * (w - pad * 2);
        const y = h - pad - tNorm * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    ctx.fillStyle = "#38bdf8";
    ctx.font = "11px monospace";
    ctx.fillText("Peak: 25.64 km (ISA) | 22.51 hPa", pad + 6, pad + 12);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("Ext -54.50°C | ΔT +37.23°C", w - 175, h - pad - 8);
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
        <span class="sub">${v.mass_g} g · $${v.cost_usd.toLocaleString()} · ${v.von_mises_mpa} MPa · FS ${v.safety_factor}</span>`;
      btn.onclick = () => { state.chassis = k; state.seuStatusText = ""; updateAll(); };
      chBox.appendChild(btn);
    });

    const avBox = document.getElementById("avionics-options");
    avBox.innerHTML = "";
    Object.entries(core.AVIONICS_SPECS).forEach(([k, v]) => {
      const btn = document.createElement("button");
      btn.className = "opt-card" + (state.avionics === k ? " selected" : "");
      const sramLabel = v.weight_sram_bytes === 0 ? "0 B SRAM (24 B Seed)" : `${(v.weight_sram_bytes / 1e6).toFixed(0)} MB SRAM`;
      btn.innerHTML = `<span class="title">${isTr ? v.name_tr : v.name_en}</span>
        <span class="sub">${sramLabel} · ${v.power_w} W · ${v.mass_g} g · $${v.cost_usd.toLocaleString()}</span>`;
      btn.onclick = () => { state.avionics = k; state.seuStatusText = ""; updateAll(); };
      avBox.appendChild(btn);
    });

    const orbBox = document.getElementById("orbit-options");
    orbBox.innerHTML = "";
    Object.entries(core.ORBIT_SPECS).forEach(([k, v]) => {
      const btn = document.createElement("button");
      btn.className = "opt-card" + (state.orbit === k ? " selected" : "");
      btn.innerHTML = `<span class="title">${isTr ? v.name_tr : v.name_en}</span>
        <span class="sub">${v.dose_krad} krad · ${v.ext_temp_min_c}°C / +${v.ext_temp_max_c}°C</span>`;
      btn.onclick = () => { state.orbit = k; state.seuStatusText = ""; updateAll(); };
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
    stormBtn.textContent = state.solarStorm ? dict.btn_storm : dict.btn_storm_off;
    stormBtn.classList.toggle("active", state.solarStorm);

    const spoofBtn = document.getElementById("btn-spoof");
    spoofBtn.textContent = state.spoofAttack ? dict.btn_spoof_on : dict.btn_spoof;
    spoofBtn.classList.toggle("active", state.spoofAttack);

    document.getElementById("btn-explode").classList.toggle("active", state.exploded);
  }

  function updateAll() {
    renderOptions();
    updateI18n();
    const res = window.AegisCore.evaluateMission(state.chassis, state.avionics, state.orbit, state.solarStorm, state.spoofAttack);
    state.lastResult = res;

    const sv = document.getElementById("val-survival");
    sv.textContent = `${res.survival_score_pct}%`;
    sv.className = "k-val " + (res.survival_score_pct >= 90 ? "k-good" : res.survival_score_pct >= 55 ? "k-warn" : "k-bad");

    const seu = document.getElementById("val-seu");
    seu.textContent = `${res.bit_flips_per_day}`;
    seu.className = "k-val " + (res.bit_flips_per_day === 0 ? "k-good" : "k-bad");

    document.getElementById("val-sram").textContent = res.weight_sram_bytes === 0 ? "0 B (24B PROM)" : `${(res.weight_sram_bytes / 1e6).toFixed(0)} MB`;
    document.getElementById("val-temp").textContent = `${res.internal_min_temp_c} °C`;
    document.getElementById("val-mass").textContent = `${res.payload_margin_g} g`;
    document.getElementById("val-power").textContent = `${res.power_w} W / $${res.total_cost_usd.toLocaleString()}`;
    document.getElementById("val-adcs").textContent = `${res.adcs.energy_damped_pct}% (μ=0.75)`;

    const guardEl = document.getElementById("val-guard");
    if (state.spoofAttack) {
      guardEl.textContent = res.avionics === "WERR_24B_FNS" ? "VETOED & ISOLATED" : "COMPROMISED!";
      guardEl.className = "k-val " + (res.avionics === "WERR_24B_FNS" ? "k-good" : "k-bad");
    } else {
      guardEl.textContent = "NOMINAL (γ < 0.585)";
      guardEl.className = "k-val k-good";
    }

    document.getElementById("werr24-hex").textContent = res.werr24_hex;
    document.getElementById("seu-status").textContent = state.seuStatusText || (state.lang === "tr" ? "CRC-16/CCITT-FALSE: GEÇERLİ (0 bit hatası)" : "CRC-16/CCITT-FALSE: VALID (0 bit errors)");

    const badgesEl = document.getElementById("badges-wrap");
    badgesEl.innerHTML = "";
    res.badges.forEach((b) => {
      const span = document.createElement("span");
      span.className = "badge-chip";
      span.textContent = "★ " + b;
      badgesEl.appendChild(span);
    });

    document.getElementById("hud-status").textContent = `S(f) = ${res.adcs.schwarzian_bound} < 0 | Mode 1: ${window.AegisCore.CHASSIS_SPECS[state.chassis].mode1_hz} Hz`;

    updateThreeColors(res);
    drawAdcsChart(res.adcs);
    drawFlightChart();
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

    const swEl = document.getElementById("sw-status");
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
      if (swData) {
        const pcScene = swData.planetary_computer_latest_scene || ((snapJson && snapJson.planetary_computer_corridor) || [])[0];
        const meteo = snapJson && snapJson.meteomatics_launch_weather && snapJson.meteomatics_launch_weather.arslankoy_mersin;
        let html = `<strong>${swData.source || "NOAA SWPC Live"}</strong><br/>GOES &ge;10 MeV: <code>${swData.goes_proton_10mev_pfu} pfu</code> · Kp: <code>${swData.kp_index}</code>`;
        if (pcScene && pcScene.id) {
          html += `<br/>Planetary Computer STAC: <code>${pcScene.id.slice(0, 26)}…</code>`;
        }
        if (meteo && meteo["t_2m:C"] !== undefined) {
          html += `<br/>Meteomatics Arslanköy: <code>${meteo["t_2m:C"]}°C</code> · Wind <code>${meteo["wind_speed_100m:ms"]} m/s</code>`;
        }
        swEl.innerHTML = html;
      }
    } catch (_) {
      swEl.textContent = "Offline SPENVIS / OMNIWeb Envelope Active";
    }
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
    document.getElementById("btn-spoof").onclick = () => {
      state.spoofAttack = !state.spoofAttack;
      updateAll();
    };
    document.getElementById("btn-explode").onclick = () => {
      state.exploded = !state.exploded;
      updateAll();
    };
    document.getElementById("btn-tumble").onclick = () => {
      state.tumbleOmegaVisual = 24.0;
    };
    document.getElementById("btn-seu").onclick = () => {
      if (!state.lastResult) return;
      const corrupted = new Uint8Array(state.lastResult.werr24_bytes);
      const bitIdx = Math.floor(Math.random() * 192);
      corrupted[Math.floor(bitIdx / 8)] ^= 1 << (bitIdx % 8);
      const valid = window.AegisCore.verifyWerr24FrameBytes(corrupted);
      document.getElementById("werr24-hex").textContent = window.AegisCore.bytesToHex(corrupted);
      state.seuStatusText = state.lang === "tr"
        ? `SEU Bit #${bitIdx} bozuldu -> CRC-16 YAKALADI (valid=${valid}), 0 B Ağırlık SRAM Etkilenmedi!`
        : `SEU Bit #${bitIdx} flipped -> CRC-16 TRAPPED (valid=${valid}), 0 B Weight SRAM Uncorrupted!`;
      document.getElementById("seu-status").textContent = state.seuStatusText;
    };

    initThree();
    updateAll();
    loadExternalData();
  });
})();
