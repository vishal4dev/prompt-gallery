import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8">
          <div className="flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-3 text-center font-semibold transition-all duration-300 ${
                isLogin
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-3 text-center font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Register
            </button>
          </div>
          {isLogin ? <Login setToken={setToken} /> : <Register setToken={setToken} />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;