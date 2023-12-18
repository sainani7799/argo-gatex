import { Button, Card, Col, Divider, Form, Input, Row, Typography, message, theme } from 'antd'
import React, { useState } from 'react';
import './login.css'
import { useNavigate } from 'react-router-dom';
import { UserManagementServices } from 'libs/shared-services';
import { LoginDto } from 'libs/shared-models';
// import logo  from '../logo.jpeg';
const { Text, Link, Title } = Typography;
const { useToken } = theme


export default function Login() {
    const [loginForm] = Form.useForm()
    const { token: { colorPrimary, colorPrimaryActive, colorBgTextHover } } = useToken()
    const [authState, setAuthState] = useState<any[]>([]);
    const navigate = useNavigate();
    const service = new UserManagementServices()



    const onLogin = () => {
        loginForm.validateFields().then((values) => {
            const loginDto = new LoginDto(values.username, values.password)
            service.login(loginDto).then((res) => {
                if (res.status) {
                    localStorage.setItem('userName', JSON.stringify(res.data))
                    console.log(localStorage.setItem('userName', JSON.stringify(res.data)), 'log')
                    setAuthState([{ userName: values.username, isAuthenticated: true }]);
                    console.log(setAuthState, 'setAuthState')
                    message.success(res.internalMessage)
                    navigate('/dc-view')
                } else {
                    message.error(res.internalMessage)
                }
            })

        })
    }

    return (
        <Card style={{ background: colorBgTextHover }}>
            <Row gutter={24} justify={'center'} align={'middle'}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'Lato, sans-serif', color: colorPrimary, fontSize: '2em', margin: 0 }}>
                                Delivery Challan
                            </h2>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <Text type='secondary'>Powered by</Text>
                            <Title level={4} style={{ margin: '0', fontSize: '1em' }}>
                                SHAHI
                            </Title>
                        </div>
                    </div>
                </Col>

                <Divider style={{ display: 'none' }} type='vertical' />

                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{
                    background: colorPrimaryActive,
                    padding: '20px',
                    borderRadius: '10px', // Adjust the border radius as needed
                    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)',
                }}>

                    <div className='login-title'>
                        <Title level={3} style={{ color: `#fff`, margin: '0' }}>Log In</Title>
                        <Text style={{ color: `#fff` }}>Enter your credentials below to login</Text>
                    </div>
                    <Card style={{ width: '100%', maxWidth: '400px', margin: '0 auto', paddingTop: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
                        <Form form={loginForm} layout='vertical'>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item name='username' label='User Name' rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item name='password' label='Password' rules={[{ required: true }]}>
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: '10px' }}>
                                <Button onClick={onLogin} style={{
                                    width: '100%',
                                    backgroundColor: '#1890ff',  // Change the background color
                                    color: '#fff',               // Change the text color
                                    borderRadius: '8px',         // Add border-radius for rounded corners
                                    border: 'none',              // Remove default border
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add box shadow for depth
                                    transition: 'background-color 0.3s ease',  // Add smooth transition effect
                                }} type={'primary'}>
                                    Login
                                </Button>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Card>
    )
}