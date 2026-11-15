"""AegisSat Core Engine: WERR 24-Byte 0-SRAM Codec, IAC-26-C2.IPB.29 Structural/Thermal Model,
3-Axis Rigid-Body Euler ADCS (Negative Schwarzian + Koenigs), and Patent 2/3 Cyber-Physical Watchdog.
"""

from __future__ import annotations

import math
import struct
from typing import Dict, List, Tuple

FRAME_STRUCT = struct.Struct(">BBBBffffhH")
assert FRAME_STRUCT.size == 24

# WERR / Holomorphic Syracuse constants
KOENIGS_MU = 0.75
LINEAR_PID_MU = 0.905
SEU_DEGRADED_MU = 0.965
SCHWARZIAN_AT_ZERO = 3.0 * (math.pi ** 2) - (3.0 / 8.0) * (math.pi ** 4)  # -6.91957...
GAMMA_CRIT = math.log(1.5) / math.log(2.0)  # ~0.5849625
LAMBDA_HAAR = 0.5 * math.log(0.75)          # ~-0.1438410
KOENIGS_C2 = -6.5 * (math.pi ** 2)
KOENIGS_D2 = -4.5 * (math.pi ** 2)
JULIA_REPELLER_ORBIT = (2.4046, 3.0951)
JULIA_REPELLER_MU = 1.2148

# KÜPSAT-01 (7 Aug 2026) verified flight burst tumbling
KUPSAT01_BURST_RATE_DPS = 3647.58

CHASSIS_SPECS: Dict[str, Dict] = {
    "AL6061": {
        "id": 0,
        "name_en": "Standard Al 6061-T6 (Gen 1)",
        "name_tr": "Standart Al 6061-T6 (Nesil 1)",
        "mass_g": 480.0,
        "cost_usd": 2400,
        "von_mises_mpa": 100.87,
        "deflection_mm": 0.840,
        "safety_factor": 2.74,
        "mode1_hz": 64.20,
        "thermal_delta_c": 8.50,
        "mli_heater_regulated": False,
        "rad_attenuation": 0.22,
    },
    "CFRP": {
        "id": 1,
        "name_en": "Carbon Fiber Composite (Gen 4)",
        "name_tr": "Karbon Fiber Kompozit (Nesil 4)",
        "mass_g": 365.0,
        "cost_usd": 4800,
        "von_mises_mpa": 34.60,
        "deflection_mm": 0.310,
        "safety_factor": 14.53,
        "mode1_hz": 92.40,
        "thermal_delta_c": 21.00,
        "mli_heater_regulated": False,
        "rad_attenuation": 0.48,
    },
    "WERR_AEGIS_HYBRID": {
        "id": 2,
        "name_en": "WERR-Aegis Hybrid (AA7075-T6 + T700 CFRP + Rigid 10K + XPS)",
        "name_tr": "WERR-Aegis Hibrit (AA7075-T6 + T700 CFRP + Rigid 10K + XPS)",
        "mass_g": 345.0,
        "cost_usd": 6500,
        "von_mises_mpa": 18.49,
        "deflection_mm": 0.254,
        "safety_factor": 27.20,
        "mode1_hz": 100.76,
        "thermal_delta_c": 37.23,
        "mli_heater_regulated": True,
        "rad_attenuation": 0.84,
    },
}

AVIONICS_SPECS: Dict[str, Dict] = {
    "ARM_SRAM": {
        "id": 0,
        "name_en": "Standard ARM Cortex / Linux (SRAM Weights)",
        "name_tr": "Standart ARM Cortex / Linux (SRAM Ağırlıklar)",
        "weight_sram_bytes": 64_000_000,
        "power_w": 4.2,
        "mass_g": 120.0,
        "cost_usd": 1200,
        "seu_susceptible": True,
        "adcs_mode": "LINEAR_PID",
    },
    "RAD_HARD_CPU": {
        "id": 1,
        "name_en": "Heavy Rad-Hard CPU (TMR SRAM)",
        "name_tr": "Ağır Rad-Hard CPU (TMR SRAM)",
        "weight_sram_bytes": 16_000_000,
        "power_w": 8.5,
        "mass_g": 410.0,
        "cost_usd": 38000,
        "seu_susceptible": False,
        "adcs_mode": "LINEAR_PID",
    },
    "WERR_24B_FNS": {
        "id": 2,
        "name_en": "WERR 24-Byte 0-SRAM FNS (72 B TMR PROM)",
        "name_tr": "WERR 24-Bayt 0-SRAM FNS (72 B TMR PROM)",
        "weight_sram_bytes": 0,
        "power_w": 0.35,
        "mass_g": 28.0,
        "cost_usd": 1800,
        "seu_susceptible": False,
        "adcs_mode": "WERR_SCHWARZIAN_KOENIGS",
    },
}

