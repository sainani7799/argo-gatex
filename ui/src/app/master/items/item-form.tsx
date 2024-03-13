import { Form, Input, Button, Select, Card, message, Col, Row, theme } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { ItemDto } from 'libs/shared-models';
import { ItemService } from 'libs/shared-services';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export interface ItemsFormProps {
    itemData: ItemDto;
    updateDetails: (itemsData: ItemDto) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const ItemForm = (props:ItemsFormProps) => {
    const {Option} = Select
    const service = new ItemService();
    const [form] = Form.useForm();
    const [disable, setDisable] = useState<boolean>(false);
    let navigate = useNavigate()



    const authdata = JSON.parse(localStorage.getItem('userName'))

    useEffect(() => {
        form.setFieldsValue({ createdUser: authdata.userName });
    }, [])

    const onReset = () => {
        form.resetFields();
    };

    const save = (itemsData: ItemDto) => {
        service.createItem(itemsData).then(res => {
            if (res.status) {
                onReset();
                message.success('Created Successfully')
                navigate('/item-grid')
            } else {
                console.log(res.internalMessage, "**********");
                message.error('Not Created')
            }
        }).catch(err => {
            setDisable(false)
            message.error('')
        })
    }


    const saveData = (values: ItemDto) => {
        setDisable(false)
        if (props.isUpdate) {
            props.updateDetails(values);
        } else {
            save(values);
            setDisable(false)

        }
    };

    return (
        <Card title={<span style={{ color: 'white' }}>Item Form</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={<Link to='/item-grid' ><span style={{ color: 'white' }} ><Button className='panel_button' >Back </Button> </span></Link>} >
            <Form
                form={form}
                onFinish={saveData}
                layout='vertical'
                initialValues={props.itemData}
                style={{ width: '50%', margin: '0px auto 0px auto' }}
            >
                <Form.Item name="itemId" style={{ display: "none" }}>
                    <Input hidden />
                </Form.Item>
                <Form.Item style={{ display: "none" }} name="createdUser"  >
                </Form.Item>
                <Row gutter={24} style={{ width: '100%' }}>
                    <Col style={{ width: '50%' }}>
                        <Form.Item label="Item Code" name="itemCode" rules={[
                            { required: true },
                        ]}>
                            <Input placeholder="Enter Item Code" disabled={props.isUpdate}/>
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
                <Col style={{width:'50%'}}>
                        <Form.Item label="Item Type" name="itemType" rules={[
                            { required: true },
                        ]} style={{ width: '95%' }}>
                            <Select placeholder='Select Item Type'>
                                <Option value={'garment'}>Garment</Option>
                                <Option value={'fabric'}>Fabric</Option>
                                <Option value={'trim'}>Trim</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col style={{width:'50%'}}>
                        <Form.Item label="Description" name="description" rules={[
                            { required: true },
                        ]} style={{ width: '95%' }}>
                            <TextArea placeholder="Enter Description" />
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