import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Card, message, Col, Row, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CreateWarehouseDto } from 'libs/shared-models';
import { WarehouseService, UnitService } from 'libs/shared-services';
const { Option } = Select;

export interface warehouseFormProps {
    warehouseData: CreateWarehouseDto;
    updateDetails: (warehouseData: CreateWarehouseDto) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const WarehouseForm = (props:warehouseFormProps) => {
    const [unit, setUnit] = useState<any[]>([]);
    const [disable, setDisable] = useState<boolean>(false);
    const service = new WarehouseService();
    const unitService = new UnitService();
    const [form] = Form.useForm();
    let navigate = useNavigate()
    const authdata = JSON.parse(localStorage.getItem('userName'))

    useEffect(() => {
        console.log(`This is Auth data: ${authdata}`);
        form.setFieldsValue({ createdUser: authdata.userName });
        unitService.getAllUnits().then((res) => {
            if (res) {
                setUnit(res.data);
                console.log(res.data)
            }
        });
    }, [])

    const onReset = () => {
        form.resetFields();
    };


    const save = (warehouse: CreateWarehouseDto) => {
        service.createWarehouse(warehouse).then(res => {
            if (res.status) {
                onReset();
                message.success('Created Successfully')
                navigate('/warehouse-grid')
            } else {
                console.log(res.internalMessage, "**********");
                message.error('Warehouse already exist in this unit')
            }
        }).catch(err => {
            setDisable(false)
            message.error('')
        })
    }

    const saveData = (values: CreateWarehouseDto) => {
        setDisable(false)
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            save(values);
            setDisable(false)

        }
    };

    return (
        <Card title={<span style={{ color: 'white' }}>Warehouse Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<Link to='/warehouse-grid' ><span style={{ color: 'white' }} ><Button className='panel_button' >View </Button> </span></Link>} >
            <Form
                form={form}
                onFinish={saveData}
                layout='vertical'
                initialValues={props.warehouseData}
            >
                <Row gutter={24}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }}>
                    <Form.Item name="warehouseId" style={{ display: "none" }}>
                    <Input hidden />
                    </Form.Item>
                        <Form.Item name="unitId" label="Unit ID" rules={[
                            { required: true },
                        ]}>
                            <Select
                                showSearch
                                placeholder="Select Unit "
                                optionFilterProp="children"
                                allowClear
                            >
                                {unit.map((rec: any) => {
                                    return (
                                        <Option key={rec.id} value={rec.id}>
                                            {rec.unitName}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }}>
                        <Form.Item name="warehouseName" label="Warehouse Name" rules={[
                            { required: true },
                        ]}>
                            <Input placeholder="Enter Warehouse Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }} style={{ margin: '1%' }}
                    >
                        <Form.Item style={{ display: "none" }} name="createdUser"  >
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        </Card>
    );
};

export default WarehouseForm;