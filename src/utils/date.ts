export abstract class DateUtils {
	static isDate(dateAsString) {
		return !Number.isNaN(new Date(dateAsString))
	}
}