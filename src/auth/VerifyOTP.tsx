import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "/assets/logo.png";
import { auth } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const VerifyOTP: React.FC = () => {
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('pending_email');
    if (!storedEmail) {
      navigate('/signin');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const otpValue = otp.join('');
    try {
      const response = await auth.verifyOtp(email, otpValue);
      if (response.token) {
        // Assume user data might be in response or construct basic user
        const userData = response.user || {
          id: 'temp-id',
          email: email,
          firstName: email.split('@')[0]
        };
        login(response.token, userData);
        navigate('/dashboard');
      } else {
        setError('Invalid verification response');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setError(null);
    setMessage(null);

    try {
      await auth.resendOtp(email);
      setMessage('OTP has been resent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f7f4] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-10 md:p-16 text-center">
        <div className="flex flex-col items-center mb-10">
          <img src={Logo} alt="AgriSense Logo" className="h-12 w-12 object-contain mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">OTP Verification</h1>
          <p className="text-gray-500 text-lg">
            We've sent a 6-digit code to <span className="font-bold text-gray-700">{email}</span>. Please enter it below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-between gap-3 md:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-full aspect-square border-2 border-gray-200 rounded-xl text-center text-2xl font-black outline-none focus:border-[#2C6E49] focus:ring-4 focus:ring-[#2C6E49]/10 transition-all bg-gray-50/50 disabled:opacity-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some(d => !d) || isLoading}
            className="w-full h-[64px] bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold text-xl rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </form>

        <div className="mt-10">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-[#2C6E49] font-bold hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
