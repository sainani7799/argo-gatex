import { Route, Routes } from 'react-router-dom';
import {
  AsserServiceReport,
  AssetsReport,
} from '../components/pages/asset-management/asset-management-components/mrn-form/src';
import { AssetGrid } from '../components/pages/asset-management/asset-management-components/aasets-grid/src';
import AssetsDetailedView from '../components/pages/asset-management/asset-management-components/aasets-grid/src/lib/Detailed-view';
import DepreciationReport from '../components/pages/asset-management/asset-management-components/aasets-grid/src/lib/depreciation-report';
import InsuranceReport from '../components/pages/asset-management/asset-management-components/aasets-grid/src/lib/insurance-report';
import WarrantyReport from '../components/pages/asset-management/asset-management-components/aasets-grid/src/lib/warranty-report';
import { AssetForm } from '../components/pages/asset-management/asset-management-components/aasets-view/src';
import { AssetLocationMappingForm } from '../components/pages/asset-management/asset-management-components/asset-classification-form/src';
import { AssetLocationMapping } from '../components/pages/asset-management/asset-management-components/asset-classification-grid/src';
import { AssetLicenseForm } from '../components/pages/asset-management/asset-management-components/asset-license-form/src';
import { AssetLicenseGrid } from '../components/pages/asset-management/asset-management-components/asset-license-grid/src';
import { AssetCategoryForm } from '../components/pages/asset-management/asset-management-components/asset-po-form/src';
import { AssetCategory } from '../components/pages/asset-management/asset-management-components/asset-po-grid/src';
import { AssetHistoryReport } from '../components/pages/asset-management/asset-management-components/asset-po-view/src';
import { AssetRequisitionForm } from '../components/pages/asset-management/asset-management-components/asset-requisition-form/src';
import { AssetRequisitionGrid } from '../components/pages/asset-management/asset-management-components/asset-requisition-grid/src';
import { AssetSaleForm } from '../components/pages/asset-management/asset-management-components/asset-sale-form/src';
import { AssetSaleGrid } from '../components/pages/asset-management/asset-management-components/asset-sale-grid/src';
import {
  AssetServiceForm,
  AssetsServices,
  ChecklistReport,
} from '../components/pages/asset-management/asset-management-components/asset-service/src';
import ServiceDetailView from '../components/pages/asset-management/asset-management-components/asset-service/src/lib/service-detail-view';
import { AssetMaintainanceGrid } from '../components/pages/asset-management/asset-management-components/asset-sub-category-grid/src';
import { AssetMaintainanceForm } from '../components/pages/asset-management/asset-management-components/asset-sub-category/src';
import { AssetTransfersForm } from '../components/pages/asset-management/asset-management-components/asset-transfers-form/src';
import { AssetTransfersGrid } from '../components/pages/asset-management/asset-management-components/asset-transfers-grid/src';
import { AssetServiceCalender } from '../components/pages/asset-management/asset-management-components/assets-dashboard/src';
import AssetsAuditReport from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/asset-audit-report';
import EmployeeInactiveReport from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/employee-inactive';
import ExpiredDateReport from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/expired-assets-list';
import MainPage from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/main-page';
import PurchasedNotAssigned from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/purchased-not-assigned-audit-report';
import AssetServiceDateReport from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/service-date-overdue';
import { AssetsAssignmentReport } from '../components/pages/asset-management/asset-management-components/assets-repair-log/src';
import {
  AssetsmaintenanaceReport,
  AuditReport,
  AssetSaleReport,
  VmsReport,
} from '../components/pages/asset-management/asset-management-components/assets-track-report/src';

