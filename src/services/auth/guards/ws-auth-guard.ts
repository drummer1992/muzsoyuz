import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../../user.service'
import { WsException } from '@nestjs/websockets'
import { notFoundAssert } from '../../../errors'
import { User } from '../../../entities/entity.user'

@Injectable()
export class WsAuthGuard implements CanActivate {
	@Inject()
	private userService: UserService
	@Inject()
	private jwtService: JwtService
	private logger: Logger = new Logger('WsAuthLogger');

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const { handshake: { query: { token } } } = context.getArgByIndex(0)

			const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET })

			const user: User = await this.userService.getProfileById(decoded.sub)

			context.getArgByIndex(0).user = user

			return Boolean(user)
		} catch (e) {
			this.logger.error(e.message)

			throw new WsException(e.message)
		}
	}
}