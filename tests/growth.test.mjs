import { test } from 'node:test';
import assert from 'node:assert/strict';
import { growthPath } from '../src/lib/growth.js';

test('starts at the initial amount in year 0', () => {
	assert.deepEqual(growthPath(1000, 5, 0), [[0, 1000]]);
});

test('compounds once a year', () => {
	const path = growthPath(1000, 10, 2);
	assert.equal(path.length, 3);
	assert.ok(Math.abs(path[2][1] - 1210) < 1e-9, `expected 1210, got ${path[2][1]}`);
});

test('a 0% return keeps the amount flat', () => {
	assert.ok(growthPath(500, 0, 30).every(([, v]) => v === 500));
});
