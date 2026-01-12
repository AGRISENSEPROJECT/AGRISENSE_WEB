import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f1f7f4] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8 md:p-12">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-2">
            <img src={Logo} alt="AgriSense Logo" className="h-8 w-8 object-contain" />
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">AgriSense - Sign Up</h1>
          </div>
          <p className="text-gray-500 text-[15px]">Create an account to manage your farms</p>
        </div>

        <form className="space-y-7">
          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-gray-800 block" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full h-[52px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#2C6E49] transition-all"
              required
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-gray-800 block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full h-[52px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#2C6E49] transition-all"
              required
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-gray-800 block" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full h-[52px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#2C6E49] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-[56px] bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold text-xl rounded-md mt-6 transition-all shadow-sm"
          >
            Sign Up
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account ? <Link to="/signin" className="text-[#2C6E49] font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
