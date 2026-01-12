import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "/assets/logo.png";
import { ChevronLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending OTP
    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-[#f1f7f4] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-10 md:p-16 text-center">
        <div className="flex flex-col items-center mb-10">
          <img src={Logo} alt="AgriSense Logo" className="h-12 w-12 object-contain mb-6" />
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Forgot Password?</h1>
          <p className="text-gray-500 text-lg">No worries! Enter your email and we'll send you an OTP to reset it.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          <div className="space-y-3">
            <label className="text-lg font-bold text-gray-800 block" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[60px] border-2 border-gray-200 rounded-xl px-5 text-lg outline-none focus:border-[#2C6E49] transition-all bg-gray-50/50"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-[64px] bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold text-xl rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            Send OTP
          </button>
        </form>

        <div className="mt-8">
          <Link to="/signin" className="inline-flex items-center text-[#2C6E49] font-bold hover:underline gap-1">
            <ChevronLeft size={20} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
