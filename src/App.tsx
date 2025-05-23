import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";

import Board from "./components/Board";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

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
      {user ? (
        <div className="min-h-screen flex flex-col">
          <Header email={user.email} onLogout={() => setUser(null)} />
          <main className="mx-auto p-6 flex-grow">
            <Board />
          </main>
          <Footer />
        </div>
      ) : (
        <Auth onAuth={() => location.reload()} />
      )}
    </>
  );
};

export default App;
