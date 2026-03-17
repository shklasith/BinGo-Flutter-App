import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

import { api } from '../../lib/api';
import { setSession } from '../../lib/session';

interface AuthUser {
  _id: string;
  token: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<ApiEnvelope<AuthUser>>('/api/users/login', {
        email,
        password,
      });

      const user = response.data.data;
      setSession({ userId: user._id, token: user.token });
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative px-6 py-12">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to BinGo</h1>
          <p className="text-gray-500 mt-2 text-center">Smart recycling starts with you.</p>
        </div>

        <form className="space-y-4 w-full" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
