import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS
  app.enableCors({
    origin: 'https://minha-plataforma-frontend-m1eyg1r7a-vinicius-debians-projects.vercel.app', // Permite apenas o seu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  } );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