ORBIT_SPECS: Dict[str, Dict] = {
    "STRATOSPHERE": {
        "id": 0,
        "name_en": "KÜPSAT-01 Stratosphere (25.64 km, 22.51 hPa)",
        "name_tr": "KÜPSAT-01 Stratosfer (25.64 km, 22.51 hPa)",
        "dose_krad": 0.2,
        "flux_pfu": 12.0,
        "ext_temp_min_c": -54.5,
        "ext_temp_max_c": 34.7,
        "launch_grms": 14.1,
    },
    "LEO": {
        "id": 1,
        "name_en": "Low Earth Orbit (LEO 550 km, SAA Transit)",
        "name_tr": "Alçak Dünya Yörüngesi (LEO 550 km, SAA Geçişi)",
        "dose_krad": 12.0,
        "flux_pfu": 450.0,
        "ext_temp_min_c": -65.0,
        "ext_temp_max_c": 85.0,
        "launch_grms": 14.1,
    },
    "LUNAR_ARTEMIS": {
        "id": 2,
        "name_en": "Artemis Lunar Transfer (Van Allen + Solar Storm)",
        "name_tr": "Artemis Ay Transferi (Van Allen + Güneş Fırtınası)",
        "dose_krad": 45.0,
        "flux_pfu": 4200.0,
        "ext_temp_min_c": -150.0,
        "ext_temp_max_c": 120.0,
        "launch_grms": 14.1,
    },
    "MARS_DEEP_SPACE": {
        "id": 3,
        "name_en": "Mars Deep Space (GCR + X-Class SEP Event)",
        "name_tr": "Mars Derin Uzay (GCR + X-Sınıfı SEP Olayı)",
        "dose_krad": 85.0,
        "flux_pfu": 12000.0,
        "ext_temp_min_c": -150.0,
        "ext_temp_max_c": 120.0,
        "launch_grms": 14.1,
        "solar_flux_factor": 0.45,
        "science_multiplier": 1.35,
    },
}

# Game Subsystems (Launch, EPS Power, Comm/Ground, Science Instruments, Difficulty Scenarios)
LAUNCH_SPECS: Dict[str, Dict] = {
    "STRATO_BALLOON": {
        "id": 0,
        "name_en": "KÜPSAT-01 Stratospheric Balloon ($1.5k)",
        "name_tr": "KÜPSAT-01 Stratosferik Balon ($1.5k)",
        "max_mass_g": 1330.0,
        "cost_usd": 1500,
        "allowed_orbits": ["STRATOSPHERE"],
        "max_grms": 6.0,
    },
    "SMALL_RIDESHARE": {
        "id": 1,
        "name_en": "SmallSat LEO Rideshare / Electron ($18k)",
        "name_tr": "SmallSat LEO Paylaşımlı / Electron ($18k)",
        "max_mass_g": 1330.0,
        "cost_usd": 18000,
        "allowed_orbits": ["STRATOSPHERE", "LEO"],
        "max_grms": 14.1,
    },
    "CISLUNAR_RIDESHARE": {
        "id": 2,
        "name_en": "Artemis Cislunar Rideshare / Falcon-SLS ($42k)",
        "name_tr": "Artemis Ay Yörüngesi / Falcon-SLS ($42k)",
        "max_mass_g": 1330.0,
        "cost_usd": 42000,
        "allowed_orbits": ["STRATOSPHERE", "LEO", "LUNAR_ARTEMIS"],
        "max_grms": 14.1,
    },
    "DEEP_SPACE_ESCORT": {
        "id": 3,
        "name_en": "Deep-Space Escort / Falcon Heavy-Vulcan ($68k)",
        "name_tr": "Derin Uzay Fırlatma / Falcon Heavy ($68k)",
        "max_mass_g": 1330.0,
        "cost_usd": 68000,
        "allowed_orbits": ["STRATOSPHERE", "LEO", "LUNAR_ARTEMIS", "MARS_DEEP_SPACE"],
        "max_grms": 14.1,
    },
}

