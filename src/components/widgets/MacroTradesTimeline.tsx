import { useState } from 'react';
import Chart, { type Line } from '../Chart.tsx';
import { EVENTS } from '../../lib/timeline-events.js';

export type TimelineChart = { title: string; units: string; note: string; lines: Line[]; mark: string; asOf: string } | null;

export default function MacroTradesTimeline({ charts }: { charts: TimelineChart[] }) {
	const [i, setI] = useState(1);
	const e = EVENTS[i];
	const c = charts[i];
	return (
		<section className="not-content macro-widget">
			<h3>Moments that made global macro</h3>
			<p className="sub">Pick a year.</p>
			<div role="group" aria-label="Year" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
				{EVENTS.map((ev, j) => (
					<button key={ev.year} type="button" aria-pressed={i === j} onClick={() => setI(j)}>{ev.year}</button>
				))}
			</div>
			<div aria-live="polite">
				<strong>{e.year}: {e.title}</strong>
				<p style={{ margin: '0.4rem 0' }}>{e.what}</p>
				<p style={{ margin: '0.4rem 0' }}><em>Macro lesson:</em> {e.lesson}</p>
				<a href={e.source} target="_blank" rel="noopener">Source</a>
			</div>
			{c && (
				<Chart framed={false} title={c.title} units={c.units} note={c.note} lines={c.lines}
					ranges={[{ from: c.mark, to: `${c.mark.slice(0, 8)}28`, label: e.year }]} source="FRED" asOf={c.asOf} />
			)}
		</section>
	);
}
