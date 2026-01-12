import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "/assets/logo.png";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to OTP verification
    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-[#f1f7f4] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] p-10 md:p-16">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-4 mb-3">
            <img src={Logo} alt="AgriSense Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">AgriSense - Sign In</h1>
          </div>
          <p className="text-gray-500 text-lg">Access your farms by signing in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-lg font-bold text-gray-800 block" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" title="Forgot Password" className="text-[#2C6E49] font-bold hover:underline text-base">
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[60px] border-2 border-gray-200 rounded-xl px-5 text-lg outline-none focus:border-[#2C6E49] transition-all bg-gray-50/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-[64px] bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold text-xl rounded-xl mt-4 transition-all shadow-lg active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
