export const predicates = {
	isUndefined: value => typeof value === 'undefined',
}

export function pick(object, props) {
	return props.reduce(
		(obj, attr) => Object.assign(obj, { [attr]: object[attr] }), {},
	)
}

export function omit(object, props) {
	return Object.keys(object)
		.reduce(
			(result, key) => Object.assign(result, props.includes(key)
				? {}
				: { [key]: object[key] }),
			{},
		)
}

export function omitBy(object, predicate = predicates.isUndefined) {
	const propsToOmit = Object.keys(object)
		.filter(key => predicate ? predicate(object[key]) : true)

	return omit(object, propsToOmit)
}