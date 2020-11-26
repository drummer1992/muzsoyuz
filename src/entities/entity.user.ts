import { Column, Entity, OneToMany } from 'typeorm'
import { AppEntity, IStats } from './entity.basic'
import { UserTypes } from '../app.interfaces'
import * as bCrypt from 'bcrypt'
import { WorkDay } from './entity.work.day'
import { Job } from './entity.job'

export interface IUser {
	dob?: Date
	email: string
	type: UserTypes
	hash: string
	salt: string
	facebookId: string
	imageURL?: string
}

@Entity({ name: 'User' })
export class User extends AppEntity implements IUser, IStats {
	static readonly SALT_ROUNDS: number = 10

	@Column({ type: 'varchar', length: 80, nullable: true })
	name: string

	@OneToMany(() => WorkDay, workday => workday.user)
	workdays: WorkDay[]

	@OneToMany(() => Job, job => job.user)
	jobs: Job[]

	@Column({ type: 'varchar', length: 30, nullable: true })
	facebookId: string

	@Column({ type: 'varchar', length: 30, nullable: true })
	googleId: string

	@Column({ type: 'date', nullable: true })
	dob: Date

	@Column({ type: 'varchar', length: 250, unique: true, nullable: true })
	email: string

	@Column({ type: 'varchar', nullable: true, unique: true })
	salt: string

	@Column({ type: 'varchar', length: 10, enum: UserTypes, nullable: true })
	type: UserTypes

	@Column({ type: 'text', nullable: true, unique: true })
	hash: string

	@Column({ type: 'varchar', nullable: true })
	imageURL: string

	async validatePassword(password: string) {
		return this.hash === await bCrypt.hash(password, this.salt)
	}

	async setPassword(password: string): Promise<void> {
		this.salt = await bCrypt.genSalt(User.SALT_ROUNDS)
		this.hash = await bCrypt.hash(password, this.salt)
	}
}