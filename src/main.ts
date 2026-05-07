import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
=======

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT || 3005);
}

bootstrap();
>>>>>>> f547b31e77b55c82ff6f67fc34eec16580d48c0f
