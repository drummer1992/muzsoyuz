import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
import { intersection } from '../utils/array'

export function IsArrayOf(array: string[], validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string) {
		registerDecorator({
			propertyName,
			name       : 'arrayOf',
			target     : object.constructor,
			constraints: [array],
			options    : validationOptions,
			validator  : {
				validate(value: any, args: ValidationArguments) {
					const [array] = args.constraints

					return Array.isArray(value)
						? intersection(array, value).length
						: array.includes(value)
				},

				defaultMessage(validationArguments?: ValidationArguments): string {
					return `${validationArguments.property} should be one of `
						+ validationArguments.constraints.join(',')
				},
			},
		})
	}
}