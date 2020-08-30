import { EntityRepository, Repository } from 'typeorm'
import { User } from '../../entities/entity.user'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
	public publicAttributes = [
		'yearCommercialExp',
		'phone',
		'altPhone',
		'musicalInstrument',
		'imageUrl',
		'firstName',
		'lastName',
		'dob',
		'city',
		'email',
		'gender',
		'type',
		'online',
	]

	async ensureUniqueEmail(email) {
		return !(await this.count({ where: { email } }))
	}

	// async insertAndGet(dto) {
	// 	const { identifiers: [{ id }] } = await this.insert(dto)
	//
	// 	return id
	// 	// return this.createQueryBuilder('user')
	// 	// 	.where('user.id IN (:ids)')
	// 	// 	.setParameters({ ids: identifiers.map(i => i.id).join(',') })
	// 	// 	.getMany()
	// 	// 	.then(results => results.map(item => ObjectUtils.omit(item, ['hash', 'salt'])))
	// }

	async createProfile(user: User): Promise<string> {
		const { identifiers: [{ id }] } = await this.insert(user)

		return id
	}
}