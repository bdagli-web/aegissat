<p align="center">
  <img src="assets/aegissat_mission_patch.jpg" alt="AegisSat Mission Patch (SI-GENERATED)" width="220" />
</p>

# AegisSat — Space Mission Architecture Simulator

**NASA Space Apps Challenge 2026 — *Space Mission Design Game* (Universal Event)**  
Live Simulator: **[https://aegissat.space/](https://aegissat.space/)**  
Slides: **[English (EN)](demo/slides_en.html)** · **[Türkçe (TR)](demo/slides_tr.html)** · **[Architecture](docs/ARCHITECTURE.md)**  
Team Contact: **[info@aegissat.space](mailto:info@aegissat.space)** · **[NASA Space Apps Team](https://www.spaceappschallenge.org/2026/find-a-team/aegissat/?tab=details)**

---

## Overview

**AegisSat** is an interactive 3D CubeSat mission architecture game and engineering simulator uniting **TRL-7 stratospheric flight heritage** from **KÜPSAT-01**, peer-reviewed **IAC 2026 Antalya** structural optimization (`IAC-26-C2.IPB.29`), and **WERR 24-Byte 0-SRAM** SEU-immune avionics with **3-axis Negative Schwarzian / Koenigs ADCS detumbling** and **Patent 2/3 cyber-physical safety gates**.

- **KÜPSAT-01 Flight Heritage (7 Aug 2026, Mersin):** 25.64 km peak altitude, 22.51 hPa, -54.50 °C ambient (+37.23 °C passive thermal delta), ~20G burst shock, and 3,647.58 °/s tumbling telemetry ([Flight Report](https://teknosanat.com.tr/lib/cubesat/cubesat_master_flight_report_tr.html) · `data/kupsat01_flight_20260807.json` [421 samples]).
- **IAC 2026 Hybrid Shield (`IAC-26-C2.IPB.29` / `TPMK 2025/007159`):** 345 g 1U chassis (`AA7075-T6 + Toray T700 CFRP + Rigid 10K Ceramic + XPS`), 81.7% Von Mises stress reduction (`100.87 -> 18.49 MPa`), `100.76 Hz` primary mode, `FS = 27.20`.
- **WERR 24-Byte 0-SRAM & ADCS:** 0 B mutable weight SRAM (72 B full TMR PROM), `192/192` CRC-16/CCITT-FALSE single-bit SEU detection, `94.37%` 10-cycle detumbling energy damping (`S(f)(0) <= -6.9196 < 0`, `mu = 0.75`), Julia Repeller AI Watchdog, and 2-adic Haar spoofing barrier (`TR 2026/020266`).
- **Live Space Weather & Global Offers Open Data:** Real-time **NOAA SWPC GOES >=10 MeV Protons** & **Planetary Kp** + **Microsoft Planetary Computer STAC** (`sentinel-2-l2a` KÜPSAT-01 corridor) via Cloudflare Pages Edge (`/api/space-weather`), paired with **NASA DONKI SEP**, **SPENVIS/OMNIWeb**, and **Meteomatics Weather API** launch-pad telemetry (`data/verified_nasa_space_weather.json`).

## Quickstart & Verification

```bash
# Run all unit & Python<->JS bit-exact parity tests
python -m unittest discover -s tests -v

# Run CLI mission evaluation with SEU fault injection
PYTHONPATH=src python src/cli.py --chassis WERR_AEGIS_HYBRID --avionics WERR_24B_FNS --orbit MARS_DEEP_SPACE --simulate-seu

# Refresh live NOAA SWPC & NASA DONKI snapshot
PYTHONPATH=src python src/cli.py --sync-nasa
```

## Team Members

- **Bekirhan Dagli** (`@bdagli`) — Team Owner
- **Burak Salar** (`@pcfox`) — Aerospace & Mechatronics Systems Engineer
- **Emrah Yurtseven** (`@eyurtseven`) — Maritime & Space Cybernetics

## Super Intelligence (SI) Transparency Disclosure

In accordance with NASA Space Apps Challenge 2026 SI guidelines, mission patch artwork (`assets/aegissat_mission_patch.jpg`) and code scaffolding were developed with AI/SI assistance without incorporating any NASA logos, flags, or official emblems. All telemetry calculations, 24-byte CRC-16 framing, 3-axis Euler ADCS equations, and Python ↔ JavaScript parity are verified by `tests/test_aegissat_core.py`.

## Presentation Decks (PDF)

- [AegisSat Presentation (English PDF)](docs/AegisSat_Presentation_EN.pdf) — 7-slide 16:9 interactive/print-ready NASA Space Apps deck
- [AegisSat Sunum (Türkçe PDF)](docs/AegisSat_Presentation_TR.pdf) — 7 slaytlık Türkçe 16:9 görev sunumu

## NASA Space Mission Design Game Alignment

Aligned directly with the [NASA Space Apps 2026 — Space Mission Design Game](https://www.spaceappschallenge.org/2026/challenges/space-mission-design-game/) challenge and official NASA/CSA resources:

- **4 Mission Segments ([NASA Science Missions](https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf?emrc=a454cf)):** Interactive engineering trade-offs across **Launch Segment** (Stratospheric Balloon, Electron LEO, Falcon/SLS Cislunar, Falcon Heavy Mars), **Space Segment** (IAC 2026 Shielding, WERR 24-Byte Zero-SRAM PROM vs SRAM/Rad-Hard TMR, Solar EPS + Solid-State Battery, 5 Science Instruments), **Ground Segment** (UHF, S-Band, Ka/Optical Downlink Capacity), and **User Segment** (Science Return).
- **4-Player Co-Op NASA MDL Mode ([GSFC MDL](https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/)):** Collaborate in **Commander**, **Structures & Thermal**, **Avionics & Cyber-ADCS**, and **Science, EPS & Ops** roles with team sign-offs and shareable `#design=` mission URLs.
- **JPL Concept Maturity Levels ([JPL CML 1–4](https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl:2014/44299)):** Live progression meter evaluating all 8 mission gates (Mass `<= 1,330 g`, Launch/GEVS Compatibility, Mars Solar Irradiance `45%` Power Balance, Data Downlink, Scenario Budget, Thermal `>= -30 °C`, Radiation SEU & Spoofing Immunity, and Science Target).
- **Dual 3D Visualization ([NASA Mission Viz](https://nasa.github.io/mission-viz/)):** Switch interactively inside Three.js between the **1U Hardware Twin** (deployable solar wings + exploded view + proton particle storm) and **Earth–Moon–Mars 3D Trajectory**.
- **3 Difficulty Scenarios + Sandbox + In-Flight Random Events + Leaderboard + CubeSat 101 ([NASA CSLI CubeSat 101](https://www3.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf)).**
