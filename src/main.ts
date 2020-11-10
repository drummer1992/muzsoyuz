import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.setGlobalPrefix(config.getServerAPIPrefix())

  await app.listen(process.env.PORT || 9000)
}

bootstrap()
  .catch(e => {
    console.error(e)
    process.exit(-1)
  })
