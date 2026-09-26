import { test } from 'node:test';
import assert from 'node:assert/strict';
import { score, loadBest, saveBest } from '../src/lib/quiz.js';

const fakeStorage = (init = {}) => {
	const m = new Map(Object.entries(init));
	return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), map: m };
};
const blocked = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
const qs = [{ answer: 0 }, { answer: 2 }, { answer: 1 }];

test('score counts correct picks and ignores unanswered ones', () => {
	assert.equal(score(qs, [0, 2, 0]), 2);
	assert.equal(score(qs, [0]), 1);
	assert.equal(score(qs, []), 0);
});

test('loadBest reads a stored score', () => {
	assert.equal(loadBest(fakeStorage({ 'quiz:ch1': '3' }), 'ch1'), 3);
});

test('loadBest treats missing or corrupt values as 0', () => {
	assert.equal(loadBest(fakeStorage(), 'ch1'), 0);
	assert.equal(loadBest(fakeStorage({ 'quiz:ch1': 'banana' }), 'ch1'), 0);
	assert.equal(loadBest(fakeStorage({ 'quiz:ch1': '-2' }), 'ch1'), 0);
});

test('saveBest only overwrites with a higher score', () => {
	const s = fakeStorage({ 'quiz:ch1': '3' });
	saveBest(s, 'ch1', 2);
	assert.equal(s.map.get('quiz:ch1'), '3');
	saveBest(s, 'ch1', 4);
	assert.equal(s.map.get('quiz:ch1'), '4');
});

test('blocked storage (private mode) never throws', () => {
	assert.equal(loadBest(blocked, 'ch1'), 0);
	assert.doesNotThrow(() => saveBest(blocked, 'ch1', 3));
});
