import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yoy, since, recessionRanges, around, withGaps } from '../src/lib/series.js';

const monthly = Array.from({ length: 13 }, (_, i) => [`2020-${String((i % 12) + 1).padStart(2, '0')}-01`, 100 + i * (10 / 12)]);
monthly[12][0] = '2021-01-01';

test('yoy compares each point with the one a year earlier', () => {
	const out = yoy(monthly);
	assert.equal(out.length, 1);
	assert.equal(out[0][0], '2021-01-01');
	assert.ok(Math.abs(out[0][1] - 10) < 1e-9);
});

test('yoy returns nothing when there is less than a year of data', () => {
	assert.deepEqual(yoy(monthly.slice(0, 5)), []);
});

test('yoy skips a zero base instead of returning Infinity', () => {
	assert.deepEqual(yoy([['2020-01-01', 0], ['2021-01-01', 5]]), []);
});

test('since keeps points on or after the date', () => {
	assert.deepEqual(since([['2019-12-01', 1], ['2020-01-01', 2]], '2020-01-01'), [['2020-01-01', 2]]);
});

test('recessionRanges finds closed and still-open recessions', () => {
	const pts = [['2020-01-01', 0], ['2020-02-01', 1], ['2020-03-01', 1], ['2020-04-01', 0], ['2020-05-01', 1]];
	assert.deepEqual(recessionRanges(pts), [
		{ from: '2020-02-01', to: '2020-04-01' },
		{ from: '2020-05-01', to: '2020-05-01' },
	]);
});

test('recessionRanges of empty input is empty', () => {
	assert.deepEqual(recessionRanges([]), []);
});

test('yoy matches the same month a year earlier even when a month is missing', () => {
	// October 2020 is missing (like Oct 2025 in real CPI data, skipped during the shutdown).
	const pts = [
		['2020-09-01', 100], ['2020-11-01', 110], ['2020-12-01', 120],
		['2021-09-01', 105], ['2021-11-01', 121], ['2021-12-01', 126],
	];
	const out = yoy(pts);
	assert.deepEqual(out.map(([d]) => d), ['2021-09-01', '2021-11-01', '2021-12-01']);
	assert.ok(Math.abs(out[1][1] - 10) < 1e-9, `Nov 2021 vs Nov 2020 should be 10%, got ${out[1][1]}`);
});

test('yoy for quarterly data looks back 4 quarters by date', () => {
	const pts = [['2020-01-01', 100], ['2020-04-01', 90], ['2021-01-01', 102], ['2021-04-01', 99]];
	assert.deepEqual(yoy(pts).map(([d, v]) => [d, Math.round(v)]), [['2021-01-01', 2], ['2021-04-01', 10]]);
});

test('around keeps points within N months either side of a date', () => {
	const pts = ['2019-12-01', '2020-01-01', '2020-03-01', '2020-05-01', '2020-06-01'].map((d, i) => [d, i]);
	assert.deepEqual(around(pts, '2020-03-01', 2, 2).map(([d]) => d), ['2020-01-01', '2020-03-01', '2020-05-01']);
});

test('around crosses year boundaries', () => {
	const pts = [['2019-11-01', 1], ['2020-02-01', 2]];
	assert.deepEqual(around(pts, '2020-01-01', 2, 1), pts);
});

test('withGaps inserts a null for each missing month so charts show a break', () => {
	const pts = [['2025-09-01', 3], ['2025-11-01', 2.7]];
	assert.deepEqual(withGaps(pts), [['2025-09-01', 3], ['2025-10-01', null], ['2025-11-01', 2.7]]);
});
