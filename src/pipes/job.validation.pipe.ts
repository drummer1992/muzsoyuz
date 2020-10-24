import { Injectable, PipeTransform } from '@nestjs/common'
import { JobTypes, Instruments } from '../app.interfaces'
import { StringUtils } from '../utils/string'
import { NumberUtils } from '../utils/number'
import { DateUtils } from '../utils/date'
import { argumentAssert, InvalidArgumentsError } from '../lib/errors'

abstract class JobValidator {
	private static jobTypes = Object.values(JobTypes)
	private static musicalInstruments = Object.values(Instruments)

	static jobType = {
		validate: value => JobValidator.jobTypes.includes(value),
		message : value => `jobType must be one of [${JobValidator.jobTypes.join(', ')}], actual: ${value}`,
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
		validate: value => DateUtils.isDate(value, x => {
			return new Date(x).getTime() > DateUtils.addDays(DateUtils.trimTime(Date.now()), -1).getTime()
		}),
		message : value => `date must be not in past and should have type of Date, actual: ${value}`,
	}

	static sets = {
		validate: value => NumberUtils.isNumber(value, x => x && x <= 5),
		message : value => `sets must be a number between 1 and 5, actual: ${value}`,
	}

	static extraInfo = {
		validate: value => !value || StringUtils.isString(value),
		message : value => `extraInfo must be a string, actual type of ${typeof value}`,
	}

	static title = {
		validate: value => StringUtils.isString(value, x => x.length > 10 && x.length < 250),
		message : value => `title must be a string with length between 10 and 250, actual: ${value}`,
	}

	static role = {
		validate: value => JobValidator.musicalInstruments.includes(value),
		message : value => {
			return 'role must be one of ['
				+ JobValidator.musicalInstruments.join(', ')
				+ `], actual: ${value}`
		},
	}

	private static BASIC_JOB_VALIDATORS = {
		title    : JobValidator.title,
		extraInfo: JobValidator.extraInfo,
		role     : JobValidator.role,
	}

	private static MUSICAL_REPLACEMENT_VALIDATION_MAP = {
		address: JobValidator.address,
		salary : JobValidator.salary,
		date   : JobValidator.date,
		sets   : JobValidator.sets,
	}

	private static SELF_PROMOTION_VALIDATION_MAP = {}

	private static VALIDATION_MAP_BY_JOB_TYPE = {
		[JobTypes.MUSICAL_REPLACEMENT]: JobValidator.MUSICAL_REPLACEMENT_VALIDATION_MAP,
		[JobTypes.SELF_PROMOTION]     : JobValidator.SELF_PROMOTION_VALIDATION_MAP,
	}

	validate(value: any, optional: boolean): any {
		argumentAssert(value && Object.keys(value).length, 'Data is not provided')

		if (!optional) {
			argumentAssert(JobValidator.jobType.validate(value.jobType), {
				jobType: JobValidator.jobType.message(value.jobType),
			})
		}

		let VALIDATION_MAP = JobValidator.VALIDATION_MAP_BY_JOB_TYPE[value.jobType]

		if (!VALIDATION_MAP) {
			VALIDATION_MAP = {
				...JobValidator.MUSICAL_REPLACEMENT_VALIDATION_MAP,
				...JobValidator.SELF_PROMOTION_VALIDATION_MAP,
			}
		} else {
			Object.assign(VALIDATION_MAP, JobValidator.BASIC_JOB_VALIDATORS)
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
export class RequiredJobValidationPipe extends JobValidator implements PipeTransform {
	transform(value: any): any {
		return this.validate(value, false)
	}
}

@Injectable()
export class OptionalJobValidationPipe extends JobValidator implements PipeTransform {
	transform(value: any): any {
		return this.validate(value, true)
	}
}