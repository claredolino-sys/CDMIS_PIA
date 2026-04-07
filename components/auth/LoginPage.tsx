
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  // Regex for 'BiPSU - 0123' format
  const employeeIdRegex = /^BiPSU - \d{4}$/;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!employeeIdRegex.test(userId)) {
      setError('Employee ID must be in the format "BiPSU - XXXX" (e.g., BiPSU - 0123).');
      setIsLoading(false);
      return;
    }

    if (password.length !== 4) {
      setError('Password must be 4 characters long.');
      setIsLoading(false);
      return;
    }

    const success = await login(userId, password);
    if (!success) {
      setError('Invalid Employee ID or Password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-indigo-600 z-20"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-md py-12 relative z-10">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center flex flex-col items-center space-y-4 w-full">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 transform transition-transform hover:scale-105 duration-300">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                CDMIS
              </h1>
              <p className="text-lg font-medium text-slate-600 max-w-[280px] sm:max-w-xs mx-auto leading-tight">
                Centralized Document Management Information System
              </p>
            </div>
          </div>

          <div className="w-full bg-white p-8 sm:p-10 rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
                  <p className="text-slate-500 text-sm mt-1">Please enter your credentials to continue</p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="userId"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Employee ID
                </label>
                <div className="relative group">
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    placeholder="BiPSU - XXXX"
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={4}
                    placeholder="••••"
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-300"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <div className="text-center space-y-4">
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
              &copy; {new Date().getFullYear()} Clare Angelie Taringting Dolino. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
