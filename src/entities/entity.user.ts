import { Column, Entity } from 'typeorm'
import { BasicEntity, IStats } from './entity.basic'
import { UserType, Gender } from '../app.interfaces'
import * as bCrypt from 'bcrypt'

export interface IUser {
	dob?: Date
	city?: string
	email: string
	gender?: Gender
	type: UserType
	online: boolean
	hash: string
	salt: string
	facebookId: string
	imageUrl?: string
}

@Entity({ name: 'User' })
export class User extends BasicEntity implements IUser, IStats {
	constructor(user) {
		super()

		Object.assign(this, user)
	}

	static readonly SALT_ROUNDS: number = 10

	@Column({ type: 'varchar', length: 30, nullable: true })
	facebookId: string

	@Column({ type: 'varchar', length: 30, nullable: true })
	googleId: string

	@Column({ type: 'date', nullable: true })
	dob: Date

	@Column({ type: 'varchar', length: 80, nullable: true })
	city: string

	@Column({ type: 'varchar', length: 250, unique: true, nullable: true })
	email: string

	@Column({ type: 'varchar', length: 2, nullable: true, enum: Gender })
	gender: Gender

	@Column({ type: 'varchar', nullable: true, unique: true })
	salt: string

	@Column({ type: 'varchar', length: 10, enum: UserType, nullable: true })
	type: UserType

	@Column({ type: 'text', nullable: true, unique: true })
	hash: string

	@Column({ type: 'boolean', default: true })
	online: boolean

	@Column({ type: 'varchar', nullable: true })
	imageUrl: string

	async validatePassword(password: string) {
		return this.hash === await bCrypt.hash(password, this.salt)
	}

	async setPassword(password: string): Promise<void> {
		this.salt = await bCrypt.genSalt(User.SALT_ROUNDS)
		this.hash = await bCrypt.hash(password, this.salt)
	}
}