import { AssetLocation } from '../components/pages/asset-management/asset-management-components/dc-grid/src';
import { AssetRACIReport } from '../components/pages/asset-management/asset-management-components/dc-view/src';
import { LocationAuditForm } from '../components/pages/asset-management/asset-management-components/location-audit-form/src';
import { LocationAuditGrid } from '../components/pages/asset-management/asset-management-components/location-audit-grid/src';
import LocationAuditCalender from '../components/pages/asset-management/asset-management-components/location-audit-grid/src/lib/location-audit-calender';
import { AssetCheckIn } from '../components/pages/asset-management/asset-management-components/mrn-grid/src';
import { DecommisionedAssets } from '../components/pages/asset-management/asset-management-components/new-aasets-form/src';
import DecommisionedAssetsReport from '../components/pages/asset-management/asset-management-components/new-aasets-form/src/lib/decomissioned-assets-report';
import { AbstractReport } from '../components/pages/asset-management/asset-management-components/opening-aasets-form/src';
import M4StockData from '../components/pages/asset-management/asset-management-components/spare-stock/src/lib/m4-stock-data';
import UploadM4File from '../components/pages/asset-management/asset-management-components/spare-stock/src/lib/upload-m4-file';
import UploadedM4GridData from '../components/pages/asset-management/asset-management-components/spare-stock/src/lib/uploaded-m4-grid-data';
import { ItemCategoriesForm } from '../components/pages/masters/item-categories-form/src';
import { ItemCategoriesGrid } from '../components/pages/masters/item-categories-grid/src';
import { ItemSubCategoriesForm } from '../components/pages/masters/item-sub-categories-form/src';
import { ItemSubCategoriesGrid } from '../components/pages/masters/item-sub-categories-grid/src';
import { ItemsForm } from '../components/pages/masters/items-form/src';
import { ItemsGrid } from '../components/pages/masters/items-grid/src';
import { ItemDamageReasonsForm } from '../components/pages/masters/item-damage-reasons-form/src';
import { ItemDamageReasonsGrid } from '../components/pages/masters/item-damage-reasons-grid/src';
import { VendorsGrid } from '../components/pages/masters/vendors-grid/src';
import { ReasonsForm } from '../components/pages/masters/reasons-form/src';
import { ReasonsGrid } from '../components/pages/masters/reasons-grid/src';
import { UnitCodeForm } from '../components/pages/masters/unit-code-form/src';
import { UnitCodeGrid } from '../components/pages/masters/unit-code-grid/src';
import { CertificationsForm } from '../components/pages/masters/certifications-form/src';
import { CertificationsGrid } from '../components/pages/masters/certifications-grid/src';
import { VendorsForm } from '../components/pages/masters/vendors-form/src';
import { HrmsEmployeeDetailsGrid } from '../components/pages/masters/hrms-employee-details-grid/src';
import { HrmsEmployeeDetailsForm } from '../components/pages/masters/hrms-employee-details-form/src';
import { DepartmentsGrid } from '../components/pages/masters/departments-grid/src';
import { DepartmentsForm } from '../components/pages/masters/departments-form/src';
import {
  DownTimeTrackingForm,
  NewDowntimeTrackingform,
} from '../components/pages/downTime/down-time-tracking-form/src';
import {
  DownTimeEventCalender,
  DownTimeReport,
  DownTimeTrackingGrid,
} from '../components/pages/downTime/down-time-tracking-grid/src';
import { AssetConfig } from '../components/pages/asset-management/asset-management-components/asset-configuration/asset-configuration';
import LocationForm from '../components/pages/asset-management/asset-management-components/dc-form/src/lib/pages-asset-management-asset-management-components-dc-form';
import { VendorPriceListForm } from '../components/pages/masters/vehicle-price-list-form/src/lib/vendor-price-list-form';
import { CalibrationForm } from '../components/pages/masters/calibration-form/src/lib/calibration-form';
import { CalibrationGrid } from '../components/pages/masters/calibration-grid/src/lib/calibration-grid';
import { AssetCheckListReq } from '@assetx/shared-models';
import { AssetCheckListGrid } from '../components/pages/masters/asset-checklist-view/src';
import { AssetCheckListForm } from '../components/pages/masters/asset-checklist-form/src';
import AssetMaintenanceConfig from '../components/pages/asset-management/asset-management-components/asset-maintenance/maintenance-main';

