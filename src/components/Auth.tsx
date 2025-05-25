import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { toast } from "react-toastify";

import { Button } from "antd";
import ResetPassword from "./ResetPassword";

const Auth = ({ onAuth }: { onAuth: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError("Signup failed. " + error.message);
      } else {
        toast.success(
          "Signup successful. Please check your email to confirm your account."
        );
        onAuth();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Login failed. " + error.message);
      } else {
        onAuth();
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-purple-100">
      <div className="bg-white rounded-md p-5 shadow sm:min-w-[500px]">
        <section className="flex justify-center">
          <img src="/images/planit-2.png" alt="PlanIt Logo" width={300} />
        </section>
        {!resetMode ? (
          <section className="flex flex-col items-center space-y-4 p-4">
            <h1 className="text-3xl font-bold mb-10">
              {isSignup ? "Create New Account" : "Account Login"}
            </h1>
            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full rounded-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button
              block
              type="primary"
              size="large"
              variant="solid"
              color="purple"
              shape="default"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
            </Button>
            <Button
              block
              type="default"
              size="large"
              variant="outlined"
              color="purple"
              shape="default"
              onClick={() => {
                localStorage.setItem("isGuest", "true");
                onAuth();
              }}
            >
              Continue as Guest
            </Button>
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-purple-700 hover:underline cursor-pointer"
                >
                  Login
                </span>
              </p>
            ) : (
              <p className="mb-0">
                Doesn't have an account?{" "}
                <span
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-purple-700 hover:underline cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            )}
            {!isSignup && (
              <p>
                Forgot{" "}
                <span
                  onClick={() => setResetMode(true)}
                  className="text-purple-700 hover:underline cursor-pointer"
                >
                  Password?
                </span>
              </p>
            )}
          </section>
        ) : (
          <ResetPassword onBack={() => setResetMode(false)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
