// Add support for both www and apex domains; include a safe dev fallback
const site = process.env.SITE_URL;
const providers: Array<{ domain: string | undefined; applicationID: string }> = [];

if (site) {
  providers.push({ domain: site, applicationID: "convex" });
  try {
    const u = new URL(site);
    const host = u.hostname;
    const altHost = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
    const altUrl = `${u.protocol}//${altHost}`;
    if (altUrl !== site) {
      providers.push({ domain: altUrl, applicationID: "convex" });
    }
  } catch {
    // no-op if SITE_URL isn't a valid URL
  }
} else {
  // Dev fallback (only used if SITE_URL is not provided)
  providers.push({ domain: "http://localhost:5173", applicationID: "convex" });
}

export default {
  providers,
};