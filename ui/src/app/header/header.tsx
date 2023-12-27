import { Avatar, Button, Col, Dropdown, Layout, Menu, MenuProps, Row, Select, SelectProps, Tooltip, theme } from 'antd';
import logo from '../logo.jpeg';


import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './header.css';
import { useEffect, useState } from 'react';
let timer
const { Header } = Layout;
const { useToken } = theme

interface IProps {
  collapsed: boolean;
  toggle: () => void;
}
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];
export const CommonHeader = (props: IProps) => {
  const navigate = useNavigate();
  const { token: { colorPrimary } } = useToken()
  const [dark, setDark] = useState(false)
  const authdata = JSON.parse(localStorage.getItem('userName'))
  const [loading, setLoading] = useState(true)
  // console.log(authdata,'authdata')



  const logoutHandler = async () => {
    localStorage.clear()
    navigate('/login')
  }
  useEffect(() => {
    Object.values(events).forEach((item) => {
        window.addEventListener(item, () => {
            resetTimer();
            handleLogoutTimer();
        });
    });
}, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
}, [])

const resetTimer = () => {
    if (timer) clearTimeout(timer);
};
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
        // clears any pending timer.
        resetTimer();
        // Listener clean up. Removes the existing event listener from the window
        Object.values(events).forEach((item) => {
            window.removeEventListener(item, resetTimer);
        });
        // logs out user
        logoutHandler();
    }, 900000); //15 minutes
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
        <Col span={1}>
          <div className="logo"  >
            <h1 style={{ color: 'rgb(125, 51, 162)' }}>{'SHAHI'}</h1>
          </div>
        </Col>
        <Col span={1} >
        </Col>
        <Col span={4}></Col>
        <Col span={14} style={{ textAlign: 'right' }}>
          <Dropdown menu={{ items }}>
            <Avatar style={{ marginBottom: '40px', marginLeft: 'auto'  }} size={45} shape="circle" icon={<UserOutlined style={{ fontSize: '25px' }} />} />
          </Dropdown>
        </Col>
        <Col></Col>
      </Row>
    </Header>
  )
}