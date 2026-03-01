import { Button, Card, Carousel, Col, Divider, Form, Input, Row, message } from "antd";
import { Header } from "antd/es/layout/layout";
import assetpic from "../login-component/images/Gatepassicon.png";
import assetname from "../login-component/images/gatex-white.png";
// import productOne from "../../app/login-component-images/empty.png";
// import productTwo from "../../app/login-component-images/empty.png";
import { EyeInvisibleOutlined, EyeOutlined, } from '@ant-design/icons';
import Axios from "axios";
import downloadicon from "../login-component-images/Downlodeicon.png";
import supporticon from "../login-component-images/Support-icon.png";
import videoiconnew from "../login-component-images/Videoiconnew.png";
import WhatsappIcon from "../login-component-images/Whatsappicon.png";
import SchemaxLogoWhite1 from "../login-component-images/X Logo 2.png";
import AssetXpert1 from "../login-component/images/GatepassOne.png";
import AssetXpert2 from "../login-component/images/GatepassTwo.png";
import './login-component.css';

import axios from "axios";
import { LoginDto } from "@gatex/shared-models";
import { UserManagementServices } from "@gatex/shared-services";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIAMClientState } from "../iam-client";
import SchemaxLogo from '../login-component-images/schemax-logo.png';

interface LocationState {
    from: { pathname: string };
}


