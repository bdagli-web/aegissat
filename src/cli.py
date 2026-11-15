"""CLI evaluator for AegisSat Mission Architecture Simulator."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from aegissat_core import (
    KUPSAT01_BURST_RATE_DPS,
    evaluate_mission,
    pack_werr24_frame,
    simulate_adcs_detumbling,
    verify_werr24_frame,
)
from nasa_space_weather_client import sync_live_space_weather


def main() -> None:
    parser = argparse.ArgumentParser(description="AegisSat CLI Mission & ADCS Evaluator")
    parser.add_argument("--chassis", default="WERR_AEGIS_HYBRID", choices=["AL6061", "CFRP", "WERR_AEGIS_HYBRID"])
    parser.add_argument("--avionics", default="WERR_24B_FNS", choices=["ARM_SRAM", "RAD_HARD_CPU", "WERR_24B_FNS"])
    parser.add_argument("--orbit", default="MARS_DEEP_SPACE", choices=["STRATOSPHERE", "LEO", "LUNAR_ARTEMIS", "MARS_DEEP_SPACE"])
    parser.add_argument("--solar-storm", action="store_true", default=True)
    parser.add_argument("--spoof-attack", action="store_true", default=False)
    parser.add_argument("--simulate-seu", action="store_true", help="Flip bit 42 in 24B WERR frame and verify CRC-16 trap")
    parser.add_argument("--sync-nasa", action="store_true", help="Refresh live NOAA SWPC & NASA DONKI snapshot")
    args = parser.parse_args()

    if args.sync_nasa:
        snap = sync_live_space_weather(Path(__file__).resolve().parent.parent / "data" / "verified_nasa_space_weather.json")
        print(json.dumps(snap, indent=2))
        return

    res = evaluate_mission(args.chassis, args.avionics, args.orbit, args.solar_storm, args.spoof_attack)
    if args.simulate_seu:
        frame = bytearray(bytes.fromhex(res["werr24_hex"]))
        frame[5] ^= 0x04  # Single cosmic-ray bit flip
        ok, _ = verify_werr24_frame(bytes(frame))
        res["seu_bit_flip_detected"] = not ok
    print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
