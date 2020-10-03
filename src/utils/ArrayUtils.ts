export class ArrayUtils {
	/**
	 * We are looking for intersection of values, which includes in both arrays
	 */
	
	static intersection(a: string[], b: string[]): string[] {
		return a.filter(x => b.indexOf(x) !== -1)
	}

	static toArray(value) {
		return Array.isArray(value) ? value : [value]
	}
}