import { MachineListReport } from '../components/pages/asset-management/asset-management-components/asset-service/src/lib/machine-list-report';
import MaintenanceDepartmentProductionMachinesRequisitionsReport from '../components/pages/asset-management/asset-management-components/assets-dashboard/src/lib/maintenance-department-production-mechines-req-report';
import AssetsGrid from '../components/pages/asset-management/asset-management-components/aasets-grid/src/lib/add-asset';
import HrmsEmployeeTrainingComponent from '../components/pages/masters/hrms-employee-details-grid/src/lib/hrms-employee-training-grid';
import HrmsEmployeeTrainingForm from '../components/pages/masters/hrms-employee-details-grid/src/lib/hrms-employee-training-form';
import AMCList from '../components/pages/asset-management/asset-management-components/aasets-grid/src/lib/amc-list';
export const AssetManagementRouting = () => {
  return (
    <>
      <Routes>
        <Route path="/asset-report" element={<AssetsReport />} />
        <Route
          path="/asset-assignment-report"
          element={<AssetsAssignmentReport viewrow={(undefined) => {}} />}
        />

        {/* <Route path="/createCountry" element={<CountryForm />} /> */}
        <Route
          path="/asset-maintenance"
          element={<AssetsmaintenanaceReport viewrow={(undefined) => {}} />}
        />
        <Route path="/asset-history-report" element={<AssetHistoryReport />} />

        <Route
          path="/asset-location-mapping"
          element={
            <AssetLocationMappingForm
              onStepChange={undefined}
              selectedRecord={undefined}
            />
          }
        />
        <Route
          path="/asset-location-mapping-grid"
          element={<AssetLocationMapping />}
        />
        <Route
          path="/asset-assignment"
          element={<AssetCheckIn selectedRecord={undefined} />}
        />
        <Route
          path="/asset-Maintenance-info"
          element={
            <AssetMaintenanceConfig
              status={undefined}
              updateState={(undefined) => {}}
            />
          }
        />
        <Route
          path="/assets-grid"
          element={<AssetGrid selectedRecord={undefined} />}
        />
        <Route path="/assets-form" element={<AssetForm />} />
        <Route path="/asset-category" element={<AssetCategory />} />
        <Route
          path="/asset-config"
          element={
            <AssetConfig status={undefined} updateState={(undefined) => {}} />
          }
        />

        <Route
          path="/asset-category-form"
          element={<AssetCategoryForm isUpdate={false} />}
        />
        <Route path="/asset-Location" element={<AssetLocation />} />
        <Route
          path="/location-Form"
          element={
            <LocationForm
              Data={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateData={(undefined) => {}}
            />
          }
        />

        <Route path="/asset-maintainance" element={<AssetMaintainanceGrid />} />
        <Route
          path="/asset-maintainance-form"
          element={
            <AssetMaintainanceForm
              maintainanceData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateMaintainance={(undefined) => {}}
              selectedRecord={undefined}
            />
          }
        />
        <Route
          path="/assetdetailedview/:code"
          element={<AssetsDetailedView assetsCode={undefined} />}
        />
        <Route
          path="/asset-decommission"
          element={<DecommisionedAssets selectedRecord={undefined} />}
        />
        <Route path="/asset-dashboard" element={<MainPage />} />
        {/* <Route  path="/machines-requisition" element={<MaintenanceDepartmentProductionMachinesRequisitionsReport} /> */}
        <Route
          path="/racinformation"
          element={<AssetRACIReport viewrow={(undefined) => {}} />}
        />
        <Route path="/abstract-report" element={<AbstractReport />} />
        <Route
          path="/asset-service-form"
          element={
            <AssetServiceForm
              serviceData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateService={(undefined) => {}}
            />
          }
        />
        <Route
          path="/asset-service-calender"
          element={<AssetServiceCalender />}
        />
        <Route path="/asset-service-grid" element={<AssetsServices />} />
        <Route
          path="/decomissioned-assets-report"
          element={<DecommisionedAssetsReport />}
        />

        <Route path="/asset-service-report" element={<AsserServiceReport />} />
        <Route
          path="/purchased-not-assigned"
          element={<PurchasedNotAssigned />}
        />
        <Route
          path="/asset-audit-report"
          element={<AssetsAuditReport viewrow={(undefined) => {}} />}
        />
        <Route
          path="/asset-service-date-report"
          element={<AssetServiceDateReport viewrow={(undefined) => {}} />}
        />
        <Route
          path="/expired-date-assets-report"
          element={<ExpiredDateReport viewrow={(undefined) => {}} />}
        />
        <Route
          path="/employeeinactive-report"
          element={<EmployeeInactiveReport viewrow={(undefined) => {}} />}
        />
        <Route path="/insurance-report" element={<InsuranceReport />} />
        <Route path="/warranty-report" element={<WarrantyReport />} />
        <Route
          path="/asset-service-detailview/:assetServiceId?"
          element={<ServiceDetailView assetServiceId={undefined} />}
        />
        <Route path="/asset-transfers" element={<AssetTransfersForm />} />
        <Route path="/view-asset-transfers" element={<AssetTransfersGrid />} />
        <Route
          path="/asset-requistion-form"
          element={
            <AssetRequisitionForm
              assetData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateAsset={(undefined) => {}}
            />
          }
        />
        <Route
          path="/asset-requistion-grid"
          element={
            <AssetRequisitionGrid
              isUpdate={false}
              closeForm={() => {}}
              updateAsset={(undefined) => {}}
            />
          }
        />
        <Route
          path="/asset-license-form"
          element={
            <AssetLicenseForm
              assetLicenseData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateReason={(undefined) => {}}
            />
          }
        />
        <Route path="/asset-license-view" element={<AssetLicenseGrid />} />
        <Route path="/depreciation-report" element={<DepreciationReport />} />
        <Route path="/asset-sale-form" element={<AssetSaleForm />} />
        <Route path="/asset-sale-grid" element={<AssetSaleGrid />} />
        <Route path="/location-audit-form" element={<LocationAuditForm />} />
        <Route
          path="/location-audit-grid/:id?/:auditId?"
          element={<LocationAuditGrid />}
        />
        <Route
          path="/location-audit-calender"
          element={<LocationAuditCalender />}
        />
        <Route
          path="/audit-report"
          element={<AuditReport viewrow={(undefined) => {}} />}
        />
        <Route
          path="/asset-sale-report"
          element={<AssetSaleReport viewrow={(undefined) => {}} />}
        />
        <Route
          path="/vms-report"
          element={<VmsReport viewrow={(undefined) => {}} />}
        />
        <Route
          path="/checklist-report"
          element={<ChecklistReport viewrow={(undefined) => {}} />}
        />
        {/* <Route  path="/machines-inward-details" element={<MachinesInwardDetails} /> */}

        <Route
          key="/uploading-m4-data"
          path="/uploading-m4-data"
          element={<UploadM4File />}
        />
        <Route
          key="/m4-grid-data"
          path="/m4-grid-data"
          element={<UploadedM4GridData />}
        />
        <Route
          key="/m4-stock-data"
          path="/m4-stock-data"
          element={<M4StockData />}
        />

        <Route path="/certificates-view" element={<CertificationsGrid />} />
        <Route
          path="/certificates-form"
          element={
            <CertificationsForm
              certificationData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateCertification={(undefined) => {}}
            />
          }
        />
        <Route path="/unitcode-view" element={<UnitCodeGrid />} />
        <Route
          path="/unitcode-form"
          element={
            <UnitCodeForm
              unitcodeData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateUnitcode={(undefined) => {}}
            />
          }
        />
        <Route path="/reasonsView" element={<ReasonsGrid />} />
        <Route
          path="/reasons-form"
          element={
            <ReasonsForm
              reasonsData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateReasons={(undefined) => {}}
            />
          }
        />
        <Route path="/vendorsView" element={<VendorsGrid />} />
        <Route path="/vendorsPriceListForm" element={<VendorPriceListForm />} />

        <Route
          path="/item-damage-reasons-view"
          element={<ItemDamageReasonsGrid />}
        />
        <Route
          path="/item-damage-reasons-form"
          element={
            <ItemDamageReasonsForm
              itemdamagereasonsData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDetails={(undefined) => {}}
            />
          }
        />
        <Route path="/items-view" element={<ItemsGrid />} />
        <Route
          path="/items-form"
          element={
            <ItemsForm
              itemData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateItem={(undefined) => {}}
            />
          }
        />
        <Route
          path="/item-sub-category-view"
          element={<ItemSubCategoriesGrid />}
        />
        <Route
          path="/item-sub-category-form"
          element={
            <ItemSubCategoriesForm
              subCategoryData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateData={(undefined) => {}}
            />
          }
        />

        <Route path="/item-category-view" element={<ItemCategoriesGrid />} />
        <Route
          path="/item-category-form"
          element={
            <ItemCategoriesForm
              itemcategoryData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDetails={(undefined) => {}}
            />
          }
        />
        <Route
          path="/vendors-form"
          element={
            <VendorsForm
              vendorsData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDetails={(undefined) => {}}
            />
          }
        />

        <Route
          path="/HRMS-employee_details-view"
          element={<HrmsEmployeeDetailsGrid />}
        />
        <Route
          path="/HRMS-employee_details-form"
          element={
            <HrmsEmployeeDetailsForm
              hrmsData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDetails={(undefined) => {}}
            />
          }
        />
        <Route
          path="/Employee-training"
          element={<HrmsEmployeeTrainingComponent />}
        />
        <Route
          path="/employee-training-form"
          element={<HrmsEmployeeTrainingForm />}
        />
        <Route path="/department-view" element={<DepartmentsGrid />} />
        <Route
          path="/department-form"
          element={
            <DepartmentsForm
              departmentData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDepartment={(undefined) => {}}
            />
          }
        />
        <Route
          path="/downtimetracking-view"
          element={<DownTimeTrackingGrid />}
        />
        <Route
          path="/down-time-tracking-form"
          element={
            <DownTimeTrackingForm
              downtimeTrackingData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDetails={(undefined) => {}}
            />
          }
        />
        <Route
          path="/downtime-event-calender"
          element={<DownTimeEventCalender />}
        />
        <Route
          path="/down-time-tracking-new-form"
          element={
            <NewDowntimeTrackingform
              downtimeTrackingData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateDetails={(undefined) => {}}
            />
          }
        />
        <Route path="/downtime-report" element={<DownTimeReport />} />
        {/* <Route path = "/gatepass" element= <{GatePass}/> */}
        <Route path="/calibration-view" element={<CalibrationGrid />} />
        <Route
          path="/calibration-form"
          element={
            <CalibrationForm
              calibrationData={undefined}
              isUpdate={false}
              closeForm={() => {}}
              updateCalibrationData={(undefined) => {}}
            />
          }
        ></Route>

        <Route path="/asset-checkList-view" element={<AssetCheckListGrid />} />

        <Route path="/machine-list" element={<MachineListReport />} />

        <Route path="/amc-list" element={<AMCList />} />

        <Route
          path="/machine-requisition-maintenance"
          element={
            <MaintenanceDepartmentProductionMachinesRequisitionsReport />
          }
        />

        <Route
          path="/asset-checkList-form"
          element={
            <AssetCheckListForm
              assetData={undefined}
              updatechecklist={function (checklist: AssetCheckListReq): void {
                throw new Error('Function not implemented.');
              }}
              isUpdate={false}
              closeForm={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        ></Route>
      </Routes>
    </>
  );
};
export default AssetManagementRouting;
