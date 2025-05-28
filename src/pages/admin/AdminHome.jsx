import AdminNavbar from "../../components/AdminNavbar";
import useUser from "../../hooks/useUser";
export default function AdminLayout() {
  const { user, userData, loading } = useUser();
  return (
    <div className="bg-app text-app min-h-screen">
      <div className="p-4">{/* Outlet pour afficher les sous-pages */}</div>
    </div>
  );
}
