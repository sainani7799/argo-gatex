import { Avatar, Button, Col, Dropdown, Layout, Menu, MenuProps, Row, Select, SelectProps, Tooltip, theme } from 'antd';
import logo from '../logo.jpeg';


import {
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './header.css';
import { useEffect, useState } from 'react';
const { Header } = Layout;
const { useToken } = theme

interface IProps {
  collapsed: boolean;
  toggle: () => void;
}
export const CommonHeader = (props: IProps) => {
  const navigate = useNavigate();
  const { token: { colorPrimary } } = useToken()
  const [dark, setDark] = useState(false)
  const authdata = JSON.parse(localStorage.getItem('userName'))
  // console.log(authdata,'authdata')



  const logoutHandler = async () => {
    localStorage.clear()
    navigate('/login')
  }
  const menu = (
    <Menu >
      <Menu.Item>
        UserName:
      </Menu.Item>
      <Menu.Item key='logout'>
        <Button
          onClick={() => logoutHandler()}
        >
          logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: `User Name:
      ${authdata?.userName}`
    },
    {
      key: '2',
      label: `Unit:
      ${authdata?.unitName}`
    },
    {
      key: '4',
      label: (<Button onClick={() => logoutHandler()} >
        logout
      </Button>)
    },
  ];

  // const options: SelectProps['options'] = [{ value: 'project-creation-page', label: 'Project Creation' }, { value: 'project-list-grid', label: 'Project View' }];



  return (
    <Header className='header-row' style={{ background: '#fff', padding: 0 }}>
      <Row justify='space-between' align='middle'>
        <Col span={4}>
          <div className="logo" >
            <h1 style={{ color: colorPrimary }}>{'SHAHI'}</h1>
          </div>
        </Col>
        <Col span={1} >
          {/* <span className='ant-pro-global-header-trigger'>
            {React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: props.toggle,
            })}
          </span> */}
        </Col>
        <Col span={4}></Col>
        {/* <Col span={4}>
          <Tooltip placement="bottom" title={'Switch mode'}>
            <Button
              size="middle"
              style={{ borderRadius: "5px" }}
              onClick={() => {
                setDark(!dark);
              }}
              icon={!dark ? <DarkModeIcon /> : <LightModeIcon />}
            ></Button>
          </Tooltip>,
        </Col> */}
        <Col span={7} style={{ textAlign: 'right' }}>
          <Dropdown menu={{ items }}>
            <Avatar style={{ marginBottom: '40px', left: '80px' }} size={45} shape="circle" icon={<UserOutlined style={{ fontSize: '25px' }} />} />
          </Dropdown>
        </Col>
        <Col></Col>
      </Row>
    </Header>
  )
}