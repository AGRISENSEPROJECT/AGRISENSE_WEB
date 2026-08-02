import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { ApiError, authService } from "@/api";
import { useAuth } from "@/context/useAuth";
import { validateEmail } from "@/lib/validation";
import AuthLayout from "./AuthLayout";
import { Alert, PasswordField, SubmitButton, TextField } from "./form-fields";

interface LocationState {
  from?: { pathname?: string };
  email?: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const state = location.state as LocationState | null;

  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign In | AGRISENSE";
  }, []);

  const from = state?.from?.pathname || "/dashboard";

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) next.email = emailCheck.message;
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 && /verif/i.test(err.message)) {
          try {
            await authService.resendOtp(email.trim());
          } catch {
            /* ignore */
          }
          navigate("/verify-otp", { state: { email: email.trim() } });
          return;
        }
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your farms and insights"
      footer={
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[#2C6E49] font-semibold hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {formError && <Alert type="error">{formError}</Alert>}

        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => setEmail(v)}
          placeholder="you@example.com"
          icon={<Mail className="h-5 w-5" />}
          error={errors.email}
          autoComplete="email"
          required
        />

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(v) => setPassword(v)}
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5" />}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#2C6E49] focus:ring-[#2C6E49]"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-[#2C6E49] font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <SubmitButton loading={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
