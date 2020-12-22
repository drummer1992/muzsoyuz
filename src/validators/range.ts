import { registerDecorator, ValidationOptions, ValidationArguments, isNotEmptyObject } from 'class-validator'

export function IsRange(validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string) {
		registerDecorator({
			propertyName,
			name     : 'isRange',
			target   : object.constructor,
			options  : validationOptions,
			validator: {
				validate(value: any) {
					value = Object(value)

					return isNotEmptyObject(value)
						&& (value.hasOwnProperty('from') || value.hasOwnProperty('to'))
				},

				defaultMessage(validationArguments?: ValidationArguments): string {
					return `${validationArguments.property} should be an object with 'from', 'to' non empty fields`
				},
			},
		})
	}
}