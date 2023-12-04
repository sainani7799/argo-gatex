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
import AddressGrid from "./master/address/address-grid";
// import SupplierGrid from "./master/suppliers/supplier-grid";
// import EmployeeGrid from "./master/employee-grid";
// import EmployeeForm from "./master/employee-form";



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
                    <Route path="/supplier-view" element={<SupplierGrid />}/>
                    <Route path="/address-form" element={<AddressForm addressData={undefined}
                        isUpdate={false}
                        closeForm={() => { }}
                        updateDetails={(undefined) => { }}
                    />} />
                    <Route path="/address-view" element={<AddressGrid />}/>
                </Route>

                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;