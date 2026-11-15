(function (root) {
  "use strict";

  const KOENIGS_MU = 0.75;
  const LINEAR_PID_MU = 0.905;
  const SEU_DEGRADED_MU = 0.965;
  const SCHWARZIAN_AT_ZERO = 3.0 * Math.PI * Math.PI - (3.0 / 8.0) * Math.pow(Math.PI, 4);
  const GAMMA_CRIT = Math.log(1.5) / Math.log(2.0);
  const LAMBDA_HAAR = 0.5 * Math.log(0.75);
  const JULIA_REPELLER_MIN = 2.4046;
  const KUPSAT01_BURST_RATE_DPS = 3647.58;

  const CHASSIS_SPECS = {
    AL6061: {
      id: 0,
      name_en: "Standard Al 6061-T6 (Gen 1)",
      name_tr: "Standart Al 6061-T6 (Nesil 1)",
      mass_g: 480.0,
      cost_usd: 2400,
      von_mises_mpa: 100.87,
      deflection_mm: 0.840,
      safety_factor: 2.74,
      mode1_hz: 64.20,
      thermal_delta_c: 8.50,
      mli_heater_regulated: false,
      rad_attenuation: 0.22,
    },
    CFRP: {
      id: 1,
      name_en: "Carbon Fiber Composite (Gen 4)",
      name_tr: "Karbon Fiber Kompozit (Nesil 4)",
      mass_g: 365.0,
      cost_usd: 4800,
      von_mises_mpa: 34.60,
      deflection_mm: 0.310,
      safety_factor: 14.53,
      mode1_hz: 92.40,
      thermal_delta_c: 21.00,
      mli_heater_regulated: false,
      rad_attenuation: 0.48,
    },
    WERR_AEGIS_HYBRID: {
      id: 2,
      name_en: "WERR-Aegis Hybrid (AA7075-T6 + T700 CFRP + Rigid 10K + XPS)",
      name_tr: "WERR-Aegis Hibrit (AA7075-T6 + T700 CFRP + Rigid 10K + XPS)",
      mass_g: 345.0,
      cost_usd: 6500,
      von_mises_mpa: 18.49,
      deflection_mm: 0.254,
      safety_factor: 27.20,
      mode1_hz: 100.76,
      thermal_delta_c: 37.23,
      mli_heater_regulated: true,
      rad_attenuation: 0.84,
    },
  };

  const AVIONICS_SPECS = {
    ARM_SRAM: {
      id: 0,
      name_en: "Standard ARM Cortex / Linux (SRAM Weights)",
      name_tr: "Standart ARM Cortex / Linux (SRAM Ağırlıklar)",
      weight_sram_bytes: 64000000,
      power_w: 4.2,
      mass_g: 120.0,
      cost_usd: 1200,
      seu_susceptible: true,
      adcs_mode: "LINEAR_PID",
    },
    RAD_HARD_CPU: {
      id: 1,
      name_en: "Heavy Rad-Hard CPU (TMR SRAM)",
      name_tr: "Ağır Rad-Hard CPU (TMR SRAM)",
      weight_sram_bytes: 16000000,
      power_w: 8.5,
      mass_g: 410.0,
      cost_usd: 38000,
      seu_susceptible: false,
      adcs_mode: "LINEAR_PID",
    },
    WERR_24B_FNS: {
      id: 2,
      name_en: "WERR 24-Byte 0-SRAM FNS (72 B TMR PROM)",
      name_tr: "WERR 24-Bayt 0-SRAM FNS (72 B TMR PROM)",
      weight_sram_bytes: 0,
      power_w: 0.35,
      mass_g: 28.0,
      cost_usd: 1800,
      seu_susceptible: false,
      adcs_mode: "WERR_SCHWARZIAN_KOENIGS",
    },
  };

  const ORBIT_SPECS = {
    STRATOSPHERE: {
      id: 0,
      name_en: "KÜPSAT-01 Stratosphere (25.64 km, 22.51 hPa)",
      name_tr: "KÜPSAT-01 Stratosfer (25.64 km, 22.51 hPa)",
      dose_krad: 0.2,
      flux_pfu: 12.0,
      ext_temp_min_c: -54.5,
      ext_temp_max_c: 34.7,
      launch_grms: 14.1,
    },
    LEO: {
      id: 1,
      name_en: "Low Earth Orbit (LEO 550 km, SAA Transit)",
      name_tr: "Alçak Dünya Yörüngesi (LEO 550 km, SAA Geçişi)",
      dose_krad: 12.0,
      flux_pfu: 450.0,
      ext_temp_min_c: -65.0,
      ext_temp_max_c: 85.0,
      launch_grms: 14.1,
    },
    LUNAR_ARTEMIS: {
      id: 2,
      name_en: "Artemis Lunar Transfer (Van Allen + Solar Storm)",
      name_tr: "Artemis Ay Transferi (Van Allen + Güneş Fırtınası)",
      dose_krad: 45.0,
      flux_pfu: 4200.0,
      ext_temp_min_c: -150.0,
      ext_temp_max_c: 120.0,
      launch_grms: 14.1,
    },
    MARS_DEEP_SPACE: {
      id: 3,
      name_en: "Mars Deep Space (GCR + X-Class SEP Event)",
      name_tr: "Mars Derin Uzay (GCR + X-Sınıfı SEP Olayı)",
      dose_krad: 85.0,
      flux_pfu: 12000.0,
      ext_temp_min_c: -150.0,
      ext_temp_max_c: 120.0,
      launch_grms: 14.1,
    },
  };

  const LAUNCH_SPECS = {
    STRATO_BALLOON: {
      id: 0,
      name_en: "KÜPSAT-01 Stratospheric Balloon ($1.5k)",
      name_tr: "KÜPSAT-01 Stratosferik Balon ($1.5k)",
      max_mass_g: 1330.0,
      cost_usd: 1500,
      allowed_orbits: ["STRATOSPHERE"],
      max_grms: 6.0,
    },
    SMALL_RIDESHARE: {
      id: 1,
      name_en: "SmallSat LEO Rideshare / Electron ($18k)",
      name_tr: "SmallSat LEO Paylaşımlı / Electron ($18k)",
      max_mass_g: 1330.0,
      cost_usd: 18000,
      allowed_orbits: ["STRATOSPHERE", "LEO"],
      max_grms: 14.1,
    },
    CISLUNAR_RIDESHARE: {
      id: 2,
      name_en: "Artemis Cislunar Rideshare / Falcon-SLS ($42k)",
      name_tr: "Artemis Ay Yörüngesi / Falcon-SLS ($42k)",
      max_mass_g: 1330.0,
      cost_usd: 42000,
      allowed_orbits: ["STRATOSPHERE", "LEO", "LUNAR_ARTEMIS"],
      max_grms: 14.1,
    },
    DEEP_SPACE_ESCORT: {
      id: 3,
      name_en: "Deep-Space Escort / Falcon Heavy-Vulcan ($68k)",
      name_tr: "Derin Uzay Fırlatma / Falcon Heavy ($68k)",
      max_mass_g: 1330.0,
      cost_usd: 68000,
      allowed_orbits: ["STRATOSPHERE", "LEO", "LUNAR_ARTEMIS", "MARS_DEEP_SPACE"],
      max_grms: 14.1,
    },
  };

  const EPS_SPECS = {
    BODY_SOLAR: {
      id: 0,
      name_en: "Body-Mounted Si Panels + Li-Ion",
      name_tr: "Gövde Üstü Si Panel + Li-Ion",
      mass_g: 145.0,
      power_gen_1au_w: 3.40,
      cost_usd: 1200,
    },
    DEPLOY_WINGS: {
      id: 1,
      name_en: "Deployable 1U Triple-Junction Wings",
      name_tr: "Açılır 1U Üç-Eklemli Güneş Kanatları",
      mass_g: 230.0,
      power_gen_1au_w: 8.60,
      cost_usd: 4200,
    },
    DEEP_SPACE_GAAS: {
      id: 2,
      name_en: "Concentrator GaAs + Solid-State Battery",
      name_tr: "Yoğunlaştırıcı GaAs + Katı-Hal Batarya",
      mass_g: 285.0,
      power_gen_1au_w: 14.80,
      cost_usd: 7800,
    },
  };

  const COMM_SPECS = {
    UHF_9K6: {
      id: 0,
      name_en: "UHF Whip Transceiver (9.6 kbps)",
      name_tr: "UHF Anten Alıcı-Verici (9.6 kbps)",
      mass_g: 65.0,
      power_w: 0.35,
      cost_usd: 900,
      rate_mb_day_leo: 14.0,
      deep_space_mult: 0.08,
    },
    SBAND_PATCH: {
      id: 1,
      name_en: "S-Band Patch Array (256 kbps)",
      name_tr: "S-Band Yama Anten Dizisi (256 kbps)",
      mass_g: 110.0,
      power_w: 1.20,
      cost_usd: 3200,
      rate_mb_day_leo: 220.0,
      deep_space_mult: 0.25,
    },
    OPTICAL_KA: {
      id: 2,
      name_en: "Ka / Optical Laser Terminal (2.0 Mbps)",
      name_tr: "Ka / Optik Lazer Terminali (2.0 Mbps)",
      mass_g: 165.0,
      power_w: 2.10,
      cost_usd: 6800,
      rate_mb_day_leo: 900.0,
      deep_space_mult: 0.45,
    },
  };

  const PAYLOAD_SPECS = {
    WERR_DOSIMETER: {
      id: 0,
      name_en: "Radiation Particle Dosimeter",
      name_tr: "Radyasyon Parçacık Dozimetresi",
      mass_g: 85.0,
      power_w: 0.25,
      cost_usd: 1500,
      data_mb_day: 2.0,
      science_pts: 24,
    },
    LASER_BEACON: {
      id: 1,
      name_en: "Deep-Space Optical Nav Beacon",
      name_tr: "Derin Uzay Optik Seyrüsefer İşaretçisi",
      mass_g: 110.0,
      power_w: 0.45,
      cost_usd: 2600,
      data_mb_day: 6.0,
      science_pts: 28,
    },
    MAG_PLASMA: {
      id: 2,
      name_en: "Magnetometer & Plasma Suite",
      name_tr: "Manyetometre & Plazma Paketi",
      mass_g: 155.0,
      power_w: 0.85,
      cost_usd: 3400,
      data_mb_day: 16.0,
      science_pts: 32,
    },
    OPTICAL_CAM: {
      id: 3,
      name_en: "Planetary Optical Terrain Imager",
      name_tr: "Gezegensel Optik Yüzey Kamerası",
      mass_g: 215.0,
      power_w: 1.40,
      cost_usd: 4200,
      data_mb_day: 48.0,
      science_pts: 38,
    },
    UV_SPECTRO: {
      id: 4,
      name_en: "UV/IR Atmospheric Spectrometer",
      name_tr: "UV/IR Atmosfer Spektrometresi",
      mass_g: 265.0,
      power_w: 1.90,
      cost_usd: 5900,
      data_mb_day: 120.0,
      science_pts: 46,
    },
  };

  const SCENARIO_SPECS = {
    CADET_STRATO: {
      id: 0,
      name_en: "Level 1 · Cadet (Stratosphere Probe)",
      name_tr: "Seviye 1 · Aday (Stratosfer Sondası)",
      orbit: "STRATOSPHERE",
      launch: "STRATO_BALLOON",
      budget_usd: 22000,
      min_science_pts: 40,
      storm: false,
      spoof: false,
    },
    ENGINEER_LUNAR: {
      id: 1,
      name_en: "Level 2 · Flight Engineer (Artemis Moon)",
      name_tr: "Seviye 2 · Uçuş Mühendisi (Artemis Ay)",
      orbit: "LUNAR_ARTEMIS",
      launch: "CISLUNAR_RIDESHARE",
      budget_usd: 74000,
      min_science_pts: 65,
      storm: true,
      spoof: false,
    },
    PI_MARS: {
      id: 2,
      name_en: "Level 3 · Principal Investigator (Mars Deep Space)",
      name_tr: "Seviye 3 · Baş Araştırmacı (Mars Derin Uzay)",
      orbit: "MARS_DEEP_SPACE",
      launch: "DEEP_SPACE_ESCORT",
      budget_usd: 98000,
      min_science_pts: 85,
      storm: true,
      spoof: true,
    },
    SANDBOX: {
      id: 3,
      name_en: "Sandbox · Free Engineering Twin",
      name_tr: "Serbest Mod · Açık Mühendislik İkizi",
      orbit: "MARS_DEEP_SPACE",
      launch: "DEEP_SPACE_ESCORT",
      budget_usd: 250000,
      min_science_pts: 0,
      storm: true,
      spoof: false,
    },
  };

  function crc16CcittFalse(bytes) {
    let crc = 0xffff;
    for (let i = 0; i < bytes.length; i++) {
      crc ^= bytes[i] << 8;
      for (let b = 0; b < 8; b++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }
    return crc;
  }

  function packWerr24Frame(chassisKey, avionicsKey, orbitKey, flags, seedCx, seedCy, seedZoom, angularRateDps, tempC) {
    const buf = new ArrayBuffer(24);
    const view = new DataView(buf);
    view.setUint8(0, CHASSIS_SPECS[chassisKey].id);
    view.setUint8(1, AVIONICS_SPECS[avionicsKey].id);
    view.setUint8(2, ORBIT_SPECS[orbitKey].id);
    view.setUint8(3, flags & 0xff);
    view.setFloat32(4, seedCx, false);
    view.setFloat32(8, seedCy, false);
    view.setFloat32(12, seedZoom, false);
    view.setFloat32(16, angularRateDps, false);
    const tempDeci = Math.max(-32768, Math.min(32767, Math.round(tempC * 10.0)));
    view.setInt16(20, tempDeci, false);
    const body = new Uint8Array(buf, 0, 22);
    const crc = crc16CcittFalse(body);
    view.setUint16(22, crc, false);
    return new Uint8Array(buf);
  }

  function verifyWerr24FrameBytes(bytes) {
    if (!bytes || bytes.length !== 24) return false;
    const body = bytes.slice(0, 22);
    const rxCrc = (bytes[22] << 8) | bytes[23];
    return crc16CcittFalse(body) === rxCrc;
  }

  function bytesToHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.length; i++) {
      out += bytes[i].toString(16).padStart(2, "0");
    }
    return out;
  }

  function roundTo(val, digits) {
    const p = Math.pow(10, digits);
    return Math.round((val + Number.EPSILON) * p) / p;
  }

  function simulateAdcsDetumbling(initialRateDps = KUPSAT01_BURST_RATE_DPS, cycles = 10, mu = KOENIGS_MU, massG = 373.0) {
    const massKg = massG / 1000.0;
    const ix = (massKg / 12.0) * (0.10 * 0.10 + 0.1135 * 0.1135);
    const iy = ix;
    const iz = (massKg / 12.0) * (0.10 * 0.10 + 0.10 * 0.10);

    const wMagRad = (Number(initialRateDps) * Math.PI) / 180.0;
    let wx = wMagRad * 0.72;
    let wy = wMagRad * 0.52;
    let wz = wMagRad * Math.sqrt(Math.max(0.0, 1.0 - 0.72 * 0.72 - 0.52 * 0.52));

    const rotEnergy = (vx, vy, vz) => 0.5 * (ix * vx * vx + iy * vy * vy + iz * vz * vz);
    const e0 = rotEnergy(wx, wy, wz);
    const rates = [roundTo(Number(initialRateDps), 4)];
    const energiesNorm = [1.0];

    const substeps = 20;
    const subDt = 0.05 / substeps;
    const ampFactor = Math.sqrt(mu);

    for (let c = 0; c < cycles; c++) {
      for (let s = 0; s < substeps; s++) {
        const hx = ix * wx, hy = iy * wy, hz = iz * wz;
        const gx = -(wy * hz - wz * hy) / ix;
        const gy = -(wz * hx - wx * hz) / iy;
        const gz = -(wx * hy - wy * hx) / iz;
        wx += gx * subDt;
        wy += gy * subDt;
        wz += gz * subDt;
      }
      const curE = rotEnergy(wx, wy, wz);
      const scale = ampFactor * Math.sqrt((energiesNorm[energiesNorm.length - 1] * e0) / Math.max(curE, 1e-18));
      wx *= scale;
      wy *= scale;
      wz *= scale;

      const curRateDps = (Math.sqrt(wx * wx + wy * wy + wz * wz) * 180.0) / Math.PI;
      const curENorm = rotEnergy(wx, wy, wz) / Math.max(e0, 1e-18);
      rates.push(roundTo(curRateDps, 4));
      energiesNorm.push(roundTo(curENorm, 6));
    }

    const dampedPct = roundTo((1.0 - energiesNorm[energiesNorm.length - 1]) * 100.0, 2);
    return {
      initial_rate_dps: initialRateDps,
      final_rate_dps: rates[rates.length - 1],
      cycles,
      mu,
      schwarzian_bound: roundTo(SCHWARZIAN_AT_ZERO, 4),
      energy_damped_pct: dampedPct,
      rates_dps: rates,
      normalized_energy: energiesNorm,
    };
  }

  function evaluateAiWatchdog(candidateRatio) {
    const vetoed = Math.abs(candidateRatio) >= JULIA_REPELLER_MIN;
    return {
      candidate_ratio: roundTo(candidateRatio, 4),
      julia_repeller_min: JULIA_REPELLER_MIN,
      vetoed,
      applied_ratio: roundTo(vetoed ? KOENIGS_MU : candidateRatio, 4),
    };
  }

  function evaluateSpoofingBarrier(nOdd, nEven) {
    const ratio = nOdd / Math.max(1, nEven);
    const drift = -nEven * Math.log(2.0) + nOdd * Math.log(1.5);
    return {
      n_odd: nOdd,
      n_even: nEven,
      parity_ratio: roundTo(ratio, 4),
      gamma_crit: roundTo(GAMMA_CRIT, 5),
      lambda_haar: roundTo(LAMBDA_HAAR, 6),
      lyapunov_drift: roundTo(drift, 4),
      spoofing_isolated: ratio > GAMMA_CRIT,
    };
  }

  function computeInternalMinTemp(chassisKey, orbitKey) {
    const ch = CHASSIS_SPECS[chassisKey];
    const orb = ORBIT_SPECS[orbitKey];
    const passiveTemp = orb.ext_temp_min_c + ch.thermal_delta_c;
    const internalMin = (ch.mli_heater_regulated && passiveTemp < -24.5) ? -24.5 : passiveTemp;
    return { internalMin: roundTo(internalMin, 2), thermalOk: internalMin >= -30.0 };
  }

  function evaluateMission(chassisKey, avionicsKey, orbitKey, solarStorm = true, spoofAttack = false) {
    const ch = CHASSIS_SPECS[chassisKey];
    const av = AVIONICS_SPECS[avionicsKey];
    const orb = ORBIT_SPECS[orbitKey];

    const effectiveDose = orb.dose_krad * (solarStorm ? 1.5 : 1.0) * (1.0 - ch.rad_attenuation);
    let bitFlipsPerDay = 0.0;
    if (av.seu_susceptible) {
      bitFlipsPerDay = roundTo((orb.flux_pfu / 100.0) * (1.0 - ch.rad_attenuation) * (solarStorm ? 2.5 : 1.0), 2);
    }

    const structuralOk = ch.safety_factor >= 2.0 && ch.mode1_hz > 90.0;
    const { internalMin: thermalInternalMin, thermalOk } = computeInternalMinTemp(chassisKey, orbitKey);

    const spoofing = evaluateSpoofingBarrier(spoofAttack ? 9 : 2, 10);
    const spoofingMitigated = !spoofAttack || avionicsKey === "WERR_24B_FNS";

    let score = 100.0;
    if (!structuralOk) score -= 18.0;
    if (!thermalOk) score -= 22.0;
    if (av.seu_susceptible) score -= Math.min(58.0, bitFlipsPerDay * 1.4);
    if (avionicsKey === "RAD_HARD_CPU") score -= 4.5;
    if (spoofAttack && !spoofingMitigated) score -= 25.0;
    score = roundTo(Math.max(2.0, Math.min(100.0, score)), 1);

    const totalMassG = ch.mass_g + av.mass_g;
    const payloadMarginG = roundTo(1330.0 - totalMassG, 1);
    const totalCostUsd = ch.cost_usd + av.cost_usd;

    let muEff = LINEAR_PID_MU;
    if (av.adcs_mode === "WERR_SCHWARZIAN_KOENIGS") {
      muEff = KOENIGS_MU;
    } else if (av.seu_susceptible && solarStorm && bitFlipsPerDay > 5.0) {
      muEff = SEU_DEGRADED_MU;
    }

    const adcs = simulateAdcsDetumbling(KUPSAT01_BURST_RATE_DPS, 10, muEff, totalMassG);
    adcs.baseline_pid_energies = simulateAdcsDetumbling(KUPSAT01_BURST_RATE_DPS, 10, LINEAR_PID_MU, totalMassG).normalized_energy;
    const watchdog = evaluateAiWatchdog(spoofAttack ? 2.65 : 0.75);

    const badges = [];
    if (av.weight_sram_bytes === 0) badges.push("Zero-SRAM Survivor");
    if (structuralOk) badges.push("GEVS 14.1 Grms Qualified");
    if (adcs.energy_damped_pct >= 94.0) badges.push("Schwarzian Detumbler");
    if (score >= 95.0) badges.push("Artemis Flight Ready");

    const heaterPower = (ch.mli_heater_regulated && orb.ext_temp_min_c < -80.0) ? 0.50 : 0.0;
    const totalPowerW = roundTo(av.power_w + heaterPower, 2);

    const flags = (solarStorm ? 0x03 : 0x01) | (spoofAttack ? 0x04 : 0x00);
    const frame = packWerr24Frame(
      chassisKey,
      avionicsKey,
      orbitKey,
      flags,
      -0.745429,
      0.113008,
      1.60,
      adcs.final_rate_dps,
      thermalInternalMin
    );

    return {
      chassis: chassisKey,
      avionics: avionicsKey,
      orbit: orbitKey,
      solar_storm: solarStorm,
      spoof_attack: spoofAttack,
      survival_score_pct: score,
      bit_flips_per_day: bitFlipsPerDay,
      weight_sram_bytes: av.weight_sram_bytes,
      power_w: totalPowerW,
      total_cost_usd: totalCostUsd,
      effective_dose_krad: roundTo(effectiveDose, 2),
      internal_min_temp_c: thermalInternalMin,
      thermal_ok: thermalOk,
      total_bus_mass_g: totalMassG,
      payload_margin_g: payloadMarginG,
      structural_ok: structuralOk,
      adcs,
      watchdog,
      spoofing,
      badges,
      werr24_bytes: Array.from(frame),
      werr24_hex: bytesToHex(frame),
    };
  }

  function orbitSolarFactor(orbitKey) {
    return ({ STRATOSPHERE: 0.92, LEO: 1.0, LUNAR_ARTEMIS: 1.0, MARS_DEEP_SPACE: 0.45 })[orbitKey] || 1.0;
  }

  function orbitCommFactor(orbitKey, commSpec) {
    if (orbitKey === "STRATOSPHERE" || orbitKey === "LEO") return 1.0;
    if (orbitKey === "LUNAR_ARTEMIS") return Math.min(1.0, commSpec.deep_space_mult * 2.2);
    return commSpec.deep_space_mult;
  }

  function orbitScienceMult(orbitKey) {
    return ({ STRATOSPHERE: 0.85, LEO: 1.0, LUNAR_ARTEMIS: 1.2, MARS_DEEP_SPACE: 1.35 })[orbitKey] || 1.0;
  }

  function evaluateGameMission(
    chassisKey = "WERR_AEGIS_HYBRID",
    avionicsKey = "WERR_24B_FNS",
    orbitKey = "MARS_DEEP_SPACE",
    solarStorm = true,
    spoofAttack = false,
    launchKey = "DEEP_SPACE_ESCORT",
    epsKey = "DEPLOY_WINGS",
    commKey = "SBAND_PATCH",
    payloadKeys = ["WERR_DOSIMETER", "LASER_BEACON", "MAG_PLASMA"],
    scenarioKey = "PI_MARS"
  ) {
    const base = evaluateMission(chassisKey, avionicsKey, orbitKey, solarStorm, spoofAttack);
    const lv = LAUNCH_SPECS[launchKey];
    const eps = EPS_SPECS[epsKey];
    const cm = COMM_SPECS[commKey];
    const sc = SCENARIO_SPECS[scenarioKey];

    const uniquePayloads = [];
    (payloadKeys || []).forEach((k) => {
      if (PAYLOAD_SPECS[k] && uniquePayloads.indexOf(k) === -1) uniquePayloads.push(k);
    });

    let payMass = 0, payPower = 0, payCost = 0, payData = 0, rawScience = 0;
    uniquePayloads.forEach((k) => {
      const p = PAYLOAD_SPECS[k];
      payMass += p.mass_g;
      payPower += p.power_w;
      payCost += p.cost_usd;
      payData += p.data_mb_day;
      rawScience += p.science_pts;
    });

    const totalMassG = roundTo(base.total_bus_mass_g + eps.mass_g + cm.mass_g + payMass, 1);
    const totalCostUsd = Math.round(base.total_cost_usd + eps.cost_usd + cm.cost_usd + payCost + lv.cost_usd);
    const powerLoadW = roundTo(base.power_w + cm.power_w + payPower, 2);
    const powerGenW = roundTo(eps.power_gen_1au_w * orbitSolarFactor(orbitKey), 2);
    const powerMarginW = roundTo(powerGenW - powerLoadW, 2);

    const dataCapMbDay = roundTo(cm.rate_mb_day_leo * orbitCommFactor(orbitKey, cm), 2);
    const dataGenMbDay = roundTo(payData, 2);
    const dataMarginMbDay = roundTo(dataCapMbDay - dataGenMbDay, 2);

    const massOk = totalMassG <= lv.max_mass_g;
    const launchOk = (lv.allowed_orbits.indexOf(orbitKey) !== -1) && (base.structural_ok || lv.max_grms < 10.0);
    const powerOk = powerMarginW >= 0.0;
    const commOk = (dataMarginMbDay >= 0.0) && (uniquePayloads.length > 0);
    const budgetOk = scenarioKey === "SANDBOX" ? true : (totalCostUsd <= sc.budget_usd);
    const thermalOk = !!base.thermal_ok;
    const radCyberOk = (base.bit_flips_per_day === 0.0) && ((!spoofAttack) || avionicsKey === "WERR_24B_FNS");

    const sciencePts = uniquePayloads.length > 0 ? Math.round(rawScience * orbitScienceMult(orbitKey)) : 0;
    const scienceOk = sciencePts >= sc.min_science_pts;

    const gates = {
      mass_ok: massOk,
      launch_ok: launchOk,
      power_ok: powerOk,
      comm_ok: commOk,
      budget_ok: budgetOk,
      thermal_ok: thermalOk,
      rad_cyber_ok: radCyberOk,
      science_ok: scienceOk,
    };
    const passedCount = Object.values(gates).filter(Boolean).length;

    let cmlLevel = 1;
    if (passedCount >= 8 && base.survival_score_pct >= 95.0) cmlLevel = 4;
    else if (passedCount >= 6 && launchOk && massOk) cmlLevel = 3;
    else if (uniquePayloads.length > 0 && launchOk) cmlLevel = 2;

    const survComp = base.survival_score_pct * 5.0;
    const sciComp = Math.min(250.0, sciencePts * 2.2);
    const effMass = massOk ? Math.max(0.0, (1330.0 - totalMassG) / 1330.0) * 100.0 : 0.0;
    const effBudget = budgetOk ? Math.max(0.0, (sc.budget_usd - totalCostUsd) / Math.max(1, sc.budget_usd)) * 100.0 : 0.0;
    let penalty = 0.0;
    if (!launchOk) penalty += 220.0;
    if (!massOk) penalty += 180.0;
    if (!powerOk) penalty += 170.0;
    if (!commOk) penalty += 120.0;
    if (!budgetOk) penalty += 110.0;

    const gameScore = Math.round(Math.max(20.0, Math.min(1000.0, survComp + sciComp + effMass + effBudget - penalty)));
    const missionSuccess = (passedCount === 8) && (base.survival_score_pct >= 85.0);

    return Object.assign({}, base, {
      scenario: scenarioKey,
      launch_vehicle: launchKey,
      eps: epsKey,
      comm: commKey,
      payloads: uniquePayloads,
      total_spacecraft_mass_g: totalMassG,
      total_mission_cost_usd: totalCostUsd,
      budget_usd: sc.budget_usd,
      power_gen_w: powerGenW,
      power_load_w: powerLoadW,
      power_margin_w: powerMarginW,
      data_cap_mb_day: dataCapMbDay,
      data_gen_mb_day: dataGenMbDay,
      data_margin_mb_day: dataMarginMbDay,
      science_points: sciencePts,
      min_science_pts: sc.min_science_pts,
      gates,
      gates_passed: passedCount,
      cml_level: cmlLevel,
      game_score: gameScore,
      mission_success: missionSuccess,
    });
  }

  const api = {
    KOENIGS_MU,
    LINEAR_PID_MU,
    SEU_DEGRADED_MU,
    SCHWARZIAN_AT_ZERO,
    GAMMA_CRIT,
    LAMBDA_HAAR,
    KUPSAT01_BURST_RATE_DPS,
    CHASSIS_SPECS,
    AVIONICS_SPECS,
    ORBIT_SPECS,
    LAUNCH_SPECS,
    EPS_SPECS,
    COMM_SPECS,
    PAYLOAD_SPECS,
    SCENARIO_SPECS,
    crc16CcittFalse,
    packWerr24Frame,
    verifyWerr24FrameBytes,
    bytesToHex,
    simulateAdcsDetumbling,
    evaluateAiWatchdog,
    evaluateSpoofingBarrier,
    computeInternalMinTemp,
    evaluateMission,
    evaluateGameMission,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AegisCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
