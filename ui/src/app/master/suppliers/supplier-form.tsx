import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Card, message, Col, Row, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { SupplierService } from '@gatex/shared-services';
import { SupplierDto } from '@gatex/shared-models';
import form from 'antd/es/form';

const { useToken } = theme;
const { Option } = Select;


export interface SupplierFormProps {
    supplierData: SupplierDto;
    updateDetails: (supplierData: SupplierDto) => void;
    isUpdate: boolean;
    closeForm: () => void;
}


const SupplierForm = (props:SupplierFormProps) => {
    const { token: { colorPrimary } } = useToken()
    const Option = Select;
    const [form] = Form.useForm();
    const service = new SupplierService();
    const navigate = useNavigate();
    const authdata = JSON.parse(localStorage.getItem('userName'));
    const [disable, setDisable] = useState<boolean>(false);
    console.log(authdata)

    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        form.setFieldsValue({createdUser:authdata?.userName})
    }, [])


    const save = (suppliersData: SupplierDto) => {
        service.createSupplier(suppliersData).then(res => {
            if (res.status) {
                onReset();
                message.success('Created Successfully')
                navigate('/supplier-view')
            } else {
                message.error(res.internalMessage)
            }
        })
    }

    const saveData = (values: SupplierDto) => {
        setDisable(false)
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            save(values);
            setDisable(false)

        }
    };


    return (
        <Card title={<span style={{ color: 'white' }}>Buyer/Supplier Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#047595',color:'black', border: 0 }} 
            extra={<Link to='/supplier-view' >
            {props.isUpdate === false && (
            <span style={{ color: 'white' }} >
                <Button className='panel_button' >Back </Button> 
            </span>
            )}
                </Link>} 
                >
            <Form
                form={form}
                onFinish={saveData}
                layout='vertical'
                initialValues={props.supplierData}
            >

                <Row gutter={24}   >
                    <Form.Item name="supplierId" style={{ display: "none" }}>
                        <Input hidden />
                    </Form.Item>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="supplierCode" label="Buyer /Supplier Code"
                            rules={[
                                { required: true },
                            ]}>
                            <Input placeholder=" Enter Buyer/Supplier Code" disabled={props.isUpdate} />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="supplierName" label="Buyer /Supplier Name"
                            rules={[
                                { required: true },
                            ]}>
                            <Input placeholder=" Enter Buyer Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }} xl={{ span: 5, offset: 1 }} style={{ margin: '1%' }} >
                        <Form.Item name="type" label="Type"
                            rules={[
                                { required: true },
                            ]}>
                            <Select placeholder='Select Type'> 
                               <Option value={'BUYER'}>Buyer</Option>
                               <Option value={'SUPPLIER'}>Supplier</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                  
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 4 }} style={{ margin: '1%' }}
                    >
                        <Form.Item style={{ display: "none" }} name="createdUser"  >
                        </Form.Item>
                    </Col>

                </Row>
                <Row justify="end">
                    <Col span={40} style={{ textAlign: 'right' }}>

                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
            {props.isUpdate === false && (

                        <Button htmlType="button" style={{ margin: '0 14px' }} onClick={onReset}>
                            Reset
                        </Button>
            )}
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default SupplierForm;