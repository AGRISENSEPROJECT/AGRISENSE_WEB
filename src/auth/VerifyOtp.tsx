import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError, authService } from "@/api";
import { validateEmail } from "@/lib/validation";
import AuthLayout from "./AuthLayout";
import { Alert, SubmitButton, TextField } from "./form-fields";
import { Mail } from 'lucide-react';

interface LocationState {
  email?: string;
}

const OTP_LENGTH = 6;

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as LocationState | null)?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = "Verify Email | AGRISENSE";
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const otp = digits.join("");

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }
    // Support pasting multiple digits.
    const chars = clean.split("");
    setDigits((prev) => {
      const next = [...prev];
      let i = index;
      for (const ch of chars) {
        if (i >= OTP_LENGTH) break;
        next[i] = ch;
        i++;
      }
      return next;
    });
    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.message || "Invalid email.");
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp({ email: email.trim(), otp });
      setInfo("Email verified successfully! Redirecting to sign in…");
      setTimeout(() => navigate("/signin", { state: { email: email.trim() } }), 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      setError("Enter a valid email to resend the code.");
      return;
    }
    setError(null);
    setInfo(null);
    try {
      await authService.resendOtp(email.trim());
      setInfo("A new verification code has been sent to your email.");
      setResendCooldown(30);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code.");
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your inbox"
      footer={
        <p className="text-sm text-gray-600">
          Back to{" "}
          <Link to="/signin" className="text-[#2C6E49] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error && <Alert type="error">{error}</Alert>}
        {info && <Alert type="success">{info}</Alert>}

        {!emailFromState && (
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
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800 block">Verification code</label>
          <div className="flex justify-between gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-full max-w-[52px] rounded-xl border border-gray-200 bg-gray-50/60 text-center text-xl font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-[#2C6E49] focus:ring-2 focus:ring-green-100"
              />
            ))}
          </div>
        </div>

        <SubmitButton loading={loading} disabled={otp.length !== OTP_LENGTH}>
          {loading ? "Verifying…" : "Verify Email"}
        </SubmitButton>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-[#2C6E49] font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't get it? Resend code"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
