import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sparkline } from '../src/lib/sparkline.js';

test('maps the first point to bottom-left and the last to top-right', () => {
	const { d } = sparkline([['2020-01-01', 0], ['2021-01-01', 10]], 100, 50, 0);
	assert.equal(d, 'M0.0,50.0L100.0,0.0');
});

test('x() places a date proportionally along the width', () => {
	const { x } = sparkline([['2020-01-01', 0], ['2022-01-01', 1]], 100, 50, 0);
	assert.ok(Math.abs(x('2021-01-01') - 50) < 0.2);
});

test('a flat series does not divide by zero', () => {
	const { d } = sparkline([['2020-01-01', 5], ['2021-01-01', 5]], 100, 50, 0);
	assert.equal(d, 'M0.0,50.0L100.0,50.0');
});

test('fewer than two points draws nothing', () => {
	assert.equal(sparkline([['2020-01-01', 5]], 100, 50).d, '');
});
