import { Injectable, PipeTransform } from '@nestjs/common'
import { FeedType, Instrument } from '../app.interfaces'
import { StringUtils } from '../utils/string'
import { NumberUtils } from '../utils/number'
import { DateUtils } from '../utils/date'
import { argumentAssert, InvalidArgumentsError } from '../lib/errors'

abstract class FeedValidator {
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
	static salary = {
		validate: value => NumberUtils.isNumber(value, x => x > 0),
		message : value => `salary must be a number and greater than 0, actual: ${value}`,
	}

	static date = {
		validate: value => DateUtils.isDate(value, x => new Date(x).getTime() > Date.now()),
		message : value => `date must be not in past and should have type of Date, actual: ${value}`,
	}

	static musicalSets = {
		validate: value => NumberUtils.isNumber(value, x => x && x <= 5),
		message : value => `musicalSets must be a number between 1 and 5, actual: ${value}`,
	}

	static extraInfo = {
		validate: value => !value || StringUtils.isString(value),
		message : value => `extraInfo must be a string, actual type of ${typeof value}`,
	}

	static title = {
		validate: value => StringUtils.isString(value, x => x.length > 10 && x.length < 250),
		message : value => `title must be a string with length between 10 and 250, actual: ${value}`,
	}

	static musicalInstrument = {
		validate: value => FeedValidator.musicalInstruments.includes(value),
		message : value => {
			return 'musicalInstrument must be one of ['
				+ FeedValidator.musicalInstruments.join(', ')
				+ `], actual: ${value}`
		},
	}

	private static BASIC_FEED_VALIDATORS = {
		title            : FeedValidator.title,
		extraInfo        : FeedValidator.extraInfo,
		musicalInstrument: FeedValidator.musicalInstrument,
	}

	private static MUSICAL_REPLACEMENT_VALIDATION_MAP = {
		address    : FeedValidator.address,
		salary     : FeedValidator.salary,
		date       : FeedValidator.date,
		musicalSets: FeedValidator.musicalSets,
	}

	private static SELF_PROMOTION_VALIDATION_MAP = {}

	private static JOB_VALIDATION_MAP = {}

	private static VALIDATION_MAP_BY_FEED_TYPE = {
		[FeedType.MUSICAL_REPLACEMENT]: FeedValidator.MUSICAL_REPLACEMENT_VALIDATION_MAP,
		[FeedType.SELF_PROMOTION]     : FeedValidator.SELF_PROMOTION_VALIDATION_MAP,
		[FeedType.JOB]                : FeedValidator.JOB_VALIDATION_MAP,
	}

	validate(value: any, optional: boolean): any {
		argumentAssert(value && Object.keys(value).length, 'Data is not provided')

		if (!optional) {
			argumentAssert(FeedValidator.feedType.validate(value.feedType), {
				feedType: FeedValidator.feedType.message(value.feedType),
			})
		}

		let VALIDATION_MAP = FeedValidator.VALIDATION_MAP_BY_FEED_TYPE[value.feedType]

		if (!VALIDATION_MAP) {
			VALIDATION_MAP = {
				...FeedValidator.MUSICAL_REPLACEMENT_VALIDATION_MAP,
				...FeedValidator.SELF_PROMOTION_VALIDATION_MAP,
				...FeedValidator.JOB_VALIDATION_MAP,
			}
		} else {
			Object.assign(VALIDATION_MAP, FeedValidator.BASIC_FEED_VALIDATORS)
		}

		const byErred = attribute => {
			let erred = false

			if (!optional || attribute in value) {
				erred = !VALIDATION_MAP[attribute].validate(value[attribute])
			}

			return erred
		}

		const pickError = attribute => VALIDATION_MAP[attribute].message(value[attribute])

		const errors = Object.keys(VALIDATION_MAP)
			.filter(byErred)
			.map(pickError)

		if (Object.keys(errors).length) {
			throw new InvalidArgumentsError(errors)
		}

		return value
	}
}

@Injectable()
export class RequiredFeedValidationPipe extends FeedValidator implements PipeTransform {
	transform(value: any): any {
		return this.validate(value, false)
	}
}

@Injectable()
export class OptionalFeedValidationPipe extends FeedValidator implements PipeTransform {
	transform(value: any): any {
		return this.validate(value, true)
	}
}