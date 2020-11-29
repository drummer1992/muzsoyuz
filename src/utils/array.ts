export function intersection(a: string[], b: string[]): string[] {
	return a.filter(x => b.indexOf(x) !== -1)
}

export function difference(a: string[], b: string[]): string[] {
	return a.filter(x => b.indexOf(x) === -1)
}

export function toArray(value) {
	return Array.isArray(value) ? value : [value]
}