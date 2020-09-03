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

	@Column({ nullable: true })
	facebookId: string

	@Column({ nullable: true })
	googleId: string

	@Column({ nullable: true })
	dob: Date

	@Column({ nullable: true })
	city: string

	@Column({ unique: true, nullable: true })
	email: string

	@Column({ nullable: true, enum: Gender })
	gender: Gender

	@Column({ nullable: true, unique: true })
	salt: string

	@Column({ enum: UserType, nullable: true })
	type: UserType

	@Column({ nullable: true, unique: true })
	hash: string

	@Column({ default: true })
	online: boolean

	@Column({ nullable: true })
	imageUrl: string

	async validatePassword(password: string) {
		return this.hash === await bCrypt.hash(password, this.salt)
	}

	async setPassword(password: string): Promise<void> {
		this.salt = await bCrypt.genSalt(User.SALT_ROUNDS)
		this.hash = await bCrypt.hash(password, this.salt)
	}
}