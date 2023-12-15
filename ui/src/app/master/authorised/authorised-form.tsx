import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Card, Row, Col, message, Typography, Upload, UploadProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { ApprovedUserDto } from "libs/shared-models";
import { ApprovalUserService, EmployeeService } from "libs/shared-services";

const { TextArea } = Input;
const { Option } = Select;

export interface ApprovedUserFormProps {
  data: ApprovedUserDto;
  updateApprovalUser: (dto: ApprovedUserDto, fileList: any) => void;
  isUpdate: boolean;
  closeForm: () => void;
}


export function ApprovedUserForm(props: ApprovedUserFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdateImg, setIsUpdateImg] = useState('')
  const [disable, setDisable] = useState<boolean>(false);
  const [employee, setEmployee] = useState<any>([]);
  const authdata = JSON.parse(localStorage.getItem('userName'))
  const employeeService = new EmployeeService();


  const Service = new ApprovalUserService();

  const [fileList, setFileList] = useState<any>(props.isUpdate ? [{
    name: props.data.sigImageName,
    status: 'done',
    url: props.data.sigImageName,

  }] : []);

  useEffect(() => {
    getAllEmployees();
    form.setFieldsValue({ createdUser: authdata.userName })
  }, [])
  const getAllEmployees = () => {
    employeeService.getAllEmployees().then(res => {
      if (res) {
        console.log("This is employee");
        // console.log(res);
        setEmployee(res.data);
      }
    })
  };

  useEffect(() => {
    if (props.data) {
      const updateImage = 'http://localhost/DELIVERY_CHALAN/upload-files' + props.data.sigImageName
      // const updateImage ='http://165.22.220.143/crm/gtstoinfor/upload-files/'+props.styleData.styleFileName
      setIsUpdateImg(updateImage)
    }
  }, [])


  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Style</div>
    </div>
  );
  let createdUser = "";

  if (!props.isUpdate) {
    createdUser = localStorage.getItem("createdUser");
  }

  const onReset = () => {
    form.resetFields();
    setImageUrl('');
    setFileList([]);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const saveApprovedUser = (data: ApprovedUserDto) => {
    setDisable(true);
    // const file:any = data.fabricWeaveImageName
    // const abc:string =file.file.name
    const req = new ApprovedUserDto(data.approvedId, data.approvedUserName, data.emailId, data.isActive, data.createdUser, data.versionFlag)
    Service.createApprovalUser(req).then((res) => {
      // console.log(req,'req');
      setDisable(false);
      console.log(res)
      if (res.status) {
        message.success('User Created Successfully');
        if (fileList.length > 0) {
          console.log(fileList)
          const formData = new FormData();
          fileList.forEach((file: any) => {
            console.log(file)
            formData.append('file', file);
          });
          console.log(res)
          formData.append('approvedId', `${res.data.approvedId}`)
          console.log(formData)
          Service.approvalUserImageUpload(formData).then(fileRes => {

          })
        }
        //   navigate("/masters/fabric-weave/fabric-weave-view")
        onReset();
      } else {
        message.error(res.internalMessage);
      }
    })
      .catch((err) => {
        setDisable(false)
        message.success(err.message, 2);
      });

  };

  const saveData = (values: ApprovedUserDto) => {
    if (props.isUpdate) {
      props.updateApprovalUser(values, fileList);
    } else {
      setDisable(false);
      saveApprovedUser(values);
    }
  };



  const weaveUploadFieldProps: UploadProps = {
    multiple: false,
    onRemove: file => {
      setFileList([]);
      setImageUrl('');
    },
    beforeUpload: (file: any) => {
      if (!file.name.match(/\.(png|jpeg|PNG|jpg|JPG|pjpeg|gif|tiff|x-tiff|x-png)$/)) {
        message.error("Only png,jpeg,jpg files are allowed!");
        // return true;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = data => {
        if (fileList.length == 1) {
          message.error("You Cannot Upload More Than One File At A Time");
          return true;
        } else {
          setFileList([file]);
          getBase64(file, imageUrl =>
            setImageUrl(imageUrl)

          );

          return false;
        }
      }
    },
    accept: 'image/jpeg,image/jpg,image/png,image/gif,image/tiff,image/x-tiff,image/x-png',
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList: fileList,
  };
  const showImagePreview = props.isUpdate && props.data.sigImageName;

  return (

    <Card title={props.isUpdate ? 'Update user' : 'User '} headStyle={{ backgroundColor: '#7d33a2', border: 0,color:'#fff' }}
     extra={(props.isUpdate === false) && <span>
      {/* <Button onClick={() => navigate('approval-user-view')} className='panel_button' type={'primary'}>View</Button> */}
      </span>}>
      <Form form={form}
        onFinish={saveData}
        initialValues={props.data} layout="vertical">
        <Form.Item name="approvedId" style={{ display: "none" }} >
          <Input hidden />
        </Form.Item>
        <Form.Item style={{ display: "none" }} name="createdUser" initialValue={''}>
          <Input hidden />
        </Form.Item>
        <Row gutter={24}>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 14 }}>
            <Card>
              <Row gutter={24}>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 10 }}>
                  <Form.Item name='approvedUserName' label='Name'
                    rules={[{
                      required: true,
                      message: 'Name Is Required'
                    }]}>
                    <Select
                      showSearch
                      placeholder="Select Name"
                      optionFilterProp="children"
                      allowClear
                    >
                      {employee.map(app => {
                        return (
                          <Option key={app.employeeId} value={app.employeeId}>
                            {app.employeeName}
                          </Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 10 }}>
                  <Form.Item name='emailId' label='Email Id'
                    rules={[{
                      required: true,
                      message: 'Email Id Is Required'
                    }]}>
                    <Input placeholder="Enter Email Id " />
                  </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 12 }}>
                  <Form.Item name="sigImageName" label='Signature Image'
                    initialValue={props.isUpdate ? props.data.sigImageName : ''}

                  >
                    {!imageUrl ? (
                      <Upload  {...weaveUploadFieldProps} style={{ width: '100%' }} listType="picture-card"  >
                        {uploadButton}
                      </Upload>
                    ) : ""}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button htmlType="button" style={{ margin: '0 14px' }} onClick={onReset}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 5 }} lg={{ span: 6 }} xl={{ span: 10 }} >
            <Card style={{ height: '331px' }}>
              <Form.Item >
                <img src={props.isUpdate ? isUpdateImg : imageUrl} alt="Preview"
                  height={'300px'}
                  width={'500px'}
                  style={{ width: '100%', objectFit: 'contain', marginRight: '100px' }}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default ApprovedUserForm;
