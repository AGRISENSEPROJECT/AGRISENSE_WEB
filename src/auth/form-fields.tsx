import { useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { getPasswordStrength } from "@/lib/validation";

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  required?: boolean;
}

export function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  autoComplete,
  inputMode,
  maxLength,
  required,
}: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-800 block">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          required={required}
          aria-invalid={!!error}
          className={`w-full h-12 rounded-xl border bg-gray-50/60 ${
            icon ? "pl-11" : "pl-4"
          } pr-4 text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-[#2C6E49] focus:ring-green-100"
          }`}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  showStrength?: boolean;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
  autoComplete,
  required,
  showStrength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const strength = getPasswordStrength(value);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-800 block">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          className={`w-full h-12 rounded-xl border bg-gray-50/60 ${
            icon ? "pl-11" : "pl-4"
          } pr-11 text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-[#2C6E49] focus:ring-green-100"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="pt-1">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: i < strength.score ? strength.color : "#e5e7eb",
                }}
              />
            ))}
          </div>
          <p className="text-xs mt-1 font-medium" style={{ color: strength.color }}>
            {strength.label}
          </p>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Alert({
  type,
  children,
}: {
  type: "success" | "error";
  children: React.ReactNode;
}) {
  const isError = type === "error";
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      {isError ? (
        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({
  loading,
  disabled,
  children,
}: {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2C6E49] to-[#0B6E4F] text-white font-bold text-base shadow-lg shadow-green-600/20 transition-all hover:shadow-green-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2"
    >
      {loading && (
        <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </button>
  );
}
