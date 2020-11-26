export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export abstract class DateUtils {
	private static readonly WEEK_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

	static isDate(dateAsString) {
		return !Number.isNaN(new Date(dateAsString))
	}

	static isFutureDate(date) {
		return new Date(date).getTime() > this.addDays(this.trimTime(Date.now()), -1)
			.getTime()
	}

	static getWeekDay(date) {
		return this.WEEK_DAYS[new Date(date).getDay()]
	}

	static getMinutes(date) {
		date = date instanceof Date ? date : new Date(date)

		return date.getHours() * 60 + date.getMinutes()
	}

	static addMinutes(date, minutes) {
		return new Date(new Date(date).getTime() + (minutes * MINUTE))
	}

	static addHours(date, hours) {
		return new Date(new Date(date).getTime() + (hours * HOUR))
	}

	static addDays(date, days) {
		return new Date(new Date(date).getTime() + (days * DAY))
	}

	static trimTime(date) {
		date = new Date(date)

		date.setMilliseconds(0)
		date.setSeconds(0)
		date.setMinutes(0)
		date.setHours(0)

		return date
	}
}
