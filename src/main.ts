import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { SwaggerConfigInt } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInt(app);
  const { PORT } = process.env;
  await app.listen(PORT, () => {
    console.log(`run server on : http://localhost:${PORT}`);
    console.log(`Use Swagger on  : http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
