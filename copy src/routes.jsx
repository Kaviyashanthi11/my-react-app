import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import ClientApproval from "./ClientApproval";
import EligibilityPayerMaster from "./Masters/EligibilityPayerMaster";
import EligibilityPayerEnrollment from "./Masters/EligibilityPayerEnrollment";
import ClaimStatusPayerMaster from "./Masters/ClaimStatusPayerMaster";
import EnhancedClaimStatus from "./Masters/EnhancedClaimStatus";
import PracticeProviderManagement from "./Masters/PracticeProviderManagement";
import PlanMaster from "./Masters/PlanMaster";
import RateCategory from "./Masters/RateCategory";
import ClearingHouse from "./Masters/ClearingHouse";
import ClaimStatusEnrollment from "./Masters/ClaimStatusEnrollment";
import PrivateRoute from "./PrivateRoute";
import ResetPasswordForm from "./ForgotPassword";
import UserManagement from "./Masters/UserManagement";
import WeeklyTransaction from "./Masters/WeeklyTransaction";
import UserMaster from "./Masters/UserMaster";
import ActivePremiumCustomer from "./Reports/ActivePremiumCustomer";
import ActiveTrial from "./Reports/ActiveTrial";
import InactiveCustomer from "./Reports/InactiveCustomer";
import MaintenanceMaster from "./Masters/MaintenanceMaster";
import HolidayMaster from "./Masters/HolidayMaster";
import ClaimStatusMapping from "./Masters/ClaimStatusMapping";
import PracticeBilling from "./PracticeBilling";
import UserManagement2 from "./User2/UserManage";
import Dashboard from "./User4/Dashboard";
import SuspendedClaim from "./Reports/SuspendedClaim";
import Batchwise from "./Reports/Batchwise";
import Transaction from "./Reports/Transaction";
import ClaimStatusTransaction from "./Reports/ClaimStatusTransaction";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} menuName="Login" />
      <Route
        path="/client"
        element={
          <PrivateRoute>
            <ClientApproval />
          </PrivateRoute>
        }
        menuName="Client Approval"
      />
      <Route
        path="/reset"
        element={
          <PrivateRoute>
            <ResetPasswordForm />
          </PrivateRoute>
        }
        menuName="Reset Password"
      />
      <Route
        path="/eligibility"
        element={
          <PrivateRoute>
            <EligibilityPayerMaster />
          </PrivateRoute>
        }
        menuName="Eligibility Payer Master"
      />
      <Route
        path="/enrollment"
        element={
          <PrivateRoute>
            <EligibilityPayerEnrollment />
          </PrivateRoute>
        }
        menuName="Eligibility Payer Enrollment"
      />
      <Route
        path="/claim"
        element={
          <PrivateRoute>
            <ClaimStatusPayerMaster />
          </PrivateRoute>
        }
        menuName="Claim Status Payer Master"
      />
      <Route
        path="/enhanced"
        element={
          <PrivateRoute>
            <EnhancedClaimStatus />
          </PrivateRoute>
        }
        menuName="Enhanced Claim Status"
      />
      <Route
        path="/practice"
        element={
          <PrivateRoute>
            <PracticeProviderManagement />
          </PrivateRoute>
        }
        menuName="Practice Provider Management"
      />
      <Route
        path="/plan"
        element={
          <PrivateRoute>
            <PlanMaster />
          </PrivateRoute>
        }
        menuName="Plan Master"
      />
      <Route
        path="/rate"
        element={
          <PrivateRoute>
            <RateCategory />
          </PrivateRoute>
        }
        menuName="Rate Category"
      />
      <Route
        path="/clearing"
        element={
          <PrivateRoute>
            <ClearingHouse />
          </PrivateRoute>
        }
        menuName="Clearing House"
      />
      <Route
        path="/claimenrollment"
        element={
          <PrivateRoute>
            <ClaimStatusEnrollment />
          </PrivateRoute>
        }
        menuName="Claim Status Enrollment"
      />
      <Route
        path="/usermanage"
        element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        }
        menuName="User Management"
      />
      <Route
        path="/weekly"
        element={
          <PrivateRoute>
            <WeeklyTransaction />
          </PrivateRoute>
        }
        menuName="Weekly Transaction"
      />
      <Route
        path="/user"
        element={
          <PrivateRoute>
            <UserMaster />
          </PrivateRoute>
        }
        menuName="User Master"
      />
      <Route
        path="/activepre"
        element={
          <PrivateRoute>
            <ActivePremiumCustomer />
          </PrivateRoute>
        }
        menuName="Active Premium Customer"
      />
      <Route
        path="/activetrial"
        element={
          <PrivateRoute>
            <ActiveTrial />
          </PrivateRoute>
        }
        menuName="Active Trial"
      />
      <Route
        path="/inactive"
        element={
          <PrivateRoute>
            <InactiveCustomer />
          </PrivateRoute>
        }
        menuName="Inactive Customer"
      />
      <Route
        path="/maintenance"
        element={
          <PrivateRoute>
            <MaintenanceMaster />
          </PrivateRoute>
        }
        menuName="Maintenance Master"
      />
      <Route
        path="/holiday"
        element={
          <PrivateRoute>
            <HolidayMaster />
          </PrivateRoute>
        }
        menuName="Holiday Master"
      />
      <Route
        path="/claimmap"
        element={
          <PrivateRoute>
            <ClaimStatusMapping />
          </PrivateRoute>
        }
        menuName="Claim Status Mapping"
      />
      <Route
        path="/practicebilling"
        element={
          <PrivateRoute>
            <PracticeBilling />
          </PrivateRoute>
        }
        menuName="Practice Billing"
      />
      <Route
        path="/admin/user-management"
        element={
          <PrivateRoute>
            <UserManagement2 />
          </PrivateRoute>
        }
        menuName="User Management 2"
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
        menuName="Dashboard"
      />
      <Route
        path="/reports/suspended-list-claim-Status"
        element={
          <PrivateRoute>
            <SuspendedClaim />
          </PrivateRoute>
        }
        menuName="Suspended Claim"
      />
      <Route
        path="/batch-wise"
        element={
          <PrivateRoute>
            <Batchwise />
          </PrivateRoute>
        }
        menuName="Batchwise"
      />
      <Route
        path="/transaction"
        element={
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        }
        menuName="Batchwise"
      />
      <Route
        path="/claim-status-transaction"
        element={
          <PrivateRoute>
            <ClaimStatusTransaction />
          </PrivateRoute>
        }
        menuName="Batchwise"
      />
    </Routes>
  );
};

export default AppRoutes;
