import { FeedType, Instrument } from '../app.interfaces'
import { argumentAssert, InvalidArgumentsError } from '../lib/errors'
import { NumberUtils } from '../utils/number'
import { StringUtils } from '../utils/string'
import { DateUtils } from '../utils/date'

export abstract class FeedValidator {
	private static feedTypes = Object.values(FeedType)
	private static musicalInstruments = Object.values(Instrument)

	static feedType = {
		validate: value => FeedValidator.feedTypes.includes(value),
		message : value => `feedType must be one of [${FeedValidator.feedTypes.join(', ')}], actual: ${value}`,
	}

	static address = {
		validate: value => StringUtils.isString(value, x => x.length < 250),
		message : value => {
			return typeof value === 'string'
				? `address must be shorter than 250, actual: ${value.length}`
				: `address must be a string, actual: ${typeof value}`
		},
	}
	static amount = {
		validate: value => NumberUtils.isNumber(value, x => x),
		message : value => `amount must be a number and greater than 0, actual: ${value}`,
	}

	static date = {
		validate: DateUtils.isDate,
		message : value => `date was expected, actual: ${value}`,
	}

	static musicalSets = {
		validate: value => NumberUtils.isNumber(value, x => x && x <= 5),
		message : value => `invalid count of musicalSets, expected number between 1 and 5, actual: ${value}`,
	}

	static extraInfo = {
		validate: value => !value || StringUtils.isString(value),
		message : value => `extraInfo must be a string, actual type of ${typeof value}`,
	}

	static title = {
		validate: value => StringUtils.isString(value, x => x.length > 10 && x.length < 250),
		message : value => `title should be a string with length between 10 and 250, actual: ${value}`,
	}

	static musicalInstrument = {
		validate: value => FeedValidator.musicalInstruments.includes(value),
		message : value => {
			return `musicalInstrument must be one of [${FeedValidator.musicalInstruments.join(', ')}], actual: ${value}`
		},
	}

 	private static BASIC_FEED_VALIDATORS = {
		title            : FeedValidator.title,
		extraInfo        : FeedValidator.extraInfo,
		musicalInstrument: FeedValidator.musicalInstrument,
	}

	private static MUSICAL_REPLACEMENT_VALIDATION_MAP = {
		address    : FeedValidator.address,
		amount     : FeedValidator.amount,
		date       : FeedValidator.date,
		musicalSets: FeedValidator.musicalSets,
		...FeedValidator.BASIC_FEED_VALIDATORS,
	}

	private static SELF_PROMOTION_VALIDATION_MAP = {
		...FeedValidator.BASIC_FEED_VALIDATORS,
	}

	private static JOB_VALIDATION_MAP = {
		...FeedValidator.BASIC_FEED_VALIDATORS,
	}

	private static VALIDATION_MAP_BY_FEED_TYPE = {
		[FeedType.MUSICAL_REPLACEMENT]: FeedValidator.MUSICAL_REPLACEMENT_VALIDATION_MAP,
		[FeedType.SELF_PROMOTION]     : FeedValidator.SELF_PROMOTION_VALIDATION_MAP,
		[FeedType.JOB]                : FeedValidator.JOB_VALIDATION_MAP,
	}

	static validateDto(dto) {
		argumentAssert(dto, 'Data is not provided')

		argumentAssert(FeedValidator.feedType.validate(dto.feedType), {
			feedType: FeedValidator.feedType.message(dto.feedType),
		})

		const VALIDATION_MAP = FeedValidator.VALIDATION_MAP_BY_FEED_TYPE[dto.feedType]

		const errors = Object.keys(VALIDATION_MAP)
			.filter(attribute => !VALIDATION_MAP[attribute].validate(dto[attribute]))
			.reduce((acc, attribute) => ({
				...acc,
				[attribute]: VALIDATION_MAP[attribute].message(dto[attribute]),
			}), {})

		if (Object.keys(errors).length) {
			throw new InvalidArgumentsError(errors)
		}
	}
}