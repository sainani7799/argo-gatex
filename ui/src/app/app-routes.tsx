import { Route, HashRouter as Router, Routes, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ChildProtectionWrapper } from "./common/protected-child-wrapper";
import BasicLayout from "./layout";
import UserForm from "./user/user-form";
import UserFormGrid from "./user/user-grid";
import Login from "./login/login";
import EmployeeGrid from "./master/employee-grid";
import EmployeeForm from "./master/employee-form";
import SupplierForm from "./master/suppliers/supplier-form";
import AddressForm from "./master/address/address-form";
import SupplierGrid from "./master/suppliers/supplier-grid";
import WarehouseForm from "./master/warehouse/warehouse-form";
import WarehouseGrid from "./master/warehouse/warehouse-grid";
import AddressGrid from "./master/address/address-grid";
import ApprovedUserForm from "./master/authorised/authorised-form";
import ItemForm from "./master/items/item-form";
import ItemGrid from "./master/items/item-grid";



const AppRoutes = () => {


    const router = createBrowserRouter(createRoutesFromElements(
        <Route  >
            <Route path='/' key='/' element={
                <ChildProtectionWrapper>
                    <>
                        <BasicLayout />
                    </>
                </ChildProtectionWrapper>
            } >
            </Route>
            <Route path="/login" key='/login' element={<Login />} />
        </Route>
    ))

    return (
        <Router>

            <Routes>
                <Route path="/" element={<ChildProtectionWrapper><BasicLayout /></ChildProtectionWrapper>}>
                    <Route path="/form9" element={<UserForm />} />
                    <Route path="/users" element={<UserFormGrid />} />
                    <Route path="/employee-view" element={<EmployeeGrid />} />
                    <Route path="/employee-form" element={<EmployeeForm employeeData={undefined}

                        isUpdate={false}
                        closeForm={() => { }}
                        updateDetails={(undefined) => { }}
                    />} />
                    <Route path="/supplier-form" element={<SupplierForm />} />
                    <Route path="/supplier-view" element={<SupplierGrid />} />
                    <Route path="/address-form" element={<AddressForm addressData={undefined}
                        isUpdate={false}
                        closeForm={() => { }}
                        updateDetails={(undefined) => { }}
                    />} />
                    <Route path="/warehouse-form" element={<WarehouseForm />} />
                    <Route path="/warehouse-grid" element={<WarehouseGrid />} />
                    <Route path="/address-view" element={<AddressGrid />}/>
                    <Route path="/item-form" element={<ItemForm />}/>
                    <Route path="/item-grid" element={<ItemGrid />}/>
                    <Route path="/approval-user-from" element={<ApprovedUserForm
                        data={undefined}
                        isUpdate={false}
                        closeForm={() => { }}
                        updateApprovalUser={(undefined) => { }} />} />
                </Route>

                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;