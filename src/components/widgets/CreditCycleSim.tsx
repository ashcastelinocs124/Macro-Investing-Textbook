import { useMemo, useState } from 'react';
import Chart, { type Range } from '../Chart.tsx';
import { simulateCreditCycle, BUST_THRESHOLD } from '../../lib/credit.js';

export default function CreditCycleSim() {
	const [rate, setRate] = useState(3);
	const [appetite, setAppetite] = useState(0.7);
	const rows = useMemo(() => simulateCreditCycle({ rate, appetite }), [rate, appetite]);

	const ranges: Range[] = [];
	for (const r of rows) {
		const last = ranges.at(-1);
		if (r.bust && last && last.to === r.q - 1) last.to = r.q;
		else if (r.bust) ranges.push({ from: r.q, to: r.q, label: 'Bust' });
	}
	const firstBust = rows.find((r) => r.bust);

	return (
		<div className="not-content">
			<div className="macro-widget" style={{ marginBottom: 0 }}>
				<h3>Run a credit cycle</h3>
				<p className="sub">Simplified model. Borrowers take on debt until repayments eat too much of their income.</p>
				<label>
					Interest rate: <strong>{rate}%</strong>
					<input type="range" min={1} max={10} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
				</label>
				<label>
					Lending standards: <strong>{appetite <= 0.3 ? 'tight' : appetite >= 0.7 ? 'loose' : 'normal'}</strong>
					<input type="range" min={0} max={1} step={0.1} value={appetite} onChange={(e) => setAppetite(Number(e.target.value))} />
				</label>
				<p aria-live="polite" style={{ margin: '0.5rem 0 0' }}>
					{firstBust
						? `Debt repayments pass ${BUST_THRESHOLD * 100}% of income and the boom turns to bust in year ${Math.ceil(firstBust.q / 4)}.`
						: 'No bust in 15 years: borrowing grows slowly enough for incomes to keep up.'}
				</p>
			</div>
			<Chart
				title="Debt repayments as a share of income"
				units="% of income"
				lines={[{ label: 'Debt service ratio', points: rows.map((r) => [r.q, r.dsr * 100]) }]}
				ranges={ranges}
				source="Simplified model"
				asOf="n/a (simulation)"
				note="x-axis: quarters (4 per year)"
			/>
		</div>
	);
}
