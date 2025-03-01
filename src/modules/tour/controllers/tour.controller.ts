import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptor/upload-file.interceptor";
import { CreateTourDto, UpdateTourDto } from "../dto/tour.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { TourService } from "../services/tour.service";

@Controller("tour")
@ApiTags("Tour")
@AuthDecorator()
export class TourController {
  constructor(private tourService: TourService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFileS3("image"))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File,
    @Body() createDto: CreateTourDto
  ) {
    return this.tourService.create(createDto, image);
  }

  @Get()
  @SkipAuth()
  getAllTours() {
    return this.tourService.getAll();
  }

  @Get("/leader/:id")
  @SkipAuth()
  getTourByLeader(@Param("id", ParseIntPipe) id: number) {
    return this.tourService.getTourByLeader(+id);
  }

  @Get("/:id")
  @SkipAuth()
  getTourById(@Param("id", ParseIntPipe) id: number) {
    return this.tourService.getTourById(+id);
  }

  @Patch("/:id")
  @UseInterceptors(UploadFileS3("image"))
  @ApiConsumes(SwaggerConsumes.MultipartData)
  update(
    @Body() udateDto: UpdateTourDto,
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    return this.tourService.update(id, image, udateDto);
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.tourService.remove(+id);
  }
}