EPS_SPECS: Dict[str, Dict] = {
    "BODY_SOLAR": {
        "id": 0,
        "name_en": "Body-Mounted Si Panels + Li-Ion",
        "name_tr": "Gövde Üstü Si Panel + Li-Ion",
        "mass_g": 145.0,
        "power_gen_1au_w": 3.40,
        "cost_usd": 1200,
    },
    "DEPLOY_WINGS": {
        "id": 1,
        "name_en": "Deployable 1U Triple-Junction Wings",
        "name_tr": "Açılır 1U Üç-Eklemli Güneş Kanatları",
        "mass_g": 230.0,
        "power_gen_1au_w": 8.60,
        "cost_usd": 4200,
    },
    "DEEP_SPACE_GAAS": {
        "id": 2,
        "name_en": "Concentrator GaAs + Solid-State Battery",
        "name_tr": "Yoğunlaştırıcı GaAs + Katı-Hal Batarya",
        "mass_g": 285.0,
        "power_gen_1au_w": 14.80,
        "cost_usd": 7800,
    },
}

COMM_SPECS: Dict[str, Dict] = {
    "UHF_9K6": {
        "id": 0,
        "name_en": "UHF Whip Transceiver (9.6 kbps)",
        "name_tr": "UHF Anten Alıcı-Verici (9.6 kbps)",
        "mass_g": 65.0,
        "power_w": 0.35,
        "cost_usd": 900,
        "rate_mb_day_leo": 14.0,
        "deep_space_mult": 0.08,
    },
    "SBAND_PATCH": {
        "id": 1,
        "name_en": "S-Band Patch Array (256 kbps)",
        "name_tr": "S-Band Yama Anten Dizisi (256 kbps)",
        "mass_g": 110.0,
        "power_w": 1.20,
        "cost_usd": 3200,
        "rate_mb_day_leo": 220.0,
        "deep_space_mult": 0.25,
    },
    "OPTICAL_KA": {
        "id": 2,
        "name_en": "Ka / Optical Laser Terminal (2.0 Mbps)",
        "name_tr": "Ka / Optik Lazer Terminali (2.0 Mbps)",
        "mass_g": 165.0,
        "power_w": 2.10,
        "cost_usd": 6800,
        "rate_mb_day_leo": 900.0,
        "deep_space_mult": 0.45,
    },
}

PAYLOAD_SPECS: Dict[str, Dict] = {
    "WERR_DOSIMETER": {
        "id": 0,
        "name_en": "Radiation Particle Dosimeter",
        "name_tr": "Radyasyon Parçacık Dozimetresi",
        "mass_g": 85.0,
        "power_w": 0.25,
        "cost_usd": 1500,
        "data_mb_day": 2.0,
        "science_pts": 24,
    },
    "LASER_BEACON": {
        "id": 1,
        "name_en": "Deep-Space Optical Nav Beacon",
        "name_tr": "Derin Uzay Optik Seyrüsefer İşaretçisi",
        "mass_g": 110.0,
        "power_w": 0.45,
        "cost_usd": 2600,
        "data_mb_day": 6.0,
        "science_pts": 28,
    },
    "MAG_PLASMA": {
        "id": 2,
        "name_en": "Magnetometer & Plasma Suite",
        "name_tr": "Manyetometre & Plazma Paketi",
        "mass_g": 155.0,
        "power_w": 0.85,
        "cost_usd": 3400,
        "data_mb_day": 16.0,
        "science_pts": 32,
    },
    "OPTICAL_CAM": {
        "id": 3,
        "name_en": "Planetary Optical Terrain Imager",
        "name_tr": "Gezegensel Optik Yüzey Kamerası",
        "mass_g": 215.0,
        "power_w": 1.40,
        "cost_usd": 4200,
        "data_mb_day": 48.0,
        "science_pts": 38,
    },
    "UV_SPECTRO": {
        "id": 4,
        "name_en": "UV/IR Atmospheric Spectrometer",
        "name_tr": "UV/IR Atmosfer Spektrometresi",
        "mass_g": 265.0,
        "power_w": 1.90,
        "cost_usd": 5900,
        "data_mb_day": 120.0,
        "science_pts": 46,
    },
}

