import * as antdIcons from '@ant-design/icons';
import Icon, {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  FileSyncOutlined,
  FontColorsOutlined,
  FormOutlined,
  HistoryOutlined,
  LayoutOutlined,
  LogoutOutlined,
  PicCenterOutlined,
  PieChartOutlined,
  ProfileOutlined,
  PullRequestOutlined,
  RadiusSettingOutlined,
  SettingOutlined,
  SlidersOutlined,
  SmileOutlined,
  SolutionOutlined,
  TranslationOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  DefaultFooter,
  ProBreadcrumb,
  ProConfigProvider,
} from '@ant-design/pro-components';
import ProLayout from '@ant-design/pro-layout';
import { Dropdown, Tooltip, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import moment from 'moment';
import { useState } from 'react';
import { Link, Outlet, Route, useNavigate } from 'react-router-dom';
import { logout, useIAMClientState } from '../common/iam-client-react';
import { IconType } from '../common/iam-client-react/constants/icon-type';
import { MenuItem, treeRouter } from '../common/utils';
import { HeaderFullscreen, NotificationComponent, OnlineStatus } from '../components/common';
import { components } from './all-components';
import Asset from '../../app/common/iam-client-react/login-component/images/gatex-white.png';


import { svgIcons } from './all-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faScrewdriverWrench, faUsersGear } from '@fortawesome/free-solid-svg-icons';

const { useToken } = theme;
/* eslint-disable-next-line */
export interface CustomProLayoutProps { }

// const renderIcon = (iconType, iconName) => {
//   if (iconType === IconType.SYS_LIB) {
//     const SpecificIcon = antdIcons[iconName]
//       ? antdIcons[iconName]
//       : antdIcons['SolutionOutlined'];
//     return <SpecificIcon />;
//   } else {
//     const SpecificIcon = svgIcons[iconName];
//     return <Icon component={SpecificIcon} style={{ fontSize: '20px' }} />;
//   }
// };



const iconMap = {
  UserOutlined: antdIcons.UserOutlined,
  DashboardOutlined: antdIcons.DashboardOutlined,
  LogoutOutlined: antdIcons.LogoutOutlined,
  PieChartOutlined:antdIcons.PieChartOutlined,
  CarOutlined:antdIcons.CarOutlined,
  EditOutlined:antdIcons.EditOutlined,
  PicCenterOutlined:antdIcons.PicCenterOutlined,
  UsergroupAddOutlined:antdIcons.UsergroupAddOutlined,
  RadiusSettingOutlined:antdIcons.RadiusSettingOutlined,
  AppstoreOutlined:antdIcons.AppstoreOutlined,
  SettingOutlined:antdIcons.SettingOutlined,
  DollarOutlined:antdIcons.DollarOutlined,
  FileSearchOutlined:antdIcons.FileSearchOutlined,
  SlidersOutlined:antdIcons.SlidersOutlined

  // Add other icons as needed
};
function renderIcon(menuId, iconName) {
  console.log(menuId);
  console.log(iconName);
  const IconComponent = iconMap[iconName];
      if (IconComponent) {
          return <IconComponent key={menuId} />;
      } else {
          return null;
      }
  }

const getSubMenu = (route) => {
  if (route && route?.subMenuData && route?.subMenuData?.length != 1) {
    return {
      key: `${route.key}`,
      icon: renderIcon(route.iconType, route.iconName),
      label: route.title,
      children: route.subMenuData.map((item) => getSubMenu(item)),
      path: route.path ? route.path : `${route.key}`,
    };
  } else if (route?.subMenuData?.length === 1) {
    return {
      key: `${route.subMenuData[0].key}`,
      icon: renderIcon(
        route.subMenuData[0].iconType,
        route.subMenuData[0].iconName
      ),
      label: route.subMenuData[0].title,
      path: route.subMenuData[0].path
        ? route.subMenuData[0].path
        : `${route.subMenuData[0].key}`,
    };
  } else {
    return {
      key: `${route.key}`,
      icon: renderIcon(route.iconType, route.iconName),
      label: route.title,
      path: route.path,
    };
  }
};

const getRoute = (route) => {
  if (route && route.subMenuData && route.subMenuData.length) {
    return route.subMenuData.map((item) => getRoute(item));
  } else {
    return (
      <Route
        key={`${route.key}`}
        path={`/${route.path}`}
        element={components[route.componentName]}
      />
    );
  }
};

const menuData = [
  {
    path: '/masters',
    name: 'Masters',
    icon: <FontAwesomeIcon icon={faGraduationCap} />,
    children: [
      {
        path: '/employee-view',
        name: 'Employee',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/users',
        name: 'Users',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/supplier-view',
        name: 'Buyers',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/address-view',
        name: 'Address',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/approval-user',
        name: 'Approval Users',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/warehouse-grid',
        name: 'Warehouse',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/item-grid',
        name: 'Items',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/buyerteam-grid',
        name: 'Userwise (Buyer Team)',
        icon: <PicCenterOutlined />,
      },

    ],
  },
  {
    path: '/dc',
    name: 'Gate Pass',
    icon: <FontAwesomeIcon icon={faUsersGear} />,
    children: [
      {
        path: '/dc-view',
        name: 'Creater',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/dc-return-view',
        name: 'Returnable',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/dc-approval-grid',
        name: 'Approver',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/dc-received',
        name: 'Receiver',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/dc-security',
        name: 'Security Check',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/security-report',
        name: 'Gate Pass Report',
        icon: <PicCenterOutlined />,
      },
    ],
  }
];

export const CustomProLayout = (props: CustomProLayoutProps) => {
  const [pathname, setPathname] = useState(location.pathname);
  const [dark, setDark] = useState(false);
  const [sideBar, setSideBar] = useState(true);

  const navigate = useNavigate();
  const {
    token: { colorPrimary, colorBgBase },
  } = useToken();
  const { IAMClientAuthContext, dispatch } = useIAMClientState();

  const getAllRoutes = () => {
    const subMenus: any[] = [];
    const menus = IAMClientAuthContext.menuAccessObject
      ? IAMClientAuthContext.menuAccessObject
      : [];
    menus.forEach((eachRoutes) => {
      const abc = getRoute(eachRoutes);
      subMenus.push(abc);
    });
    return subMenus;
  };

  // const getAllSubMenus = () => {
  //   const subMenus = [];
  //   const menus = IAMClientAuthContext.menuAccessObject
  //     ? IAMClientAuthContext.menuAccessObject
  //     : [];
  //     console.log(IAMClientAuthContext.menuAccessObject,'ppppppppp')
  //   menus.forEach((eachRoutes) => {
  //     const subMenu = getSubMenu(eachRoutes);
  //     subMenus.push(subMenu);
  //   });
  //   console.log(subMenus,'ooooooooo')
  //   return subMenus;
  // };

  let menu
  const getAllSubMenus = () => {
    menu =IAMClientAuthContext.user ? IAMClientAuthContext.user : '';
    const menuData = IAMClientAuthContext.menuAccessObject ? IAMClientAuthContext.menuAccessObject : [];
const menus = menuData.sort((a,b) => a.orderId - b.orderId);
// console.log(menus)
    const processedMenuData = menus.map(menuItem => {
        const menuItems = menuItem.subMenuData.sort((a,b) => a.orderId - b.orderId);
      const processedSubMenuItems =  menuItems?.map(subMenuItem => (

        {
            path: subMenuItem.path,
            label: subMenuItem.subMenuName,
            key: subMenuItem.subMenuId, 
            icon:renderIcon(subMenuItem.subMenuId,subMenuItem.subMenuIconName),
      }))
      return {
        key: menuItem.menuId, 
        label: menuItem.menuName,
        icon: renderIcon(menuItem.menuId,menuItem.menuIconName),
        path:menuItem.path?menuItem.path:'/',
        children: processedSubMenuItems.length > 0 ? processedSubMenuItems : null,

      };
    });
  
    return processedMenuData;
  };

  const logoutHandler = () => {
    logout(dispatch);
  };

  const getSideBarData = (): any => {
    if (sideBar) {
      return {
        headerContentRender: (props) =>
          props.layout !== 'side' && document.body.clientWidth > 1000 ? (
            <ProBreadcrumb />
          ) : undefined,
        layout: 'mix',
      };
    } else {
      return {
        layout: 'top',
      };
    }
  };
  return (
    <ProConfigProvider dark={dark}>
      <div
        id="main-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          title=""
          logo={<img src={dark ? Asset : Asset} />}
          locale="en-US"
          siderWidth={240}
          colorPrimary={colorPrimary}
          {...getSideBarData()}
          fixSiderbar
          // token={{ header: { colorBgHeader: dark ? '#ffffff' : '#001529', colorTextMenu: !dark ? '#ffffff' : '#001529', colorHeaderTitle: !dark ? '#ffffff' : '#001529', colorTextMenuSelected: colorPrimary }, sider: { colorBgMenuItemSelected: colorBgBase } }}
          className={dark ? 'dark-theme' : 'light-theme'}
          token={{
            header: {
              colorBgHeader: dark ? '#000' : '#016582',
              colorTextMenu: dark ? '#ffffff' : '#d5d5d5',
              colorHeaderTitle: !dark ? '#ffffff' : '#ffffff',
              colorTextMenuSelected: '#fff',
              colorBgMenuItemHover: '#017c99',
              colorTextMenuActive: '#fff',
            },
            sider: {
              colorBgMenuItemSelected: colorBgBase,
              colorMenuBackground: dark ? '#000' : '#047595',
              colorTextMenu: '#fff',
              colorBgMenuItemHover: '#005f7a',
              colorTextMenuItemHover: '#fff',
              colorBgCollapsedButton: '#047595',
              colorTextCollapsedButton: '#fff',
            },
          }}
          menu={{
            // request: async () => treeRouter(getAllSubMenus()),
            request: async () => menuData,
            collapsedShowGroupTitle: true,
          }}
          location={{
            pathname,
          }}
          avatarProps={{
            // src: userIcon,
            size: 'small',
            title: (
              <OnlineStatus>
                <span style={{ color: !dark ? '#ffffff' : '#001529' }}>
                  {/* {IAMClientAuthContext?.user?.userName} */}
                  Admin
                </span>
              </OnlineStatus>
            ),
            render: (props, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'roles',
                        label: `Roles: ${IAMClientAuthContext?.user?.roles?.toString()}`,
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: 'logout',
                        onClick: () => {
                          logoutHandler();
                        },
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
          actionsRender={(props) => {
            return [

              <><Tooltip placement="bottom" title={'Notifications'}>
                <NotificationComponent />
              </Tooltip>
                <Tooltip placement="bottom" title={'Switch mode'}>
                  {/* {dark ? (
                    <LightModeIcon
                      onClick={() => {
                        setDark(!dark);
                      }}
                      style={{ color: '#fff', fontSize: '30px' }} />
                  ) : (
                    <DarkModeIcon
                      onClick={() => {
                        setDark(!dark);
                      }}
                      style={{ color: '#fff', fontSize: '30px' }} />
                  )} */}
                  {/* <Button
    size="large"
    onClick={() => { setDark(!dark); }}
    icon={!dark ? <DarkModeIcon style={{ color: "#22C55E" }} /> : <LightModeIcon style={{ color: "#22C55E" }} />}
  ></Button> */}
                </Tooltip></>,
              <Tooltip placement="bottom" title={'Switch LayOut'}>
                {sideBar ? (
                  <CreditCardOutlined
                    style={{ color: '#fff', fontSize: '20px' }}
                    onClick={async () => {
                      setSideBar((prev) => !prev);
                    }}
                  />
                ) : (
                  <LayoutOutlined
                    style={{ color: '#fff', fontSize: '20px' }}
                    onClick={async () => {
                      setSideBar((prev) => !prev);
                    }}
                  />
                )}
                {/* <Button size="large" type='primary' onClick={async () => { setSideBar(prev => !prev); }} icon={ sideBar ? <PicLeftOutlined /> : <LayoutOutlined style={{ color: '#22C55E' }} /> }></Button> */}
              </Tooltip>,
              <Tooltip placement="bottom" title={'Resize Layout'}>
                <HeaderFullscreen />
              </Tooltip>,
            ];
          }}
          menuItemRender={(item, dom) => {
            return (
              <Link
                to={item?.path || '/'}
                onClick={() => {
                  setPathname(item.path || '/');
                }}
              >
                {dom}
              </Link>
            );
          }}
          onMenuHeaderClick={() => navigate('/')}
          footerRender={() => (
            <DefaultFooter
              links={[
                {
                  key: 'click',
                  title: 'schemax',
                  href: 'https://www.schemaxtech.com/',
                },
              ]}
              copyright={`${moment().year()} Schemax Expert Techno Craft.`}
            />
          )}
        >
          <Content style={{ minHeight: '90vh' }}>
            <Outlet/>
          </Content>
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
};

export default CustomProLayout;
