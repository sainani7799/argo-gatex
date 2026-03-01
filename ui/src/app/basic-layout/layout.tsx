import React, { useState } from 'react'
import { Avatar, Button, Layout, Menu, MenuProps, Result } from 'antd';
import { Footer, Header } from 'antd/es/layout/layout';
import Icon, { DollarOutlined, ProjectOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons'
import { Link, Navigate, Outlet, HashRouter as Router, useNavigate } from 'react-router-dom';
import { get } from 'http';
const { Sider, Content } = Layout;
const { SubMenu } = Menu;
import * as antdIcons from '@ant-design/icons';
import { useIAMClientState } from '../common';
import schemax22 from './schemax22.jpg';
import { AlertMessages } from '../components/common';




export default function BasicLayout() {
    const [collapsed, setCollapsed] = useState(true);
    const [selectedMenu, setselectedMenu] = useState('/');
    const [subMenu, setSubmenu] = useState<string[]>([]);
    const navigate = useNavigate();
    type MenuItem = Required<MenuProps>['items'][number];

    const { IAMClientAuthContext, dispatch } = useIAMClientState();



    const toggle = () => {
        setCollapsed(prevCollapsed => !prevCollapsed);
    };

    const menu = (e: any) => {
        if (e.keyPath.length < 2) {
            setSubmenu([])
            setselectedMenu(e.key)
        } else {
            setSubmenu(e.keyPath)
            setselectedMenu(e.key)
        }
        navigate(e.key)
    }
    const onOpenChange = (openKeys: string[]) => {
        setSubmenu(openKeys)
    }
    function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group',): MenuItem {
        return { key, icon, children, label, type, } as MenuItem;
    }
    const authdata = JSON.parse(localStorage.getItem('currentUser'))



    function renderIcon(iconType, iconName) {
        // if (iconType === "antd") { 
        const SpecificIcon = antdIcons["SolutionOutlined"];
        return <SpecificIcon />
        // }
        // else {
        //     const SpecificIcon = icons[iconName];
        //     return <Icon component={SpecificIcon} style={{ fontSize: '20px' }} /

    }

    const getSubMenu = (route) => {

        if (route && route.subMenuData && route.subMenuData.length) {
            return (
                <SubMenu key={route.menuId} title={<span> {renderIcon(route.iconType, route.iconName)} <span>{route.menuName}</span> </span>}  >
                    <div style={{ backgroundColor: 'white', color: 'black' }}>

                        {route.subMenuData.map(item => getSubMenu(item))}
                    </div>
                </SubMenu>
            )
        } else {
            return (
                <div style={key === route.subMenuId ? {backgroundColor:'#a3e1f5'} : {}}
                // style={{ backgroundColor: 'white', color: 'black' }}
                >
                    <Menu.Item key={route.subMenuId} ><Link onClick={() => handleClick(route.subMenuId)} to={route.path}><span><span> {route.icon} <span>{route.subMenuName}</span> </span></span></Link> </Menu.Item>
                </div>

            )
        }
    }
    const getAllSubMenus = () => {
        // console.log(localStorage.getItem("currentUser"));
        const subMenus = [];
        const menu = IAMClientAuthContext.menuAccessObject ? IAMClientAuthContext.menuAccessObject : [];
        // const menuAccess = localStorage.getItem("currentUser")? JSON.parse(localStorage.getItem("currentUser"))["menuAccessObject"]:[];
        menu?.forEach(eachRoutes => {
            subMenus.push(getSubMenu(eachRoutes));
        });
        return subMenus;
    }

    const [key, setKey] = useState("");

    const handleClick = (e) => {
        setKey(e)
    }

    const logOut = () => {
      localStorage.clear();
      window.location.reload();
      <Navigate to="/" />;
      AlertMessages.getSuccessMessage('Logging out');
    };
    const ifNotHaveAccess = () => {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
        // extra={<Link to='' ><Button type="primary">Back Home</Button></Link>}
        />
      );
    };

    return (
  <Layout className="layout">
      <Sider
        breakpoint="lg"
        collapsedWidth="80"
        className="noprint"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        collapsible
        onCollapse={(collapsed, type) => {
          setCollapsed(true);
        }}
        collapsed={collapsed}
        trigger={null}
      >
        <div className="logo">
          {/* <img src={schemaxlogowhite} /> */}
          {/* <h1 style={{ display: collapsed ? 'none' : 'block' }}>AquaX</h1> */}

          {collapsed ? (
            <img src={schemax22} />
          ) : (
            <img src={schemax22} />
          )}

        </div>
     <Menu
          theme="dark"
          mode="inline"
          onClick={menu}
          openKeys={subMenu}
          defaultOpenKeys={[]}
          style={{ paddingTop: '20px' }}
          selectedKeys={[key]}
          onOpenChange={onOpenChange}
          defaultSelectedKeys={['/']}
        >
        
{getAllSubMenus()}

        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 230 }}>
        <Header
          style={{
            background: '#fff',
            padding: 0,
          }}
          className="noprint"
        >
          <div className="ant-pro-global-header">
            <div className="samllLogo">
              <img
                style={{ display: collapsed ? 'block' : 'none' }}
                src={schemax22}
              />
            </div>
            <span className="ant-pro-global-header-trigger">
              <antdIcons.MenuFoldOutlined
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-unfold'}
                onClick={toggle}
              />
            </span>

            <span>
              <Button
                type="primary"
                style={{ float: 'right' }}
                onClick={logOut}
              >
                <antdIcons.ExportOutlined />
                <span className="l-rem">logout</span>
              </Button>
            </span>
            <span>
              <Button style={{ float: 'right', border: 'white' }}>
                Hello!{' '}
                {/* {username === ''
                  ? user_name_local
                  : props?.user?.user_data?.username} */}
              </Button>
            </span>

            <span>
              <Avatar icon={<UserOutlined />} />
            </span>
          </div>
        </Header>

        <Content
          style={{
            margin: '5px 5px',
            padding: 8,
            background: '#fff',
            minHeight: 280,
            overflow: 'scroll',
          }}
        >
          {/* <Routes> */}
          {/* </Routes> */}
         
        </Content>
        <Footer style={{ textAlign: 'center' }} className="noprint">
          Design © {new Date().getUTCFullYear()} Created by Schemaxtech
        </Footer>
      </Layout>
    </Layout >
    )
}
