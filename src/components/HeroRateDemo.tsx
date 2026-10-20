import { useState } from 'react';
import { transmit } from '../lib/monetary.js';

const money = (n: number) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
const points = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(n % 1 ? 2 : 1);

// Landing-page hero card (deep-ml's "live problem" slot): chapter 4's rate model in miniature.
export default function HeroRateDemo() {
	const [change, setChange] = useState(1);
	const r = transmit(change);
	const diff = r.payment - r.paymentBefore;

	return (
		<div className="landing-card landing-demo">
			<div className="landing-card-head">
				<span className="landing-label">policy rate → your mortgage</span>
				<span className="landing-pill"><i aria-hidden="true" />simplified model</span>
			</div>
			<div className="landing-demo-body">
				<label>
					<span className="landing-demo-q">
						Central bank changes its rate by <output>{points(change)} pt</output>
					</span>
					<input
						type="range"
						min={-2}
						max={2}
						step={0.25}
						value={change}
						aria-valuetext={`${points(change)} percentage points`}
						onChange={(e) => setChange(Number(e.target.value))}
					/>
				</label>
				<div className="landing-ticks" aria-hidden="true"><span>−2</span><span>0</span><span>+2</span></div>
				<ul className="landing-results" aria-live="polite">
					<li><span>Policy rate</span><b>{r.policy.toFixed(2)}%</b></li>
					<li><span>30-year mortgage rate</span><b>{r.mortgage.toFixed(2)}%</b></li>
					<li><span>Payment on $300k</span><b>{money(r.payment)} <em>{diff < 0 ? '−' : '+'}{money(diff)}</em></b></li>
					<li><span>Inflation two years on</span><b>{r.inflation.toFixed(2)}%</b></li>
				</ul>
			</div>
		</div>
	);
}
