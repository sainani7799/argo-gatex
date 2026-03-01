import { PicCenterOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons"
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Menu } from "antd"
import SubMenu from "antd/es/menu/SubMenu"
import { Link } from "react-router-dom"

export const AssetManagementMenus = () => {
    return(
        <Menu>
             <Menu.Item key="ums-grid" icon={<UserOutlined />}>
                <Link to="/user-grid">
                  <span>Users</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="asset-dashboard" icon={<PieChartOutlined />}>
                  <Link to="asset-dashboard">
                    <span>Dashboard</span>
                  </Link>
            </Menu.Item>
            <SubMenu
                key="masters"
                icon={<FontAwesomeIcon icon={faGraduationCap} />}
                title={
                  <span>
                    <span>Masters</span>
                  </span>
                }
              >
                <Menu.Item
                  key="item-category-view"
                  icon={<PicCenterOutlined />}
                >
                  <Link to="/item-category-view">
                    <span>Asset Categories</span>
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="item-sub-category-view"
                  icon={<PicCenterOutlined />}
                >
                  <Link to="/item-sub-category-view">
                    <span>Asset Sub Categories</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="items-view" icon={<PicCenterOutlined />}>
                  <Link to="/items-view">
                    <span>Assets</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="Asset-Location" icon={<PicCenterOutlined />}>
                  <Link to="/Asset-Location">
                    <span>Asset Location</span>
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="item-damage-reasons-view"
                  icon={<PicCenterOutlined />}
                >
                  <Link to="/item-damage-reasons-view">
                    <span>Asset Damage Reasons</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="vendorsView" icon={<PicCenterOutlined />}>
                  <Link to="/vendorsView">
                    <span>Vendors</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="reasonsView" icon={<PicCenterOutlined />}>
                  <Link to="/reasonsView">
                    <span>AMC Reasons</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="unitcode-view" icon={<PicCenterOutlined />}>
                  <Link to="/unitcode-view">
                    <span>Plants</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="certificates-view" icon={<PicCenterOutlined />}>
                  <Link to="/certificates-view">
                    <span>Certificates</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="calibration-view" icon={<PicCenterOutlined />}>
                  <Link to='/calibration-view'>
                    <span>Calibration</span>
                  </Link>
                </Menu.Item>{
        
      },
              </SubMenu>
        </Menu>
    )

}
