import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

from aegissat_core import (  # noqa: E402
    KUPSAT01_BURST_RATE_DPS,
    evaluate_ai_watchdog,
    evaluate_mission,
    evaluate_spoofing_barrier,
    pack_werr24_frame,
    schwarzian_syracuse_at_zero,
    simulate_adcs_detumbling,
    verify_werr24_frame,
)
from nasa_space_weather_client import map_proton_flux_to_noaa_scale  # noqa: E402


class TestAegisSatCore(unittest.TestCase):
    def test_werr24_frame_size_and_192bit_seu_detection(self):
        frame = pack_werr24_frame(
            "WERR_AEGIS_HYBRID",
            "WERR_24B_FNS",
            "MARS_DEEP_SPACE",
            0x03,
            -0.745429,
            0.113008,
            1.60,
            205.41,
            -112.77,
        )
        self.assertEqual(len(frame), 24)
        ok, decoded = verify_werr24_frame(frame)
        self.assertTrue(ok)
        self.assertEqual(decoded["chassis_id"], 2)
        self.assertEqual(decoded["avionics_id"], 2)
        self.assertEqual(decoded["orbit_id"], 3)

        detected = 0
        for byte_idx in range(24):
            for bit_idx in range(8):
                corrupted = bytearray(frame)
                corrupted[byte_idx] ^= 1 << bit_idx
                ok_bad, _ = verify_werr24_frame(bytes(corrupted))
                if not ok_bad:
                    detected += 1
        self.assertEqual(detected, 192)

    def test_negative_schwarzian_and_3axis_adcs_detumbling(self):
        s0 = schwarzian_syracuse_at_zero()
        self.assertLess(s0, -6.919)
        adcs = simulate_adcs_detumbling(KUPSAT01_BURST_RATE_DPS, cycles=10, mu=0.75, mass_g=373.0)
        self.assertEqual(adcs["energy_damped_pct"], 94.37)
        self.assertEqual(len(adcs["axes_dps"]), 11)
        self.assertEqual(len(adcs["inertia_diag_kgm2"]), 3)
        self.assertLess(adcs["final_rate_dps"], 870.0)
        adcs20 = simulate_adcs_detumbling(KUPSAT01_BURST_RATE_DPS, cycles=20, mu=0.75, mass_g=373.0)
        self.assertLess(adcs20["final_rate_dps"], 210.0)

    def test_patent2_watchdog_and_patent3_spoofing_barrier(self):
        wd_bad = evaluate_ai_watchdog(2.65)
        self.assertTrue(wd_bad["vetoed"])
        self.assertEqual(wd_bad["applied_ratio"], 0.75)

        wd_ok = evaluate_ai_watchdog(0.65)
        self.assertFalse(wd_ok["vetoed"])

        sp_attack = evaluate_spoofing_barrier(n_odd=9, n_even=10)
        self.assertTrue(sp_attack["spoofing_isolated"])
        self.assertGreater(sp_attack["parity_ratio"], sp_attack["gamma_crit"])

        sp_clean = evaluate_spoofing_barrier(n_odd=2, n_even=10)
        self.assertFalse(sp_clean["spoofing_isolated"])

    def test_aha_comparison_hybrid_vs_baseline(self):
        baseline = evaluate_mission("AL6061", "ARM_SRAM", "MARS_DEEP_SPACE", solar_storm=True, spoof_attack=True)
        aegis = evaluate_mission("WERR_AEGIS_HYBRID", "WERR_24B_FNS", "MARS_DEEP_SPACE", solar_storm=True, spoof_attack=True)
        self.assertGreater(baseline["bit_flips_per_day"], 50.0)
        self.assertEqual(aegis["bit_flips_per_day"], 0.0)
        self.assertEqual(aegis["weight_sram_bytes"], 0)
        self.assertEqual(aegis["survival_score_pct"], 100.0)
        self.assertLess(baseline["survival_score_pct"], 15.0)
        self.assertIn("Zero-SRAM Survivor", aegis["badges"])

    def test_verified_datasets_and_noaa_scale(self):
        flight = json.loads((ROOT / "data" / "kupsat01_flight_20260807.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(flight["samples"]), 400)
        self.assertEqual(flight["verified_min_pressure_hpa"], 22.51)

        sw = json.loads((ROOT / "data" / "verified_nasa_space_weather.json").read_text(encoding="utf-8"))
        self.assertIn("noaa_swpc", sw)
        self.assertTrue(len(sw.get("planetary_computer_corridor", [])) >= 1)
        self.assertIn("arslankoy_mersin", sw.get("meteomatics_launch_weather", {}))
        self.assertEqual(map_proton_flux_to_noaa_scale(1500.0)["scale"], "S3 (Strong)")

    def test_python_js_bit_exact_parity(self):
        js_path = (ROOT / "assets" / "js" / "werr_aegissat_core.js").as_posix()
        script = f"""
        const core = require({json.dumps(js_path)});
        const res = core.evaluateMission("WERR_AEGIS_HYBRID", "WERR_24B_FNS", "LUNAR_ARTEMIS", true, true);
        console.log(JSON.stringify(res));
        """
        out = subprocess.check_output(["node", "-e", script], text=True).strip()
        js_res = json.loads(out)
        py_res = evaluate_mission("WERR_AEGIS_HYBRID", "WERR_24B_FNS", "LUNAR_ARTEMIS", True, True)
        self.assertEqual(py_res["werr24_hex"], js_res["werr24_hex"])
        self.assertEqual(py_res["survival_score_pct"], js_res["survival_score_pct"])
        self.assertEqual(py_res["adcs"]["energy_damped_pct"], js_res["adcs"]["energy_damped_pct"])
        self.assertEqual(py_res["watchdog"]["vetoed"], js_res["watchdog"]["vetoed"])
        self.assertEqual(py_res["spoofing"]["spoofing_isolated"], js_res["spoofing"]["spoofing_isolated"])


if __name__ == "__main__":
    unittest.main()
