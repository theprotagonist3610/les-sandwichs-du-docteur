import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FullLoaderProvider } from "./context/FullLoaderContext";
import { auth, db } from "./firebase";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";
// Layouts
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";

// Pages publiques
import Commandes from "./pages/Commandes";
import Balance from "./pages/Balance";
import Agent from "./pages/Agent";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profil from "./pages/Profil";

// Pages admin
import AdminHome from "./pages/admin/AdminHome";
import Production from "./pages/admin/Production";
import Stock from "./pages/admin/Stock";
import Clients from "./pages/admin/Clients";
import Promotions from "./pages/admin/Promotions";
import AgentAdmin from "./pages/admin/Agent";
import Compta from "./pages/admin/Compta";
import Stats from "./pages/admin/Stats";

// Composants
import TopNavbar from "./components/TopNavbar";
import BottomNav from "./components/BottomNav";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <TopNavbar />}

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<Profil />} />

        {/* Routes admin protégées */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route index element={<AdminHome />} />
          <Route path="production" element={<Production />} />
          <Route path="stock" element={<Stock />} />
          <Route path="clients" element={<Clients />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="agent" element={<AgentAdmin />} />
          <Route path="compta" element={<Compta />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>

      {!isAdminRoute && <BottomNav />}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        setRole(userSnap.data()?.role || "client");
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-4">⏳ Chargement utilisateur...</div>;

  return (
    <FullLoaderProvider>
      <Toaster
        richColors
        position="top-right"
        className="sonner-toaster"
        toastOptions={{
          classNames: {
            toast:
              "bg-white text-app rounded-md shadow-lg border border-accent px-4 py-3",
            success: "border-l-4 border-green-500",
            error: "border-l-4 border-red-500",
            warning: "border-l-4 border-yellow-500",
            info: "border-l-4 border-blue-500",
            description: "text-sm text-muted-foreground mt-1",
            title: "font-semibold text-app",
          },
        }}
      />
      <Router>
        <div className="bg-app text-app min-h-screen pb-20 md:pb-0">
          <AppContent />
        </div>
      </Router>
    </FullLoaderProvider>
  );
}

export default App;
