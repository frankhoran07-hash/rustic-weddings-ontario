globalThis.process ??= {};
globalThis.process.env ??= {};
import { n as __exportAll } from "./rolldown-runtime_BDykq6kg.mjs";
import { d as renderHead, i as renderComponent, l as renderTemplate } from "./server_Dxa3Krkp.mjs";
import { t as createComponent } from "./compiler_zqOqP_IP.mjs";
import { t as createClient } from "./dist_U3FUDA_P.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const supabaseUrl = "https://ayuxdwqobvtigdlcvmin.supabase.co";
	const supabaseKey = "sb_publishable_gJJB7fRJUEyFWeRk5V9Bzg_XbvPE1-W";
	let initialVenues = [];
	{
		const { data, error } = await createClient(supabaseUrl, supabaseKey).from("venues").select("id, name, slug, city, region, latitude, longitude").order("name", { ascending: true }).limit(50);
		if (!error && data) initialVenues = data;
	}
	return renderTemplate`<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Find Rustic Wedding Venues Across Ontario | Rustic Weddings Ontario</title><meta name="description" content="Browse rustic wedding venues, barn spaces, and farm estates across Ontario. Search by town or city to find venues near you."><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">${renderHead($$result)}</head><body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafaf9; color: #1c1917; margin: 0; padding: 0;"><header style="background-color: #ffffff; border-bottom: 1px solid #e7e5e4; padding: 16px 24px;"><div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;"><a href="/" style="font-size: 20px; font-weight: 700; color: #78350f; text-decoration: none;">Rustic Weddings Ontario</a><nav style="display: flex; gap: 20px;"><a href="/" style="color: #44403c; text-decoration: none; font-size: 15px;">Home</a><a href="/venues" style="color: #78350f; font-weight: 600; text-decoration: none; font-size: 15px;">Venues</a></nav></div></header><main style="max-width: 1200px; margin: 0 auto; padding: 40px 20px 80px 20px;"><div style="margin-bottom: 32px;"><h1 style="font-size: 32px; font-weight: 800; color: #292524; margin: 0 0 10px 0;">Explore Rustic Wedding Venues in Ontario</h1><p style="font-size: 16px; color: #57534e; margin: 0; max-width: 720px; line-height: 1.5;">Search by town or city to find barn venues, country estates, and waterfront properties near you. Pan the interactive map to browse locations across the province.</p></div><!-- Interactive React Search + Leaflet Map Component -->${renderComponent($$result, "VenueExplorer", null, {
		"client:only": "react",
		"initialVenues": initialVenues,
		"client:component-hydration": "only",
		"client:component-path": "C:/Users/helic/rustic-weddings-ontario/src/components/VenueExplorer.jsx",
		"client:component-export": "default"
	})}</main><footer style="background-color: #292524; color: #d6d3d1; padding: 40px 20px; text-align: center; font-size: 14px; margin-top: 40px;"><p style="margin: 0 0 8px 0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Rustic Weddings Ontario. All rights reserved.</p><div style="display: flex; justify-content: center; gap: 16px;"><a href="/privacy-policy" style="color: #a8a29e; text-decoration: none;">Privacy Policy</a><a href="/terms" style="color: #a8a29e; text-decoration: none;">Terms of Service</a><a href="/contact" style="color: #a8a29e; text-decoration: none;">Contact Us</a></div></footer></body></html>`;
}, "C:/Users/helic/rustic-weddings-ontario/src/pages/index.astro", void 0);
var $$file = "C:/Users/helic/rustic-weddings-ontario/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
