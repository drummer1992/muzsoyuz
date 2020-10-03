export abstract class NumberUtils {
	static isNumber(num, predicate: (params: any) => boolean) {
		return !Number.isNaN(Number(num)) && (!predicate || predicate(num))
	}
}