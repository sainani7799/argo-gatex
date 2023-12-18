import React, { useState } from 'react'
import { Layout, Menu, MenuProps } from 'antd';
import { ClusterOutlined, FileAddOutlined, UserOutlined } from '@ant-design/icons'
import { Link, Outlet, Route, useNavigate } from 'react-router-dom';
import { CommonHeader } from './header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faLocationPin, faPerson, faShirt, faTruckArrowRight, faUserShield, faUserTie, faUsers, faWarehouse } from '@fortawesome/free-solid-svg-icons';
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function BasicLayout() {
    const [collapsed, setCollapsed] = useState(true);
    const [selectedMenu, setselectedMenu] = useState('/');
    const [subMenu, setSubmenu] = useState<string[]>([]);
    const navigate = useNavigate();
    type MenuItem = Required<MenuProps>['items'][number];


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
    

    const onCollapse = (collapsed) => {
      setCollapsed(collapsed);
    };

    return (
        <Layout className="site-layout" style={{ background: ' #f0f2f5' }}>
            <Sider
                 collapsed={collapsed}
                 onCollapse={onCollapse}
                 trigger={null}
                 breakpoint='lg'
                 collapsedWidth={35}  // Adjust the collapsed width for mobile view
                 width={200}  
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    background: '#fff',
                    marginTop: '55px',
                    borderRadius: '5px',
                    boxShadow: '0 8px 24px -2px rgb(0 0 0 / 5%)',
                }}
            >
                <Menu mode="inline"
                    onClick={menu}
                    openKeys={subMenu}
                    defaultOpenKeys={[]}
                    selectedKeys={[selectedMenu]}
                    onOpenChange={onOpenChange}
                    defaultSelectedKeys={['/']}
                    style={{ paddingTop: '15px' }}
                >
                    <SubMenu
                        key="masters" icon={<UserOutlined />}
                        title={
                            <span>
                                <span>Masters</span>
                            </span>
                        }
                    >
                        <Menu.Item key="employee-view" icon={<FontAwesomeIcon icon={faUserTie} />}>
                            <Link to="/employee-view"><span>Employee</span></Link>
                        </Menu.Item>
                        <Menu.Item key="users" icon={<FontAwesomeIcon icon={faUsers} />}>
                            <Link to="/users"><span>Users</span></Link>
                        </Menu.Item>
                        <Menu.Item key="supplier-view" icon={<FontAwesomeIcon icon={faPerson} />}>
                            <Link to="/supplier-view"><span>Buyers</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/address-view" icon={<FontAwesomeIcon icon={faLocationPin} />}>
                            <Link to="/address-view"><span>Address</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/approval-user-from" icon={<FontAwesomeIcon icon={faUserShield} />}>
                            <Link to="/approval-user-from"><span>Approval Users</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/warehouse-grid" icon={<FontAwesomeIcon icon={faWarehouse} />}>
                            <Link to="/warehouse-grid"><span>Warehouse</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/item-grid" icon={<FontAwesomeIcon icon={faShirt} />}>
                            <Link to="/item-grid"><span>Items</span></Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="dc" icon={<FontAwesomeIcon icon={faTruckArrowRight} />}
                        title={
                            <span>
                                <span>Dc</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/dc-view" icon={<FontAwesomeIcon icon={faFileExport} />}>
                            <Link to="/dc-view"><span>GatePass</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/dc-received" icon={<FontAwesomeIcon icon={faFileExport} />}>
                            <Link to="/dc-received"><span>Received DC</span></Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <CommonHeader key={Date.now()} toggle={toggle} collapsed={collapsed} />
            <Content
                className="site-layout-background"
                style={{
                    marginTop: '60px',
                    padding: '6px',
                    height: '100%',
                    marginLeft: collapsed ? '25px' : '198px'

                }}
            >
                <Outlet />
            </Content>
        </Layout>
    )
}