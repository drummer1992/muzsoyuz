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
					return isNotEmptyObject(value) && (value.from || value.to)
				},

				defaultMessage(validationArguments?: ValidationArguments): string {
					return `${validationArguments.property} should be object with 'from', 'to' fields`
				},
			},
		})
	}
}