import { Injectable, PipeTransform } from '@nestjs/common'
import { JobTypes, Instruments } from '../app.interfaces'
import { isString } from '../utils/string'
import { isNumber } from '../utils/number'
import { isDate, isFutureDate } from '../utils/date'
import { argumentAssert, InvalidArgumentsError } from '../errors'

abstract class JobValidator {
	private static jobTypes = Object.values(JobTypes)
	private static musicalInstruments = Object.values(Instruments)
	private optionalAttributes = ['extraInfo']

	static jobType(value) {
		argumentAssert(
			JobValidator.jobTypes.includes(value),
			`jobType must be one of [${JobValidator.jobTypes.join(', ')}], actual: ${value}`,
		)
	}

	static address(value) {
		argumentAssert(isString(value), 'address should be a string')
		argumentAssert(value.length > 0, 'address can not be empty')
	}

	static salary(value) {
		argumentAssert(isNumber(value), 'salary should be type of number')
		argumentAssert(value > 0, 'salary should be greater than 0')
	}

	static date(value) {
		argumentAssert(isDate(value), 'date should be typeOf Date')
		argumentAssert(isFutureDate(value), 'date can not be in past')
	}

	static sets(value) {
		argumentAssert(isNumber(value), 'sets should be a number')
		argumentAssert(value && value <= 5, 'sets should be a number between 1 and 5')
	}

	static extraInfo(value) {
		argumentAssert(isString(value), 'extraInfo should be a string')
	}

	static title(value) {
		argumentAssert(isString(value), 'title should be a string')
		argumentAssert(
			value.length > 10 && value.length < 250,
			'title should be a string with length between 10 and 250',
		)
	}

	static role(value) {
		argumentAssert(JobValidator.musicalInstruments.includes(value),
			`role should be one of [${JobValidator.musicalInstruments.join(', ')}]`)
	}

	static phone(value) {
		argumentAssert(value, 'phone is required')
	}

	private static BASIC_JOB_VALIDATORS = {
		title    : JobValidator.title,
		extraInfo: JobValidator.extraInfo,
		role     : JobValidator.role,
		phone    : JobValidator.phone,
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

	validate(payload: any, required: boolean): any {
		argumentAssert(payload && Object.keys(payload).length, 'Data is not provided')

		required && JobValidator.jobType(payload.jobType)

		const VALIDATION_MAP = {
			...(JobValidator.VALIDATION_MAP_BY_JOB_TYPE[payload.jobType] || {}),
			...JobValidator.BASIC_JOB_VALIDATORS,
		}

		const errors = []

		Object.keys(VALIDATION_MAP).forEach(attr => {
			try {
				if (required && !this.optionalAttributes.includes(attr)) {
					argumentAssert(payload[attr], `${attr} is required`)
				}

				if (payload[attr]) {
					const attrValidator = VALIDATION_MAP[attr]

					attrValidator(payload[attr])
				}
			} catch (e) {
				errors.push(e.message)
			}
		})

		if (errors.length) {
			throw new InvalidArgumentsError(errors)
		}

		return payload
	}
}

@Injectable()
export class RequiredJobValidationPipe extends JobValidator implements PipeTransform {
	transform(value: any): any {
		return this.validate(value, true)
	}
}

@Injectable()
export class OptionalJobValidationPipe extends JobValidator implements PipeTransform {
	transform(value: any): any {
		return this.validate(value, false)
	}
}