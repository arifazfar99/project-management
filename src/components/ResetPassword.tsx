import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button } from "antd";

interface ResetPasswordProps {
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });

    if (error) {
      setError(error.message);
      setMessage("");
    } else {
      setMessage("Check your email for reset link.");
      setError("");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-3xl font-bold mb-10">Reset Password</h1>
      <input
        className="border p-2 w-full rounded-lg"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        block
        type="primary"
        size="large"
        variant="solid"
        color="purple"
        shape="default"
        onClick={handleReset}
      >
        Send Reset Link
      </Button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button
        block
        size="large"
        color="purple"
        variant="outlined"
        onClick={onBack}
        className="text-sm text-gray-500"
      >
        Back to Login
      </Button>
    </div>
  );
};

export default ResetPassword;
