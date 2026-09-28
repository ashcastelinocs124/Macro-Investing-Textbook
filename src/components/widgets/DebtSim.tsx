import { useMemo, useState } from 'react';
import Chart from '../Chart.tsx';
import { debtPath, verdict } from '../../lib/debt.js';

export default function DebtSim() {
	const [rate, setRate] = useState(4);
	const [growth, setGrowth] = useState(3);
	const [primary, setPrimary] = useState(1.5);
	const path = useMemo(() => debtPath({ rate: rate / 100, growth: growth / 100, primary: primary / 100 }), [rate, growth, primary]);
	const end = path.at(-1)![1];

	return (
		<div className="not-content">
			<div className="macro-widget" style={{ marginBottom: 0 }}>
				<h3>Will the debt snowball or shrink?</h3>
				<p className="sub">Simplified model. Debt starts at 100% of GDP. Each year: debt × (1 + interest) ÷ (1 + growth) + the deficit before interest.</p>
				<label>
					Interest rate on the debt: <strong>{rate.toFixed(1)}%</strong>
					<input type="range" min={0} max={10} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
				</label>
				<label>
					Economic growth (nominal): <strong>{growth.toFixed(1)}%</strong>
					<input type="range" min={0} max={8} step={0.5} value={growth} onChange={(e) => setGrowth(Number(e.target.value))} />
				</label>
				<label>
					Deficit before interest: <strong>{primary.toFixed(1)}% of GDP</strong>
					<input type="range" min={-3} max={6} step={0.5} value={primary} onChange={(e) => setPrimary(Number(e.target.value))} />
				</label>
				<p aria-live="polite" style={{ margin: '0.5rem 0 0' }}>
					After 20 years debt is <strong>{Math.round(end)}% of GDP</strong>: <strong>{verdict(path).toLowerCase()}</strong>. Interest minus growth is{' '}
					<strong>{rate - growth >= 0 ? '+' : '−'}{Math.abs(rate - growth).toFixed(1)} points</strong>.
				</p>
			</div>
			<Chart
				xLabel="Year"
				title="Government debt as a share of GDP"
				units="% of GDP"
				lines={[
					{ label: 'Debt', points: path as [number, number][] },
					{ label: 'Starting level (100%)', points: [[0, 100], [20, 100]] },
				]}
				source="Simplified model"
				asOf="n/a (simulation)"
				note="x-axis: years from today"
			/>
		</div>
	);
}
