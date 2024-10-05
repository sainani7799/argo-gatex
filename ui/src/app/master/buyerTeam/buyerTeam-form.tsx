import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Card, message, Col, Row, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { BuyerTeameDto } from 'libs/shared-models';
import { WarehouseService, UnitService, BuyerTeamService } from 'libs/shared-services';
const { Option } = Select;

export interface buyerTeamFormProps {
    data: BuyerTeameDto;
    updateDetails: (data: BuyerTeameDto) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const BuyerTeamForm = (props:buyerTeamFormProps) => {
    const [unit, setUnit] = useState<any[]>([]);
    const [disable, setDisable] = useState<boolean>(false);
    const service = new BuyerTeamService();
    const [form] = Form.useForm();
    let navigate = useNavigate()
    const authdata = JSON.parse(localStorage.getItem('userName'))

    useEffect(() => {
        console.log(`This is Auth data: ${authdata}`);
        form.setFieldsValue({ createdUser: authdata?.userName });
    }, [])

    const onReset = () => {
        form.resetFields();
    };


    const save = (buyerTeam: BuyerTeameDto) => {
        service.createBuyer(buyerTeam).then(res => {
            if (res.status) {
                onReset();
                message.success('Created Successfully')
                navigate('/buyerteam-grid')
            } else {
                console.log(res.internalMessage, "**********");
                message.error('BuyerTeam already exist in this unit')
            }
        }).catch(err => {
            setDisable(false)
            message.error('')
            console.log(err, 'error while creating buyer team')
        })
    }

    const saveData = (values: BuyerTeameDto) => {
        setDisable(false)
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            save(values);
            setDisable(false)
        }
    };

    return (
        <Card title={<span style={{ color: 'white' }}>BuyerTeam Form </span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<Link to='/buyerteam-grid' >
            {props.isUpdate === false && (
                
                <span style={{ color: 'white' }} >
                    <Button className='panel_button' >Back </Button> 
                </span>
            )}
                </Link>} >
            <Form
                form={form}
                onFinish={saveData}
                layout='vertical'
                initialValues={props.data}
            >
                <Row gutter={24}>
                <Form.Item name="buyerTeamId" style={{ display: "none" }}>
                    <Input hidden />
                    </Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }}>
                        <Form.Item name="buyerTeam" label="Buyer Team" rules={[
                            { required: true },
                        ]}>
                            <Input placeholder="Enter Buyer Team" />
                        </Form.Item>
                    </Col>
                        <Form.Item style={{ display: "none" }} name="createdUser"  >
                        </Form.Item>
                </Row>
                {/* <Row > */}
                    <Col>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Col>
                {/* </Row> */}
            </Form>
        </Card>
    );
};

export default BuyerTeamForm;