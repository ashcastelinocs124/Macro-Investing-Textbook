import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmtWhen, fmtValue } from '../src/lib/format.js';

test('dates read as month and year', () => {
	assert.equal(fmtWhen(new Date('2025-09-01')), 'Sep 2025');
	assert.equal(fmtWhen(new Date('2025-07-01'), 'Year'), '2025');
});

test('model x-values use the axis name', () => {
	assert.equal(fmtWhen(12, 'Quarter'), 'Quarter 12');
	assert.equal(fmtWhen(5), '5');
});

test('percent values get a % sign and two decimals', () => {
	assert.equal(fmtValue(3.02361, '%'), '3.02%');
	assert.equal(fmtValue(1.5, '% of income'), '1.50% of income');
	assert.equal(fmtValue(1.64, '% points'), '1.64 pts');
});

test('dollar values get a $ sign and thousands separators', () => {
	assert.equal(fmtValue(10062.6, '$'), '$10,063');
	assert.equal(fmtValue(83.9, '$ per barrel'), '$83.90 per barrel');
});

test('other units are appended', () => {
	assert.equal(fmtValue(26494.2, 'index'), '26,494 index');
	assert.equal(fmtValue(1.3547, '$ per £'), '$1.35 per £');
	assert.equal(fmtValue(158.85, 'yen per $'), '158.85 yen per $');
});

test('economy headline numbers carry their own year', async () => {
	const { headline } = await import('../src/lib/economies.js');
	const e = { gdp_usd: [['2025-07-01', 4.435e12]], growth: [['2025-07-01', 1.19]], inflation: [['2024-07-01', 2.95]], unemployment: [['2025-07-01', 2.45]] };
	assert.deepEqual(headline(e).map((s) => `${s.label} ${s.year}: ${s.text}`), [
		'GDP 2025: $4.4 trillion', 'Real growth 2025: 1.2%', 'Inflation 2024: 3.0%', 'Unemployment 2025: 2.5%',
	]);
});
