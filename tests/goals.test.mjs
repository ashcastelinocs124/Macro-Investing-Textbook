import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chinaTargets, targetLines } from '../src/lib/china-targets.js';

test('targets are in order, ranges are valid, 2020 is absent', () => {
	chinaTargets.forEach((t, i) => {
		assert.ok(t.low <= t.high && t.url.startsWith('https://'));
		if (i) assert.ok(t.year > chinaTargets[i - 1].year);
	});
	assert.ok(!chinaTargets.some((t) => t.year === 2020));
});

test('ranges plot at their midpoint and actual growth keeps 2020', () => {
	const [target, actual] = targetLines(chinaTargets, [['2019-07-01', 6.0], ['2020-07-01', 2.2], ['2010-07-01', 10.6]]);
	assert.deepEqual(target.points.find(([d]) => d === '2026-07-01'), ['2026-07-01', 4.75]);
	assert.deepEqual(actual.points.map(([d]) => d), ['2019-07-01', '2020-07-01']);
});

test('goalLine is flat across the dates of the data', async () => {
	const { goalLine } = await import('../src/lib/economies.js');
	assert.deepEqual(goalLine('Target', 2, [['2013-01-01', 1], ['2015-01-01', 3], ['2016-01-01', 5]]).points, [['2013-01-01', 2], ['2016-01-01', 2]]);
});
