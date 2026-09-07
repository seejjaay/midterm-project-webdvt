import { Routes, Route } from "react-router";
import { MainLayout } from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Records from "../pages/Records";
import AddTransaction from "../pages/AddTransaction";
import TransactionDetail from "../pages/TransactionDetail";
import CalendarView from "../pages/CalendarView";
import Summary from "../pages/Summary";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="records" element={<Records />} />
        <Route path="add" element={<AddTransaction />} />
        <Route path="transaction/:id" element={<TransactionDetail />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="summary" element={<Summary />} />
      </Route>
    </Routes>
  );
}
