import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ZarrinpalService } from "./zarrinpal.service";

@Global() //to yous thi module everywhere of project
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5, //number of try to coonect
      timeout: 5000,
    }),
  ],
  providers: [ZarrinpalService],
  exports: [ZarrinpalService],
})
export class HttpApiModule {}
