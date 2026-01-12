import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F5F2] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-8 md:p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img src={Logo} alt="AgriSense Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-black">AgriSense - Sign In</h1>
          </div>
          <p className="text-gray-600 text-sm">Access your farms by signing in</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900 block" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder=""
              className="w-full h-12 border-gray-400 focus:border-[#2C6E49] focus:ring-[#2C6E49]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900 block" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder=""
              className="w-full h-12 border-gray-400 focus:border-[#2C6E49] focus:ring-[#2C6E49]"
              required
            />
          </div>

          <Button
            className="w-full h-12 bg-[#2C6E49] hover:bg-[#23583a] text-white font-bold text-lg rounded-md mt-4 transition-colors"
          >
            Sign In
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account ? <Link to="/signup" className="text-[#2C6E49] font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
