/**
 * Cloudflare Pages Function — Live Space Weather Proxy (NOAA SWPC + NASA DONKI)
 * Provides clean CORS-enabled live telemetry for https://aegissat.space/api/space-weather
 */
export async function onRequestGet() {
  const protonsUrl = "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json";
  const kpUrl = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";

  try {
    const [pResp, kResp] = await Promise.all([
      fetch(protonsUrl, { headers: { "User-Agent": "AegisSat-Pages-Edge/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } }),
      fetch(kpUrl, { headers: { "User-Agent": "AegisSat-Pages-Edge/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } }),
    ]);

    let pfu10 = null;
    if (pResp.ok) {
      const pData = await pResp.json();
      const filtered = pData.filter((d) => String(d.energy || "").startsWith(">=10"));
      if (filtered.length > 0) pfu10 = Number(filtered[filtered.length - 1].flux);
    }

    let kp = null;
    if (kResp.ok) {
      const kData = await kResp.json();
      if (Array.isArray(kData) && kData.length > 1) {
        kp = Number(kData[kData.length - 1][1]);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        source: "NOAA SWPC Live Edge",
        updated_utc: new Date().toISOString(),
        goes_proton_10mev_pfu: pfu10,
        kp_index: kp,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=900",
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "upstream_unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