SCENARIO_SPECS: Dict[str, Dict] = {
    "CADET_STRATO": {
        "id": 0,
        "name_en": "Level 1 · Cadet (Stratosphere Probe)",
        "name_tr": "Seviye 1 · Aday (Stratosfer Sondası)",
        "orbit": "STRATOSPHERE",
        "launch": "STRATO_BALLOON",
        "budget_usd": 22000,
        "min_science_pts": 40,
        "storm": False,
        "spoof": False,
    },
    "ENGINEER_LUNAR": {
        "id": 1,
        "name_en": "Level 2 · Flight Engineer (Artemis Moon)",
        "name_tr": "Seviye 2 · Uçuş Mühendisi (Artemis Ay)",
        "orbit": "LUNAR_ARTEMIS",
        "launch": "CISLUNAR_RIDESHARE",
        "budget_usd": 74000,
        "min_science_pts": 65,
        "storm": True,
        "spoof": False,
    },
    "PI_MARS": {
        "id": 2,
        "name_en": "Level 3 · Principal Investigator (Mars Deep Space)",
        "name_tr": "Seviye 3 · Baş Araştırmacı (Mars Derin Uzay)",
        "orbit": "MARS_DEEP_SPACE",
        "launch": "DEEP_SPACE_ESCORT",
        "budget_usd": 98000,
        "min_science_pts": 85,
        "storm": True,
        "spoof": True,
    },
    "SANDBOX": {
        "id": 3,
        "name_en": "Sandbox · Free Engineering Twin",
        "name_tr": "Serbest Mod · Açık Mühendislik İkizi",
        "orbit": "MARS_DEEP_SPACE",
        "launch": "DEEP_SPACE_ESCORT",
        "budget_usd": 250000,
        "min_science_pts": 0,
        "storm": True,
        "spoof": False,
    },
}


def crc16_ccitt_false(data: bytes) -> int:
    crc = 0xFFFF
    for byte in data:
        crc ^= byte << 8
        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF
    return crc


def pack_werr24_frame(
    chassis_key: str,
    avionics_key: str,
    orbit_key: str,
    flags: int,
    seed_cx: float,
    seed_cy: float,
    seed_zoom: float,
    angular_rate_dps: float,
    temp_c: float,
) -> bytes:
    c_id = CHASSIS_SPECS[chassis_key]["id"]
    a_id = AVIONICS_SPECS[avionics_key]["id"]
    o_id = ORBIT_SPECS[orbit_key]["id"]
    temp_deci = max(-32768, min(32767, int(round(temp_c * 10.0))))
    body = struct.pack(
        ">BBBBffffh",
        c_id,
        a_id,
        o_id,
        flags & 0xFF,
        float(seed_cx),
        float(seed_cy),
        float(seed_zoom),
        float(angular_rate_dps),
        temp_deci,
    )
    crc = crc16_ccitt_false(body)
    return body + struct.pack(">H", crc)


def verify_werr24_frame(frame: bytes) -> Tuple[bool, dict]:
    if len(frame) != 24:
        return False, {}
    body, rx_crc = frame[:22], struct.unpack(">H", frame[22:24])[0]
    if crc16_ccitt_false(body) != rx_crc:
        return False, {}
    c_id, a_id, o_id, flags, cx, cy, zoom, omega, temp_deci = struct.unpack(">BBBBffffh", body)
    return True, {
        "chassis_id": c_id,
        "avionics_id": a_id,
        "orbit_id": o_id,
        "flags": flags,
        "seed_cx": cx,
        "seed_cy": cy,
        "seed_zoom": zoom,
        "angular_rate_dps": omega,
        "temp_c": temp_deci / 10.0,
        "crc16": rx_crc,
    }


def holomorphic_syracuse(z: float) -> float:
    return 0.25 * (1.0 + 4.0 * z - (1.0 + 2.0 * z) * math.cos(math.pi * z))


def schwarzian_syracuse_at_zero() -> float:
    return SCHWARZIAN_AT_ZERO


