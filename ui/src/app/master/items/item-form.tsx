import { Form, Input, Button, Select, Card, message, Col, Row, theme } from 'antd';
import { ItemDto } from 'libs/shared-models';
import { ItemService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ItemForm = () => {

    const service = new ItemService();
    const [form] = Form.useForm();
    const saveData = (data: ItemDto) => {
        console.log(`This is Item Data ${data}`);
        console.log(data);
        service.createItem(data).then(res => {
            if (res) {
                message.success('Created Successfully');
                form.resetFields();
            } else {
                message.error("Couldn't create");
            }
        }).catch(err => {
            message.error('Some Error Occured');
        })
    };
    const authdata = JSON.parse(localStorage.getItem('userName'))

    useEffect(() => {
        form.setFieldsValue({ createdUser: authdata.userName });
    }, [])

    return (
        <Card title={<span style={{ color: 'white' }}>Item Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<Link to='/item-grid' ><span style={{ color: 'white' }} ><Button className='panel_button' >View </Button> </span></Link>} >
            <Form
                form={form}
                onFinish={saveData}
                layout='vertical'
                style={{ width: '50%', margin: '0px auto 0px auto' }}
            >
                <Form.Item style={{ display: "none" }} name="createdUser"  >
                </Form.Item>
                <Row gutter={24} style={{ width: '100%' }}>
                    <Col style={{ width: '50%' }}>
                        <Form.Item label="Item Code" name="itemCode" rules={[
                            { required: true },
                        ]}>
                            <Input placeholder="Enter Item Code" />
                        </Form.Item>
                    </Col>
                    <Col style={{ width: '50%' }}>
                        <Form.Item label="Item Name" name="itemName" rules={[
                            { required: true },
                        ]}>
                            <Input placeholder="Enter Item Name" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col style={{width:'100%'}}>
                        <Form.Item label="Description" name="description" rules={[
                            { required: true },
                        ]} style={{ width: '95%' }}>
                            <Input placeholder="Enter Description" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col style={{ width: '50%' }}>
                        <Form.Item label="UOM" name="uom" rules={[
                            { required: true },
                        ]} style={{ width: '100%' }}>
                            <Input placeholder="Enter Unit Of Measurement" />
                        </Form.Item>
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        </Card>
    )
}

export default ItemForm;