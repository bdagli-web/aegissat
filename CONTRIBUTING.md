# Contributing to AegisSat

1. Clone the repository and run the automated verification suite before committing:
   ```bash
   python -m unittest discover -s tests -v
   ```
2. Keep Python (`src/aegissat_core.py`) and JavaScript (`assets/js/werr_aegissat_core.js`) bit-exact in `werr24_hex` and mission scoring.
3. Never commit API tokens or `.env` files.
