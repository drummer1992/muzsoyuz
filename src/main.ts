import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './config'

async function bootstrap(port) {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.setGlobalPrefix(config.getAppPrefix())

  await app.listen(port)
}

bootstrap(config.getPort())
  .catch(e => {
    console.error(e)
    process.exit(-1)
  })
