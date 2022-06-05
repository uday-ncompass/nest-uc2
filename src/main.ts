import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use(
    session({
      secret: "12345678" ,
      resave: false,
      saveUninitialized: false,
      cookie: {maxAge: 600000}
    })
  )

  app.use(passport.initialize());
  app.use(passport.session())
  app.useGlobalPipes(new ValidationPipe({ transform: true}))
  await app.listen(3000);
}
bootstrap();