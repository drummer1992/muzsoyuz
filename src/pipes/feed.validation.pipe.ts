import { Injectable, PipeTransform } from '@nestjs/common'
import { FeedType, Instrument } from '../app.interfaces'
import { StringUtils } from '../utils/string'
import { NumberUtils } from '../utils/number'
import { DateUtils } from '../utils/date'
import { argumentAssert, InvalidArgumentsError } from '../lib/errors'

@Injectable()
export class FeedValidationPipe implements PipeTransform {
	private static feedTypes = Object.values(FeedType)
	private static musicalInstruments = Object.values(Instrument)

	static feedType = {
		validate: value => FeedValidationPipe.feedTypes.includes(value),
		message : value => `feedType must be one of [${FeedValidationPipe.feedTypes.join(', ')}], actual: ${value}`,
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
		message : value => `date must be type of Date, actual: ${value}`,
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
		validate: value => FeedValidationPipe.musicalInstruments.includes(value),
		message : value => {
			return 'musicalInstrument must be one of ['
				+ FeedValidationPipe.musicalInstruments.join(', ')
			+ `], actual: ${value}`
		},
	}

	private static BASIC_FEED_VALIDATORS = {
		title            : FeedValidationPipe.title,
		extraInfo        : FeedValidationPipe.extraInfo,
		musicalInstrument: FeedValidationPipe.musicalInstrument,
	}

	private static MUSICAL_REPLACEMENT_VALIDATION_MAP = {
		address    : FeedValidationPipe.address,
		amount     : FeedValidationPipe.amount,
		date       : FeedValidationPipe.date,
		musicalSets: FeedValidationPipe.musicalSets,
		...FeedValidationPipe.BASIC_FEED_VALIDATORS,
	}

	private static SELF_PROMOTION_VALIDATION_MAP = {
		...FeedValidationPipe.BASIC_FEED_VALIDATORS,
	}

	private static JOB_VALIDATION_MAP = {
		...FeedValidationPipe.BASIC_FEED_VALIDATORS,
	}

	private static VALIDATION_MAP_BY_FEED_TYPE = {
		[FeedType.MUSICAL_REPLACEMENT]: FeedValidationPipe.MUSICAL_REPLACEMENT_VALIDATION_MAP,
		[FeedType.SELF_PROMOTION]     : FeedValidationPipe.SELF_PROMOTION_VALIDATION_MAP,
		[FeedType.JOB]                : FeedValidationPipe.JOB_VALIDATION_MAP,
	}

	transform(dto: any): any {
		argumentAssert(dto && Object.keys(dto).length, 'Data is not provided')

		argumentAssert(FeedValidationPipe.feedType.validate(dto.feedType), {
			feedType: FeedValidationPipe.feedType.message(dto.feedType),
		})

		const VALIDATION_MAP = FeedValidationPipe.VALIDATION_MAP_BY_FEED_TYPE[dto.feedType]

		const errors = Object.keys(VALIDATION_MAP)
			.filter(attribute => !VALIDATION_MAP[attribute].validate(dto[attribute]))
			.map(attribute => VALIDATION_MAP[attribute].message(dto[attribute]))

		if (Object.keys(errors).length) {
			throw new InvalidArgumentsError(errors)
		}

		return dto
	}
}