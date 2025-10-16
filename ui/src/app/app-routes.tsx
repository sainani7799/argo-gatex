import {
  Route,
  HashRouter as Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { ChildProtectionWrapper } from './common/protected-child-wrapper';
import BasicLayout from './layout';
import UserForm from './user/user-form';
import UserFormGrid from './user/user-grid';
import Login from './login/login';
import EmployeeGrid from './master/employee-grid';
import EmployeeForm from './master/employee-form';
import SupplierForm from './master/suppliers/supplier-form';
import AddressForm from './master/address/address-form';
import SupplierGrid from './master/suppliers/supplier-grid';
import WarehouseForm from './master/warehouse/warehouse-form';
import WarehouseGrid from './master/warehouse/warehouse-grid';
import AddressGrid from './master/address/address-grid';
import ApprovedUserForm from './master/authorised/authorised-form';
import ItemForm from './master/items/item-form';
import ItemGrid from './master/items/item-grid';
import DCForm from './dc/dc-form';
import DCGrid from './dc/dc-grid';
import DcDetailsView from './dc/dc-detail-view';
import { DcEmailModel } from 'libs/shared-models';
import { DcMail } from './dc/dc-mail';
import DCReceived from './dc/dc-recived';
import DcRejectMail from './dc/dc-mail-reject';
import DCSecurity from './dc/dc-security';
import SecurityHeadReport from './dc/security-head-report';
import DcEmailDetailsView from './dc/email-detail-view';
import ApproverGrid from './master/authorised/authorised-grid';
import DCApprovalGrid from './dc/dc-approval-screen';
import BuyerTeamForm from './master/buyerTeam/buyerTeam-form';
import BuyerTeamGrid from './master/buyerTeam/buyerTeam-grid';
import DCReturnableGrid from './dc/dc-returnable-grid';
import newLogin from './login/newLogin';
import NewLogin from './login/newLogin';
import CustomProLayout from './basic-layout/custom-pro-layout';
import { LoginComponent } from './common';
import DCSecurityIn from './dc/dc-security-in';
import Dashboard from './dashboard/dashboard';
import VehicleGrid from './dc/veichle-grid';
import VehicleForm from './dc/vehicle-form';
import VehcileEntry from './dc/vehicle-entry';
import VehicleEntryDetailedView from './dc/vehicle-entry-detailed-view';

const AppRoutes = () => {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" key="/" element={<ChildProtectionWrapper><CustomProLayout /></ChildProtectionWrapper>}>
          <Route path="/form9" element={<UserForm
            userData={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }}
          />} />
          <Route path="/dashboard" key="/dashboard" element={<Dashboard />} />
          <Route path="/users" key="/users" element={<UserFormGrid />} />
          <Route path="/employee-view" key="/employee-view" element={<EmployeeGrid />} />
          <Route path="/employee-form" element={<EmployeeForm employeeData={undefined}

            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }}
          />} />
          <Route path="/supplier-form" element={<SupplierForm supplierData={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }} />} />
          <Route path="/supplier-view" element={<SupplierGrid />} />
          <Route path="/address-form" element={<AddressForm addressData={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }}
          />} />
          <Route path="/warehouse-form" element={<WarehouseForm warehouseData={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }}
          />} />
          <Route path="/warehouse-grid" element={<WarehouseGrid />} />
          <Route path="/buyerteam-form" element={<BuyerTeamForm
            data={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }}
          />} />
          <Route path="/buyerteam-grid" element={<BuyerTeamGrid />} />
          <Route path="/address-view" element={<AddressGrid />} />
          <Route path="/item-form" element={<ItemForm
            itemData={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateDetails={(undefined) => { }}
          />} />
          <Route path="/item-grid" element={<ItemGrid />} />
          <Route path="/dc-form" element={<DCForm
            data={undefined}
            updateDetails={(undefined) => { }}
            isUpdate={false}
            closeForm={() => { }} />} />
          <Route path="/dc-view" element={<DCGrid />} />
          <Route path="/dc-return-view" element={<DCReturnableGrid />} />
          <Route path="/dc-approval-grid" element={<DCApprovalGrid />} />
          <Route path="/dc-received" element={<DCReceived />} />
          <Route path="/dc-security" element={<DCSecurity />} />
          <Route path="/dc-security-in" element={<DCSecurityIn />} />
          <Route path="/security-report" element={<SecurityHeadReport />} />
          <Route path="/dc-detail-view/:id" element={<DcDetailsView dcId={undefined} />} />
          <Route path="/dc-detail-view-security/:id/:security" element={<DcDetailsView dcId={undefined} />} />
          <Route path="/dc-mail/:id" element={<DcMail dcId={undefined} />} />
          <Route path="/approval-user" element={<ApproverGrid />} />
          <Route path="/vehcile-entry" element={<VehcileEntry />} />
          <Route path="/vehcile-entry-detailed-view" element={<VehicleEntryDetailedView />} />
          <Route path="/approval-user-from" element={<ApprovedUserForm
            data={undefined}
            isUpdate={false}
            closeForm={() => { }}
            updateApprovalUser={(undefined) => { }} />} />
          <Route path="/vehicle-grid" key="/vehicle-grid" element={<VehicleGrid />} />
          <Route path="/vehicle-form" key="/vehicle-form" element={<VehicleForm updateDetails={undefined} isUpdate={false} veichleData={undefined} closeForm={undefined} />} />
        </Route>
        <Route path="/login" element={< LoginComponent />} />
        <Route path="/dc-email-detail-view/:id" element={<DcEmailDetailsView dcId={undefined} />} />
        <Route path="/dc-email/:id" element={<DcMail dcId={undefined} />} />
        <Route path="/dc-reject-mail/:id" element={<DcRejectMail dcId={undefined} />} />
        <Route path="/login" key="/login" element={<LoginComponent />} />

      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
};

export default AppRoutes;
