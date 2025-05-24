import React from "react";
import { supabase } from "../utils/supabaseClient";

import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

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
      <img src="/images/planit-2.png" width={100} />
      <h2 className="text-xl font-semibold">Welcome, {email.split("@")[0]}</h2>
      <Button
        type="primary"
        size="large"
        variant="solid"
        color="purple"
        shape="default"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
