import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth.jsx";
import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Notices from "./pages/Notices.jsx";
import Announcements from "./pages/Announcements.jsx";
import Events from "./pages/Events.jsx";
import Achievements from "./pages/Achievements.jsx";
import Calendar from "./pages/Calendar.jsx";
import Exams from "./pages/Exams.jsx";
import Downloads from "./pages/Downloads.jsx";
import Gallery from "./pages/Gallery.jsx";
import SearchPage from "./pages/Search.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import RequireAdmin from "./pages/admin/RequireAdmin.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="notices" element={<Notices />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="events" element={<Events />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="exams" element={<Exams />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route
            path="admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
