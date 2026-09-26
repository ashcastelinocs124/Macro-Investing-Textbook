import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCreditCycle, BUST_THRESHOLD } from '../src/lib/credit.js';

test('returns one row per quarter', () => {
	assert.equal(simulateCreditCycle({ rate: 4, appetite: 0.5 }).length, 60);
	assert.equal(simulateCreditCycle({ rate: 4, appetite: 0.5, quarters: 8 }).length, 8);
});

test('loose lending with cheap money ends in a bust', () => {
	const rows = simulateCreditCycle({ rate: 2, appetite: 0.9 });
	assert.ok(rows.some((r) => r.bust), 'expected a bust within 15 years');
});

test('tight lending with normal rates never busts', () => {
	const rows = simulateCreditCycle({ rate: 5, appetite: 0.1 });
	assert.ok(rows.every((r) => !r.bust));
});

test('a bust only starts once debt service crosses the threshold', () => {
	const rows = simulateCreditCycle({ rate: 2, appetite: 0.9 });
	const first = rows.findIndex((r) => r.bust);
	assert.ok(rows[first - 1].dsr > BUST_THRESHOLD);
});

test('debt service falls during a bust (deleveraging)', () => {
	const rows = simulateCreditCycle({ rate: 2, appetite: 0.9 });
	const first = rows.findIndex((r) => r.bust);
	assert.ok(rows[first + 7].dsr < rows[first - 1].dsr);
});
