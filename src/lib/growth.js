/** Value of `amount` growing at `ratePct` per year, compounded yearly: [[year, value], …] for years 0..years. */
export function growthPath(amount, ratePct, years) {
	return Array.from({ length: years + 1 }, (_, y) => [y, amount * (1 + ratePct / 100) ** y]);
}
