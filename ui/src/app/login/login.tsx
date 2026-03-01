import { Button, Card, Col, Divider, Form, Input, Modal, Row, Typography, message, theme } from 'antd'
import React, { useState } from 'react';
import './login.css'
import { useNavigate } from 'react-router-dom';
import { UserManagementServices } from '@gatex/shared-services';
import { LoginDto } from '@gatex/shared-models';
// import logo  from '../logo.jpeg';
const { Text, Link, Title } = Typography;
const { useToken } = theme


export default function Login() {
    const [loginForm] = Form.useForm()
    const [modalForm] = Form.useForm()
    const { token: { colorPrimary, colorPrimaryActive, colorBgTextHover } } = useToken()
    const [authState, setAuthState] = useState<any[]>([]);
    const navigate = useNavigate();
    const service = new UserManagementServices()
    const [modalVisible , setModalVisible] = useState(false)



    const onLogin = () => {
        loginForm.validateFields().then((values) => {
            const loginDto = new LoginDto(values.username, values.password)
            service.login(loginDto).then((res) => {
                if (res.status) {
                    localStorage.setItem('userName', JSON.stringify(res.data))
                    console.log( JSON.stringify(res.data), 'log')
                    setAuthState([{ userName: values.username, isAuthenticated: true }]);
                    console.log(setAuthState, 'setAuthState')
                    message.success(res.internalMessage)
                    // navigate('/dc-view')
                    navigate('/')
                } else {
                    message.error(res.internalMessage)
                }
            })

        })
    }


  const showModal = () => {
    modalForm.setFieldsValue({
        userName1: loginForm.getFieldValue('username')
      });
    setModalVisible(true)
  }

  function oncancelModal(){
    setModalVisible(false)
    modalForm.resetFields()
  }

  function onResetPassword(){
    const userName = modalForm.getFieldValue('userName1')
    const oldP = modalForm.getFieldValue('oldPassword')  
    const newP = modalForm.getFieldValue('newPassword')  
    const confirmP = modalForm.getFieldValue('confirmPassword') 

    if (!userName || !oldP || !newP || !confirmP) {
        message.error("All fields are required" , 2);
        return;
      }

    const req = {
        user : userName
    }
    service.getPassword(req).then((res) => {
       
        if (!res || res.length === 0 || !res[0].PASSWORD) {
            message.error("Invalid username. Please enter a correct username.");
            return;
          }

            const dbPassword = res[0]?.PASSWORD
            console.log(dbPassword , 'dbpass')

        if(oldP === dbPassword){
            if(newP === confirmP){
                // message.success("Password updated successfully for user:", userName );

                const updateReq = {
                    user: userName,
                    newPassword: newP,
                  };
                
                service.updatePassword(updateReq).then((res) => {
                    if(res.status){
                        message.success(res.internalMessage , 2)
                    }else{
                        message.error(res.internalMessage , 2)
                    }
                })
                oncancelModal()

                
            }
        }else {
            message.error("Old password is incorrect");
        }

    })

    console.log(userName , oldP , confirmP)    
  }

    return (
        <Card style={{ background: colorBgTextHover, width: '100%', height: '100vh', 
        margin: '0 auto',  
        display:'-ms-flexbox',
        justifyContent: 'center',
        boxSizing: 'border-box'}}>
            <Row gutter={24} justify={'center'} align={'middle'}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ padding: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontFamily: 'Lato, sans-serif', color: colorPrimary, fontSize: '2em', margin: 0 }}>
                            DIGITAL GATE PASS DC
                            </h2>
                            <h1 style={{fontSize : '1em'}}>
                              For Non Inventory Sample Items
                            </h1>
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
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Button type='link'
              style={{ width: '100%' }} onClick={showModal}>
                Reset password             
                 </Button>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: '10px' }}>
                                <Button onClick={onLogin} htmlType="submit" style={{
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
            <Modal
        title = "Reset Password"
        visible = {modalVisible}
        onCancel={oncancelModal}
        footer = {null}
        
        >
          <Card>
          <Form layout='vertical' style={{width:400}} form={modalForm} onFinish={onResetPassword} >
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 24 }}
            >
              <Form.Item label="User Name" name="userName1">
                <Input placeholder="Enter User Name"  />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 24 }}
            >
              <Form.Item label="Old Password" name="oldPassword" 
              rules={[
                {
                required: true,
                message: "Please enter your old password",
                },
            ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 24 }}
            >
              <Form.Item label="New Password" name="newPassword"
               rules={[
                {
                required: true,
                message: "Please enter your new password",
                },
            ]}>
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 24 }}
            >
              <Form.Item label="Confirm New Password" 
              name="confirmPassword" 
              dependencies={['newPassword']}
              hasFeedback
            rules={[
                {
                required: true,
                message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                    }
                    return Promise.reject(new Error('The passwords did not match!'));
                },
                }),
            ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item>
          </Form>
          </Card>

        </Modal>
        </Card>
        
    )
}