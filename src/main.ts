import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './config'
import { GlobalErrorFilter } from './errors/errors.filter'
import { LoggingInterceptor } from './logging/logging.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalFilters(new GlobalErrorFilter())
	app.useGlobalInterceptors(new LoggingInterceptor())

	app.enableCors()
	app.setGlobalPrefix(config.getServerAPIPrefix())

	await app.listen(config.getPort(true))
}

bootstrap()
	.catch(e => {
		console.error(e)
		process.exit(-1)
	})
