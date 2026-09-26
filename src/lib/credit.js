// Simplified teaching model of a credit cycle; not a forecast.
export const BUST_THRESHOLD = 0.35; // debt service above 35% of income is unsustainable
const BUST_QUARTERS = 8;

export function simulateCreditCycle({ rate, appetite, quarters = 60 }) {
	let debt = 100;
	let income = 100;
	let bustLeft = 0;
	const rows = [];
	for (let q = 1; q <= quarters; q++) {
		const dsr = (debt * (rate / 100 + 0.1)) / income; // interest + 10%/yr principal, as a share of income
		if (bustLeft === 0 && dsr > BUST_THRESHOLD) bustLeft = BUST_QUARTERS;
		if (bustLeft > 0) {
			debt *= 0.97; // defaults and paydown
			income *= 0.99; // recession
			bustLeft--;
			rows.push({ q, dsr: (debt * (rate / 100 + 0.1)) / income, bust: true });
		} else {
			debt *= 1 + (0.005 + appetite * 0.04 - rate / 400); // cheap, easy credit grows debt faster
			income *= 1.005; // ~2% a year
			rows.push({ q, dsr: (debt * (rate / 100 + 0.1)) / income, bust: false });
		}
	}
	return rows;
}