def simulate_adcs_detumbling(
    initial_rate_dps: float = KUPSAT01_BURST_RATE_DPS,
    cycles: int = 10,
    mu: float = KOENIGS_MU,
    mass_g: float = 373.0,
) -> Dict:
    """3-Axis Rigid-Body 1U CubeSat Euler ADCS with Negative Schwarzian & Koenigs contraction."""
    mass_kg = mass_g / 1000.0
    ix = (mass_kg / 12.0) * (0.10 ** 2 + 0.1135 ** 2)
    iy = (mass_kg / 12.0) * (0.10 ** 2 + 0.1135 ** 2)
    iz = (mass_kg / 12.0) * (0.10 ** 2 + 0.10 ** 2)

    w_mag_rad = math.radians(initial_rate_dps)
    wx = w_mag_rad * 0.72
    wy = w_mag_rad * 0.52
    wz = w_mag_rad * math.sqrt(max(0.0, 1.0 - 0.72 ** 2 - 0.52 ** 2))

    def rot_energy(vx: float, vy: float, vz: float) -> float:
        return 0.5 * (ix * vx * vx + iy * vy * vy + iz * vz * vz)

    e0 = rot_energy(wx, wy, wz)
    rates_dps: List[float] = [round(initial_rate_dps, 4)]
    energies_norm: List[float] = [1.0]
    axes_history: List[List[float]] = [[round(math.degrees(wx), 2), round(math.degrees(wy), 2), round(math.degrees(wz), 2)]]

    dt = 0.05
    substeps = 20
    sub_dt = dt / substeps
    amp_factor = math.sqrt(mu)
    for _ in range(cycles):
        for _ in range(substeps):
            hx, hy, hz = ix * wx, iy * wy, iz * wz
            gx = -(wy * hz - wz * hy) / ix
            gy = -(wz * hx - wx * hz) / iy
            gz = -(wx * hy - wy * hx) / iz
            wx += gx * sub_dt
            wy += gy * sub_dt
            wz += gz * sub_dt
        cur_e = rot_energy(wx, wy, wz)
        target_scale = amp_factor * math.sqrt((energies_norm[-1] * e0) / max(cur_e, 1e-18))
        wx *= target_scale
        wy *= target_scale
        wz *= target_scale

        cur_rate_dps = math.degrees(math.sqrt(wx * wx + wy * wy + wz * wz))
        cur_e_norm = rot_energy(wx, wy, wz) / max(e0, 1e-18)
        rates_dps.append(round(cur_rate_dps, 4))
        energies_norm.append(round(cur_e_norm, 6))
        axes_history.append([round(math.degrees(wx), 2), round(math.degrees(wy), 2), round(math.degrees(wz), 2)])

    damped_pct = round((1.0 - energies_norm[-1]) * 100.0, 2)
    return {
        "initial_rate_dps": initial_rate_dps,
        "final_rate_dps": rates_dps[-1],
        "cycles": cycles,
        "mu": mu,
        "schwarzian_bound": round(SCHWARZIAN_AT_ZERO, 4),
        "energy_damped_pct": damped_pct,
        "rates_dps": rates_dps,
        "normalized_energy": energies_norm,
        "axes_dps": axes_history,
        "inertia_diag_kgm2": [round(ix, 6), round(iy, 6), round(iz, 6)],
    }


def evaluate_ai_watchdog(candidate_torque_ratio: float) -> Dict:
    vetoed = abs(candidate_torque_ratio) >= JULIA_REPELLER_ORBIT[0]
    applied_ratio = KOENIGS_MU if vetoed else candidate_torque_ratio
    return {
        "candidate_ratio": round(candidate_torque_ratio, 4),
        "julia_repeller_min": JULIA_REPELLER_ORBIT[0],
        "vetoed": vetoed,
        "applied_ratio": round(applied_ratio, 4),
    }


def evaluate_spoofing_barrier(n_odd: int, n_even: int) -> Dict:
    ratio = n_odd / max(1, n_even)
    drift = -n_even * math.log(2.0) + n_odd * math.log(1.5)
    isolated = ratio > GAMMA_CRIT
    return {
        "n_odd": n_odd,
        "n_even": n_even,
        "parity_ratio": round(ratio, 4),
        "gamma_crit": round(GAMMA_CRIT, 5),
        "lambda_haar": round(LAMBDA_HAAR, 6),
        "lyapunov_drift": round(drift, 4),
        "spoofing_isolated": isolated,
    }


