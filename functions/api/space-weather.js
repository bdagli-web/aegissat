/**
 * Cloudflare Pages Function — Live Space Weather & Planetary Computer STAC Proxy
 * Serves https://aegissat.space/api/space-weather
 */
export async function onRequestGet() {
  const protonsUrl = "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json";
  const kpUrl = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
  const donkiUrl = "https://api.nasa.gov/DONKI/GST?api_key=DEMO_KEY";
  const stacUrl = "https://planetarycomputer.microsoft.com/api/stac/v1/search";

  try {
    const [pSet, kSet, dSet, sSet] = await Promise.allSettled([
      fetch(protonsUrl, { headers: { "User-Agent": "AegisSat-Pages-Edge/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } }),
      fetch(kpUrl, { headers: { "User-Agent": "AegisSat-Pages-Edge/1.0" }, cf: { cacheTtl: 900, cacheEverything: true } }),
      fetch(donkiUrl, { headers: { "User-Agent": "AegisSat-Pages-Edge/1.0" }, cf: { cacheTtl: 3600, cacheEverything: true } }),
      fetch(stacUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "AegisSat-Pages-Edge/1.0" },
        body: JSON.stringify({ collections: ["sentinel-2-l2a"], bbox: [34.15, 36.95, 34.85, 37.35], limit: 1 }),
        cf: { cacheTtl: 1800, cacheEverything: true },
      }),
    ]);

    const pResp = pSet.status === "fulfilled" ? pSet.value : null;
    const kResp = kSet.status === "fulfilled" ? kSet.value : null;
    const dResp = dSet.status === "fulfilled" ? dSet.value : null;
    const sResp = sSet.status === "fulfilled" ? sSet.value : null;

    let pfu10 = null;
    if (pResp && pResp.ok) {
      const pData = await pResp.json();
      const filtered = pData.filter((d) => String(d.energy || "").startsWith(">=10"));
      if (filtered.length > 0) pfu10 = Number(filtered[filtered.length - 1].flux);
    }

    let kp = null;
    if (kResp && kResp.ok) {
      const kData = await kResp.json();
      if (Array.isArray(kData) && kData.length > 0) {
        const last = kData[kData.length - 1];
        kp = typeof last === "object" && !Array.isArray(last) ? Number(last.Kp) : Number(last[1]);
      }
    }

    let donkiEvents = [];
    if (dResp && dResp.ok) {
      const dData = await dResp.json();
      if (Array.isArray(dData) && dData.length > 0) {
        donkiEvents = dData.slice(-3).map((ev) => ({
          gstID: ev.gstID || null,
          startTime: ev.startTime || null,
          kpIndex: Array.isArray(ev.allKpIndex) && ev.allKpIndex.length > 0 ? ev.allKpIndex[ev.allKpIndex.length - 1].kpIndex : null,
        }));
      }
    }

    let latestScene = null;
    if (sResp && sResp.ok) {
      const sData = await sResp.json();
      if (sData.features && sData.features.length > 0) {
        latestScene = {
          id: sData.features[0].id,
          datetime: sData.features[0].properties?.datetime || null,
        };
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        source: "NOAA SWPC + NASA DONKI GST + Planetary Computer Live Edge",
        updated_utc: new Date().toISOString(),
        goes_proton_10mev_pfu: pfu10,
        kp_index: kp,
        donki_events: donkiEvents,
        planetary_computer_latest_scene: latestScene,
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
