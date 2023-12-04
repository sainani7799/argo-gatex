import { CreateAddressDto, CreateEmployeeDto } from 'libs/shared-models/src';
import { AddressService, DepartmentService, DesignationService, EmployeeService, SupplierService, UnitService } from 'libs/shared-services/src';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, message, theme } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { from } from 'rxjs';
const { useToken } = theme;
const { Option } = Select;

export interface AddressFormProps {
    addressData: CreateAddressDto;
    updateDetails: (address: AddressFormProps) => void;
    isUpdate: boolean;
    closeForm: () => void;
}

const AddressForm = (props: AddressFormProps) => {
    const { token: { colorPrimary } } = useToken()
    const [form] = Form.useForm();
    let navigate = useNavigate()
    const [unit, setUnit] = useState<any[]>([]);
    const [supplier, setSupplier] = useState<any[]>([]);
    const unitService = new UnitService();
    const supplierService = new SupplierService();
    const service = new AddressService;
    const [selectedAddressType, setSelectedAddressType] = useState(null);
    const authdata = JSON.parse(localStorage.getItem('userName'))
    const handleAddressTypeChange = (value) => {
        setSelectedAddressType(value);
    };

    const onReset = () => {
        form.resetFields();
    };

    useEffect(() => {
        form.setFieldsValue({ createdUser: authdata.userName })
    }, [])


    useEffect(() => {
        getAllUnits();
        getAllSuppliers();

    }, []);



    const getAllUnits = () => {
        unitService.getAllUnits().then((res) => {
            if (res) {
                setUnit(res.data);
                console.log(res.data)
            }
        })
    }

    const getAllSuppliers = () => {
        supplierService.getAllSuppliers().then((res) => {
            if (res) {
                setSupplier(res.data);
                console.log(res.data)
            }
        })
    }


    const save = (addressData: CreateAddressDto) => {
        service.createAddress(addressData).then(res => {
            if (res) {
                onReset();
                message.success('Created Successfully')
                // navigate('/employee-view')
            } else {
                console.log(res.internalMessage, "**********");
                message.error('Not Created')
            }
        }).catch(err => {
            message.error('')
        })
    }

    const saveData = (values: CreateAddressDto) => {
        save(values);
    };

    return (
        <Card title={<span style={{ color: 'white' }}>Add Address</span>}
            style={{ textAlign: 'center' }} headStyle={{ backgroundColor: '#7d33a2', border: 0 }} extra={props.isUpdate == true ? "" : <Link to='/address-view' ><span style={{ color: 'white' }} ><Button className='panel_button' >View </Button> </span></Link>} >
            <Form
                form={form}
                initialValues={props.addressData}
                onFinish={saveData}
                layout='vertical'
            >
                <Card>

                    <Row gutter={24}>
                        <Form.Item name="addressId" style={{ display: "none" }}>
                            <Input hidden />
                        </Form.Item>
                        <Row style={{ width: '50%', margin: '10px auto 10px auto' }}>
                            <Card style={{ width: '100%' }}>
                                <Row style={{ width: '100%' }}>
                                    <Col style={{ width: '50%' }}>
                                        <Form.Item name="addresser" label="Unit/Supplier"
                                            rules={[
                                                { required: true },
                                            ]} style={{ width: '90%' }}>
                                            <Select
                                                placeholder="Select Address Type"
                                                style={{ width: "100%" }}
                                                allowClear
                                                onChange={handleAddressTypeChange}
                                            >
                                                <Select.Option value="unit">Unit</Select.Option>
                                                <Select.Option value="supplier">Supplier</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <Form.Item name="addresserName" label="Name" rules={[{ required: true }]} style={{ width: '90%' }}>
                                            <Select
                                                showSearch
                                                placeholder={`Select ${selectedAddressType === 'unit' ? 'Unit' : 'supplier'}`}
                                                optionFilterProp="children"
                                                allowClear
                                                style={{ width: '100%' }}
                                            >
                                                {selectedAddressType === 'unit'
                                                    ? unit.map((rec: any) => (
                                                        <Select.Option key={rec.id} value={rec.id}>
                                                            {rec.unitName}
                                                        </Select.Option>
                                                    ))
                                                    : supplier.map((rec: any) => (
                                                        <Select.Option key={rec.supplierId} value={rec.supplierId}>
                                                            {rec.supplierName}
                                                        </Select.Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item name="lineOne" label="line One"
                                    rules={[
                                        { required: true },
                                    ]} style={{ width: '90%' }}>
                                    <Input placeholder=" Enter line One" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name="lineTwo" label="line Two"
                                    rules={[
                                        { required: true },
                                    ]} style={{ width: '90%' }}>
                                    <Input placeholder=" Enter line Two" style={{ width: '100%' }} />
                                </Form.Item>
                                <Row style={{ width: '100%' }}>
                                    <Col style={{ width: '50%' }}>
                                        <Form.Item name="city" label="city:"
                                            rules={[
                                                { required: true },
                                            ]}
                                            style={{ width: '90%' }}
                                        >
                                            <Input placeholder=" Enter city" />
                                        </Form.Item>
                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <Form.Item name="dist" label="Dist" style={{ width: '90%' }}>
                                            <Input placeholder=" Enter Dist" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ width: '100%' }}>
                                    <Col style={{ width: '50%' }}>
                                        <Form.Item
                                            name="pinCode"
                                            label="Pin Code"
                                            rules={[
                                                { required: true, message: ' Valid Mobile No is required', min: 6, },
                                                {
                                                    pattern: /^[0-9]*$/,
                                                    message: `Don't Allow letters and Spaces`
                                                }
                                            ]}
                                            style={{ width: '90%' }}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col style={{ width: '50%' }}>
                                        <Form.Item name="state" label="state"
                                            rules={[
                                                { required: true },
                                            ]}
                                        >
                                            <Input placeholder=" Enter state" />
                                        </Form.Item>
                                    </Col>
                                </Row>



                                <Form.Item name="country" label="country"
                                    rules={[
                                        { required: true },
                                    ]}
                                >
                                    <Input placeholder=" Enter country" />
                                </Form.Item>

                                <Form.Item style={{ display: "none" }} name="createdUser"  >
                                </Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                {(props.isUpdate !== true) &&
                                    <Button htmlType="button" style={{ margin: '0 14px' }} onClick={onReset}>
                                        Reset
                                    </Button>}
                            </Card>
                        </Row>
                    </Row>

                </Card>

            </Form>
        </Card>
    )
}

export default AddressForm;