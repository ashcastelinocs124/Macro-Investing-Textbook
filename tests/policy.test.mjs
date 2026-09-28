import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthlyPayment, transmit } from '../src/lib/monetary.js';
import { debtPath, verdict } from '../src/lib/debt.js';

test('mortgage payment matches the standard annuity example and grows with the rate', () => {
	assert.equal(Math.round(monthlyPayment(6)), 1799); // $300k, 30 years, 6%
	assert.ok(transmit(2).payment > transmit(0).payment && transmit(-2).payment < transmit(0).payment);
});

test('a rate rise lowers inflation with a lag and costs jobs; no change changes nothing', () => {
	const up = transmit(4);
	assert.equal(up.inflationPath[0][1], 4);
	assert.ok(up.inflationPath[4][1] > up.inflation && up.inflation < 4);
	assert.ok(up.unemployment > 0);
	assert.deepEqual(transmit(0).inflationPath.map(([, v]) => v), Array(13).fill(4));
});

test('debt shrinks when growth beats interest, snowballs when interest beats growth with deficits', () => {
	assert.equal(verdict(debtPath({ rate: 0.02, growth: 0.04, primary: 0 })), 'Shrinking');
	assert.equal(verdict(debtPath({ rate: 0.08, growth: 0.01, primary: 0.03 })), 'Snowballing');
	assert.equal(debtPath({ rate: 0.04, growth: 0.04, primary: 0 }).at(-1)[1], 100); // stable when r = g and no deficit
});
