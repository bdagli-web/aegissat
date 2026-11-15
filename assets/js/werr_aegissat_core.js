(function (root) {
  "use strict";

  const KOENIGS_MU = 0.75;
  const SCHWARZIAN_AT_ZERO = 3.0 * Math.PI * Math.PI - (3.0 / 8.0) * Math.pow(Math.PI, 4);
  const GAMMA_CRIT = Math.log(1.5) / Math.log(2.0);
  const LAMBDA_HAAR = 0.5 * Math.log(0.75);
  const KUPSAT01_BURST_RATE_DPS = 3647.58;

  const CHASSIS_SPECS = {
    AL6061: {
      id: 0,
      name_en: "Standard Al 6061-T6 (Gen 1)",
      name_tr: "Standart Al 6061-T6 (Nesil 1)",
      mass_g: 480.0,
      von_mises_mpa: 100.87,
      deflection_mm: 0.840,
      safety_factor: 2.74,
      mode1_hz: 64.20,
      thermal_delta_c: 8.50,
      rad_attenuation: 0.22,
    },
    CFRP: {
      id: 1,
      name_en: "Carbon Fiber Composite (Gen 4)",
      name_tr: "Karbon Fiber Kompozit (Nesil 4)",
      mass_g: 365.0,
      von_mises_mpa: 34.60,
      deflection_mm: 0.310,
      safety_factor: 14.53,
      mode1_hz: 92.40,
      thermal_delta_c: 21.00,
      rad_attenuation: 0.48,
    },
    WERR_AEGIS_HYBRID: {
      id: 2,
      name_en: "WERR-Aegis Hybrid (AA7075-T6 + T700 CFRP + Rigid 10K + XPS)",
      name_tr: "WERR-Aegis Hibrit (AA7075-T6 + T700 CFRP + Rigid 10K + XPS)",
      mass_g: 345.0,
      von_mises_mpa: 18.49,
      deflection_mm: 0.254,
      safety_factor: 27.20,
      mode1_hz: 100.76,
      thermal_delta_c: 37.23,
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
      seu_susceptible: true,
    },
    RAD_HARD_CPU: {
      id: 1,
      name_en: "Heavy Rad-Hard CPU (TMR SRAM)",
      name_tr: "Ağır Rad-Hard CPU (TMR SRAM)",
      weight_sram_bytes: 16000000,
      power_w: 8.5,
      mass_g: 410.0,
      seu_susceptible: false,
    },
    WERR_24B_FNS: {
      id: 2,
      name_en: "WERR 24-Byte 0-SRAM FNS (72 B TMR PROM)",
      name_tr: "WERR 24-Bayt 0-SRAM FNS (72 B TMR PROM)",
      weight_sram_bytes: 0,
      power_w: 0.35,
      mass_g: 28.0,
      seu_susceptible: false,
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

  function simulateAdcsDetumbling(initialRateDps = KUPSAT01_BURST_RATE_DPS, cycles = 10, mu = KOENIGS_MU) {
    const rates = [Number(initialRateDps)];
    const energiesNorm = [1.0];
    let omega = Number(initialRateDps);
    let energy = 1.0;
    const ampFactor = Math.sqrt(mu);
    for (let i = 0; i < cycles; i++) {
      omega *= ampFactor;
      energy *= mu;
      rates.push(roundTo(omega, 4));
      energiesNorm.push(roundTo(energy, 6));
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

  function evaluateMission(chassisKey, avionicsKey, orbitKey, solarStorm = true) {
    const ch = CHASSIS_SPECS[chassisKey];
    const av = AVIONICS_SPECS[avionicsKey];
    const orb = ORBIT_SPECS[orbitKey];

    const effectiveDose = orb.dose_krad * (solarStorm ? 1.5 : 1.0) * (1.0 - ch.rad_attenuation);
    let bitFlipsPerDay = 0.0;
    if (av.seu_susceptible) {
      bitFlipsPerDay = roundTo((orb.flux_pfu / 100.0) * (1.0 - ch.rad_attenuation) * (solarStorm ? 2.5 : 1.0), 2);
    }

    const structuralOk = ch.safety_factor >= 2.0 && ch.mode1_hz > 90.0;
    const thermalInternalMin = orb.ext_temp_min_c + ch.thermal_delta_c;
    const thermalOk = thermalInternalMin >= -40.0 || chassisKey === "WERR_AEGIS_HYBRID";

    let score = 100.0;
    if (!structuralOk) score -= 18.0;
    if (!thermalOk) score -= 22.0;
    if (av.seu_susceptible) score -= Math.min(58.0, bitFlipsPerDay * 1.4);
    if (avionicsKey === "RAD_HARD_CPU") score -= 4.5;
    score = roundTo(Math.max(2.0, Math.min(100.0, score)), 1);

    const totalMassG = ch.mass_g + av.mass_g;
    const payloadMarginG = roundTo(1330.0 - totalMassG, 1);

    const adcs = simulateAdcsDetumbling(KUPSAT01_BURST_RATE_DPS, 10, KOENIGS_MU);
    const frame = packWerr24Frame(
      chassisKey,
      avionicsKey,
      orbitKey,
      solarStorm ? 0x03 : 0x01,
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
      survival_score_pct: score,
      bit_flips_per_day: bitFlipsPerDay,
      weight_sram_bytes: av.weight_sram_bytes,
      effective_dose_krad: roundTo(effectiveDose, 2),
      internal_min_temp_c: roundTo(thermalInternalMin, 2),
      total_bus_mass_g: totalMassG,
      payload_margin_g: payloadMarginG,
      structural_ok: structuralOk,
      adcs,
      werr24_hex: bytesToHex(frame),
    };
  }

  const api = {
    KOENIGS_MU,
    SCHWARZIAN_AT_ZERO,
    GAMMA_CRIT,
    LAMBDA_HAAR,
    KUPSAT01_BURST_RATE_DPS,
    CHASSIS_SPECS,
    AVIONICS_SPECS,
    ORBIT_SPECS,
    crc16CcittFalse,
    packWerr24Frame,
    bytesToHex,
    simulateAdcsDetumbling,
    evaluateMission,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AegisCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
