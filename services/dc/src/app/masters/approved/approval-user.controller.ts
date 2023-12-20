import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { ApprovedUserService } from "./approval-user.service";
import { CommonResponse } from "libs/shared-models/src/common";
import { ApiConsumes } from "@nestjs/swagger";
import { extname } from "path";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller("/approval-user")
export class ApprovalUSerController {
  constructor(
    private readonly service: ApprovedUserService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('/createApprovalUser')
  async createApprovalUser(@Body() dto:any): Promise<CommonResponse> {
    try {
      return await this.service.createApprovalUser(dto);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/fileUpload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: { files: 1 },
    storage: diskStorage({
      destination: './upload-files',
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        callback(null, `${name}-${randomName}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG|pjpeg|gif|tiff|x-tiff|x-png)$/)) {
        return callback(new Error('Only png,jpeg,PNG,jpg,gif,tiff,x-tiff,z-png files are allowed!'), false);
      }
      callback(null, true);
    },
  }))

  async fabricWeaveImageUpload(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponse> {
    console.log(file,'-------file')
    console.log(uploadData,'uploadData')
    try {
      return await this.service.updatePath(file.path,file.filename, uploadData.approvedId)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Get('/getAllApprovalUser')
  async getAllApprovalUser(): Promise<CommonResponse> {
    try {
      return await this.service.getAllApprovalUser();
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/getAllApprovalIdUser')
  async getAllApprovalIdUser(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.service.getAllApprovalIdUser(req);
    } catch (error) {
      console.log(error,'err')
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

}