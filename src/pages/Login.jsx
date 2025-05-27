import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      const userSnap = await getDoc(doc(db, "users", user.uid));
      const role = userSnap.data()?.role || "client";

      toast.success("Connexion réussie. Bienvenue !");
      navigate(role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error(error);
      toast.error("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
            <div className="text-sm text-center mt-2">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
