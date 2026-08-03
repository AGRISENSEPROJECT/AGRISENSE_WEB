import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { ApiError, authService } from "@/api";
import {
  sanitizeSingleLine,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/validation";
import AuthLayout from "./AuthLayout";
import { Alert, PasswordField, SubmitButton, TextField } from "./form-fields";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign Up | AGRISENSE";
  }, []);

  const validate = () => {
    const next: FieldErrors = {};
    const u = validateUsername(username);
    if (!u.valid) next.username = u.message;
    const em = validateEmail(email);
    if (!em.valid) next.email = em.message;
    const pw = validatePassword(password);
    if (!pw.valid) next.password = pw.message;
    if (confirm !== password) next.confirm = "Passwords do not match.";
    if (!terms) next.terms = "Please accept the terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.register({
        email: email.trim(),
        username: sanitizeSingleLine(username),
        password,
      });
      navigate("/auth/verify-otp", { state: { email: email.trim() } });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your farms in minutes"
      footer={
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-[#2C6E49] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {formError && <Alert type="error">{formError}</Alert>}

        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="johndoe"
          icon={<User className="h-5 w-5" />}
          error={errors.username}
          autoComplete="username"
          required
        />

        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
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
          onChange={setPassword}
          placeholder="Create a strong password"
          icon={<Lock className="h-5 w-5" />}
          error={errors.password}
          autoComplete="new-password"
          showStrength
          required
        />

        <PasswordField
          id="confirm"
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter your password"
          icon={<Lock className="h-5 w-5" />}
          error={errors.confirm}
          autoComplete="new-password"
          required
        />

        <div className="space-y-1">
          <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-gray-300 text-[#2C6E49] focus:ring-[#2C6E49]"
            />
            <span>
              I agree to the{" "}
              <Link
                to="/legal/terms"
                target="_blank"
                className="text-[#2C6E49] font-medium hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/legal/privacy"
                target="_blank"
                className="text-[#2C6E49] font-medium hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-600">{errors.terms}</p>}
        </div>

        <SubmitButton loading={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
