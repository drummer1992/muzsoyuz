export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

const WEEK_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export function isDate(dateAsString) {
	return !Number.isNaN(new Date(dateAsString))
}

export function isFutureDate(date) {
	return new Date(date).getTime() > this.trimTime(Date.now()).getTime()
}

export function getWeekDay(date) {
	return this.WEEK_DAYS[new Date(date).getDay()]
}

export function getMinutes(date) {
	date = date instanceof Date ? date : new Date(date)

	return date.getHours() * 60 + date.getMinutes()
}

export function addMinutes(date, minutes) {
	return new Date(new Date(date).getTime() + (minutes * MINUTE))
}

export function addHours(date, hours) {
	return new Date(new Date(date).getTime() + (hours * HOUR))
}

export function addDays(date, days) {
	return new Date(new Date(date).getTime() + (days * DAY))
}

export function trimTime(date) {
	date = new Date(date)

	date.setMilliseconds(0)
	date.setSeconds(0)
	date.setMinutes(0)
	date.setHours(0)

	return date
}