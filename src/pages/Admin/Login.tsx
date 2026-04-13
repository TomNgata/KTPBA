
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock auth for now, to be replaced in Antigravity phase
    if (password === 'ktpba2026') {
      navigate('/admin');
    } else {
      setError('Invalid tournament access code.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-ktpba-red" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-ktpba-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Admin Access</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">League Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Access Code</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 font-mono focus:border-ktpba-red outline-none transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-ktpba-red bg-ktpba-red/5 p-3 text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full px-8 py-4 bg-ktpba-black text-white font-display font-bold uppercase tracking-wider hover:bg-ktpba-red transition-all flex items-center justify-center gap-2"
          >
            Enter Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
            Authorized personnel only.<br />
            All access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
