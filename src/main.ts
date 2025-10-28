import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cấu hình thư mục views và view engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // Thêm middleware cookie-parser
  app.use(cookieParser());

  // Cấu hình CORS (nếu cần)
  app.enableCors({
    origin: 'http://localhost:3000', // Thay bằng domain của frontend nếu khác
    credentials: true, // Cho phép gửi cookie
  });

  await app.listen(3000);
}
bootstrap();
