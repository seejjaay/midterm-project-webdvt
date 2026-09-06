import { Routes, Route } from "react-router";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import Records from "../pages/Records";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="records" element={<Records />} />
      </Route>
    </Routes>
  );
}
