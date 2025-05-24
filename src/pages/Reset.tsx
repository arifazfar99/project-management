import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Reset: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setConfirmed(true);
    }
  };

  const handleNavigate = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return null;
  if (user)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-purple-100">
        <div className="bg-white rounded-md p-5 shadow">
          <section className="flex justify-center">
            <img src="/images/planit-2.png" alt="PlanIt Logo" width={300} />
          </section>
          <section className="flex flex-col items-center space-y-4 p-4">
            {confirmed ? (
              <>
                <h1 className="text-3xl font-bold mb-10">Password Updated!</h1>
                <p>
                  You can now{" "}
                  <span
                    onClick={handleNavigate}
                    className="text-purple-700 hover:underline cursor-pointer"
                  >
                    log in
                  </span>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-10">Set New Password</h1>

                <input
                  className="border p-2 w-96 rounded-lg"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  block
                  type="primary"
                  size="large"
                  variant="solid"
                  color="purple"
                  shape="default"
                  onClick={handleSubmit}
                >
                  Reset Password
                </Button>
                {error && <p className="text-red-500">{error}</p>}
              </>
            )}
          </section>
        </div>
      </div>
    );
};

export default Reset;