def compute_internal_min_temp(chassis_key: str, orbit_key: str) -> Tuple[float, bool]:
    """Compute realistic internal avionics minimum temperature.

    Stratosphere/LEO relies on passive XPS + Rigid 10K + CFRP thermal delta (+37.23 C).
    Deep-space cryogenic eclipse (-150 C) with WERR-Aegis Hybrid couples MLI + XPS + 0.5 W
    survival heater clamping internal bay at -24.5 C (within IAC TVAC -30..+65 C envelope).
    """
    ch = CHASSIS_SPECS[chassis_key]
    orb = ORBIT_SPECS[orbit_key]
    passive_temp = orb["ext_temp_min_c"] + ch["thermal_delta_c"]
    if ch["mli_heater_regulated"] and passive_temp < -24.5:
        internal_min = -24.5
    else:
        internal_min = passive_temp
    thermal_ok = internal_min >= -30.0
    return round(internal_min, 2), thermal_ok


def evaluate_mission(
    chassis_key: str,
    avionics_key: str,
    orbit_key: str,
    solar_storm: bool = True,
    spoof_attack: bool = False,
) -> Dict:
    ch = CHASSIS_SPECS[chassis_key]
    av = AVIONICS_SPECS[avionics_key]
    orb = ORBIT_SPECS[orbit_key]

    effective_dose = orb["dose_krad"] * (1.5 if solar_storm else 1.0) * (1.0 - ch["rad_attenuation"])
    bit_flips_per_day = 0.0
    if av["seu_susceptible"]:
        bit_flips_per_day = round((orb["flux_pfu"] / 100.0) * (1.0 - ch["rad_attenuation"]) * (2.5 if solar_storm else 1.0), 2)

    structural_ok = ch["safety_factor"] >= 2.0 and ch["mode1_hz"] > 90.0
    thermal_internal_min, thermal_ok = compute_internal_min_temp(chassis_key, orbit_key)

    spoofing = evaluate_spoofing_barrier(9 if spoof_attack else 2, 10)
    spoofing_mitigated = (not spoof_attack) or (avionics_key == "WERR_24B_FNS")

    score = 100.0
    if not structural_ok:
        score -= 18.0
    if not thermal_ok:
        score -= 22.0
    if av["seu_susceptible"]:
        score -= min(58.0, bit_flips_per_day * 1.4)
    if avionics_key == "RAD_HARD_CPU":
        score -= 4.5
    if spoof_attack and not spoofing_mitigated:
        score -= 25.0
    score = round(max(2.0, min(100.0, score)), 1)

    total_mass_g = ch["mass_g"] + av["mass_g"]
    payload_margin_g = round(1330.0 - total_mass_g, 1)
    total_cost_usd = ch["cost_usd"] + av["cost_usd"]

    # Choose realistic ADCS contraction factor by avionics architecture
    if av["adcs_mode"] == "WERR_SCHWARZIAN_KOENIGS":
        mu_eff = KOENIGS_MU
    elif av["seu_susceptible"] and solar_storm and bit_flips_per_day > 5.0:
        mu_eff = SEU_DEGRADED_MU
    else:
        mu_eff = LINEAR_PID_MU

    adcs = simulate_adcs_detumbling(KUPSAT01_BURST_RATE_DPS, 10, mu_eff, total_mass_g)
    adcs["baseline_pid_energies"] = simulate_adcs_detumbling(KUPSAT01_BURST_RATE_DPS, 10, LINEAR_PID_MU, total_mass_g)["normalized_energy"]
    watchdog = evaluate_ai_watchdog(2.65 if spoof_attack else 0.75)

    badges: List[str] = []
    if av["weight_sram_bytes"] == 0:
        badges.append("Zero-SRAM Survivor")
    if structural_ok:
        badges.append("GEVS 14.1 Grms Qualified")
    if adcs["energy_damped_pct"] >= 94.0:
        badges.append("Schwarzian Detumbler")
    if score >= 95.0:
        badges.append("Artemis Flight Ready")

    heater_power = 0.50 if (ch["mli_heater_regulated"] and orb["ext_temp_min_c"] < -80.0) else 0.0
    total_power_w = round(av["power_w"] + heater_power, 2)

    frame = pack_werr24_frame(
        chassis_key,
        avionics_key,
        orbit_key,
        flags=(0x03 if solar_storm else 0x01) | (0x04 if spoof_attack else 0x00),
        seed_cx=-0.745429,
        seed_cy=0.113008,
        seed_zoom=1.60,
        angular_rate_dps=adcs["final_rate_dps"],
        temp_c=thermal_internal_min,
    )

    return {
        "chassis": chassis_key,
        "avionics": avionics_key,
        "orbit": orbit_key,
        "solar_storm": solar_storm,
        "spoof_attack": spoof_attack,
        "survival_score_pct": score,
        "bit_flips_per_day": bit_flips_per_day,
        "weight_sram_bytes": av["weight_sram_bytes"],
        "power_w": total_power_w,
        "total_cost_usd": total_cost_usd,
        "effective_dose_krad": round(effective_dose, 2),
        "internal_min_temp_c": thermal_internal_min,
        "thermal_ok": thermal_ok,
        "total_bus_mass_g": total_mass_g,
        "payload_margin_g": payload_margin_g,
        "structural_ok": structural_ok,
        "adcs": adcs,
        "watchdog": watchdog,
        "spoofing": spoofing,
        "badges": badges,
        "werr24_hex": frame.hex(),
    }


