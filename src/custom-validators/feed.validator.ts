import { FeedType, Instrument } from '../app.interfaces'

export class FeedValidator {
	private static feedTypes = Object.values(FeedType)
	private static musicalInstruments = Object.values(Instrument)

	static feedType = {
		validate: value => FeedValidator.feedTypes.includes(value),
		message : value => `feedType must be one of [${FeedValidator.feedTypes.join(', ')}], actual: ${value}`,
	}

	static address = {
		validate: value => !value || (typeof value === 'string' && value.length < 250),
		message : value => {
			return typeof value === 'string'
				? `address must be shorter than 250, actual: ${value.length}`
				: `address must be a string, actual: ${typeof value}`
		},
	}
	static amount = {
		validate: value => value && !isNaN(value) && value > 0,
		message : value => `amount must be a number and greater than 0, actual: ${value}`,
	}

	static date = {
		validate: value => value && !isNaN(new Date(value).getTime()),
		message : value => `date was expected, actual: ${value}`,
	}

	static musicalSets = {
		validate: value => value && !isNaN(value) && [1, 2, 3, 4, 5].includes(value),
		message : value => `invalid count of musicalSets, expected number between 1 and 5, actual: ${value}`,
	}

	static extraInfo = {
		validate: value => !value || typeof value === 'string',
		message : value => `extraInfo must be a string, actual type of ${typeof value}`,
	}

	static title = {
		validate: value => value && typeof value === 'string' && value.length > 10 && value.length < 250,
		message: value => `title should be a string with length between 10 and 250, actual: ${value}`,
	}

	static musicalInstrument = {
		validate: value => value && FeedValidator.musicalInstruments.includes(value),
		message: value => {
			return `musicalInstrument must be one of [${FeedValidator.musicalInstruments.join(', ')}], actual: ${value}`
		},
	}
}