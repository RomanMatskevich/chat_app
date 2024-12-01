import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  try {
    const { PORT } = process.env 
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept'],
    })
    await app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
  }catch(err){
    console.log(err)
  }
}
bootstrap();
