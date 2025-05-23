import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Auth = ({ onAuth }: { onAuth: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    else onAuth();

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <img src="/images/planit.png" alt="PlanIt Logo" width={400} />
      <section className="flex flex-col items-center space-y-4 rounded-lg shadow p-4 bg-amber-50">
        <h1 className="text-2xl font-bold">{isSignup ? "Sign Up" : "Login"}</h1>
        <input
          className="border p-2 w-64 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-64 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
        </button>
        <button
          className="text-sm text-gray-500 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "New here? Sign up"}
        </button>
      </section>
    </div>
  );
};

export default Auth;
