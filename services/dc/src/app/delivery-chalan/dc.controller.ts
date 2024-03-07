import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApplicationExceptionHandler } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { DcService } from "./dc.service";
import { CommonResponse } from "libs/shared-models/src/common";
import { Response } from 'express';
import { ApiProperty } from "@nestjs/swagger";
import { DcDto } from "./dto/dc.dto";
import { MailerService } from "./send-mail";

@Controller("dc")
export class DcController {
  applicationExceptionHandler: any;
  constructor(
    private readonly dcService: DcService ,
    private readonly mailService : MailerService
  ) { }

  @Post('/createDc')
  async createDc(@Body() dto: any, isUpdate: boolean = false): Promise<CommonResponse> {
    try {
      return await this.dcService.createDc(dto, false);
    } catch (error) {
      console.log(error)
      return await this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/updateDc')
  async updateDc(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.updateDc(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/acceptDc')
  async acceptDc(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.acceptDc(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/rejectDc')
  async rejectDc(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.rejectDc(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/getAllGatePass')
  async getAllGatePass(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.dcService.getAllGatePass(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getIntransAndCompleteGatePass')
  async getIntransAndCompleteGatePass(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.dcService.getIntransAndCompleteGatePass(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getDcDetailsById')
  async getDcDetailsById(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.dcService.getDcDetailsById(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/receivedDc')
  async receivedDc(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.receivedDc(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/securityCheckDone')
  async securityCheckDone(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.securityCheckDone(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post('/getSecurityGatePass')
  async getSecurityGatePass(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.getSecurityGatePass(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/securityReport')
  async securityReport(@Body() dto: any,): Promise<CommonResponse> {
    try {
      return await this.dcService.securityReport(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Post('/getAllUnitsData')
  async getAllUnitsData(): Promise<CommonResponse> {
    try {
      return await this.dcService.getAllUnitsData();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post('/downloadExcel')
    async downloadExcel(@Body() req: any, @Res() res: Response) {
      try {
        const buffer = await this.dcService.ticketsExcelDownload(req);
  
        // Set the response headers
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
        res.setHeader('Content-Length', buffer.length);
  
        // Send the buffer as the response
        res.send(buffer);
      } catch (err) {
        console.log(err)
      }
    }

    @Post('/getDcDrop')
    async getDcDrop(): Promise<CommonResponse> {
      try {
        return await this.dcService.getDcDrop();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }

    @Post('/getItemDrop')
    async getItemDrop(): Promise<CommonResponse> {
      try {
        return await this.dcService.getItemDrop();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }

    @Post('/getEmpDrop')
    async getEmpDrop(): Promise<CommonResponse> {
      try {
        return await this.dcService.getEmpDrop();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }

    @Post('/getApprovedBy')
    async getApprovedBy(): Promise<CommonResponse> {
      try {
        return await this.dcService.getApprovedBy();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }

    @Post('/getCheckedBy')
    async getCheckedBy(): Promise<CommonResponse> {
      try {
        return await this.dcService.getCheckedBy();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }

    @Post('/getReceivedBy')
    async getReceivedBy(): Promise<CommonResponse> {
      try {
        return await this.dcService.getReceivedBy();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }
    
    @Post('/getPurpose')
    async getPurpose(): Promise<CommonResponse> {
      try {
        return await this.dcService.getPurpose();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }
    @Post('/getCreated')
    async getCreated(): Promise<CommonResponse> {
      try {
        return await this.dcService.getCreated();
      } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }

    @Post('/sendDcMail')
    async sendDcMail(@Body() req: any): Promise<CommonResponse> {
      try {
        return await this.mailService.sendDcMail(req);
      } catch (error) {
        console.log('----------error in send mail controller')
        console.log(error)
        console.log('-------End in Controller')
        return this.applicationExceptionHandler.returnException(CommonResponse, error);
      }
    }
}