import {
	Body,
	Controller,
	Get,
	Inject,
	Patch, Req, UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { UserDto } from '../dto/user.dto'
import { UsersService } from './users.service'
import { LoggingInterceptor } from '../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseInterceptors(LoggingInterceptor)
@Controller('user')
export class UserController {
	@Inject()
	private readonly userService: UsersService

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() { user }) {
		return this.userService.getProfile(user.id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('profile')
	updateProfile(@Req() { user }, @Body() data: UserDto) {
		return this.userService.updateProfile(user.id, data)
	}
}
