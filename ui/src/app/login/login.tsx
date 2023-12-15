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
            <Row gutter={24} justify={'center'}>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: `1px solid ${colorPrimaryActive}` }}>
                    <div style={{ display: 'flex' }}>
                        {/* <img style={{marginLeft:'100%',marginBottom:'150%'}} src = {logo} /> */}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ color: colorPrimary }} className='shahi-logo' >Delivery Chalan</h1>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'absolute', bottom: 0, right: 10 }}>
                        <Text style={{ margin: '0%' }} type='secondary'>Powered by</Text>
                        <Title style={{ margin: '0%' }} level={4}>UNIT 7</Title>
                    </div>
                </Col>
                <Divider style={{ height: '90vh' }} type='vertical' />
                <Col span={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: colorPrimaryActive }} >
                    <div className='login-title'>
                        <Title level={3} style={{ color: `#fff`, margin: '0' }}>Log In</Title>
                        <Text style={{ color: `#fff` }}>Enter your credentials below to login</Text>
                        <br />
                    </div>
                    <Card style={{ maxWidth: '70%', paddingTop: '10px' }}>
                        <Form form={loginForm} layout='vertical'>
                            <Form.Item name='username' label='Username' rules={[
                                { required: true },
                            ]}>
                                <Input />

                            </Form.Item>
                            <Form.Item name='password' label='Password' rules={[
                                { required: true },
                            ]}>
                                <Input.Password />

                            </Form.Item>
                        </Form>
                        {/* <Row justify={'end'}>
                            <Link>Forgot password ?</Link>
                        </Row> */}
                        <Row style={{ paddingTop: '5px' }}>
                            <Button onClick={onLogin} style={{ width: '100%' }} type={'primary'}>Login</Button>
                        </Row>
                    </Card>
                </Col>

            </Row>
        </Card>
    )
}