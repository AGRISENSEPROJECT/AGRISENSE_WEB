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
  plan?: string;
  billing?: string;
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

  const from = state?.from?.pathname || "/app";

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
      navigate(from, {
        replace: true,
        state:
          state?.plan || state?.billing
            ? { plan: state.plan, billing: state.billing }
            : undefined,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 && /verif/i.test(err.message)) {
          try {
            await authService.resendOtp(email.trim());
          } catch {
            /* ignore */
          }
          navigate("/auth/verify-otp", { state: { email: email.trim() } });
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
      subtitle="Sign in to continue to AgriSense"
      footer={
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="font-semibold text-[#2C6E49] hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {formError && <Alert type="error">{formError}</Alert>}

        <TextField
          id="email"
          label="Email address"
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
          placeholder="Your password"
          icon={<Lock className="h-5 w-5" />}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#2C6E49] focus:ring-[#2C6E49]"
            />
            Remember me
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm font-semibold text-[#2C6E49] hover:underline"
          >
            Forgot?
          </Link>
        </div>

        <SubmitButton loading={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
