// Pure helpers for the keyless World Bank API (api.worldbank.org/v2, format=json).

/** [meta, rows] → [{ iso3, country, year, value }], dropping null values. */
export function parseWorldBank(json) {
	if (!Array.isArray(json) || json[0]?.message) {
		throw new Error(`World Bank API error: ${JSON.stringify(json?.[0]?.message ?? json).slice(0, 120)}`);
	}
	return (json[1] ?? [])
		.filter((r) => r.value !== null && r.countryiso3code)
		.map((r) => ({ iso3: r.countryiso3code, country: r.country.value, year: Number(r.date), value: r.value }));
}

/** ISO3 codes of real countries from the /country endpoint (aggregates like "World" have region id "NA"). */
export function realCountries(json) {
	return new Set((json[1] ?? []).filter((c) => c.region?.id !== 'NA').map((c) => c.id));
}

/** The n largest economies by GDP, with household-consumption and industry shares of GDP. */
// ponytail: a country missing either share is skipped, so the list is "largest with complete data".
export function topEconomies(countries, gdp, consumption, industry, n) {
	const share = (rows) => new Map(rows.map((r) => [r.iso3, r.value]));
	const [c, ind] = [share(consumption), share(industry)];
	return gdp
		.filter((r) => countries.has(r.iso3) && c.has(r.iso3) && ind.has(r.iso3))
		.sort((a, b) => b.value - a.value)
		.slice(0, n)
		.map((r) => ({ iso3: r.iso3, country: r.country, year: r.year, gdp_usd: r.value, consumption_pct: c.get(r.iso3), industry_pct: ind.get(r.iso3) }));
}

/** Rows of several indicators for a few economies → { iso3: { name, <measure>: [[YYYY-07-01, value]] } }, years ascending. */
// ponytail: a yearly value is dated mid-year (July 1) so charts centre each point on its year.
export function economySeries(byMeasure) {
	const out = {};
	for (const [measure, rows] of Object.entries(byMeasure)) {
		for (const r of rows) {
			const e = (out[r.iso3] ??= { name: r.country });
			(e[measure] ??= []).push([`${r.year}-07-01`, r.value]);
		}
	}
	for (const e of Object.values(out)) for (const [k, v] of Object.entries(e)) if (k !== 'name') v.sort(([a], [b]) => (a < b ? -1 : 1));
	return out;
}