const LoginComponent = () => {
    // const {dispatch}=useIAMClientState()
    const [user_data, setUser] = useState(null);
    const [load, setLoad] = useState(false);
    let navigate = useNavigate();
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const location = useLocation();
    const [loginForm] = Form.useForm()
    const service = new UserManagementServices()
    const [authState, setAuthState] = useState<any[]>([]);

    axios.interceptors.request.use(request => {
        setLoad(true);
        return request;
    });

    axios.interceptors.response.use(response => {
        setLoad(false);
        return response;
    }, error => {
        setLoad(false);
        throw error;
    });


    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    console.log(loggedInUser)
    useEffect(() => {

        if (loggedInUser) {
            // setTimeout(() => setLoading(false), 1000)
            setUser(loggedInUser);
        }
    }, []);

    // login the user
    // const handleSubmit = async (values) => {
    //     // e.preventDefault();
    //     const response = await axios.post(appSettings.ums_url + '/auth/login', values);
    //     if (response.data.status) {
    //         // store the user in localStorage
    //         localStorage.setItem("user", JSON.stringify(response.data));
    //         localStorage.setItem("username", JSON.stringify(response.data.user_data.username));
    //         localStorage.setItem("userid", JSON.stringify(response.data.user_data.id));
    //         localStorage.setItem("createdUser", response.data.user_data.username);
    //         localStorage.setItem("expiresIn", JSON.stringify(response.data.expiresIn));
    //         localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
    //         localStorage.setItem("role", JSON.stringify(response.data.user_data.employeeRole));
    //         localStorage.setItem("unit_id", JSON.stringify(response.data.user_data.unitId));
    //         localStorage.setItem('accessToken', response.data.accessToken);
    //         const data = {
    //             loading: false,
    //             isAuthenticated: true,
    //             user: {
    //                 userId: response.data.user_data.id,
    //                 userName: response.data.user_data.username,
    //                 profilePicPath: null,
    //                 roles: response.data.user_data.employeeRole,
    //                 orgData: {
    //                     unitCode: '12',
    //                     companyCode: 'Shahi'
    //                 }
    //             },
    //             defaultPlant: 'SRPL',
    //             defaultPlantCurrency: 'IDR',
    //             token: response.data.accessToken,
    //             errorMessage: ''
    //         }
    //         dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
    //         localStorage.setItem('currentUser', JSON.stringify(data));

    //         // set the state of the user
    //         setUser(response.data);
    //        navigate('/asset-dashboard',{replace:true})
    //         AlertMessages.getSuccessMessage('Login Successful');

    //         // Optionally, reload the page
    //         // window.location.reload();
    //     } else {
    //         AlertMessages.getErrorMessage('Invalid Credentials');
    //     }
    // };

    // const handleSubmit = async (values: any) => {
    //     if (values.username === 'admin' && values.password === "admin") {
    //         localStorage.setItem('auth', 'true');
    //         localStorage.setItem('username', values.username);
    //         navigate('/employee-view', { replace: true });
    //     } else if (values.username === 'patrolx' && values.password === "patrolx") {
    //         localStorage.setItem('auth', 'true');
    //         localStorage.setItem('username', values.username);
    //         navigate('/employee-view', { replace: true });
    //     } else {

    //     }
    // };


    const handleSubmit = () => {
        loginForm.validateFields().then((values) => {
            const loginDto = new LoginDto(values.username, values.password)
            service.login(loginDto).then((res) => {
                if (res.status) {
                    res.data.unitCode = 'NORLANKA'
                    res.data.companyCode = 'NORLANKA'
                    localStorage.setItem('userName', JSON.stringify(res.data));
                    localStorage.setItem('helpxUserName', values.username)
                    setAuthState([{ userName: values.username, isAuthenticated: true }]);
                    message.success(res.internalMessage)
                    navigate('/dc-view')
                } else {
                    message.error(res.internalMessage)
                }
            })

        })
    }



    // const handleSubmit = async (values: any) => {
    //     try {
    //         const req = new LoginUserDto(values.username, values.password, IAMClientAuthContext.authServerUrl,IAMClientAuthContext.unitId)
    //         let response = await loginUser(dispatch, req);
    //         if (!response.user) return false;
    //         const from = (location.state as LocationState)?.from;
    //         if (from) {
    //             navigate(from, { replace: true });
    //         } else {
    //             navigate("/asset-dashboard", { replace: true });
    //         }
    //         return true;
    //     } catch (error: any) {
    //         notification.config({ maxCount: 3, duration: 3, placement: 'top' });
    //         notification.destroy();
    //         notification.error(
    //             {
    //                 message: 'Error',
    //                 description: error.message,
    //             }
    //         );
    //         return false;
    //     }
    // };

    const ProductsCards = [
        {
            title: 'Warehouse Mangemennt',
            image: AssetXpert1,
            description: 'To efficiently manage and organize raw materials inventory to ensure timely availability for production while minimizing storage costs and waste.'
        },
        {
            title: 'Inspection',
            image: AssetXpert2,
            description: ' To thoroughly inspect incoming raw materials for quality and compliance with specifications to prevent defects and ensure consistency in product quality. A: 4-point inspection: Assessing four critical aspects (fabric appearance, hand-feel, weight, and width. B: Shade inspection: Checking for color consistency and accuracy. C: Shrinkage inspection: Measuring fabric shrinkage after washing or treatment. D: GSM Inspection: It involves measuring the weight of fabric per unit area, typically in grams per square meter'

        },
    ]

    const contentStyle: React.CSSProperties = {
        height: '86vh',
        color: '#fff',
        textAlign: 'center',
    };

    const downloadFile = async () => {
        const response = await Axios({ url: './assets/AssetXpert - product-catalogy.pdf', method: 'GET', responseType: 'blob' })
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'AssetXpert - product-catalogy.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    }


    return (
        <div style={{ height: '100vh', overflowY: 'hidden' }}>
            <Header style={{ padding: '10px', background: 'black', border: '1px solid gray', height: "65px" }}>
                <Row >
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ color: 'white', marginTop: '-3px' }}>
                        {/* <h1 style={{ color: 'white', marginTop: '-15px' }}>Schemax</h1> */}
                        <img src={SchemaxLogo} alt="/" style={{ height: "57px" }} />
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'center', marginTop: '-10px' }}>
                        <img src={SchemaxLogoWhite1} alt="/" style={{ height: "57px" }} />
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'end' }}>
                        <a href="tel:+919014375798" >
                            <img src={supporticon} style={{ fontSize: '54px', height: "59px", marginLeft: '20px', cursor: 'pointer', paddingBottom: "24px" }} /></a>
                        <img src={videoiconnew} alt="/" style={{ fontSize: '24px', height: "59px", paddingBottom: "24px", marginLeft: '20px', cursor: 'pointer', marginTop: '7px' }} />
                        <img
                            onClick={downloadFile}
                            src={downloadicon}
                            alt="/" style={{ fontSize: '24px', height: "59px", paddingBottom: "24px", marginLeft: '20px', cursor: 'pointer', marginTop: '7px' }}
                        />
                        <a aria-label="Chat on WhatsApp" target="_blank" href="https://wa.me/919014375798?text=Hi%20there%21%20I%27m%20reaching%20out%20for%20some%20help.%20Can%20you%20assist%20me%20%3F">
                            <img alt="Chat on WhatsApp" src={WhatsappIcon} style={{ color: "white", fontSize: '24px', height: "59px", paddingBottom: "24px", marginLeft: '20px', cursor: 'pointer' }} />
                        </a>
                    </Col>
                </Row>
            </Header>
            <Row>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }} lg={{ span: 18, order: 1 }}>
                    <Card style={{ background: 'white', height: '100%', }}
                        bodyStyle={{ padding: "0px" }}
                    >
                        <Carousel
                            arrows={true}
                            className="login-c"
                            autoplay
                            slidesToShow={1} speed={500}>
                            {ProductsCards.map((card, key) => {
                                return <div >
                                    <p style={contentStyle}>
                                        <div key={key}
                                        >
                                            <div className="flip-container">
                                                <div className="flipper">
                                                    <div className="front">
                                                        <div>
                                                            <img style={{
                                                                height: '92vh',
                                                                width: '100%',
                                                                top: '0', marginTop: "-20px"
                                                            }} className="mb-2" src={card.image} />
                                                        </div>
                                                    </div>
                                                    <div className="back">
                                                        <Col className="justify-center">
                                                            <h3 className="">
                                                                {card.title}
                                                            </h3>
                                                            <p className="description" style={{ color: "black" }}>
                                                                {card.description}
                                                            </p>
                                                        </Col>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </p>
                                </div>
                            })}
                        </Carousel>

                    </Card>
                </Col>
                <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }} lg={{ span: 6, order: 2 }}
                    style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', fontFamily: 'cursive',
                        background: 'black',
                        boxShadow: 'none',
                        borderRadius: 0,
                        border: 'none'
                    }}>

                        <Card className="glass" style={{
                            textAlign: 'center', background: 'black', fontFamily: 'sans-serif',
                            border: 'none', width: "300px", height: "600px",
                        }}>
                            <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '1.4rem' }}>
                                <img src={assetpic} alt="/"
                                    style={{
                                        width: "45%",
                                    }} />
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <img src={assetname} alt="/" style={{
                                    height: "2.5rem",
                                    marginBottom: '10px'
                                }} />
                            </Row>
                            <div className="logo">


                                <Form
                                    name="normal_login"
                                    className="container"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    form={loginForm}
                                    onFinish={handleSubmit}>
                                    <Col span={24}>
                                        <Form.Item
                                            name='username'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your Username!',
                                                },
                                                // {
                                                //     type: 'email',
                                                //     message: 'The input is not valid E-mail!',
                                                // },
                                            ]}>
                                            <Input placeholder="Username"
                                                className="custom-placeholder"
                                                style={{
                                                    background: '#000', border: 'none', width: "260px", height: "40px", color: 'white', boxShadow: '0 0 10px #822bff'
                                                }}
                                                autoComplete="new-username"

                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
                                            <Input.Password
                                                // className="custom-placeholder"
                                                className="custom-password-input"
                                                placeholder="Password"
                                                iconRender={visible => (visible ? <EyeOutlined style={{ color: 'white' }} /> : <EyeInvisibleOutlined style={{ color: 'white' }} />)}
                                                style={{
                                                    background: '#000', border: 'none', width: "260px", height: "40px", color: 'white', boxShadow: '0 0 10px #822bff'
                                                }}

                                                autoComplete="new-password"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Col span={24}>
                                            <Button
                                                type="primary" htmlType="submit"
                                                style={{
                                                    textSizeAdjust: '50',
                                                    backgroundColor: '#7a6bcc',
                                                    width: "260px", color: '#FFFFFF',
                                                    height: "40px", fontSize: '18px',
                                                    border: "black",
                                                    fontFamily: "calibri",
                                                    fontWeight: 'bold',
                                                    boxShadow: '#A46BF5 -4px 15px 40px -8px',
                                                    letterSpacing: '1px',
                                                }}>Login</Button>
                                        </Col>
                                    </Col>
                                </Form>
                            </div>
                        </Card>
                        <div style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '2px',
                            color: 'white',
                            fontSize: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Divider style={{ color: '#ffff', marginBottom: "-1px", }}>Powered by @SchemaxTech</Divider>
                            <span style={{
                                alignSelf: 'flex-start', fontSize: '15px',
                                fontWeight: 700,
                                marginLeft: '0rem'
                            }}></span>
                        </div>


                    </Card>
                </Col>
            </Row>
        </div>
    )
};
export default LoginComponent;