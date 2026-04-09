import { CommonResponse } from '@gatex/shared-models';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import nodemailer from 'nodemailer';
import { SendOptions } from './dto/send-mail';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly filePath: string = 'dist/services/dc/dcErrorLog.docx';

  constructor() {
    //TODO: need to move this to configuration and use env variables
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'alerts@schemaxtech.com',
        pass: 'vqem erti nuze kria',
      },
    });
  }


  async sendMail(req: any) {
    const inv: any = Object.values(req.invoiceDoc);
    const sli: any = Object.values(req.sliDoc);
    const quran: any = Object.values(req.quranDoc);

    const invoiceBuf = Buffer.from(inv, 'utf-8');
    const quranBuffer = Buffer.from(quran, 'utf-8');
    const sliBuffer = Buffer.from(sli, 'utf-8');

    let message = {
      attachments: [
        // {
        //   // binary buffer as an attachment
        //   filename: `SLI_${req.invoiceNo}-BO_${req.cusOrderNo}.pdf`,
        //   content: sliBuffer,
        // },
        {
          // binary buffer as an attachment
          filename: `INV_${req.invoiceNo}-BO_${req.cusOrderNo}.pdf`,
          content: invoiceBuf,
        },
        // {
        //   filename: `QD_${req.invoiceNo}-BO_${req.cusOrderNo}.pdf`,
        //   content: quranBuffer,
        // },
      ],
    };
    const sendMail = await this.transporter.sendMail({
      from: '"GATE PASS" <alerts@schemaxtech.com>',
      to: req.to,
      cc: req.ccMails.split(','),
      subject: req.subject,
      text: req.text,
      attachments: message.attachments,
    });
    return new CommonResponse(true, 1111, 'Mail sent sucessfully');
  }


  async send(req: SendOptions): Promise<CommonResponse> {
    try {
      await this.transporter.sendMail(req);
      return new CommonResponse(true, 1111, "Mail sent successfully");
    } catch (error) {
      await this.logError(error.code)
      // Check specific Nodemailer error types and handle them accordingly
      if (error.code === 'EENVELOPE' || error.code === 'ECONNECTION' || error.code === 'EMESSAGE') {
        return new CommonResponse(false, 500, "Failed to send mail: Invalid email configuration");
      } else if (error.code === 'EPROTOCOL' || error.code === 'EAUTH') {
        return new CommonResponse(false, 500, "Failed to send mail: Authentication or protocol error");
      } else {
        return new CommonResponse(false, 500, "Failed to send mail: Unknown error");
      }
    }
  }
  async sendDcMail(req: any) {
    try {
      await this.logError(req.subject)
      const sendDcMail = await this.transporter.sendMail({
        from: '"GATE PASS" <alerts@schemaxtech.com>',
        to: req.to,
        dcNo: req.dcNo,
        subject: req.subject,
        html: req.html
      });
      return new CommonResponse(true, 1111, 'Mail sent sucessfully');
    } catch (err) {
      await this.logError(err)
      throw err
    }
  }

  async logError(error: any) {
    console.log(error, 'error')
    const errorMessage = `${new Date().toISOString()}: ${error}\n`;
    // Append error message to the file
    fs.appendFile(this.filePath, errorMessage, (err) => {
      if (err) {
        console.error('Error logging to file:', err);
      }
    });
  }

}