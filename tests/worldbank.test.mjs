import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseWorldBank, realCountries, topEconomies } from '../scripts/lib/worldbank.mjs';

const row = (iso3, country, value, date = '2025') => ({ countryiso3code: iso3, country: { value: country }, date, value });

test('parseWorldBank returns rows and drops null values', () => {
	const json = [{ page: 1 }, [row('USA', 'United States', 30), row('XXX', 'Nowhere', null)]];
	assert.deepEqual(parseWorldBank(json), [{ iso3: 'USA', country: 'United States', year: 2025, value: 30 }]);
});

test('parseWorldBank rejects an API error payload', () => {
	assert.throws(() => parseWorldBank([{ message: [{ id: '120', value: 'Invalid value' }] }]), /World Bank API error/);
});

test('realCountries excludes aggregates like "World" or "High income"', () => {
	const json = [{}, [
		{ id: 'USA', region: { id: 'NAC' } },
		{ id: 'WLD', region: { id: 'NA', value: 'Aggregates' } },
	]];
	assert.deepEqual([...realCountries(json)], ['USA']);
});

test('topEconomies ranks countries by GDP and joins their shares', () => {
	const gdp = [
		{ iso3: 'USA', country: 'United States', year: 2025, value: 30e12 },
		{ iso3: 'CHN', country: 'China', year: 2025, value: 19e12 },
		{ iso3: 'WLD', country: 'World', year: 2025, value: 110e12 },
		{ iso3: 'DEU', country: 'Germany', year: 2025, value: 5e12 },
	];
	const consumption = [{ iso3: 'USA', value: 68 }, { iso3: 'CHN', value: 39 }];
	const industry = [{ iso3: 'USA', value: 17 }, { iso3: 'CHN', value: 36 }];
	const top = topEconomies(new Set(['USA', 'CHN', 'DEU']), gdp, consumption, industry, 2);
	assert.deepEqual(top, [
		{ iso3: 'USA', country: 'United States', year: 2025, gdp_usd: 30e12, consumption_pct: 68, industry_pct: 17 },
		{ iso3: 'CHN', country: 'China', year: 2025, gdp_usd: 19e12, consumption_pct: 39, industry_pct: 36 },
	]);
});

test('committed top-economies snapshot is complete', () => {
	const snap = JSON.parse(readFileSync(new URL('../src/data/worldbank/top-economies.json', import.meta.url), 'utf8'));
	assert.equal(snap.source, 'World Bank');
	assert.equal(snap.rows.length, 10);
	for (const r of snap.rows) {
		assert.ok(r.gdp_usd > 0 && Number.isFinite(r.consumption_pct) && Number.isFinite(r.industry_pct), `incomplete row for ${r.iso3}`);
	}
	assert.deepEqual(snap.rows.map((r) => r.gdp_usd), [...snap.rows.map((r) => r.gdp_usd)].sort((a, b) => b - a));
});
