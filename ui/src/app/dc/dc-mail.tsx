import { Button, message } from "antd"
import { AcceptReq, AcceptableEnum, DcEmailModel, DcIdReq, StatusEnum } from "libs/shared-models"
import { DcService, EmailService } from "libs/shared-services"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import image from "../../../../ui/src/assets/EIG1.gif"
import moment from "moment"

export interface DcMailProps {
    dcId: number
}

export const DcMail = (props: DcMailProps) => {
    const [data, setData] = useState<any>([])
    const service = new DcService();
    const { id } = useParams();
    const mailService = new EmailService()
    console.log(id, '---out side')

    useEffect(() => {
        if (id) {
            console.log(id, '--inside use effect')
            getDc(id);
        }
    }, [id])

    const getDc = (val) => {
        const req = new DcIdReq(Number(val))
        console.log(req, '-----------req');
        service.getDcDetailsById(req).then(res => {
            console.log(res.data[0],'--reesponse')
            if (res.status) {
                setData(res.data)
                acceptDc(res.data[0])
            }
        })
    }



    const authdata = JSON.parse(localStorage.getItem('userName'))


    const acceptDc = (data) => {
        console.log(data,'---accept dc')
        const dto: AcceptReq = {
            isAccepted: AcceptableEnum.YES,
            acceptedUser: data.assign_by,
            dcId: Number(id),
            status: StatusEnum.SENT_FOR_SECURITY_CHECK,
        };
        // console.log(dto);
        const currentDate = new Date();
        const approvedDate = moment(currentDate).format('YYYY-MM-DD')
        service.acceptDc(dto).then(res => {
            if (res.status) {
                message.success('User Accept Successfully');
                sendDcMailForGatePass(data.createdUserMail, data.dcNumber, approvedDate, data.assignBy, data.fromUnit, data.toAddresserName, data.dcId)
            } else {
                // message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        });
    };

    async function sendDcMailForGatePass(email, dcNumber, approvedDate, approvedBy, fromUnit, toUnit, dcId) {
        const dcDetails = new DcEmailModel();
        // dcDetails.to = form.getFieldValue('emailId');
        dcDetails.to = email;
        // dcDetails.to = 'kushal.siddegowda@shahi.co.in';
        dcDetails.html = `
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            #acceptDcLink {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #28a745;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 10px;
                  transition: background-color 0.3s ease, color 0.3s ease;
                  cursor: pointer;
              }
      
              #acceptDcLink.accepted {
                  background-color: #6c757d;
                  cursor: not-allowed;
              }
      
              #acceptDcLink:hover {
                  background-color: #218838;
                  color: #fff;
              }
          </style>
        </head>
        <body>
          <p>Dear User,</p>
          <p>Please find the Approved ✅ Gate Pass details below:</p>
          <p>DC NO: ${dcNumber}</p>
          <p>
            Some items moved from Address: ${fromUnit} to
            Address: ${toUnit}
          </p>
            <p>Approved By: ${approvedBy}</p>
            <p>Approved Date: ${approvedDate}</p>
          <p>Please click the link below for details:</p>
      
          <a
            href="https://gatex.schemaxtech.in/dc-email-detail-view/${dcId}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >View Details of GatePass</a
          >
        </body>
      </html>
      `
        dcDetails.subject = "Gate Pass : " + dcNumber
        const res = await mailService.sendDcMail(dcDetails)
        console.log(res)
        if (res.status == 201) {
            if (res.data.status) {
                message.success("Mail sent successfully")
            } else {
                message.error("Error while sending mail ")
            }
        } else {
            message.success("Mail sent successfully")
        }
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ width: '100%', }}>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2em', // Adjust font size
                    color: '#4CAF50', // Adjust text color
                    fontFamily: 'Arial, sans-serif', // Specify a font family
                    fontWeight: 'bold', // Specify font weight
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Add a subtle text shadow
                    // Add more styles as needed
                }}>
                    GATE PASS "{data[0]?.dcNumber}" APPROVED, THANK YOU
                </h1>
                <img
                    src={image}
                    alt="EIG1.gif"
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
        </div>
    )
}
export default DcMail