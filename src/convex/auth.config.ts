// Add support for both www and apex domains; include a safe dev fallback
const site = process.env.SITE_URL;
const providers: Array<{ domain: string | undefined; applicationID: string }> = [];

console.log(`[AUTH CONFIG] SITE_URL: ${site}`);

if (site) {
  // Add primary domain
  providers.push({ domain: site, applicationID: "convex" });
  console.log(`[AUTH CONFIG] Added primary domain: ${site}`);
  
  // Add alternate domain (www variant)
  try {
    const u = new URL(site);
    const host = u.hostname;
    const altHost = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
    const altUrl = `${u.protocol}//${altHost}`;
    if (altUrl !== site) {
      providers.push({ domain: altUrl, applicationID: "convex" });
      console.log(`[AUTH CONFIG] Added alternate domain: ${altUrl}`);
    }
  } catch (e) {
    console.error(`[AUTH CONFIG] Failed to parse SITE_URL:`, e);
  }
} else {
  // Dev fallback (only used if SITE_URL is not provided)
  providers.push({ domain: "http://localhost:5173", applicationID: "convex" });
  console.log(`[AUTH CONFIG] Using dev fallback: http://localhost:5173`);
}

console.log(`[AUTH CONFIG] Final providers:`, providers);

export default {
  providers,
};