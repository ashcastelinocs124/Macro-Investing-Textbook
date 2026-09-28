import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../src/data/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const registry = JSON.parse(readFileSync(new URL('../scripts/series.json', import.meta.url), 'utf8'));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

test('every registered series has a snapshot', () => {
	for (const s of registry) assert.ok(files.includes(`${s.id}.json`), `missing src/data/${s.id}.json`);
});

for (const f of files) {
	test(`${f} is a valid snapshot`, () => {
		const d = JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
		assert.equal(`${d.series_id}.json`, f);
		for (const k of ['title', 'units', 'source']) assert.equal(typeof d[k], 'string', k);
		assert.match(d.as_of, DATE);
		assert.ok(Array.isArray(d.points) && d.points.length > 0, 'no points');
		let prev = '';
		for (const [date, value] of d.points) {
			assert.match(date, DATE);
			assert.ok(Number.isFinite(value), `non-finite value on ${date}`);
			assert.ok(date > prev, `dates not ascending at ${date}`);
			prev = date;
		}
		assert.equal(d.as_of, d.points.at(-1)[0]);
	});
}

test('every timeline chart uses a registered series', async () => {
	const { EVENTS } = await import('../src/lib/timeline-events.js');
	const ids = new Set(registry.map((s) => s.id));
	for (const e of EVENTS) for (const id of e.chart?.series ?? []) assert.ok(ids.has(id), `${e.year} uses unregistered series ${id}`);
});

test('big-economies.json has every measure for all five economies', () => {
	const d = JSON.parse(readFileSync(new URL('worldbank/big-economies.json', dir), 'utf8'));
	assert.deepEqual(Object.keys(d.economies).sort(), ['CHN', 'EUU', 'IND', 'JPN', 'USA']);
	for (const [iso3, e] of Object.entries(d.economies)) {
		for (const m of ['gdp_usd', 'growth', 'inflation', 'unemployment']) {
			assert.ok(e[m]?.length > 20, `${iso3} ${m} is missing or short`);
			for (const [date, v] of e[m]) assert.ok(DATE.test(date) && Number.isFinite(v), `${iso3} ${m} bad point ${date}`);
		}
	}
});
