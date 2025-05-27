import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="bg-app text-app min-h-screen">
      <div className="p-4">{/* Outlet pour afficher les sous-pages */}</div>
    </div>
  );
}
