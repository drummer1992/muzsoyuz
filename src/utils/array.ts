export class ArrayUtils {
	static intersection(a: string[], b: string[]): string[] {
		return a.filter(x => b.indexOf(x) !== -1)
	}

	static toArray(value) {
		return Array.isArray(value) ? value : [value]
	}
}