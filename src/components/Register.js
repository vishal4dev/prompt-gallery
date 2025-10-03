import React, { useState } from 'react';

const Register = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border-none bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 border-none bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-all duration-300"
      >
        Register
      </button>
    </form>
  );
};

export default Register;