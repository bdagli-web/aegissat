# AegisSat System Architecture

## 1. Dual-Shield CubeSat Architecture (Physical + Algorithmic)
AegisSat bridges hardware structural survivability and algorithmic zero-SRAM fault immunity:

1. **Physical Shielding (`IAC-26-C2.IPB.29` / `TPMK 2025/007159`):**
   - **Primary Skeleton:** CNC AA7075-T6 (`503 MPa` yield, `572 MPa` UTS, `50 µm` Type III hard anodizing + PTFE).
   - **Shear & EM Panels:** `1.0 mm` Toray T700 12K CFRP `[0°/±45°/90°]s` (`2,550 MPa` UTS).
   - **Internal Brackets:** Formlabs Rigid 10K ceramic-infused SLA resin (`10,000 MPa` flexural modulus, `280 °C` HDT).
   - **Thermal Core:** `25 kg/m³` XPS closed-cell matrix ($\lambda = 0.032\text{ W/m}\cdot\text{K}$).
   - **5-Generation FEA:** Stress reduced `100.87 MPa -> 18.49 MPa` (`-81.7%`), max deflection `0.254 mm`, `Mode 1 = 100.76 Hz`, `FS = 27.20`, total 1U chassis mass `345 g`.

2. **TRL-7 Flight Validation (`KÜPSAT-01`, 7 August 2026):**
   - Launched from Arslanköy, Mersin (`37.00379°N, 34.25370°E`).
   - Reached `25,636 m` (`25.64 km`) ISA altitude and `22.51 hPa` ambient pressure.
   - Survived `-54.50 °C` ambient with `-17.27 °C` internal avionics (`+37.23 °C` passive thermal delta).
   - Recorded `~20 G` burst shock and `3,647.58 °/s` (`10.13 rev/s`) angular tumbling.

3. **WERR 24-Byte 0-SRAM Avionics & ADCS:**
   - **Zero-SRAM Model:** Entire decision kernel derived procedurally from a 24-byte seed (`72 B` full TMR in rad-hard PROM); zero mutable neural weight SRAM.
   - **192-Bit Frame Integrity:** `>BBBBffffhH` big-endian frame protected by `CRC-16/CCITT-FALSE` (`192/192` single-bit SEU detection).
   - **3-Axis Rigid-Body ADCS:** Euler integration $\dot{\omega} = I^{-1}(\tau_{\text{WERR}} - \omega \times I\omega)$ driven by universal Negative Schwarzian derivative ($S(f)(0) \le -6.9196 < 0$) and Koenigs contraction ($\mu = 0.75$), damping `94.37%` rotational kinetic energy in 10 cycles.
   - **Cyber-Physical Safety:** Patent 2 Julia Repeller Watchdog ($\mathcal{O}_{\text{rep}} = \{2.4046, 3.0951\}$) and Patent 3 (`TR 2026/020266`) 2-adic Haar spoofing barrier ($\gamma_{\text{crit}} = 0.58496$, $\lambda_{\text{Haar}} = -0.143841$).

## 2. Live Open Data & Edge Architecture
- **`functions/api/space-weather.js`:** Cloudflare Pages Edge Function querying NOAA SWPC GOES `>=10 MeV` protons and Planetary `Kp` with 900s edge caching.
- **`data/verified_nasa_space_weather.json`:** Offline verified snapshot including NASA DONKI SEP events and SPENVIS/OMNIWeb orbit envelopes.
- **`data/kupsat01_flight_20260807.json`:** 421 compiled telemetry samples from the 7 August 2026 flight.
