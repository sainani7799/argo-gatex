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
import { Link, Route, useNavigate } from 'react-router-dom';
import { ReactComponent as DarkModeIcon } from '../assets/icons/dark-mode.svg';
import { ReactComponent as LightModeIcon } from '../assets/icons/light-mode.svg';
import userIcon from '../assets/images/user.jpg';
import { logout, useIAMClientState } from '../common/iam-client-react';
import { IconType } from '../common/iam-client-react/constants/icon-type';
import { MenuItem, treeRouter } from '../common/utils';
import { HeaderFullscreen, NotificationComponent, OnlineStatus } from '../components/common';
import { components } from './all-components';
import Asset from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/Assertxpert.png';


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
  // {
  //   path: '/user-grid',
  //   name: 'Users',
  //   icon: <UserOutlined />,
  // },
  {
    path: '/asset-dashboard',
    name: 'Dashboard',
    icon: <PieChartOutlined />,
  },
  {
    path: '/masters',
    name: 'Masters',
    icon: <FontAwesomeIcon icon={faGraduationCap} />,
    children: [
      {
        path: '/item-category-view',
        name: 'Asset Categories',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/item-sub-category-view',
        name: 'Asset Sub Categories',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/items-view',
        name: 'Assets',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/Asset-Location',
        name: 'Asset Location',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/item-damage-reasons-view',
        name: 'Asset Damage Reasons',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/vendorsView',
        name: 'Vendors',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/reasonsView',
        name: 'AMC Reasons',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/unitcode-view',
        name: 'Plants',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/certificates-view',
        name: 'Certificates',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/calibration-view',
        name: 'Calibration',
        icon: <PicCenterOutlined />,
      },

    ],
  },
  {
    path: '/employee-management',
    name: 'Employee Management',
    icon: <FontAwesomeIcon icon={faUsersGear} />,
    children: [
      {
        path: '/department-view',
        name: 'Departments',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/HRMS-employee_details-view',
        name: 'Employees',
        icon: <PicCenterOutlined />,
      },
      {
        path: '/Employee-training',
        name: 'Employee Training',
        icon: <PicCenterOutlined />,
      },
    ],
  },
  {
    path: '/request-transfer',
    name: 'Request and Transfer',
    icon: <RadiusSettingOutlined />,
    children: [
      {
        path: '/view-asset-transfers',
        name: 'Transfer',
        icon: <TranslationOutlined />,
      },
      {
        path: '/asset-requistion-grid',
        name: 'Requistion',
        icon: <PullRequestOutlined />,
      },
      // {
      //   path: '/machines-requisition',
      //   name: 'Machines Requisition',
      //   icon: <PicCenterOutlined />,
      // },
    ],
  },
  {
    path: '/asset-management',
    name: 'Asset Management',
    icon: <AppstoreOutlined />,
    children: [
      {
        path: '/assets-form',
        name: 'Add Asset',
        icon: <AppstoreOutlined />,
      },
      {
        path: '/asset-location-mapping-grid',
        name: 'Location Mapping',
        icon: <EnvironmentOutlined />,
      },
      {
        path: '/asset-assignment',
        name: 'Assignment',
        icon: <FormOutlined />,
      },
      {
        path: '/asset-maintainance',
        name: 'Maintenance',
        icon: <SettingOutlined />,
      },
      {
        path: '/asset-decommission',
        name: 'Retire',
        icon: <DeleteOutlined />,
      },
    ],
  },
  {
    path: '/inventory',
    name: 'Inventory',
    icon: <FontAwesomeIcon icon={faUsersGear} />,
    children: [
      // {
      //   path: '/assets-grid',
      //   name: 'Assets',
      //   icon: <PicCenterOutlined />,
      // },
      {
        path: '/asset-history-report',
        name: 'History',
        icon: <HistoryOutlined />,
      },
    ],
  },
  {
    path: '/ams-service',
    name: 'Asset Service',
    icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
    children: [
      {
        path: '/asset-service-grid',
        name: 'Service',
        icon: <SolutionOutlined />,
      },
      {
        path: '/asset-service-calender',
        name: 'Service Calender',
        icon: <CalendarOutlined />,
      },
    ],
  },
  {
    path: '/ams-sale',
    name: 'Sales',
    icon: <DollarOutlined />,
    children: [
      {
        path: '/asset-sale-grid',
        name: 'Asset Sale',
        icon: <AppstoreAddOutlined />,
      },
    ],
  },
  {
    path: '/ams-audit',
    name: 'Audit',
    icon: <FileSearchOutlined />,
    children: [
      {
        path: '/location-audit-form',
        name: 'Audit Form',
        icon: <AppstoreAddOutlined />,
      },
    ],
  },
  {
    path: '/downtime-module',
    name: 'Downtime',
    icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
    children: [
      // {
      //   path: '/down-time-dashboard',
      //   name: 'Dashboard',
      //   icon: <PicCenterOutlined />,
      // },
      // {
      //   path: '/DownTimeReason-view',
      //   name: 'Reason',
      //   icon: <PicCenterOutlined />,
      // },
      {
        path: '/downtimetracking-view',
        name: 'Tracking',
        icon: <PicCenterOutlined />,
      },
    ],
  },
  {
    path: '/license',
    name: 'License',
    icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
    children: [
      {
        path: '/asset-license-view',
        name: 'License',
        icon: <PicCenterOutlined />,
      },
    ],
  },
  {
    path: '/reports',
    name: 'Operational Reports',
    icon: <EditOutlined />,
    children: [
      {
        path: '/asset-report',
        name: 'Asset Report',
        icon: <AppstoreOutlined />,
      },
      {
        path: '/asset-assignment-report',
        name: 'Assignment Report',
        icon: <FormOutlined />,
      },
      {
        path: '/asset-maintenance',
        name: 'Maintenance Report',
        icon: <SettingOutlined />,
      },
      {
        path: '/racinformation',
        name: 'RACI Matrix Report',
        icon: <ProfileOutlined />,
      },
      {
        path: '/abstract-report',
        name: 'Abstract Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/decomissioned-assets-report',
        name: 'Retired Report',
        icon: <DeleteOutlined />,
      },
      {
        path: '/asset-service-report',
        name: 'Service Report',
        icon: <SolutionOutlined />,
      },
      {
        path: '/insurance-report',
        name: 'Insurance Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/warranty-report',
        name: 'Warranty Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/depreciation-report',
        name: 'Depreciation Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/vms-report',
        name: 'VM Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/checklist-report',
        name: 'Checklist Report',
        icon: <FontColorsOutlined />,
      },
      // {
      //   path: '/machines-inward-details',
      //   name: 'Machines Inward Detailst Report',
      //   icon: <FontColorsOutlined />,
      // },
    ],
  },
  {
    path: '/audit-reports',
    name: 'Audit Reports',
    icon: <EditOutlined />,
    children: [
      {
        path: '/asset-audit-report',
        name: 'Rented Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/purchased-not-assigned',
        name: 'Purchased Un-Assigned',
        icon: <FormOutlined />,
      },
      {
        path: '/asset-service-date-report',
        name: 'Service Date Overdue Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/expired-date-assets-report',
        name: 'Expired Date AssetsReport',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/employeeinactive-report',
        name: 'Employee InActive Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/audit-report',
        name: 'Audit Report',
        icon: <FontColorsOutlined />,
      },
      {
        path: '/asset-sale-report',
        name: 'Asset Sale Report',
        icon: <FontColorsOutlined />,
      },
    ],
  },
  {
    path: '/spare-parts',
    name: 'Spare Parts',
    icon: <SlidersOutlined/>,
    children: [
      {
        path: '/uploading-m4-data',
        name: 'Uploading',
        icon: <FileSyncOutlined />,
      },
      {
        path: '/m4-grid-data',
        name: 'M4 Grid Data',
        icon: <FileSearchOutlined />,
      },
      {
        path: '/m4-stock-data',
        name: 'M4 Stock Data',
        icon: <FileSearchOutlined />,
      },
    ],
  },
  {
    path: '/asset-configuration',
    name: 'Asset Configuration',
    icon: <FontAwesomeIcon icon={faUsersGear} />,
    children: [
      {
        path: '/asset-config',
        name: 'Add Assets',
        icon: <PicCenterOutlined />,
      },
      
    ],
  },
  {
    path: '/asset-Maintenance',
    name: 'Asset Maintenance',
    icon: <FontAwesomeIcon icon={faUsersGear} />,
    children: [
      {
        path: '/asset-Maintenance-info',
        name: 'Asset Maintenance',
        icon: <PicCenterOutlined />,
      },
      
    ],
  },
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
            request: async () => treeRouter(getAllSubMenus()),
            // request: async () => menuData,
            collapsedShowGroupTitle: true,
          }}
          location={{
            pathname,
          }}
          avatarProps={{
            src: userIcon,
            size: 'small',
            title: (
              <OnlineStatus>
                <span style={{ color: !dark ? '#ffffff' : '#001529' }}>
                  {IAMClientAuthContext?.user?.userName}
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
                  {dark ? (
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
                  )}
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
          </Content>
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
};

export default CustomProLayout;
