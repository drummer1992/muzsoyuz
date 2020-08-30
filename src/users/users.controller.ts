import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Patch, UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { UserDto } from '../dto/user.dto'
import { User } from '../entities/entity.user'
import { UsersService } from './users.service'
import { LoggingInterceptor } from '../logging/logging.interceptor'
import { AuthService } from '../auth/auth.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UserController {
	@Inject()
	private readonly userService: UsersService

	@Get('profile/:id')
	getProfile(@Param() { id }): Promise<User> {
		return this.userService.getProfile(id)
	}

	@Patch('profile/:id')
	updateProfile(@Param() { id }, @Body() data: UserDto) {
		return this.userService.updateProfile(id, data)
	}
}
