export abstract class NumberUtils {
	static isNumber(num) {
		return !Number.isNaN(Number(num))
	}
}