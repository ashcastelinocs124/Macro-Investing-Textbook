// Build-time only: slices each timeline moment's chart window out of the data snapshots,
// so the client island receives a few dozen points per moment instead of whole series.
import { EVENTS } from './timeline-events.js';
import { around, yoy, withGaps } from './series.js';

const snapshots = import.meta.glob('../data/*.json', { eager: true, import: 'default' });
const snap = (id) => snapshots[`../data/${id}.json`];

export const timelineCharts = EVENTS.map((e) => {
	const c = e.chart;
	if (!c) return null;
	const lines = c.series.map((id, k) => {
		const points = c.transform === 'yoy' ? yoy(snap(id).points) : snap(id).points;
		const window = around(points, c.mark, c.before, c.after);
		return { label: c.names[k], points: c.showGaps ? withGaps(window) : window };
	});
	return { title: c.names.join(' vs '), units: c.units, note: c.note, lines, mark: c.mark, asOf: c.series.map((id) => snap(id).as_of).sort()[0] };
});
