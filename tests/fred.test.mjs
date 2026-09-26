import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFredCsv, toSnapshot } from '../scripts/lib/fred.mjs';

test('parses dates and numbers', () => {
	assert.deepEqual(parseFredCsv('observation_date,X\n2020-01-01,1.5\n2020-02-01,2\n'), [
		['2020-01-01', 1.5],
		['2020-02-01', 2],
	]);
});

test('skips missing observations written as empty or "."', () => {
	const csv = 'observation_date,DGS10\n1962-02-12,\n1962-02-13,.\n1962-02-14,4.1\n';
	assert.deepEqual(parseFredCsv(csv), [['1962-02-14', 4.1]]);
});

test('handles CRLF line endings', () => {
	assert.deepEqual(parseFredCsv('observation_date,X\r\n2020-01-01,3\r\n'), [['2020-01-01', 3]]);
});

test('rejects a non-CSV response (e.g. an HTML error page)', () => {
	assert.throws(() => parseFredCsv('<!DOCTYPE html><html><body>Too many requests</body></html>'), /Unexpected FRED CSV header/);
});

test('rejects a non-numeric value instead of charting NaN', () => {
	assert.throws(() => parseFredCsv('observation_date,X\n2020-01-01,abc\n'), /Bad value "abc" on 2020-01-01/);
});

test('toSnapshot sets as_of to the last observation date', () => {
	const snap = toSnapshot({ id: 'UNRATE', title: 'Unemployment rate', units: '%' }, [['2026-07-01', 4.2], ['2026-08-01', 4.1]]);
	assert.deepEqual(snap, {
		series_id: 'UNRATE',
		title: 'Unemployment rate',
		units: '%',
		source: 'FRED',
		as_of: '2026-08-01',
		points: [['2026-07-01', 4.2], ['2026-08-01', 4.1]],
	});
});

test('toSnapshot refuses zero points', () => {
	assert.throws(() => toSnapshot({ id: 'X', title: 'X', units: '' }, []), /X: no data points/);
});
