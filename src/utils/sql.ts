import { RangeDto } from '../controllers/dto/common.dto'

export const mappers = {
	byTableName: tableName => arg => arg.includes('.') ? arg : `${tableName}.${arg}`,
}

export const resolveRange = (value: any): RangeDto => {
	const from = typeof value === 'number' ? value : value?.from
	const to = typeof value === 'number' ? value : value?.to

	return { from, to }
}