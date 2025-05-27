// src/layouts/AdminLayout.jsx
import AdminNavbar from "../components/AdminNavbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="bg-app text-app min-h-screen">
      <AdminNavbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