def _orbit_solar_factor(orbit_key: str) -> float:
    return {"STRATOSPHERE": 0.92, "LEO": 1.0, "LUNAR_ARTEMIS": 1.0, "MARS_DEEP_SPACE": 0.45}.get(orbit_key, 1.0)


def _orbit_comm_factor(orbit_key: str, comm_spec: Dict) -> float:
    if orbit_key == "STRATOSPHERE":
        return 1.0
    if orbit_key == "LEO":
        return 1.0
    if orbit_key == "LUNAR_ARTEMIS":
        return min(1.0, comm_spec["deep_space_mult"] * 2.2)
    return comm_spec["deep_space_mult"]


def _orbit_science_mult(orbit_key: str) -> float:
    return {"STRATOSPHERE": 0.85, "LEO": 1.0, "LUNAR_ARTEMIS": 1.20, "MARS_DEEP_SPACE": 1.35}.get(orbit_key, 1.0)


def evaluate_game_mission(
    chassis_key: str = "WERR_AEGIS_HYBRID",
    avionics_key: str = "WERR_24B_FNS",
    orbit_key: str = "MARS_DEEP_SPACE",
    solar_storm: bool = True,
    spoof_attack: bool = False,
    launch_key: str = "DEEP_SPACE_ESCORT",
    eps_key: str = "DEPLOY_WINGS",
    comm_key: str = "SBAND_PATCH",
    payload_keys: List[str] | None = None,
    scenario_key: str = "PI_MARS",
) -> Dict:
    """Evaluate complete Space Mission Design Game including Launch, EPS Power, Comm/Data, Budget, Science & JPL CML."""
    if payload_keys is None:
        payload_keys = ["WERR_DOSIMETER", "LASER_BEACON", "MAG_PLASMA"]

    base = evaluate_mission(chassis_key, avionics_key, orbit_key, solar_storm, spoof_attack)
    lv = LAUNCH_SPECS[launch_key]
    eps = EPS_SPECS[eps_key]
    cm = COMM_SPECS[comm_key]
    sc = SCENARIO_SPECS[scenario_key]

    unique_payloads = [k for k in dict.fromkeys(payload_keys) if k in PAYLOAD_SPECS]
    pay_mass = sum(PAYLOAD_SPECS[k]["mass_g"] for k in unique_payloads)
    pay_power = sum(PAYLOAD_SPECS[k]["power_w"] for k in unique_payloads)
    pay_cost = sum(PAYLOAD_SPECS[k]["cost_usd"] for k in unique_payloads)
    pay_data = sum(PAYLOAD_SPECS[k]["data_mb_day"] for k in unique_payloads)
    raw_science = sum(PAYLOAD_SPECS[k]["science_pts"] for k in unique_payloads)

    total_mass_g = round(base["total_bus_mass_g"] + eps["mass_g"] + cm["mass_g"] + pay_mass, 1)
    total_cost_usd = int(base["total_cost_usd"] + eps["cost_usd"] + cm["cost_usd"] + pay_cost + lv["cost_usd"])
    power_load_w = round(base["power_w"] + cm["power_w"] + pay_power, 2)
    power_gen_w = round(eps["power_gen_1au_w"] * _orbit_solar_factor(orbit_key), 2)
    power_margin_w = round(power_gen_w - power_load_w, 2)

    data_cap_mb_day = round(cm["rate_mb_day_leo"] * _orbit_comm_factor(orbit_key, cm), 2)
    data_gen_mb_day = round(pay_data, 2)
    data_margin_mb_day = round(data_cap_mb_day - data_gen_mb_day, 2)

    mass_ok = total_mass_g <= lv["max_mass_g"]
    launch_ok = (orbit_key in lv["allowed_orbits"]) and (base["structural_ok"] or lv["max_grms"] < 10.0)
    power_ok = power_margin_w >= 0.0
    comm_ok = (data_margin_mb_day >= 0.0) and (len(unique_payloads) > 0)
    budget_ok = True if scenario_key == "SANDBOX" else (total_cost_usd <= sc["budget_usd"])
    thermal_ok = bool(base["thermal_ok"])
    rad_cyber_ok = (base["bit_flips_per_day"] == 0.0) and ((not spoof_attack) or avionics_key == "WERR_24B_FNS")

    science_pts = int(round(raw_science * _orbit_science_mult(orbit_key))) if len(unique_payloads) > 0 else 0
    science_ok = science_pts >= sc["min_science_pts"]

    gates = {
        "mass_ok": mass_ok,
        "launch_ok": launch_ok,
        "power_ok": power_ok,
        "comm_ok": comm_ok,
        "budget_ok": budget_ok,
        "thermal_ok": thermal_ok,
        "rad_cyber_ok": rad_cyber_ok,
        "science_ok": science_ok,
    }
    passed_count = sum(1 for ok in gates.values() if ok)

    # JPL Concept Maturity Level (CML 1 to CML 4)
    if passed_count >= 8 and base["survival_score_pct"] >= 95.0:
        cml_level = 4
    elif passed_count >= 6 and launch_ok and mass_ok:
        cml_level = 3
    elif len(unique_payloads) > 0 and launch_ok:
        cml_level = 2
    else:
        cml_level = 1

    # Composite Mission Design Game Score (0 - 1000 pts)
    surv_comp = base["survival_score_pct"] * 5.0
    sci_comp = min(250.0, science_pts * 2.2)
    eff_mass = max(0.0, (1330.0 - total_mass_g) / 1330.0) * 100.0 if mass_ok else 0.0
    eff_budget = max(0.0, (sc["budget_usd"] - total_cost_usd) / max(1, sc["budget_usd"])) * 100.0 if budget_ok else 0.0
    penalty = 0.0
    if not launch_ok:
        penalty += 220.0
    if not mass_ok:
        penalty += 180.0
    if not power_ok:
        penalty += 170.0
    if not comm_ok:
        penalty += 120.0
    if not budget_ok:
        penalty += 110.0

    game_score = int(round(max(20.0, min(1000.0, surv_comp + sci_comp + eff_mass + eff_budget - penalty))))
    mission_success = all(gates.values()) and base["survival_score_pct"] >= 85.0

    result = dict(base)
    result.update({
        "scenario": scenario_key,
        "launch_vehicle": launch_key,
        "eps": eps_key,
        "comm": comm_key,
        "payloads": unique_payloads,
        "total_spacecraft_mass_g": total_mass_g,
        "total_mission_cost_usd": total_cost_usd,
        "budget_usd": sc["budget_usd"],
        "power_gen_w": power_gen_w,
        "power_load_w": power_load_w,
        "power_margin_w": power_margin_w,
        "data_cap_mb_day": data_cap_mb_day,
        "data_gen_mb_day": data_gen_mb_day,
        "data_margin_mb_day": data_margin_mb_day,
        "science_points": science_pts,
        "min_science_pts": sc["min_science_pts"],
        "gates": gates,
        "gates_passed": passed_count,
        "cml_level": cml_level,
        "game_score": game_score,
        "mission_success": mission_success,
    })
    return result

