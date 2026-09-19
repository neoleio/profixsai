import { Routes, Route } from "react-router-dom";

import SiteLayout from "./components/site/SiteLayout.jsx";
import Home from "./pages/site/Home.jsx";
import Services from "./pages/site/Services.jsx";
import About from "./pages/site/About.jsx";
import RepairProcess from "./pages/site/RepairProcess.jsx";
import Contact from "./pages/site/Contact.jsx";
import BookRepair from "./pages/site/BookRepair.jsx";

import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import RepairRequests from "./pages/admin/RepairRequests.jsx";
import Messages from "./pages/admin/Messages.jsx";
import JobOrders from "./pages/admin/JobOrders.jsx";
import NewJobOrder from "./pages/admin/NewJobOrder.jsx";
import JobOrderDetail from "./pages/admin/JobOrderDetail.jsx";
import PrintReceipt from "./pages/admin/PrintReceipt.jsx";
import Customers from "./pages/admin/Customers.jsx";
import CustomerDetail from "./pages/admin/CustomerDetail.jsx";
import Devices from "./pages/admin/Devices.jsx";
import DeviceDetail from "./pages/admin/DeviceDetail.jsx";
import ServicesAdmin from "./pages/admin/ServicesAdmin.jsx";
import Users from "./pages/admin/Users.jsx";
import AuditLogs from "./pages/admin/AuditLogs.jsx";
import SettingsPage from "./pages/admin/SettingsPage.jsx";
import Reports from "./pages/admin/Reports.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/repair-process" element={<RepairProcess />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-a-repair" element={<BookRepair />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Print receipt renders full-page, without the admin sidebar */}
      <Route
        path="/admin/job-orders/:id/print"
        element={
          <ProtectedRoute roles={["admin", "staff", "technician"]}>
            <PrintReceipt />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin", "staff", "technician"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="repair-requests"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <RepairRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route path="job-orders" element={<JobOrders />} />
        <Route
          path="job-orders/new"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <NewJobOrder />
            </ProtectedRoute>
          }
        />
        <Route path="job-orders/:id" element={<JobOrderDetail />} />

        <Route
          path="customers"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="customers/:id"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <CustomerDetail />
            </ProtectedRoute>
          }
        />

        <Route path="devices" element={<Devices />} />
        <Route path="devices/:id" element={<DeviceDetail />} />

        <Route
          path="services"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ServicesAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute roles={["admin", "staff"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit-logs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <h1 className="font-display font-bold text-3xl">404</h1>
        <p className="text-ink/60 mt-2">This page doesn't exist.</p>
      </div>
    </div>
  );
}
