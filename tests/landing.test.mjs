import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bookCounts, glossaryTermCount, glossaryEntry } from '../src/lib/landing.js';

test('bookCounts splits chapters from country and bank pages, ignoring overviews and other pages', () => {
	const ids = [
		'index',
		'glossary',
		'start-here/what-is-an-investment',
		'part-1-economy',
		'part-1-economy/02-growth-inflation-cycle',
		'part-1-economy/five-big-economies/china',
		'part-2-policy/central-banks/federal-reserve',
		'part-3-assets',
	];
	assert.deepEqual(bookCounts(ids), { chapters: 2, deepDives: 2 });
});

test('glossary helpers read the real glossary', () => {
	const body = readFileSync(new URL('../src/content/docs/glossary.mdx', import.meta.url), 'utf8');
	assert.ok(glossaryTermCount(body) >= 30);
	assert.match(glossaryEntry(body, 'Basis point'), /^One hundredth of one percent/);
	assert.match(glossaryEntry(body, 'CPI (Consumer Price Index)'), /\S/);
	assert.equal(glossaryEntry(body, 'Not a term'), undefined);
});
