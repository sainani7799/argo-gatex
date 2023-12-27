import { Button, message } from "antd"
import { AcceptReq, AcceptableEnum, DcIdReq, StatusEnum } from "libs/shared-models"
import { DcService } from "libs/shared-services"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import image from "../../../../ui/src/assets/EIG1.gif"

export interface DcMailProps {
    dcId: number
}

export const DcMail = (props: DcMailProps) => {
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
            acceptDc()
        }
    }, [data])

    const acceptDc = () => {
        const dto: AcceptReq = {
            isAccepted: AcceptableEnum.YES,
            acceptedUser: data[0]?.assign_by,
            dcId: Number(id),
            status: StatusEnum.READY_TO_RECEIVE,
        };
        // console.log(dto);
        service.acceptDc(dto).then(res => {
            if (res.status) {
                message.success('User Accept Successfully');
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