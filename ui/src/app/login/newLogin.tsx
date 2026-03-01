import { Button, Card, Col, Form, Input, message, Modal, Row, theme } from "antd";
import { LoginDto } from "@gatex/shared-models";
import { UserManagementServices } from "@gatex/shared-services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './newLogin.css'
import image from './image.png'
import image2 from './image copy.png'
import image3 from './image copy 2.png'
const { useToken } = theme


export default function NewLogin() {
    const [loginForm] = Form.useForm()
    const [modalForm] = Form.useForm()
    const { token: { colorPrimary, colorPrimaryActive, colorBgTextHover } } = useToken()
    const [authState, setAuthState] = useState<any[]>([]);
    const navigate = useNavigate();
    const service = new UserManagementServices()
    const [modalVisible, setModalVisible] = useState(false)



    const onLogin = () => {
        loginForm.validateFields().then((values) => {
            const loginDto = new LoginDto(values.username, values.password)
            service.login(loginDto).then((res) => {
                if (res.status) {
                    localStorage.setItem('userName', JSON.stringify(res.data))
                    console.log(JSON.stringify(res.data), 'log')
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

    function oncancelModal() {
        setModalVisible(false)
        modalForm.resetFields()
    }

    function onResetPassword() {
        const userName = modalForm.getFieldValue('userName1')
        const oldP = modalForm.getFieldValue('oldPassword')
        const newP = modalForm.getFieldValue('newPassword')
        const confirmP = modalForm.getFieldValue('confirmPassword')

        if (!userName || !oldP || !newP || !confirmP) {
            message.error("All fields are required", 2);
            return;
        }

        const req = {
            user: userName
        }
        service.getPassword(req).then((res) => {

            if (!res || res.length === 0 || !res[0].PASSWORD) {
                message.error("Invalid username. Please enter a correct username.");
                return;
            }

            const dbPassword = res[0]?.PASSWORD
            console.log(dbPassword, 'dbpass')

            if (oldP === dbPassword) {
                if (newP === confirmP) {
                    // message.success("Password updated successfully for user:", userName );

                    const updateReq = {
                        user: userName,
                        newPassword: newP,
                    };

                    service.updatePassword(updateReq).then((res) => {
                        if (res.status) {
                            message.success(res.internalMessage, 2)
                        } else {
                            message.error(res.internalMessage, 2)
                        }
                    })
                    oncancelModal()


                }
            } else {
                message.error("Old password is incorrect");
            }

        })

        console.log(userName, oldP, confirmP)
    }

    return (
        <>

            <div className="login-whole">
                <div className="login-section">
                    <div className="login-heading">
                        {/* <h1 className="app-title">DIGITAL GATE PASS DC</h1> */}
                        <h1 className="heading" style={{ color: colorPrimary, fontSize: '2em', margin: 0 , textAlign:'center' }}>
                            DIGITAL GATE PASS DC
                        </h1>
                        <h1 className="heading" style={{ fontSize: '1em', padding: '10px' , textAlign:'center' }} >
                            For Non Inventory Sample Items
                        </h1>
                        <div className="login-form-container">
                            <div className="login-form-antd">
                                <Form
                                    name="login"
                                    initialValues={{ remember: true }}
                                    layout='vertical'
                                    form={loginForm}
                                >
                                    <Row gutter={16}>                                    
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
                                        <Form.Item>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Button type='link'
                                                    style={{ width: '100%'  ,  fontSize: '14px', }} onClick={showModal}>
                                                    Reset password
                                                </Button>
                                            </Col>
                                        </Form.Item>
                                    </Row>

                                    <Row >
                                        <Button onClick={onLogin} htmlType="submit" style={{
                                            width: '100%',
                                            backgroundColor: '#1890ff',  // Change the background color
                                            color: '#fff',               // Change the text color
                                            borderRadius: '8px',         // Add border-radius for rounded corners
                                            border: 'none',              // Remove default border
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add box shadow for depth
                                            transition: 'background-color 0.3s ease',  // Add smooth transition effect
                                        }}   className="login-button" >
                                            Login
                                        </Button>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="bg-image "> */}
                <img className="bg-image" src={image3} alt="modern art" style={{ maxWidth: '45vw' }} />
                {/* </div> */}

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
              xs={{ span: 18 }}
              sm={{ span: 24 }}
              md={{ span: 20 }}
              lg={{ span: 20 }}
              xl={{ span: 24 }}
            >
              <Form.Item label="User Name" name="userName1">
                <Input placeholder="Enter User Name"  />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col
              xs={{ span: 18 }}
              sm={{ span: 24 }}
              md={{ span: 20 }}
              lg={{ span: 20 }}
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
              xs={{ span: 18 }}
              sm={{ span: 24 }}
              md={{ span: 20 }}
              lg={{ span: 20 }}
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
              xs={{ span: 18 }}
              sm={{ span: 24 }}
              md={{ span: 20 }}
              lg={{ span: 20 }}
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

            </div>


        </>
    )
}