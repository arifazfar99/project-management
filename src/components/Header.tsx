import React from "react";
import { supabase } from "../utils/supabaseClient";

interface HeaderProps {
  email: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ email, onLogout }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <h2 className="text-xl font-semibold">Welcome, {email.split("@")[0]}</h2>
      <button
        onClick={handleLogout}
        className="text-white px-4 py-2 bg-blue-500 rounded-lg cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
