import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock } from 'lucide-react';
import { ApiError, authService } from "@/api";
import { validateEmail, validateOtp, validatePassword } from "@/lib/validation";
import AuthLayout from "./AuthLayout";
import { Alert, PasswordField, SubmitButton, TextField } from "./form-fields";

type Step = "request" | "reset";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Reset Password | AGRISENSE";
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.message || "Invalid email.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
      setInfo("If an account exists, a reset code has been sent to your email.");
      setStep("reset");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const otpCheck = validateOtp(otp);
    if (!otpCheck.valid) {
      setError(otpCheck.message || "Invalid code.");
      return;
    }
    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      setError(pwCheck.message || "Weak password.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ email: email.trim(), otp, newPassword });
      setInfo("Password reset successfully! Redirecting to sign in…");
      setTimeout(() => navigate("/auth/login", { state: { email: email.trim() } }), 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === "request" ? "Reset your password" : "Set a new password"}
      subtitle={
        step === "request"
          ? "Enter your email and we'll send you a reset code"
          : "Enter the code from your email and choose a new password"
      }
      footer={
        <p className="text-sm text-gray-600">
          Remembered it?{" "}
          <Link to="/auth/login" className="font-semibold text-[#2C6E49] hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      {step === "request" ? (
        <form className="space-y-5" onSubmit={handleRequest} noValidate>
          {error && <Alert type="error">{error}</Alert>}
          {info && <Alert type="success">{info}</Alert>}

          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5" />}
            autoComplete="email"
            required
          />

          <SubmitButton loading={loading}>
            {loading ? "Sending…" : "Send reset code"}
          </SubmitButton>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={handleReset} noValidate>
          {error && <Alert type="error">{error}</Alert>}
          {info && <Alert type="success">{info}</Alert>}

          <TextField
            id="otp"
            label="Reset code"
            value={otp}
            onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            icon={<KeyRound className="h-5 w-5" />}
            inputMode="numeric"
            maxLength={6}
            required
          />

          <PasswordField
            id="newPassword"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Create a strong password"
            icon={<Lock className="h-5 w-5" />}
            autoComplete="new-password"
            showStrength
            required
          />

          <SubmitButton loading={loading}>
            {loading ? "Resetting…" : "Reset password"}
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
