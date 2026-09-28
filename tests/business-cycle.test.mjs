import { test } from 'node:test';
import assert from 'node:assert/strict';
import { businessCycle } from '../src/lib/business-cycle.js';

test('turning points alternate trough/peak and sit on the curve', () => {
	const { turns } = businessCycle();
	assert.deepEqual(turns.map((t) => t.kind), ['Trough', 'Peak', 'Trough', 'Peak']);
	// y grows down in SVG: each peak is above (smaller y than) its neighbouring troughs.
	for (let i = 1; i < turns.length; i++) {
		const [prev, cur] = [turns[i - 1], turns[i]];
		assert.ok(cur.kind === 'Peak' ? cur.y < prev.y : cur.y > prev.y);
	}
});

test('phases cover the curve from the first trough to the right edge', () => {
	const { phases, turns } = businessCycle();
	assert.deepEqual(phases.map((p) => p.kind), ['Expansion', 'Contraction', 'Expansion', 'Contraction']);
	assert.equal(phases[0].from, turns[0].x);
	assert.equal(phases.at(-1).to, 620);
	phases.slice(1).forEach((p, i) => assert.equal(p.from, phases[i].to));
});
