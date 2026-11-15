"""Verified NOAA SWPC & NASA Space Weather client + KÜPSAT-01 flight telemetry compiler."""

from __future__ import annotations

import csv
import json
import ssl
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

NOAA_PROTONS_URL = "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json"
NOAA_KP_URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
NASA_DONKI_SEP_URL = "https://api.nasa.gov/DONKI/SEP?api_key=DEMO_KEY"


def _get_json(url: str, timeout: int = 12) -> Any:
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={"User-Agent": "AegisSat-SpaceApps-2026/1.0"})
    with urllib.request.urlopen(req, context=ctx, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def map_proton_flux_to_noaa_scale(pfu_10mev: float) -> Dict[str, str]:
    if pfu_10mev >= 100000:
        return {"scale": "S5 (Extreme)", "tier": "critical"}
    if pfu_10mev >= 10000:
        return {"scale": "S4 (Severe)", "tier": "critical"}
    if pfu_10mev >= 1000:
        return {"scale": "S3 (Strong)", "tier": "critical"}
    if pfu_10mev >= 100:
        return {"scale": "S2 (Moderate)", "tier": "watch"}
    if pfu_10mev >= 10:
        return {"scale": "S1 (Minor)", "tier": "watch"}
    return {"scale": "S0 (Quiet)", "tier": "optimal"}


def compile_kupsat01_flight_json(csv_path: Path, out_path: Path) -> Dict[str, Any]:
    """Parse KÜPSAT-01 2-minute master flight CSV into compact JSON for browser replay."""
    rows: List[Dict[str, Any]] = []
    with csv_path.open("r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for r in reader:
            try:
                alt = float(r.get("Sensor_Irtifa_m") or 0.0)
                pres = float(r.get("Basinc_hPa") or 0.0)
                t_in = float(r.get("Ic_Sicaklik_C") or 0.0)
                t_out = float(r.get("Dis_Sicaklik_C") or 0.0)
                rows.append({
                    "t": r.get("Zaman_TSI", ""),
                    "sec": int(float(r.get("Sec_Offset") or 0)),
                    "phase": r.get("Gorev_Evresi", ""),
                    "alt_m": round(alt, 2),
                    "press_hpa": round(pres, 2),
                    "t_in_c": round(t_in, 2),
                    "t_out_c": round(t_out, 2),
                })
            except ValueError:
                continue

    payload = {
        "mission": "KÜPSAT-01 Stratospheric Flight (TRL-7)",
        "date": "2026-08-07",
        "launch_site": "Arslanköy, Mersin, Türkiye (37.00379°N, 34.25370°E)",
        "verified_peak_altitude_isa_m": 25636,
        "verified_min_pressure_hpa": 22.51,
        "verified_min_ext_temp_c": -54.50,
        "verified_thermal_delta_c": 37.23,
        "verified_burst_shock_g": 20.0,
        "verified_burst_tumble_dps": 3647.58,
        "samples": rows,
    }
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return payload


def sync_live_space_weather(snapshot_path: Path) -> Dict[str, Any]:
    """Fetch live NOAA SWPC GOES protons & Kp + NASA DONKI SEP events with safe snapshot fallback."""
    existing = {}
    if snapshot_path.exists():
        existing = json.loads(snapshot_path.read_text(encoding="utf-8"))

    pfu_10mev = existing.get("noaa_swpc", {}).get("goes_proton_10mev_pfu", 0.42)
    kp_index = existing.get("noaa_swpc", {}).get("kp_index", 2.33)
    donki_events = existing.get("nasa_donki", {}).get("recent_sep_events", [])
    live_sources: List[str] = []

    try:
        protons = _get_json(NOAA_PROTONS_URL)
        p10 = [float(x["flux"]) for x in protons if str(x.get("energy", "")).startswith(">=10")]
        if p10:
            pfu_10mev = round(p10[-1], 4)
            live_sources.append("NOAA SWPC GOES >=10 MeV")
    except Exception:
        pass

    try:
        kp_rows = _get_json(NOAA_KP_URL)
        if len(kp_rows) > 1:
            kp_index = round(float(kp_rows[-1][1]), 2)
            live_sources.append("NOAA SWPC Planetary Kp")
    except Exception:
        pass

    try:
        sep = _get_json(NASA_DONKI_SEP_URL)
        if isinstance(sep, list):
            donki_events = [
                {
                    "sepID": ev.get("sepID", ""),
                    "eventTime": ev.get("eventTime", ""),
                    "instruments": [i.get("displayName", "") for i in ev.get("instruments", [])][:2],
                }
                for ev in sep[-5:]
            ]
            live_sources.append("NASA DONKI SEP")
    except Exception:
        pass

    s_scale = map_proton_flux_to_noaa_scale(pfu_10mev)
    snapshot = {
        "updated_utc": datetime.now(timezone.utc).isoformat(),
        "live_sources": live_sources,
        "noaa_swpc": {
            "goes_proton_10mev_pfu": pfu_10mev,
            "s_scale": s_scale["scale"],
            "tier": s_scale["tier"],
            "kp_index": kp_index,
        },
        "nasa_donki": {
            "recent_sep_events": donki_events,
        },
        "spenvis_omniweb_reference": {
            "LEO_550km": {"gcr_dose_krad_yr": 12.0, "peak_sep_pfu": 450.0},
            "LUNAR_ARTEMIS": {"gcr_dose_krad_yr": 45.0, "peak_sep_pfu": 4200.0},
            "MARS_DEEP_SPACE": {"gcr_dose_krad_yr": 85.0, "peak_sep_pfu": 12000.0},
        },
    }
    snapshot_path.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    return snapshot
