import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yoy, since, recessionRanges } from '../src/lib/series.js';

const monthly = Array.from({ length: 13 }, (_, i) => [`2020-${String((i % 12) + 1).padStart(2, '0')}-01`, 100 + i * (10 / 12)]);
monthly[12][0] = '2021-01-01';

test('yoy compares each point with the one a year earlier', () => {
	const out = yoy(monthly, 12);
	assert.equal(out.length, 1);
	assert.equal(out[0][0], '2021-01-01');
	assert.ok(Math.abs(out[0][1] - 10) < 1e-9);
});

test('yoy returns nothing when there is less than a year of data', () => {
	assert.deepEqual(yoy(monthly.slice(0, 5), 12), []);
});

test('yoy skips a zero base instead of returning Infinity', () => {
	assert.deepEqual(yoy([['2020-01-01', 0], ['2021-01-01', 5]], 1), []);
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
