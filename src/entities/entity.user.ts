import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Basic } from './entity.basic'
import { Gender, Instruments, UserTypes } from '../app.interfaces'
import * as bCrypt from 'bcrypt'
import { WorkDay } from './entity.work.day'
import { Job } from './entity.job'
import { Instrument } from './entity.instrument'
import { Chat } from './entity.chat'

export interface IUser {
	dob?: Date
	email: string
	type: UserTypes
	hash: string
	salt: string
	facebookId: string
	imageURL?: string
	yearCommercialExp: number
	countOfJobs: number
	countOfLikes: number
	countOfDisLikes: number
	phone: string
	altPhone: string
	name: string
	workdays: WorkDay[]
	jobs: Job[]
	gender: Gender
	googleId: string
}

@Entity({ name: 'User' })
export class User extends Basic implements IUser {
	static readonly SALT_ROUNDS: number = 10

	@Column({ type: 'varchar', length: 30, enum: Instruments, nullable: true })
	role: Instruments

	@Column({ type: 'smallint', nullable: true })
	yearCommercialExp: number

	@Column({ type: 'int', nullable: true })
	countOfJobs: number

	@Column({ type: 'int', nullable: true })
	countOfLikes: number

	@Column({ type: 'int', nullable: true })
	countOfDisLikes: number

	@Column({ type: 'varchar', length: 30, nullable: true })
	phone: string

	@Column({ type: 'varchar', length: 30, nullable: true })
	altPhone: string

	@Column({ type: 'varchar', length: 80, nullable: true })
	name: string

	@OneToMany(() => WorkDay, workday => workday.user)
	workdays: WorkDay[]

	@OneToMany(() => Job, job => job.user)
	jobs: Job[]

	@Column({ type: 'varchar', length: 30, nullable: true })
	facebookId: string

	@Column({
		type    : 'varchar',
		length  : 1,
		nullable: false,
		enum    : Gender,
		default : Gender.MALE,
	})
	gender: Gender

	@Column({ type: 'varchar', length: 30, nullable: true })
	googleId: string

	@Column({ type: 'date', nullable: true })
	dob: Date

	@Column({ type: 'varchar', length: 250, unique: true, nullable: true })
	email: string

	@Column({ type: 'varchar', nullable: true, unique: true, select: false })
	salt: string

	@Column({ type: 'varchar', length: 10, enum: UserTypes, nullable: true })
	type: UserTypes

	@Column({ type: 'text', nullable: true, unique: true, select: false })
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