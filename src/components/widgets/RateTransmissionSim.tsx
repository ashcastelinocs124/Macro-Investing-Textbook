import { useMemo, useState } from 'react';
import Chart from '../Chart.tsx';
import { transmit, START_INFLATION, LAG_QUARTERS } from '../../lib/monetary.js';

const pp = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)} pp`;

export default function RateTransmissionSim() {
	const [change, setChange] = useState(2);
	const r = useMemo(() => transmit(change), [change]);
	const diff = Math.round(r.payment - r.paymentBefore);

	return (
		<div className="not-content">
			<div className="macro-widget" style={{ marginBottom: 0 }}>
				<h3>What happens when the central bank changes its rate?</h3>
				<p className="sub">Simplified model. It starts from a 4% policy rate and 4% inflation. Inflation takes about two years to feel the full effect.</p>
				<label>
					Policy rate change: <strong>{pp(change)}</strong> (new rate {r.policy.toFixed(1)}%)
					<input type="range" min={-3} max={5} step={0.25} value={change} onChange={(e) => setChange(Number(e.target.value))} />
				</label>
				<p aria-live="polite" style={{ margin: '0.5rem 0 0' }}>
					Mortgage rate <strong>{r.mortgage.toFixed(1)}%</strong>. Payment on a $300,000 loan: <strong>${Math.round(r.payment).toLocaleString()}</strong> a month (
					{diff >= 0 ? '+' : '−'}${Math.abs(diff)} vs today). After {LAG_QUARTERS} quarters inflation is about <strong>{r.inflation.toFixed(1)}%</strong> and unemployment is{' '}
					<strong>{pp(r.unemployment)}</strong> from where it started.
				</p>
			</div>
			<Chart
				xLabel="Quarter"
				title="Inflation after the rate change"
				units="%"
				lines={[
					{ label: 'Inflation', points: r.inflationPath as [number, number][] },
					{ label: `Starting inflation (${START_INFLATION}%)`, points: [[0, START_INFLATION], [12, START_INFLATION]] },
				]}
				source="Simplified model"
				asOf="n/a (simulation)"
				note="x-axis: quarters after the change"
			/>
		</div>
	);
}
