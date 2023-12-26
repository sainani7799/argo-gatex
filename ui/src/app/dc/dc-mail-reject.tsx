import { Button, message } from "antd"
import { AcceptReq, AcceptableEnum, DcIdReq, RejectDcReq, StatusEnum } from "libs/shared-models"
import { DcService } from "libs/shared-services"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import image from "../../../../ui/src/assets/cancelled.jpg"

export interface DcRejectMailProps {
    dcId: number
}

export const DcRejectMail = (props: DcRejectMailProps) => {
    const [data, setData] = useState<any>([])
    const service = new DcService();
    const { id } = useParams();

    console.log(id)


    useEffect(() => {
        getDc();
    }, [id])

    const getDc = () => {
        const req = new DcIdReq(Number(id))
        console.log(req, '-----------');
        service.getDcDetailsById(req).then(res => {
            if (res.status) {
                setData(res.data)
            }
        })
    }

    useEffect(() => {
        console.log(data)
        if (data) {
            console.log('111')
            rejectDc()
        }
    }, [data])

    const rejectDc = () => {
        const dto: RejectDcReq = {
            dcId: Number(id),
            isAccepted: AcceptableEnum.REJECT,
            acceptedUser: data[0]?.assign_by,
            status: StatusEnum.CLOSED,
        };
        // console.log(dto);
        service.rejectDc(dto).then(res => {
            if (res.status) {
                message.success('DC Rejected Successfully');
            } else {
                // message.error(res.internalMessage);
            }
        }).catch(err => {
            message.error(err.message);
        });
    };
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
                    THANK YOU FOR UPDATING
                </h1 >
                {/* <img
                    src={image}
                    alt="cancelled.jpg"
                    style={{ width: '100%', height: 'auto' }}
                /> */}
            </div>
        </div>
    )
}
export default DcRejectMail