import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "/assets/logo.png";

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // Simulate verification
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f7f4] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-10 md:p-16 text-center">
        <div className="flex flex-col items-center mb-10">
          <img src={Logo} alt="AgriSense Logo" className="h-12 w-12 object-contain mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">OTP Verification</h1>
          <p className="text-gray-500 text-lg">We've sent a 6-digit code to your email. Please enter it below.</p>
        </div>

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
                className="w-full aspect-square border-2 border-gray-200 rounded-xl text-center text-2xl font-black outline-none focus:border-[#2C6E49] focus:ring-4 focus:ring-[#2C6E49]/10 transition-all bg-gray-50/50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some(d => !d)}
            className="w-full h-[64px] bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold text-xl rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify & Continue
          </button>
        </form>

        <div className="mt-10">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button className="text-[#2C6E49] font-bold hover:underline">Resend OTP</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
