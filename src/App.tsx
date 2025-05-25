import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { supabase } from "./utils/supabaseClient";

import Board from "./components/Board";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Reset from "./pages/Reset";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("isGuest") === "true";

  const handleLogout = async () => {
    if (isGuest) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .is("user_id", null);

      if (error) {
        console.error("Failed to delete guest tasks:", error.message);
      }
    }

    localStorage.removeItem("isGuest");
    if (!isGuest) {
      await supabase.auth.signOut();
    }
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Auth onAuth={() => navigate("/home")} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/home"
          element={
            user || isGuest ? (
              <div className="min-h-screen flex flex-col">
                <Header email={user?.email} onLogout={handleLogout} />
                <main className="flex-grow bg-purple-100 p-4">
                  <Board />
                </main>
                <Footer />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/reset" element={<Reset />} />
      </Routes>
    </>
  );
};

export default App;
